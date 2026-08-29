import { formatCurrency, percentFunded } from "@/lib/utils";
import { StatCard } from "@/components/shared/stat-card";
import { cn } from "@/lib/utils";

/** Reusable fundraising progress display: a percent bar plus $ raised vs. goal. */
export function CampaignProgress({
  totalRaised,
  goal,
  showStats = true,
  tone,
}: {
  totalRaised: number;
  goal: number;
  showStats?: boolean;
  /** "dark" for use on a dark (bg-ink) background, e.g. the campaign-home hero. */
  tone?: "dark";
}) {
  const percent = percentFunded(totalRaised, goal);
  const isDark = tone === "dark";

  return (
    <div>
      <div
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${formatCurrency(totalRaised)} raised toward ${formatCurrency(goal)} goal`}
        className={cn("h-4 w-full overflow-hidden rounded-full", isDark ? "bg-off-white/15" : "bg-charcoal/10")}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-olive to-bronze transition-[width] duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p
          className={cn(
            "font-display text-2xl font-semibold tabular-nums sm:text-3xl",
            isDark ? "text-off-white" : "text-ink",
          )}
        >
          {formatCurrency(totalRaised)}{" "}
          <span className={cn("text-base font-medium", isDark ? "text-off-white/70" : "text-charcoal-light")}>
            raised
          </span>
        </p>
        <p className={cn("text-sm font-medium", isDark ? "text-off-white/70" : "text-charcoal-light")}>
          Goal: {formatCurrency(goal)}
        </p>
      </div>

      {showStats && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <StatCard label="Raised" value={formatCurrency(totalRaised)} />
          <StatCard label="Goal" value={formatCurrency(goal)} />
        </div>
      )}
    </div>
  );
}
