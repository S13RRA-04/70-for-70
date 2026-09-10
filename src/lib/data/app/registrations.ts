import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isAppEventRegistrationOpen } from "@/lib/data/app/events";
import type { AppRegistrationRow, RegistrationType } from "@/types/app";

/** The signed-in participant's own registration for one event, or null if not registered — RLS scopes this to auth.uid() automatically. */
export async function getMyRegistration(eventId: string): Promise<AppRegistrationRow | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load registration:", error);
    return null;
  }
  return data;
}

export async function registerForAppEvent(input: {
  eventId: string;
  registrationType: RegistrationType;
  teamName?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to register." };

  const { data: event } = await supabase.from("events").select("*").eq("id", input.eventId).maybeSingle();
  if (!event) return { ok: false, error: "That challenge could not be found." };
  if (!isAppEventRegistrationOpen(event)) return { ok: false, error: "Registration for this challenge is closed." };

  const { error } = await supabase.from("registrations").insert({
    event_id: input.eventId,
    user_id: user.id,
    registration_type: input.registrationType,
    team_name: input.registrationType === "team" ? input.teamName || null : null,
  });

  if (error) {
    if (error.code === "23505") return { ok: false, error: "You're already registered for this event." };
    console.error("Failed to register for app event:", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  return { ok: true };
}
