import {
  RACE_AGE_GROUP_2023_NINTH_FINISH,
  RACE_AGE_GROUP_2023_TENTH_FINISH,
  RACE_AGE_GROUP_2026_FINISHER_COUNT,
  RACE_AGE_GROUP_2026_TOP5_PERCENT_THRESHOLD,
  RACE_AGE_GROUP_PERFORMANCE_TIERS,
  RACE_AGE_GROUP_TOP3_2025,
  RACE_AGE_GROUP_TOP5_2023,
  RACE_AGE_GROUP_TOP5_2026,
  RACE_AGE_GROUP_YEARLY,
} from "@/lib/content/race-benchmarks";

const HEAD_CELL = "px-4 py-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light";
const BODY_CELL = "px-4 py-3 align-top";
const ROW = "border-b border-ink/10 bg-off-white last:border-0";
const DASH = "—";

/** Years worth showing in the compact summary — a real comparable finish, or a flagged shortened/no-swim year; the fully-unconfirmed 2024 row is left for the full table below. */
const SUMMARY_YEARS = [...RACE_AGE_GROUP_YEARLY]
  .filter((row) => row.finish !== null || row.note?.toLowerCase().includes("swim"))
  .sort((a, b) => a.year - b.year);

function AccordionSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="rounded-sm border border-ink/10 bg-off-white">
      <summary className="cursor-pointer list-none px-5 py-4 font-display text-sm font-semibold uppercase tracking-wide text-ink [&::-webkit-details-marker]:hidden">
        {title}
      </summary>
      <div className="border-t border-ink/10 p-5">{children}</div>
    </details>
  );
}

function YearlyTable({ rows }: { rows: typeof RACE_AGE_GROUP_TOP5_2026 }) {
  return (
    <div className="overflow-x-auto rounded-sm border border-ink/10">
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
          {rows.map((row) => (
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
  );
}

/**
 * M35-39 age-group "times to beat" for IRONMAN 70.3 Chattanooga — a compact
 * recent-years summary up front, with the full yearly/top-5/top-3 tables
 * and methodology tucked behind separate accordions rather than one large
 * always-expanded block. See race-benchmarks.ts for provenance, the
 * 2025/2024 caveats, and why no athlete names appear here. The composite
 * performance tiers this data backs now live in their own section — see
 * PerformanceTierLadder.
 */
export function RaceBenchmarks() {
  const podiumTier = RACE_AGE_GROUP_PERFORMANCE_TIERS.find((t) => t.tier.startsWith("AG winner"));

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
        Recent {RACE_AGE_GROUP_YEARLY[0]?.year ? `M35–39` : ""} Winning Performances
      </p>
      <ul className="mt-3 space-y-1.5">
        {SUMMARY_YEARS.map((row) => (
          <li key={row.year} className="flex items-baseline gap-3 text-sm">
            <span className="w-12 font-display font-semibold text-ink">{row.year}</span>
            <span className="text-charcoal-light">—</span>
            <span className={row.note ? "text-charcoal-light" : "font-semibold text-ink"}>
              {row.note ? "shortened race" : row.finish}
            </span>
          </li>
        ))}
      </ul>

      {podiumTier && (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal-light">
          Recent normal-format years show M35–39 podiums finishing in the{" "}
          <span className="font-semibold text-ink">{podiumTier.finish}</span> range — the goal target above reflects
          that real result, not a softer estimate.
        </p>
      )}

      <div className="mt-6 space-y-3">
        <AccordionSection title="2026 Top 5 Results">
          <p className="mb-3 text-sm text-charcoal-light">
            The most recent normal-format race — {RACE_AGE_GROUP_2026_FINISHER_COUNT} M35–39 finishers. The winner
            wasn&apos;t the fastest swimmer; the gap opened on the bike and run.
          </p>
          <YearlyTable rows={RACE_AGE_GROUP_TOP5_2026} />
        </AccordionSection>

        <AccordionSection title="2025 Shortened-Race Results">
          <p className="mb-3 text-sm text-charcoal-light">
            No swim leg was held (river conditions), so finish times aren&apos;t comparable to a normal-format
            year — bike and run splits are, though, and are kept here for that reason.
          </p>
          <YearlyTable rows={RACE_AGE_GROUP_TOP3_2025} />
        </AccordionSection>

        <AccordionSection title="2023 Historical Results">
          <p className="mb-3 text-sm text-charcoal-light">
            An unusually fast year for the division — 9th place finished in {RACE_AGE_GROUP_2023_NINTH_FINISH}, and
            even 10th place finished in {RACE_AGE_GROUP_2023_TENTH_FINISH}.
          </p>
          <YearlyTable rows={RACE_AGE_GROUP_TOP5_2023} />
        </AccordionSection>

        <AccordionSection title="Additional Historical Results">
          <div className="space-y-4">
            <p className="text-sm text-charcoal-light">
              2026 top-5% finish-time threshold for M35–39: {RACE_AGE_GROUP_2026_TOP5_PERCENT_THRESHOLD} — an
              intermediate benchmark between &ldquo;sub-5&rdquo; and the front of the division.
            </p>
            <div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
                M35–39 Winning Time, by Year
              </h4>
              <div className="mt-3 overflow-x-auto rounded-sm border border-ink/10">
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
          </div>
        </AccordionSection>

        <AccordionSection title="Benchmark Methodology">
          <div className="space-y-3 text-sm leading-relaxed text-charcoal-light">
            <p>
              Compiled from age-group results for the 2022–2026 races — real recorded results, not projections,
              except where marked unconfirmed above.
            </p>
            <p>
              Deliberately anonymous: this is about the times, not putting other amateur athletes&apos; names on a
              public campaign page, so no winner/finisher names are stored or rendered here.
            </p>
            <p>
              2025 is excluded from time comparisons — no swim leg was held that year (river conditions), so total
              times aren&apos;t comparable to a normal-format race. It&apos;s kept in the yearly table only for
              continuity, clearly flagged.
            </p>
            <p>
              The performance tiers (see the ladder above) are a composite across the normal-format years only —
              2022, 2023, and 2026. &ldquo;AG winner&rdquo; is labeled &ldquo;(podium range)&rdquo; because that&apos;s
              what the 2023 and 2025 results actually show: recent podiums here run closer to age-group-winner pace
              than a softer &ldquo;podium contender&rdquo; estimate would suggest.
            </p>
          </div>
        </AccordionSection>
      </div>
    </div>
  );
}
