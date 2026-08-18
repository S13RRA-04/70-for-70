import { cn, formatCurrency } from "@/lib/utils";

const MILESTONES = [
  { percent: 10, label: "10%" },
  { percent: 25, label: "25%" },
  { percent: 50, label: "Halfway" },
  { percent: 75, label: "75%" },
  { percent: 100, label: "Mission Accomplished" },
] as const;

/**
 * Milestone tick marks along the fundraising goal. Reached milestones are
 * highlighted; each becomes a natural moment to celebrate/share once real
 * donation data exists (full auto-generated update posts aren't built yet
 * — see README).
 */
export function MilestoneRail({ totalRaised, goal }: { totalRaised: number; goal: number }) {
  const percentRaised = goal > 0 ? (totalRaised / goal) * 100 : 0;

  return (
    <div className="relative pt-2">
      <div className="relative h-1.5 w-full rounded-full bg-charcoal/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-bronze transition-[width] duration-700 ease-out"
          style={{ width: `${Math.min(percentRaised, 100)}%` }}
        />
        {MILESTONES.map((milestone) => (
          <div
            key={milestone.percent}
            aria-hidden="true"
            className={cn(
              "absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2",
              percentRaised >= milestone.percent
                ? "border-bronze bg-bronze"
                : "border-charcoal/20 bg-off-white",
            )}
            style={{ left: `calc(${milestone.percent}% - 6px)` }}
          />
        ))}
      </div>

      <div className="relative mt-2 h-8">
        {MILESTONES.map((milestone) => (
          <div
            key={milestone.percent}
            className="absolute top-0 -translate-x-1/2 text-center"
            style={{ left: `${milestone.percent}%` }}
          >
            <p
              className={cn(
                "whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide",
                percentRaised >= milestone.percent ? "text-bronze" : "text-charcoal-light/60",
              )}
            >
              {milestone.label}
            </p>
            <p className="whitespace-nowrap text-[10px] text-charcoal-light/60">
              {formatCurrency(Math.round((milestone.percent / 100) * goal))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
