import { RACE_GOAL } from "@/lib/content/race-goal";

const SPLIT_ROWS = [
  { label: "Swim (1.2 mi)", range: RACE_GOAL.splits.swim },
  { label: "Bike (56 mi)", range: RACE_GOAL.splits.bike },
  { label: "Run (13.1 mi)", range: RACE_GOAL.splits.run },
  { label: "Transitions (T1 + T2)", range: RACE_GOAL.splits.transitions },
];

/** The athlete's placement goal (podium, M35-39) plus the target split ranges that back it up — see race-goal.ts. */
export function RaceGoalPanel() {
  return (
    <div className="rounded-sm border border-bronze/40 bg-bronze/10 p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-bronze">{RACE_GOAL.ageGroup} Age Group</p>
      <p className="mt-1 font-display text-2xl font-semibold text-ink">{RACE_GOAL.placementLabel}</p>
      <p className="mt-1 text-sm text-charcoal-light">
        Target finish: {RACE_GOAL.targetFinish.low}–{RACE_GOAL.targetFinish.high}
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SPLIT_ROWS.map((row) => (
          <div key={row.label} className="rounded-sm border border-ink/10 bg-off-white p-4">
            <dt className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">{row.label}</dt>
            <dd className="mt-1 font-display text-lg font-semibold text-ink">
              {row.range.low}–{row.range.high}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-xs text-charcoal-light">{RACE_GOAL.note}</p>
    </div>
  );
}
