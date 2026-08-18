import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { AllocationPolicy, CampaignRow } from "@/types/database";

export interface AllocationBreakdown {
  policy: AllocationPolicy;
  byOrganization: { organization: string; amount: number }[];
}

/**
 * Computed from verified donations grouped by `organization_benefited` —
 * no separate stored per-org totals to keep in sync. Returns null whenever
 * `campaign.allocation_policy` is unset, which the frontend must treat as
 * "don't display or imply an allocation breakdown" (see README Priority 10).
 */
export async function getAllocationBreakdown(
  campaign: CampaignRow,
): Promise<AllocationBreakdown | null> {
  if (!campaign.allocation_policy) return null;
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("donations")
    .select("organization_benefited, amount")
    .eq("verified", true)
    .not("organization_benefited", "is", null);

  if (error || !data) {
    console.error("Failed to load allocation breakdown:", error);
    return null;
  }

  const totals = new Map<string, number>();
  for (const row of data as { organization_benefited: string | null; amount: number }[]) {
    if (!row.organization_benefited) continue;
    totals.set(
      row.organization_benefited,
      (totals.get(row.organization_benefited) ?? 0) + row.amount,
    );
  }

  return {
    policy: campaign.allocation_policy,
    byOrganization: Array.from(totals, ([organization, amount]) => ({ organization, amount })),
  };
}
