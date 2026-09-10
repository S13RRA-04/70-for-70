import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CURRENT_EVENT_SLUG } from "@/lib/content/22-for-the-22";

/**
 * "Don't lose users who registered before the app launched" (spec section
 * 25) — matches ONLY on the authenticated participant's own verified
 * email, never a client-supplied one, and never a name match (see the
 * spec's explicit warning against that). public.event_registrations has
 * no client-facing RLS select policy at all (by design — it's the
 * anonymous marketing-site giveaway form), so this lookup can only run
 * server-side with the service-role client, gated on the caller's own
 * session email.
 *
 * Takes the app's public.events.id directly (not re-derived from a slug
 * constant here) — that table uses its own slug ("22forthe22"), distinct
 * from CURRENT_EVENT_SLUG ("22-for-the-22-2026", the marketing site's
 * event_config.event_slug). The caller (the challenge detail page) has
 * already resolved the right events row via getAppEventBySlug(slug).
 */
export async function findLinkableEventRegistration(appEventId: string): Promise<{
  legacyRegistrationId: string;
  firstName: string;
  lastName: string;
  participationType: string;
  teamName: string | null;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const admin = createAdminClient();

  // Already linked (or registered without linking, deliberately not
  // overwritten) — nothing to prompt.
  const { data: existingAppRegistration } = await admin
    .from("registrations")
    .select("id, linked_event_registration_id")
    .eq("event_id", appEventId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (existingAppRegistration) return null;

  const { data: marketingEventConfig } = await admin
    .from("event_config")
    .select("id")
    .eq("event_slug", CURRENT_EVENT_SLUG)
    .maybeSingle();
  if (!marketingEventConfig) return null;

  // ilike treats % and _ as wildcards — escape them so an email containing
  // either character (rare, but valid) can't broaden the match.
  const escapedEmail = user.email.replace(/[%_]/g, (char) => `\\${char}`);
  const { data: legacyRegistration } = await admin
    .from("event_registrations")
    .select("id, first_name, last_name, participation_type, team_name")
    .eq("event_id", marketingEventConfig.id)
    .ilike("email", escapedEmail)
    .maybeSingle();
  if (!legacyRegistration) return null;

  return {
    legacyRegistrationId: legacyRegistration.id,
    firstName: legacyRegistration.first_name,
    lastName: legacyRegistration.last_name,
    participationType: legacyRegistration.participation_type,
    teamName: legacyRegistration.team_name,
  };
}

/**
 * Re-derives the match from the caller's own session server-side rather
 * than trusting a client-supplied legacy-registration id — a client could
 * otherwise pass an arbitrary id and link someone else's sweepstakes entry
 * to their own account.
 */
export async function linkExistingRegistration(
  eventId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const match = await findLinkableEventRegistration(eventId);
  if (!match) return { ok: false, error: "No matching registration was found for your account email." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to link your registration." };

  const registrationType = match.participationType === "team" ? "team" : "solo";

  const { error } = await supabase.from("registrations").insert({
    event_id: eventId,
    user_id: user.id,
    registration_type: registrationType,
    team_name: registrationType === "team" ? match.teamName : null,
    linked_event_registration_id: match.legacyRegistrationId,
  });

  if (error) {
    if (error.code === "23505") return { ok: false, error: "You're already registered for this event." };
    console.error("Failed to link existing registration:", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  return { ok: true };
}
