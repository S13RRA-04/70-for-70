import { RACE_GOAL } from "@/lib/content/race-goal";

const HEAD_CELL = "px-4 py-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light";
const BODY_CELL = "px-4 py-3 align-top";
const ROW = "border-b border-ink/10 bg-off-white last:border-0";
const DASH = "—";

const SPLIT_ROWS = [
  { label: "Swim (1.2 mi)", metric: RACE_GOAL.splits.swim },
  { label: "Bike (56 mi)", metric: RACE_GOAL.splits.bike },
  { label: "Run (13.1 mi)", metric: RACE_GOAL.splits.run },
  { label: "Transitions (T1 + T2)", metric: RACE_GOAL.splits.transitions },
];

/**
 * The athlete's placement goal (podium, M35-39) plus the Historical →
 * Current → Competitive → Podium target ladder behind it — see
 * race-goal.ts. Historical is a real recorded result, not a target; the
 * other three are read left-to-right as the progression training is
 * meant to climb.
 */
export function RaceGoalPanel() {
  return (
    <div className="rounded-sm border border-bronze/40 bg-bronze/10 p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-bronze">{RACE_GOAL.ageGroup} Age Group</p>
      <p className="mt-1 font-display text-2xl font-semibold text-ink">{RACE_GOAL.placementLabel}</p>
      <p className="mt-1 text-sm text-charcoal-light">Podium target: {RACE_GOAL.targetFinish.podium}</p>

      <div className="mt-6 overflow-x-auto rounded-sm border border-ink/10">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 bg-sand-light">
              <th scope="col" className={HEAD_CELL}>Split</th>
              <th scope="col" className={HEAD_CELL}>Historical Winning Range</th>
              <th scope="col" className={HEAD_CELL}>Current Benchmark</th>
              <th scope="col" className={HEAD_CELL}>Next Target</th>
              <th scope="col" className={HEAD_CELL}>Podium Target</th>
            </tr>
          </thead>
          <tbody>
            <tr className={ROW}>
              <th scope="row" className={`${BODY_CELL} font-semibold text-ink`}>
                Overall finish
              </th>
              <td className={BODY_CELL}>{RACE_GOAL.targetFinish.historical ?? DASH}</td>
              <td className={BODY_CELL}>{RACE_GOAL.targetFinish.current}</td>
              <td className={BODY_CELL}>{RACE_GOAL.targetFinish.competitive}</td>
              <td className={`${BODY_CELL} font-semibold text-ink`}>{RACE_GOAL.targetFinish.podium}</td>
            </tr>
            {SPLIT_ROWS.map((row) => (
              <tr key={row.label} className={ROW}>
                <th scope="row" className={`${BODY_CELL} font-semibold text-ink`}>
                  {row.label}
                </th>
                <td className={BODY_CELL}>{row.metric.historical ?? DASH}</td>
                <td className={BODY_CELL}>{row.metric.current}</td>
                <td className={BODY_CELL}>{row.metric.competitive}</td>
                <td className={`${BODY_CELL} font-semibold text-ink`}>{row.metric.podium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-charcoal-light">{RACE_GOAL.note}</p>
    </div>
  );
}
