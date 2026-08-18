import { cn, formatCurrency, mileStatusLabel, percentFunded } from "@/lib/utils";
import type { MileWithDonations } from "@/types/content";

const STATUS_STYLES = {
  available: "border-ink/15 bg-off-white text-charcoal-light",
  requested: "border-charcoal/30 bg-charcoal/5 text-charcoal-light",
  reserved: "border-charcoal/40 bg-charcoal/10 text-charcoal",
  partially_funded: "border-bronze/40 bg-sand-light text-bronze",
  funded: "border-olive bg-olive text-off-white",
} as const;

export function MileCard({
  mile,
  onSelect,
}: {
  mile: MileWithDonations;
  onSelect: (mileNumber: number) => void;
}) {
  const primarySupporter = mile.donations.find((d) => !d.anonymous);
  const percent = percentFunded(mile.amount_funded, mile.goal_amount);

  return (
    <button
      type="button"
      onClick={() => onSelect(mile.mile_number)}
      data-analytics-event="mile_viewed"
      className={cn(
        "flex flex-col rounded-sm border p-4 text-left transition-shadow hover:shadow-md focus-visible:shadow-md",
        STATUS_STYLES[mile.status],
      )}
      aria-haspopup="dialog"
    >
      <span className="font-display text-lg font-semibold uppercase tracking-wide">
        Mile {String(mile.mile_number).padStart(2, "0")}
      </span>
      <span
        className={cn(
          "mt-1 text-xs font-semibold uppercase tracking-widest",
          mile.status === "funded" ? "text-off-white/85" : "text-current",
        )}
      >
        {mileStatusLabel(mile.status)}
      </span>

      <span className="mt-3 text-sm font-medium">
        {mile.status === "funded" &&
          (primarySupporter ? `Sponsored by ${primarySupporter.donor_name}` : "Fully funded")}
        {(mile.status === "requested" || mile.status === "reserved") &&
          "Pending sponsorship review"}
        {(mile.status === "available" || mile.status === "partially_funded") &&
          `${formatCurrency(mile.amount_funded)} / ${formatCurrency(mile.goal_amount)}`}
      </span>

      {(mile.status === "available" || mile.status === "partially_funded") && (
        <>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-current/10">
            <div
              className="h-full rounded-full bg-current opacity-60"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="mt-1 text-xs text-current opacity-70">
            {Math.round(percent)}% funded
          </span>
        </>
      )}
    </button>
  );
}
