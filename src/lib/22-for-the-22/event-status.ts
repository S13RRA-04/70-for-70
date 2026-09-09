import type { EventLiveStatus } from "@/types/database";

/**
 * Pure epoch-millisecond comparison — never hand-rolled against "current
 * Central Time." `startsAtIso`/`endsAtIso` are timestamptz columns, always
 * read back from Supabase as UTC ISO-8601 strings regardless of how they
 * were inserted, so `new Date(iso).getTime()` is timezone-correct
 * everywhere this runs (server or client). `statusOverride` wins whenever
 * set — the admin escape hatch on EventConfigRow.
 */
export function computeEventStatus(
  nowMs: number,
  startsAtIso: string,
  endsAtIso: string,
  statusOverride: EventLiveStatus | null,
): EventLiveStatus {
  if (statusOverride) return statusOverride;

  const start = new Date(startsAtIso).getTime();
  const end = new Date(endsAtIso).getTime();

  if (nowMs < start) return "pre";
  if (nowMs < end) return "live";
  return "complete";
}

/**
 * Server Component render-body convenience wrapper — `nowMs` defaults via
 * the parameter list (not a literal `Date.now()` call inside the caller's
 * body) so it satisfies the project's react-hooks/purity lint rule, same
 * pattern as isSuicidePreventionMonth()'s `now: Date = new Date()` default.
 */
export function getCurrentEventStatus(
  startsAtIso: string,
  endsAtIso: string,
  statusOverride: EventLiveStatus | null,
  nowMs: number = Date.now(),
): EventLiveStatus {
  return computeEventStatus(nowMs, startsAtIso, endsAtIso, statusOverride);
}

/** Weeks before `starts_at` the homepage/sitewide promo surfaces switch on. */
const PROMO_WINDOW_LEAD_WEEKS = 6;

/**
 * True from PROMO_WINDOW_LEAD_WEEKS before `starts_at` through `ends_at` —
 * gates the homepage 6th section and the sitewide announcement banner so
 * they don't show stale event content most of the year. Mirrors
 * isSuicidePreventionMonth()'s self-gating pattern (see AwarenessBanner).
 */
export function isEventPromoWindow(nowMs: number, startsAtIso: string, endsAtIso: string): boolean {
  const start = new Date(startsAtIso).getTime();
  const end = new Date(endsAtIso).getTime();
  const promoStart = start - PROMO_WINDOW_LEAD_WEEKS * 7 * 24 * 60 * 60 * 1000;

  return nowMs >= promoStart && nowMs <= end;
}

/** Server Component render-body convenience wrapper — see getCurrentEventStatus's doc comment. */
export function isEventPromoWindowNow(startsAtIso: string, endsAtIso: string, nowMs: number = Date.now()): boolean {
  return isEventPromoWindow(nowMs, startsAtIso, endsAtIso);
}
