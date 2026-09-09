import { StatCard } from "@/components/shared/stat-card";
import { formatGrowingValueRange } from "./raffle-value";
import type { RaffleSummary } from "@/lib/data/raffle-items";

/**
 * Prominent panel just under the raffle intro — three numbers, all derived
 * from getRaffleSummary()/the confirmed-supporter count, never hand-typed.
 * "Building the Prize Package" is the only phase this section knows about
 * yet; a later "Entries Open" phase gets its own literal string here once
 * the lawful entry structure is actually determined, not a status enum
 * built ahead of need.
 */
export function RaffleStatusCard({
  supporterCount,
  summary,
}: {
  supporterCount: number;
  summary: RaffleSummary;
}) {
  return (
    <div className="rounded-sm border-2 border-bronze bg-bronze/5 p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
        Raffle Status: Building the Prize Package
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Confirmed Supporters" value={String(supporterCount)} />
        <StatCard
          label="Confirmed Retail Value"
          value={formatGrowingValueRange(summary.totalValueMin, summary.totalValueMax)}
        />
        <StatCard label="Items in Prize Package" value={String(summary.itemCount)} />
      </div>
    </div>
  );
}
