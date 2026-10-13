/**
 * National First Responder Day is observed annually on October 28 — not a
 * federal holiday, just this site's own banner window for it. Opens a week
 * early (Oct 22) so it has visibility beyond a single day, same reasoning as
 * isSuicidePreventionMonth()'s whole-month window. Pure date check, no env
 * override — the window repeats identically every year.
 */
export function isFirstResponderDayWindow(now: Date = new Date()): boolean {
  return now.getMonth() === 9 && now.getDate() >= 22 && now.getDate() <= 28; // October 22-28
}
