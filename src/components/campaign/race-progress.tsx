import { RACE_LEGS, RACE_TOTAL_DISTANCE, TOTAL_FUNDRAISING_MILES } from "@/lib/constants";
import { cn, formatNumber, milesFunded } from "@/lib/utils";

const LEGS = [
  { key: "swim", label: "Swim", distance: RACE_LEGS.swim, color: "bg-charcoal" },
  { key: "bike", label: "Bike", distance: RACE_LEGS.bike, color: "bg-olive" },
  { key: "run", label: "Run", distance: RACE_LEGS.run, color: "bg-bronze" },
] as const;

/**
 * Visualizes fundraising progress as distance covered along the IRONMAN
 * 70.3 course (swim 1.2mi + bike 56mi + run 13.1mi ≈ 70.3mi total).
 */
export function RaceProgress({ totalRaised }: { totalRaised: number }) {
  const progressMiles = Math.min(
    milesFunded(totalRaised, TOTAL_FUNDRAISING_MILES),
    RACE_TOTAL_DISTANCE,
  );
  const progressPercent = (progressMiles / RACE_TOTAL_DISTANCE) * 100;

  const legBounds = LEGS.reduce<{ legStart: number; legEnd: number }[]>((bounds, leg) => {
    const legStart = bounds.at(-1)?.legEnd ?? 0;
    bounds.push({ legStart, legEnd: legStart + leg.distance });
    return bounds;
  }, []);

  return (
    <div>
      <div className="relative flex h-3 w-full overflow-hidden rounded-full bg-charcoal/10">
        {LEGS.map((leg) => {
          const widthPercent = (leg.distance / RACE_TOTAL_DISTANCE) * 100;
          return (
            <div
              key={leg.key}
              className={cn("h-full opacity-25", leg.color)}
              style={{ width: `${widthPercent}%` }}
            />
          );
        })}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-bronze transition-[width] duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${formatNumber(progressMiles, 1)} of ${RACE_TOTAL_DISTANCE} race miles funded`}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {LEGS.map((leg, i) => {
          const { legStart, legEnd } = legBounds[i];
          const covered = Math.min(Math.max(progressMiles - legStart, 0), leg.distance);
          const complete = progressMiles >= legEnd;

          return (
            <div key={leg.key} className="rounded-sm border border-ink/10 bg-off-white p-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                {leg.label}
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-ink">
                {leg.distance} mi
              </p>
              <p
                className={cn(
                  "mt-1 text-xs font-medium",
                  complete ? "text-bronze" : "text-charcoal-light/80",
                )}
              >
                {complete
                  ? "Funded"
                  : `${formatNumber(covered, 1)} mi funded`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
