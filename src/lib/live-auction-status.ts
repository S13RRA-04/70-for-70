/**
 * Silent-auction item status, derived from each item's bidding window
 * (see LIVE_AUCTION_ITEMS in src/lib/content/live-auction.ts) rather than
 * hand-written status copy that goes stale. Same pure epoch-millisecond
 * pattern as computeEventStatus/getCurrentEventStatus
 * (src/lib/22-for-the-22/event-status.ts): `opensAtIso`/`closesAtIso` are
 * ISO-8601 strings with an explicit UTC offset (same convention as
 * RACE_INFO.raceDate in constants.ts), so `new Date(iso).getTime()` is
 * timezone-correct wherever this runs. The window is half-open
 * [opensAt, closesAt) — closesAtIso is the instant bidding ends (midnight
 * at the start of the day *after* the last bidding day), so the last
 * bidding day itself still reads as open.
 */
export type AuctionStatus = "coming-soon" | "bidding-open" | "closed";

export function computeAuctionStatus(nowMs: number, opensAtIso: string, closesAtIso: string): AuctionStatus {
  const opensAt = new Date(opensAtIso).getTime();
  const closesAt = new Date(closesAtIso).getTime();

  if (nowMs < opensAt) return "coming-soon";
  if (nowMs < closesAt) return "bidding-open";
  return "closed";
}

/** Server Component render-body convenience wrapper — `nowMs` defaults via the parameter list, same pattern as getCurrentEventStatus. */
export function getCurrentAuctionStatus(
  opensAtIso: string,
  closesAtIso: string,
  nowMs: number = Date.now(),
): AuctionStatus {
  return computeAuctionStatus(nowMs, opensAtIso, closesAtIso);
}
