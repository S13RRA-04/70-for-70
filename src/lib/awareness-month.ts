/**
 * September is National Suicide Prevention Month — directly on-mission for
 * an org built around veteran/first-responder suicide prevention. Drives
 * the awareness banner (see AwarenessBanner) and the small teal/purple
 * identification accents in Header/Footer, plus the --color-awareness-*
 * tokens in globals.css. Pure date check, same pattern as
 * getCampaignPhase() — no env override, since the window repeats
 * identically every year and there's nothing to tune per-launch.
 */
export function isSuicidePreventionMonth(now: Date = new Date()): boolean {
  return now.getMonth() === 8; // September (0-indexed)
}
