import { AuctionCountdown } from "@/components/live/auction-countdown";
import type { AuctionStatus } from "@/lib/live-auction-status";
import type { LiveAuctionItem, LiveAuctionTracker } from "@/lib/content/live-auction";
import { formatCurrency } from "@/lib/utils";

/**
 * Bid amount against the item's goal, plus time remaining. The bid is a
 * hand-updated value (see LiveAuctionTracker), so it always carries its "as of"
 * time and 32auctions stays the system of record for the actual high bid.
 */
export function AuctionBidTracker({
  item,
  tracker,
  status,
}: {
  item: LiveAuctionItem;
  tracker: LiveAuctionTracker;
  status: AuctionStatus;
}) {
  const { currentBid, startingBid, goal, bidAsOfLabel } = tracker;
  const percent = Math.min(Math.round(((currentBid ?? 0) / goal) * 100), 100);
  const amountLabel = currentBid === null ? "Starting bid" : status === "closed" ? "Last reported bid" : "Current bid";

  return (
    <div className="mt-6 rounded-xl border border-off-white/10 bg-ink/40 p-4 sm:p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-off-white/50">{amountLabel}</p>
          <p className="mt-1 font-display text-4xl text-bronze-light">{formatCurrency(currentBid ?? startingBid)}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-off-white/50">Goal</p>
          <p className="mt-1 font-display text-2xl text-off-white">{formatCurrency(goal)}</p>
        </div>
      </div>

      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-off-white/10"
        role="progressbar"
        aria-label={`Bidding progress toward the ${formatCurrency(goal)} goal`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="h-full rounded-full bg-bronze-light" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-xs text-off-white/50">
        {percent}% of goal
        {currentBid !== null && bidAsOfLabel ? ` · Updated ${bidAsOfLabel}` : ""}
        {" · "}See 32auctions for the live high bid
      </p>

      <div className="mt-5">
        <AuctionCountdown opensAtIso={item.opensAtIso} closesAtIso={item.closesAtIso} />
      </div>
    </div>
  );
}
