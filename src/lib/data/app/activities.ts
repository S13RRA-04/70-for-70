import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createActivitySchema, type CreateActivityInput } from "@/lib/validation/activity";
import type { ActivityRow } from "@/types/app";

/** All of the signed-in participant's logged activities for one event, oldest first (RLS scopes this to auth.uid() automatically). */
export async function getMyActivities(eventId: string): Promise<ActivityRow[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .order("activity_date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load activities:", error);
    return [];
  }
  return data;
}

export interface ProgressSummary {
  sessionCount: number;
  totalMinutes: number;
  totalDistanceByUnit: Partial<Record<string, number>>;
  byActivityType: Partial<Record<string, number>>;
}

export function summarizeActivities(activities: ActivityRow[]): ProgressSummary {
  const summary: ProgressSummary = { sessionCount: activities.length, totalMinutes: 0, totalDistanceByUnit: {}, byActivityType: {} };
  for (const activity of activities) {
    summary.totalMinutes += activity.duration_minutes;
    summary.byActivityType[activity.activity_type] = (summary.byActivityType[activity.activity_type] ?? 0) + 1;
    if (activity.distance && activity.distance_unit) {
      summary.totalDistanceByUnit[activity.distance_unit] =
        (summary.totalDistanceByUnit[activity.distance_unit] ?? 0) + activity.distance;
    }
  }
  return summary;
}

/**
 * Every stored activity must already satisfy its event's
 * minimum_session_minutes — enforced here (event-configurable, so it can't
 * live as a fixed table-level check) rather than trusting the client. RLS
 * still independently enforces that a participant can only ever write a
 * row with their own user_id — this is defense in depth on top of that,
 * not a substitute for it.
 */
export async function createActivity(
  input: CreateActivityInput,
): Promise<{ ok: true; activity: ActivityRow } | { ok: false; error: string }> {
  const parsed = createActivitySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }
  const data = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to log a session." };

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, minimum_session_minutes")
    .eq("id", data.eventId)
    .maybeSingle();
  if (eventError || !event) return { ok: false, error: "That challenge could not be found." };

  const minimum = event.minimum_session_minutes;
  if (minimum && data.durationMinutes < minimum) {
    return { ok: false, error: `Sessions for this challenge must be at least ${minimum} minutes.` };
  }

  const { data: registration } = await supabase
    .from("registrations")
    .select("id")
    .eq("event_id", data.eventId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!registration) return { ok: false, error: "Register for this challenge before logging a session." };

  const { data: inserted, error } = await supabase
    .from("activities")
    .insert({
      registration_id: registration.id,
      user_id: user.id,
      event_id: data.eventId,
      activity_type: data.activityType,
      duration_minutes: data.durationMinutes,
      distance: data.distance ?? null,
      distance_unit: data.distance ? data.distanceUnit ?? null : null,
      activity_date: data.activityDate,
      started_at: data.startedAt || null,
      notes: data.notes || null,
    })
    .select("*")
    .single();

  if (error || !inserted) {
    console.error("Failed to insert activity:", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  return { ok: true, activity: inserted };
}

export async function deleteActivity(activityId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("activities").delete().eq("id", activityId);
  if (error) {
    console.error("Failed to delete activity:", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
  return { ok: true };
}
