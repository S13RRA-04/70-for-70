import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Reuses the suggested-amount breakpoints already shown in
 * MileDetailModal (src/components/miles/mile-detail-modal.tsx) so there's
 * one ladder of meaningful dollar amounts across the site, not two.
 * `benefit` is cumulative/self-contained wording ("Everything above,
 * plus...") so each tier reads correctly on its own on /donate — see
 * GivingLevels. Public since the /donate giving-levels section shipped;
 * getDonorTiers() below remains admin-only (needs donor_email).
 */
export const DONOR_TIERS = [
  { threshold: 1000, name: "Mile Champion", benefit: "Everything above, plus your name on my race bib or kit for race day." },
  { threshold: 500, name: "Half Mile Hero", benefit: "Everything above, plus a personal thank-you message from me." },
  { threshold: 220, name: "Carry the 22", benefit: "Everything above, plus your name read or shown on race day." },
  { threshold: 70, name: "Mile Marker", benefit: "Everything above, plus a shoutout in a journal post." },
  { threshold: 22, name: "Mission Member", benefit: "Your name listed on the campaign's public supporter wall." },
] as const;

export function tierForAmount(cumulativeAmount: number): string | null {
  return DONOR_TIERS.find((tier) => cumulativeAmount >= tier.threshold)?.name ?? null;
}

export interface PublicSupporter {
  display_name: string;
  amount: number;
  tier: string;
}

/**
 * The public counterpart to getDonorTiers() below — deliberately never
 * selects donor_email (see PUBLIC_DONATION_COLUMNS's comment: even
 * selecting it server-side for a public page risks it ending up in that
 * page's RSC payload). Cumulative giving is grouped by donor_name instead,
 * which is a real limitation (two donors sharing a name are merged) accepted
 * for a small, self-reported campaign. Anonymous gifts can't be safely
 * grouped by identity at all without email, so each is listed as its own
 * single-gift "Anonymous" entry rather than merged together.
 */
export async function getPublicSupporterWall(): Promise<PublicSupporter[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("donations")
    .select("donor_name, amount, anonymous")
    .eq("verified", true);

  if (error || !data) return [];

  const named = new Map<string, number>();
  const anonymousGiftAmounts: number[] = [];
  for (const row of data as { donor_name: string; amount: number; anonymous: boolean }[]) {
    if (row.anonymous) {
      anonymousGiftAmounts.push(Number(row.amount));
      continue;
    }
    const key = row.donor_name.trim();
    named.set(key, (named.get(key) ?? 0) + Number(row.amount));
  }

  const supporters: PublicSupporter[] = [];
  for (const [display_name, amount] of named) {
    const tier = tierForAmount(amount);
    if (tier) supporters.push({ display_name, amount, tier });
  }
  for (const amount of anonymousGiftAmounts) {
    const tier = tierForAmount(amount);
    if (tier) supporters.push({ display_name: "Anonymous", amount, tier });
  }

  return supporters.sort((a, b) => b.amount - a.amount);
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
