"use client";

import { CountUpNumber } from "@/components/shared/count-up-number";
import { formatCurrency, formatNumber, percentFunded } from "@/lib/utils";

interface StatCell {
  value: number;
  label: string;
  formatter: (n: number) => string;
}

/**
 * The homepage's "live campaign dashboard" strip, immediately below the
 * hero — $ raised, goal, partner count, and days to race, each animating
 * in once via CountUpNumber, plus a slim fill bar. Deliberately doesn't
 * reuse CampaignProgress's bar+stats combo: that component prints its own
 * "$X raised / Goal: $Y" text under the bar, which would just repeat the
 * Raised/Goal stat cells already shown here.
 */
export function CampaignStatusBar({
  amountRaised,
  goal,
  partnerCount,
  daysToRace,
}: {
  amountRaised: number;
  goal: number;
  partnerCount: number;
  /** Null before RACE_INFO.raceDate is confirmed or after race day — see getDaysToRace(). */
  daysToRace: number | null;
}) {
  const percent = percentFunded(amountRaised, goal);

  const stats: StatCell[] = [
    { value: amountRaised, label: "Raised", formatter: (n) => formatCurrency(n) },
    { value: goal, label: "Goal", formatter: (n) => formatCurrency(n) },
    { value: partnerCount, label: "Partners", formatter: (n) => formatNumber(Math.round(n)) },
    ...(daysToRace !== null
      ? [{ value: daysToRace, label: "Days to Chattanooga", formatter: (n: number) => formatNumber(Math.round(n)) }]
      : []),
  ];

  return (
    <section className="border-b border-ink/10 bg-off-white py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="font-display text-2xl font-bold tabular-nums text-ink sm:text-3xl">
                <CountUpNumber value={stat.value} formatter={stat.formatter} />
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div
          role="progressbar"
          aria-valuenow={Math.round(percent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${formatCurrency(amountRaised)} raised toward ${formatCurrency(goal)} goal`}
          className="mt-6 h-2 w-full overflow-hidden rounded-full bg-charcoal/10"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-olive to-bronze transition-[width] duration-600 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </section>
  );
}
