import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Reuses the suggested-amount breakpoints already shown in
 * MileDetailModal (src/components/miles/mile-detail-modal.tsx) so there's
 * one ladder of meaningful dollar amounts across the site, not two. Admin-
 * facing only for now — see src/app/admin/donations/page.tsx. No public
 * donor wall yet; see the "explicitly not doing" note in the donor-tiers plan.
 */
export const DONOR_TIERS = [
  { threshold: 1000, name: "Mile Champion" },
  { threshold: 500, name: "Half Mile Hero" },
  { threshold: 220, name: "Carry the 22" },
  { threshold: 70, name: "Mile Marker" },
  { threshold: 22, name: "Mission Member" },
] as const;

export function tierForAmount(cumulativeAmount: number): string | null {
  return DONOR_TIERS.find((tier) => cumulativeAmount >= tier.threshold)?.name ?? null;
}

export interface DonorTier {
  donor_email: string;
  display_name: string;
  cumulative_amount: number;
  tier: string | null;
}

/**
 * Groups verified donations by donor_email and sums cumulative giving —
 * donations with no donor_email simply aren't included, since there's
 * nothing to group them by. display_name comes from that donor's most
 * recent verified gift, shown as "Anonymous" if that specific gift was
 * marked anonymous (mirrors MileDetailModal's per-mile "Supported by" list).
 */
export async function getDonorTiers(
  admin: SupabaseClient,
): Promise<Map<string, DonorTier>> {
  const { data, error } = await admin
    .from("donations")
    .select("donor_email, donor_name, amount, anonymous, date")
    .eq("verified", true)
    .not("donor_email", "is", null)
    .order("date", { ascending: false });

  if (error || !data) return new Map();

  const byEmail = new Map<string, DonorTier>();
  for (const row of data) {
    const email = row.donor_email as string;
    const existing = byEmail.get(email);
    if (existing) {
      existing.cumulative_amount += Number(row.amount);
    } else {
      byEmail.set(email, {
        donor_email: email,
        // First row seen per email is the most recent, since the query is
        // ordered by date descending.
        display_name: row.anonymous ? "Anonymous" : row.donor_name,
        cumulative_amount: Number(row.amount),
        tier: null,
      });
    }
  }

  for (const donor of byEmail.values()) {
    donor.tier = tierForAmount(donor.cumulative_amount);
  }

  return byEmail;
}
