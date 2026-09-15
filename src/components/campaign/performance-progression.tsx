import { Waves, Bike, Footprints, ArrowRightLeft } from "lucide-react";
import { RACE_GOAL } from "@/lib/content/race-goal";
import type { GoalMetric } from "@/lib/content/race-goal";

const DISCIPLINES: { label: string; Icon: typeof Waves; metric: GoalMetric }[] = [
  { label: "Swim", Icon: Waves, metric: RACE_GOAL.splits.swim },
  { label: "Bike", Icon: Bike, metric: RACE_GOAL.splits.bike },
  { label: "Run", Icon: Footprints, metric: RACE_GOAL.splits.run },
  { label: "Transitions", Icon: ArrowRightLeft, metric: RACE_GOAL.splits.transitions },
];

/**
 * Condensed Current → Next → Podium narrative moment, sitting above
 * RaceGoalPanel's full Historical/Current/Competitive/Podium table (the
 * detail-on-demand version of the same RACE_GOAL data — no new/invented
 * values here). "Current" reads "TBD" honestly where race-effort data
 * doesn't exist yet (swim/run/transitions) rather than faking a number.
 */
export function PerformanceProgression() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {DISCIPLINES.map(({ label, Icon, metric }) => (
        <div key={label} className="rounded-sm border border-ink/10 bg-off-white p-5">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            <Icon size={14} className="text-bronze" aria-hidden />
            {label}
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-charcoal-light/70">Current</p>
              <p className="mt-0.5 text-sm font-semibold text-ink">{metric.current}</p>
            </div>
            <div aria-hidden="true" className="text-charcoal-light/40">
              &darr;
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-charcoal-light/70">
                Next Milestone
              </p>
              <p className="mt-0.5 text-sm font-semibold text-ink">{metric.competitive}</p>
            </div>
            <div aria-hidden="true" className="text-charcoal-light/40">
              &darr;
            </div>
            <div className="rounded-sm bg-bronze/10 p-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-bronze">Podium Target</p>
              <p className="mt-0.5 text-sm font-bold text-ink">{metric.podium}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
