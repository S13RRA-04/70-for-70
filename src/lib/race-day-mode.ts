/**
 * Race-day activation flag — independent of CAMPAIGN_LIVE (which only gates
 * whether the campaign domain serves real pages at all, see launch-gate.ts).
 * While this is false, /live shows a compact date/countdown page instead of
 * the live dashboard, and the "Race Day Live" link is hidden from the
 * footer and /the-race's CTA. Flip to "true" during race week.
 */
export function isRaceDayModeEnabled(): boolean {
  return process.env.RACE_DAY_MODE === "true";
}
