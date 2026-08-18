import { TOTAL_FUNDRAISING_MILES } from "@/lib/constants";
import { formatCurrency, formatNumber, milesFunded, percentFunded } from "@/lib/utils";
import { StatCard } from "@/components/shared/stat-card";

/**
 * Reusable fundraising progress display. milesFunded = totalRaised / 1000,
 * capped at 70 for the visual bar/labels.
 */
export function CampaignProgress({
  totalRaised,
  goal,
  showStats = true,
}: {
  totalRaised: number;
  goal: number;
  showStats?: boolean;
}) {
  const percent = percentFunded(totalRaised, goal);
  const miles = milesFunded(totalRaised, TOTAL_FUNDRAISING_MILES);
  const remainingMiles = Math.max(TOTAL_FUNDRAISING_MILES - miles, 0);

  return (
    <div>
      <div
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${formatCurrency(totalRaised)} raised toward ${formatCurrency(goal)} goal`}
        className="h-4 w-full overflow-hidden rounded-full bg-charcoal/10"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-olive to-bronze transition-[width] duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-display text-2xl font-semibold tabular-nums text-ink sm:text-3xl">
          {formatCurrency(totalRaised)}{" "}
          <span className="text-base font-medium text-charcoal-light">raised</span>
        </p>
        <p className="text-sm font-medium text-charcoal-light">
          Goal: {formatCurrency(goal)}
        </p>
      </div>
      <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-bronze">
        {formatNumber(miles, 1)} of {TOTAL_FUNDRAISING_MILES} miles funded ({Math.round(percent)}%)
      </p>

      {showStats && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Raised" value={formatCurrency(totalRaised)} />
          <StatCard label="Goal" value={formatCurrency(goal)} />
          <StatCard label="Miles Funded" value={formatNumber(miles, 1)} />
          <StatCard label="Miles Remaining" value={formatNumber(remainingMiles, 1)} />
        </div>
      )}
    </div>
  );
}
