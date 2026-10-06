import { createPublicClient } from "@/lib/supabase/public";
import { logServerError } from "@/lib/log";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_EVENT_REGISTRATION_STATS } from "./seed-data";
import type { EventRegistrationStatsRow } from "@/types/database";

const EMPTY_STATS: Omit<EventRegistrationStatsRow, "event_id"> = { total_participants: 0, team_count: 0 };

/**
 * Real, non-financial 22 For the 22 stats — reads public.event_registration_stats
 * (a view aggregating public.event_registrations), replacing the old
 * independent event_config.fundraising_goal/amount_raised columns. Never
 * throws: a missing row (no registrations yet) resolves to zero counts, not
 * an error state.
 */
export async function getEventRegistrationStats(eventId: string): Promise<EventRegistrationStatsRow> {
  if (!isSupabaseConfigured()) {
    return eventId === SEED_EVENT_REGISTRATION_STATS.event_id
      ? { ...SEED_EVENT_REGISTRATION_STATS }
      : { event_id: eventId, ...EMPTY_STATS };
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("event_registration_stats")
    .select("*")
    .eq("event_id", eventId)
    .maybeSingle();

  if (error) {
    logServerError("data.event-registration-stats: load failed, using zero counts", error);
    return { event_id: eventId, ...EMPTY_STATS };
  }

  return data ?? { event_id: eventId, ...EMPTY_STATS };
}
