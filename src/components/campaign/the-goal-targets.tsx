import { TargetSplitCard } from "@/components/campaign/target-split-card";
import { PerformanceProgression } from "@/components/campaign/performance-progression";
import { RaceGoalPanel } from "@/components/campaign/race-goal-panel";
import { RACE_GOAL } from "@/lib/content/race-goal";

/**
 * "What does a podium-level performance require?" — five large target cards
 * (the answer at a glance), then the existing Current → Next → Podium
 * progression and the full Historical/Current/Competitive/Podium table
 * tucked behind a disclosure for anyone who wants the detail behind these
 * numbers. No new values — same RACE_GOAL data PerformanceProgression and
 * RaceGoalPanel already render, just introduced at a higher level first.
 */
export function TheGoalTargets() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <TargetSplitCard label="Swim" value={RACE_GOAL.splits.swim.podium} />
        <TargetSplitCard label="Bike" value={RACE_GOAL.splits.bike.podium} />
        <TargetSplitCard label="Run" value={RACE_GOAL.splits.run.podium} />
        <TargetSplitCard label="Transitions" value={RACE_GOAL.splits.transitions.podium} />
        <TargetSplitCard label="Finish" value={RACE_GOAL.targetFinish.podium} emphasized />
      </div>

      <p className="mt-6 text-sm text-charcoal-light">
        Targets based on recent {RACE_GOAL.ageGroup} results at IRONMAN 70.3 Chattanooga.
      </p>

      <details className="mt-6">
        <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light">
          See the Benchmark Data
        </summary>
        <div className="mt-6 space-y-6">
          <PerformanceProgression />
          <RaceGoalPanel />
        </div>
      </details>
    </div>
  );
}
