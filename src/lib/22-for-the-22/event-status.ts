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
