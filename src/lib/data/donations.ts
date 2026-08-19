import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_DONATIONS } from "./seed-data";
import type { DonationRow } from "@/types/database";

export async function getRecentDonations(limit = 5): Promise<DonationRow[]> {
  if (!isSupabaseConfigured()) {
    return [...SEED_DONATIONS]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, limit);
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("verified", true)
    .order("date", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("Failed to load recent donations:", error);
    return [];
  }

  return data;
}
