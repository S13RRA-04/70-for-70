import { RACE_AGE_GROUP_PERFORMANCE_TIERS } from "@/lib/content/race-benchmarks";

/**
 * The same composite performance tiers as the old "What It Takes, by Tier"
 * table (see RACE_AGE_GROUP_PERFORMANCE_TIERS for sourcing/methodology),
 * as stacked/horizontal tier cards instead of a dense spreadsheet — the
 * podium tier (this campaign's actual goal) gets the strongest visual
 * emphasis, decreasing down the ladder.
 */
export function PerformanceTierLadder() {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {RACE_AGE_GROUP_PERFORMANCE_TIERS.map((tier, i) => {
        const isPodium = i === 0;
        return (
          <div
            key={tier.tier}
            className={`rounded-sm p-6 ${
              isPodium
                ? "border-2 border-bronze bg-bronze/10"
                : "border border-ink/10 bg-off-white"
            }`}
          >
            <p
              className={`font-display text-lg font-bold uppercase tracking-tight ${
                isPodium ? "text-bronze" : "text-ink"
              }`}
            >
              {tier.tier}
            </p>
            <p className={`mt-1 font-display text-2xl font-bold ${isPodium ? "text-ink" : "text-charcoal-light"}`}>
              {tier.finish}
            </p>
            <dl className="mt-4 space-y-1.5 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-charcoal-light">Swim</dt>
                <dd className="font-medium text-ink">{tier.swim}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-charcoal-light">Bike</dt>
                <dd className="font-medium text-ink">{tier.bike}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-charcoal-light">Run</dt>
                <dd className="font-medium text-ink">{tier.run}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-charcoal-light">Transitions</dt>
                <dd className="font-medium text-ink">{tier.transitions}</dd>
              </div>
            </dl>
          </div>
        );
      })}
    </div>
  );
}
