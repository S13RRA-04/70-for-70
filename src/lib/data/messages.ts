import { createPublicClient } from "@/lib/supabase/public";
import { logServerError } from "@/lib/log";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_MESSAGES } from "./seed-data";
import type { MessageRow } from "@/types/database";

/** Newest-first, capped — shared by the not-configured and query-error paths so a broken query looks like the seed site rather than an empty board. */
function seedMessages(limit: number): MessageRow[] {
  return [...SEED_MESSAGES]
    .sort((a, b) => b.submitted_at.localeCompare(a.submitted_at))
    .slice(0, limit);
}

export async function getApprovedMessages(limit = 50): Promise<MessageRow[]> {
  if (!isSupabaseConfigured()) {
    return seedMessages(limit);
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("messages")
    .select("id, name, anonymous, message, approved, submitted_at, approved_at")
    .eq("approved", true)
    .order("submitted_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    logServerError("data.messages: load approved failed, using seed", error);
    return seedMessages(limit);
  }

  return data;
}
