"use client";

import { formatCurrency, percentFunded } from "@/lib/utils";
import { CountUpNumber } from "@/components/shared/count-up-number";
import { useMountedTransition } from "@/components/shared/use-mounted-transition";
import { cn } from "@/lib/utils";
import type { AllocationBreakdown } from "@/lib/data/allocation";

/**
 * Per-organization bar colors. Only orgs listed here get their own segment
 * — anything else (or donations with no organization_benefited set) falls
 * into the neutral "unallocated" gradient segment instead of a silent
 * default, since guessing a color for an unrecognized org isn't safe.
 */
const ORG_BAR_COLORS: Record<string, string> = {
  "Mighty Oaks Foundation": "bg-blue-600",
  "Veterans and Athletes United": "bg-red-600",
};

/** Reusable fundraising progress display: a percent bar plus $ raised vs. goal (once, not restated in a stat grid below it — every call site that used to opt out of that repeated grid via showStats={false} is now just the default). */
export function CampaignProgress({
  totalRaised,
  goal,
  tone,
  breakdown,
}: {
  totalRaised: number;
  goal: number;
  /** "dark" for use on a dark (bg-ink) background, e.g. the campaign-home hero. */
  tone?: "dark";
  /**
   * Optional per-organization split (see getAllocationBreakdown). When
   * provided, the bar renders as colored segments by org instead of a
   * single gradient fill. Only rendered once campaign.allocation_policy is
   * set — see README's Priority 10 notes on why that gate exists.
   */
  breakdown?: AllocationBreakdown | null;
}) {
  const percent = percentFunded(totalRaised, goal);
  const isDark = tone === "dark";
  // Renders every segment at 0% on first paint, then to its real width one
  // frame later, so the bar visibly grows in on mount instead of appearing
  // already full — the transition-[width] below only ever had a prop
  // *change* to animate from before this, and mount isn't one.
  const mounted = useMountedTransition();

  const orgSegments = (breakdown?.byOrganization ?? [])
    .filter((row) => row.amount > 0)
    .map((row) => ({ ...row, widthPercent: percentFunded(row.amount, goal) }));
  const allocatedTotal = orgSegments.reduce((sum, row) => sum + row.amount, 0);
  const unallocatedWidthPercent = percentFunded(Math.max(totalRaised - allocatedTotal, 0), goal);

  return (
    <div>
      <div
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${formatCurrency(totalRaised)} raised toward ${formatCurrency(goal)} goal`}
        className={cn("flex h-4 w-full overflow-hidden rounded-full", isDark ? "bg-off-white/15" : "bg-charcoal/10")}
      >
        {orgSegments.length > 0 ? (
          <>
            {orgSegments.map((row) => (
              <div
                key={row.organization}
                className={cn(
                  "h-full transition-[width] duration-600 ease-out",
                  ORG_BAR_COLORS[row.organization] ?? "bg-gradient-to-r from-olive to-bronze",
                )}
                style={{ width: mounted ? `${row.widthPercent}%` : "0%" }}
              />
            ))}
            {unallocatedWidthPercent > 0 && (
              <div
                className="h-full bg-gradient-to-r from-olive to-bronze transition-[width] duration-600 ease-out"
                style={{ width: mounted ? `${unallocatedWidthPercent}%` : "0%" }}
              />
            )}
          </>
        ) : (
          <div
            className="h-full rounded-full bg-gradient-to-r from-olive to-bronze transition-[width] duration-600 ease-out"
            style={{ width: mounted ? `${percent}%` : "0%" }}
          />
        )}
      </div>

      {orgSegments.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {orgSegments.map((row) => (
            <div key={row.organization} className="flex items-center gap-1.5 text-xs">
              <span
                className={cn("h-2 w-2 shrink-0 rounded-full", ORG_BAR_COLORS[row.organization] ?? "bg-bronze")}
                aria-hidden="true"
              />
              <span className={isDark ? "text-off-white/70" : "text-charcoal-light"}>
                {row.organization} &middot; {formatCurrency(row.amount)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p
          className={cn(
            "font-display text-2xl font-semibold tabular-nums sm:text-3xl",
            isDark ? "text-off-white" : "text-ink",
          )}
        >
          <CountUpNumber value={totalRaised} formatter={formatCurrency} />{" "}
          <span className={cn("text-base font-medium", isDark ? "text-off-white/70" : "text-charcoal-light")}>
            raised
          </span>
        </p>
        <p className={cn("text-sm font-medium", isDark ? "text-off-white/70" : "text-charcoal-light")}>
          Goal: {formatCurrency(goal)}
        </p>
      </div>
    </div>
  );
}
