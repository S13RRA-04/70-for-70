import { StatCard } from "@/components/shared/stat-card";
import { formatCurrency } from "@/lib/utils";
import type { FundraisingImpactStats } from "@/lib/data/fundraising-impact";

/** Compact $ raised / supporters / partners / miles-funded row — the fundraising counterpart to the training-heavy sections above it on /journal. */
export function FundraisingImpactStrip({ stats }: { stats: FundraisingImpactStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard label="Raised" value={formatCurrency(stats.amountRaised)} sublabel={`of ${formatCurrency(stats.fundraisingGoal)} goal`} />
      <StatCard label="Supporters" value={String(stats.supporterCount)} />
      <StatCard label="Partners" value={String(stats.partnerCount)} />
      <StatCard label="Miles Funded" value={`${stats.milesFunded} of ${stats.milesTotal}`} />
    </div>
  );
}
