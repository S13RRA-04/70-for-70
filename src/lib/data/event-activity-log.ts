import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_EVENT_ACTIVITY_LOG } from "./seed-data";
import type { EventActivityLogRow } from "@/types/database";

export async function getEventActivityLog(eventId: string): Promise<EventActivityLogRow[]> {
  if (!isSupabaseConfigured()) {
    return SEED_EVENT_ACTIVITY_LOG.filter((entry) => entry.event_id === eventId).sort(
      (a, b) => a.display_order - b.display_order,
    );
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("event_activity_log")
    .select("*")
    .eq("event_id", eventId)
    .order("display_order", { ascending: true });

  if (error || !data) {
    console.error("Failed to load event activity log, falling back to seed data:", error);
    return SEED_EVENT_ACTIVITY_LOG.filter((entry) => entry.event_id === eventId).sort(
      (a, b) => a.display_order - b.display_order,
    );
  }

  return data;
}
