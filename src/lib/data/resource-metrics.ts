import "server-only";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Count of active records in the live public resource directory.
 *
 * Unknown stays null instead of falling back to the bundled long-tail source:
 * that source is intentionally larger while its structured migration is in
 * progress, so presenting its length as the live database total would drift.
 */
export async function getActiveResourceCount(): Promise<number | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { count, error } = await createPublicClient()
      .from("resource_records")
      .select("resource_key", { count: "exact", head: true })
      .eq("is_active", true);

    if (error || count === null) return null;
    return count;
  } catch {
    return null;
  }
}
