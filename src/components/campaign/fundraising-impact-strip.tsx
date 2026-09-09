import { StatCard } from "@/components/shared/stat-card";
import { formatCurrency } from "@/lib/utils";
import type { FundraisingImpactStats } from "@/lib/data/fundraising-impact";

/**
 * Compact $ raised / partners / supporters row for /journal's mission
 * section. `stats` also carries miles-funded data (see
 * FundraisingImpactStats) not rendered here — kept in the shared data
 * layer for reuse on a page where mile-by-mile funding is the actual
 * subject (/fund-a-mile, /the-race), not duplicated here.
 */
export function FundraisingImpactStrip({ stats }: { stats: FundraisingImpactStats }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard label="Raised" value={formatCurrency(stats.amountRaised)} sublabel={`of ${formatCurrency(stats.fundraisingGoal)} goal`} />
      <StatCard label="Partners" value={String(stats.partnerCount)} />
      <StatCard label="Supporters" value={String(stats.supporterCount)} />
    </div>
  );
}
