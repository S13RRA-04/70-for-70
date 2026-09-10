import { createClient } from "@/lib/supabase/server";
import type { AppEventRow } from "@/types/app";

/**
 * public.events.slug for the current "22 For the 22" instance — NOT the
 * same value as CURRENT_EVENT_SLUG in src/lib/content/22-for-the-22.ts
 * ("22-for-the-22-2026", the marketing site's separate event_config.event_slug).
 * Mixing these two up silently breaks any admin/for-the-22-app query or
 * findLinkableEventRegistration() (both found no row and failed quietly —
 * exactly this bug, caught in testing). Always import this one for
 * anything touching public.events/registrations/activities/milestones.
 */
export const CURRENT_APP_EVENT_SLUG = "22forthe22";

/** Public-read (RLS) — every event a participant can see, newest window first. */
export async function getAppEvents(): Promise<AppEventRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select("*").order("start_at", { ascending: false });
  if (error || !data) {
    console.error("Failed to load app events:", error);
    return [];
  }
  return data;
}

export async function getAppEventBySlug(slug: string): Promise<AppEventRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.error(`Failed to load app event "${slug}":`, error);
    return null;
  }
  return data;
}

/**
 * registration_open_at/registration_close_at are timestamps, not a
 * boolean — "open" means either field is unset-in-the-relevant-direction:
 * registration hasn't started yet counts as not-open; a close time at or
 * before now means closed. The admin dashboard's "Registration Open"
 * checkbox (see admin/for-the-22-app/actions.ts) sets/clears
 * registration_close_at to represent an on/off toggle over this.
 */
export function isAppEventRegistrationOpen(event: AppEventRow, now: Date = new Date()): boolean {
  if (event.registration_open_at && now < new Date(event.registration_open_at)) return false;
  if (event.registration_close_at && now >= new Date(event.registration_close_at)) return false;
  return true;
}
