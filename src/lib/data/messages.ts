import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_MESSAGES } from "./seed-data";
import type { MessageRow } from "@/types/database";

export async function getApprovedMessages(limit = 50): Promise<MessageRow[]> {
  if (!isSupabaseConfigured()) {
    return [...SEED_MESSAGES]
      .sort((a, b) => b.submitted_at.localeCompare(a.submitted_at))
      .slice(0, limit);
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("messages")
    .select("id, name, anonymous, message, approved, submitted_at, approved_at")
    .eq("approved", true)
    .order("submitted_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("Failed to load messages:", error);
    return [];
  }

  return data;
}
