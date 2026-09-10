import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { MilestoneCompletionRow, MilestoneRow } from "@/types/app";

export async function getMilestonesForEvent(eventId: string): Promise<MilestoneRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("milestones")
    .select("*")
    .eq("event_id", eventId)
    .order("display_order", { ascending: true });
  if (error) {
    console.error("Failed to load milestones:", error);
    return [];
  }
  return data;
}

/** RLS scopes this to auth.uid() automatically — never another participant's completions. */
export async function getMyMilestoneCompletions(eventId: string): Promise<MilestoneCompletionRow[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("milestone_completions")
    .select("*, milestones!inner(event_id)")
    .eq("user_id", user.id)
    .eq("milestones.event_id", eventId);

  if (error) {
    console.error("Failed to load milestone completions:", error);
    return [];
  }
  return data;
}
