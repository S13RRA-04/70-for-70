import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_DONATIONS } from "./seed-data";
import { PUBLIC_DONATION_COLUMNS } from "./donation-columns";
import type { DonationWithMile } from "@/types/database";

export async function getRecentDonations(limit = 5): Promise<DonationWithMile[]> {
  if (!isSupabaseConfigured()) {
    return [...SEED_DONATIONS]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, limit)
      .map((donation) => ({ ...donation, mile_number: null }));
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("donations")
    .select(`${PUBLIC_DONATION_COLUMNS}, miles(mile_number)`)
    .eq("verified", true)
    .order("date", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("Failed to load recent donations:", error);
    return [];
  }

  return data.map(({ miles, ...donation }) => ({
    ...donation,
    mile_number: (miles as unknown as { mile_number: number } | null)?.mile_number ?? null,
  }));
}
