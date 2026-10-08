"use client";

import { CountUpNumber } from "@/components/shared/count-up-number";
import { useMountedTransition } from "@/components/shared/use-mounted-transition";
import { cn, formatCurrency, formatDateLong, formatNumber, percentFunded } from "@/lib/utils";

interface StatCell {
  value: number;
  label: string;
  formatter: (n: number) => string;
  sublabel?: string;
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
  distanceMiles,
  updatedAt,
}: {
  amountRaised: number;
  goal: number;
  partnerCount: number;
  distanceMiles?: number;
  /** Null before RACE_INFO.raceDate is confirmed or after race day — see getDaysToRace(). */
  daysToRace: number | null;
  /** campaign.updated_at — shown as a small freshness cue under the bar, same source /impact's "Fundraising totals verified" line reads. Admins can re-stamp this to today via "Confirm Total Is Current" on /admin/donations even when the amount itself hasn't changed, so a quiet week doesn't make the campaign read as stale. Optional so existing callers that don't have it handy aren't forced to thread it through. */
  updatedAt?: string;
}) {
  const percent = percentFunded(amountRaised, goal);
  const mounted = useMountedTransition();

  const stats: StatCell[] = [
    { value: amountRaised, label: "Mission Progress", formatter: (n) => formatCurrency(n), sublabel: `of ${formatCurrency(goal)}` },
    ...(distanceMiles !== undefined
      ? [{ value: distanceMiles, label: "Race Distance", formatter: (n: number) => `${n.toFixed(1)} miles` }]
      : []),
    { value: partnerCount, label: "Partners", formatter: (n) => formatNumber(Math.round(n)) },
    ...(daysToRace !== null
      ? [{ value: daysToRace, label: "Days to Chattanooga", formatter: (n: number) => formatNumber(Math.round(n)) }]
      : []),
  ];

  return (
    <section className="border-b border-ink/10 bg-off-white py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* A light eyebrow, not a full SectionHeading — this strip sits
            directly under a large hero and is meant to read as a quick
            glance-at-this-number strip, not its own heavy editorial
            section. It previously had no framing at all, unlike every
            other section on the page. */}
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-bronze-text">
          Live Campaign Status
        </p>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "text-center sm:text-left",
                // An odd stat count (3, when daysToRace is null) otherwise
                // orphans the last cell alone on its own row in a 2-column
                // mobile grid — span it full-width instead of leaving it
                // stranded. Never triggers at sm:+, where it's always 4 even.
                stats.length % 2 !== 0 && i === stats.length - 1 && "col-span-2 sm:col-span-1",
              )}
            >
              <p className="font-display text-2xl font-bold tabular-nums text-ink sm:text-3xl">
                <CountUpNumber value={stat.value} formatter={stat.formatter} />
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                {stat.label}
              </p>
              {stat.sublabel && <p className="mt-0.5 text-xs text-charcoal-light/75">{stat.sublabel}</p>}
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
            className="h-full rounded-full bg-property-accent transition-[width] duration-motion-narrative ease-system"
            style={{ width: mounted ? `${percent}%` : "0%" }}
          />
        </div>

        {updatedAt && (
          <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-charcoal-light/70">
            Fundraising total verified {formatDateLong(updatedAt)}
          </p>
        )}
      </div>
    </section>
  );
}
