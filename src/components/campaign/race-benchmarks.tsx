import {
  RACE_AGE_GROUP_2023_TENTH_FINISH,
  RACE_AGE_GROUP_2026_FINISHER_COUNT,
  RACE_AGE_GROUP_2026_TOP5_PERCENT_THRESHOLD,
  RACE_AGE_GROUP_PERFORMANCE_TIERS,
  RACE_AGE_GROUP_TOP5_2023,
  RACE_AGE_GROUP_TOP5_2026,
  RACE_AGE_GROUP_YEARLY,
} from "@/lib/content/race-benchmarks";

const HEAD_CELL = "px-4 py-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light";
const BODY_CELL = "px-4 py-3 align-top";
const ROW = "border-b border-ink/10 bg-off-white last:border-0";
const DASH = "—";

/**
 * M35-39 age-group "times to beat" for IRONMAN 70.3 Chattanooga — recent-
 * year winning splits, the 2026 top 5 in full, 2023 as historical context,
 * and composite performance tiers. Backs RaceGoalPanel's target ranges.
 * See race-benchmarks.ts for provenance, the 2025/2024 caveats, and why
 * no athlete names appear here.
 */
export function RaceBenchmarks() {
  return (
    <div className="space-y-10">
      <div>
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
          M35–39 Winning Time, by Year
        </h3>
        <div className="mt-4 overflow-x-auto rounded-sm border border-ink/10">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-sand-light">
                <th scope="col" className={HEAD_CELL}>Year</th>
                <th scope="col" className={HEAD_CELL}>Swim</th>
                <th scope="col" className={HEAD_CELL}>Bike</th>
                <th scope="col" className={HEAD_CELL}>Run</th>
                <th scope="col" className={HEAD_CELL}>Finish</th>
              </tr>
            </thead>
            <tbody>
              {RACE_AGE_GROUP_YEARLY.map((row) => (
                <tr key={row.year} className={ROW}>
                  <th scope="row" className={`${BODY_CELL} font-semibold text-ink`}>{row.year}</th>
                  <td className={BODY_CELL}>{row.swim ?? DASH}</td>
                  <td className={BODY_CELL}>{row.bike ?? DASH}</td>
                  <td className={BODY_CELL}>{row.run ?? DASH}</td>
                  <td className={`${BODY_CELL} font-semibold text-ink`}>{row.finish ?? DASH}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-3 space-y-1 text-xs text-charcoal-light">
          {RACE_AGE_GROUP_YEARLY.filter((row) => row.note).map((row) => (
            <li key={row.year}>
              <span className="font-semibold">{row.year}:</span> {row.note}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
          2026 Top 5, M35–39
        </h3>
        <p className="mt-1 text-sm text-charcoal-light">
          The most recent normal-format race — {RACE_AGE_GROUP_2026_FINISHER_COUNT} M35–39 finishers. The winner
          wasn&apos;t the fastest swimmer; the gap opened on the bike and run.
        </p>
        <div className="mt-4 overflow-x-auto rounded-sm border border-ink/10">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-sand-light">
                <th scope="col" className={HEAD_CELL}>Place</th>
                <th scope="col" className={HEAD_CELL}>Swim</th>
                <th scope="col" className={HEAD_CELL}>Bike</th>
                <th scope="col" className={HEAD_CELL}>Run</th>
                <th scope="col" className={HEAD_CELL}>Finish</th>
              </tr>
            </thead>
            <tbody>
              {RACE_AGE_GROUP_TOP5_2026.map((row) => (
                <tr key={row.place} className={ROW}>
                  <th scope="row" className={`${BODY_CELL} font-semibold text-ink`}>{row.place}</th>
                  <td className={BODY_CELL}>{row.swim ?? DASH}</td>
                  <td className={BODY_CELL}>{row.bike ?? DASH}</td>
                  <td className={BODY_CELL}>{row.run ?? DASH}</td>
                  <td className={`${BODY_CELL} font-semibold text-ink`}>{row.finish}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-charcoal-light">
          2026 top-5% finish-time threshold for M35–39: {RACE_AGE_GROUP_2026_TOP5_PERCENT_THRESHOLD}.
        </p>
      </div>

      <div>
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
          2023 Top 5, M35–39 <span className="font-normal normal-case text-charcoal-light">(historical context)</span>
        </h3>
        <p className="mt-1 text-sm text-charcoal-light">
          An unusually fast year for the division — even 10th place finished in {RACE_AGE_GROUP_2023_TENTH_FINISH}.
        </p>
        <div className="mt-4 overflow-x-auto rounded-sm border border-ink/10">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-sand-light">
                <th scope="col" className={HEAD_CELL}>Place</th>
                <th scope="col" className={HEAD_CELL}>Swim</th>
                <th scope="col" className={HEAD_CELL}>Bike</th>
                <th scope="col" className={HEAD_CELL}>Run</th>
                <th scope="col" className={HEAD_CELL}>Finish</th>
              </tr>
            </thead>
            <tbody>
              {RACE_AGE_GROUP_TOP5_2023.map((row) => (
                <tr key={row.place} className={ROW}>
                  <th scope="row" className={`${BODY_CELL} font-semibold text-ink`}>{row.place}</th>
                  <td className={BODY_CELL}>{row.swim ?? DASH}</td>
                  <td className={BODY_CELL}>{row.bike ?? DASH}</td>
                  <td className={BODY_CELL}>{row.run ?? DASH}</td>
                  <td className={`${BODY_CELL} font-semibold text-ink`}>{row.finish}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
          What It Takes, by Tier
        </h3>
        <p className="mt-1 text-sm text-charcoal-light">
          A composite across the normal-format years above — see the Race Goal panel for which tier the actual
          goal targets.
        </p>
        <div className="mt-4 overflow-x-auto rounded-sm border border-ink/10">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-sand-light">
                <th scope="col" className={HEAD_CELL}>Tier</th>
                <th scope="col" className={HEAD_CELL}>Swim</th>
                <th scope="col" className={HEAD_CELL}>Bike</th>
                <th scope="col" className={HEAD_CELL}>Run</th>
                <th scope="col" className={HEAD_CELL}>Transitions</th>
                <th scope="col" className={HEAD_CELL}>Finish</th>
              </tr>
            </thead>
            <tbody>
              {RACE_AGE_GROUP_PERFORMANCE_TIERS.map((row) => (
                <tr key={row.tier} className={ROW}>
                  <th scope="row" className={`${BODY_CELL} font-semibold text-ink`}>{row.tier}</th>
                  <td className={BODY_CELL}>{row.swim}</td>
                  <td className={BODY_CELL}>{row.bike}</td>
                  <td className={BODY_CELL}>{row.run}</td>
                  <td className={BODY_CELL}>{row.transitions}</td>
                  <td className={`${BODY_CELL} font-semibold text-ink`}>{row.finish}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
