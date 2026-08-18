import { formatCurrency } from "@/lib/utils";
import type { AllocationPolicy } from "@/types/database";
import type { AllocationBreakdown } from "@/lib/data/allocation";

const POLICY_LABELS: Record<AllocationPolicy, string> = {
  even_split: "Split evenly between beneficiary organizations.",
  donor_choice: "Credited to the organization each donor selects.",
  campaign_defined: "Allocated by the campaign according to a published split.",
  separate_totals: "Tracked as separate, independent totals per organization.",
};

/**
 * Renders nothing if `breakdown` is null — i.e. whenever
 * campaign.allocation_policy hasn't been set yet. See README's Priority 10
 * notes: until an allocation policy is finalized, the site must not imply
 * donations to either charity pool together.
 */
export function CampaignAllocation({ breakdown }: { breakdown: AllocationBreakdown | null }) {
  if (!breakdown || breakdown.byOrganization.length === 0) return null;

  return (
    <div className="rounded-sm border border-ink/10 bg-off-white p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
        How Donations Are Credited
      </p>
      <p className="mt-1 text-sm text-charcoal-light">{POLICY_LABELS[breakdown.policy]}</p>
      <ul className="mt-4 space-y-2">
        {breakdown.byOrganization.map((row) => (
          <li key={row.organization} className="flex items-center justify-between text-sm">
            <span className="text-ink">{row.organization}</span>
            <span className="tabular-nums font-medium text-ink">
              {formatCurrency(row.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
