import { cn, mileStatusLabel, percentFunded } from "@/lib/utils";
import { FEATURED_MILE } from "@/lib/constants";
import type { MileWithDonations } from "@/types/content";

/**
 * Compact tile, not a card — the point is that a visitor can visually scan
 * all 70 miles at once (see MileGrid). Status is communicated by a
 * bottom-up fill (like a thermometer) AND by the accessible label, never
 * by color alone. Detail (dollar amounts, donor, dedication) lives in
 * MileDetailModal once a mile is opened, not on the tile itself.
 */
export function MileCard({
  mile,
  onSelect,
}: {
  mile: MileWithDonations;
  onSelect: (mileNumber: number) => void;
}) {
  const percent = percentFunded(mile.amount_funded, mile.goal_amount);
  const isFeatured = mile.mile_number === FEATURED_MILE.number;
  const isPending = mile.status === "requested" || mile.status === "reserved";
  const fillPercent = mile.status === "funded" ? 100 : isPending ? 0 : percent;

  return (
    <button
      type="button"
      onClick={() => onSelect(mile.mile_number)}
      data-analytics-event="mile_viewed"
      aria-haspopup="dialog"
      aria-label={`Mile ${mile.mile_number} — ${mileStatusLabel(mile.status)}${isPending ? "" : `, ${Math.round(percent)}% funded`}`}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-[3px] border bg-off-white transition-transform hover:z-10 hover:scale-110 focus-visible:z-10 focus-visible:scale-110",
        isFeatured ? "border-2 border-bronze" : "border-ink/10",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 bottom-0 transition-[height]",
          mile.status === "funded" ? "bg-olive" : isPending ? "bg-charcoal/30" : "bg-bronze/60",
        )}
        style={{ height: `${fillPercent}%` }}
      />
      <span
        className={cn(
          "relative z-[1] flex h-full w-full items-center justify-center font-display text-[10px] font-bold sm:text-xs",
          fillPercent > 55 ? "text-off-white" : "text-ink",
        )}
      >
        {mile.mile_number}
      </span>
    </button>
  );
}
