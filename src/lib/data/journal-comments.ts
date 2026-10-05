import { createPublicClient } from "@/lib/supabase/public";
import { logServerError } from "@/lib/log";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { JournalCommentRow } from "@/types/database";

/** Approved comments for one journal entry, oldest first. Empty (not seeded) when Supabase isn't configured or the query fails — there's no honest fallback content for visitor comments the way there is for campaign data. */
export async function getApprovedJournalComments(journalEntryId: string): Promise<JournalCommentRow[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("journal_comments")
    .select("id, journal_entry_id, name, body, approved, submitted_at, approved_at")
    .eq("journal_entry_id", journalEntryId)
    .eq("approved", true)
    .order("submitted_at", { ascending: true });

  if (error || !data) {
    logServerError("data.journal-comments: load approved failed", error);
    return [];
  }

  return data;
}
