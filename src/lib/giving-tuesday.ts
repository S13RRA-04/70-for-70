import { AWARENESS_CALENDAR, type ExplicitDateRule } from "@/lib/content/awareness-calendar";

/**
 * GivingTuesday phases for the homepage and /donate spotlight.
 *
 * The date comes from the "givingtuesday" entry in the awareness calendar, so
 * re-dating it there each year (it's the Tuesday after Thanksgiving) moves
 * the spotlight and the sitewide banner together. Days are counted in Central
 * time, where the campaign is based. The Worker runs in UTC, which would
 * otherwise flip "Today is GivingTuesday" on at 6 PM the night before.
 */

const TIME_ZONE = "America/Chicago";
/** The spotlight opens a week out… */
const LEAD_DAYS = 7;
/** …and says thank you for a few days after. */
const THANKS_DAYS = 3;

export type GivingTuesdayPhase =
  | { phase: "upcoming"; date: string; daysUntil: number }
  | { phase: "live"; date: string }
  | { phase: "thanks"; date: string };

function givingTuesdayDate(): string | null {
  const entry = AWARENESS_CALENDAR.find((item) => item.slug === "givingtuesday");
  return entry?.dateRule.type === "explicit" ? (entry.dateRule as ExplicitDateRule).startDate : null;
}

/** YYYY-MM-DD for `now` in Central time. */
function centralDate(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

/**
 * Lets you preview a phase locally (`GIVING_TUESDAY_NOW=2026-12-01T12:00:00-06:00 npm run dev`).
 * Ignored in production so the live site always uses the real clock.
 */
function currentTime(): Date {
  const override = process.env.NODE_ENV !== "production" ? process.env.GIVING_TUESDAY_NOW : undefined;
  const parsed = override ? new Date(override) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : new Date();
}

export function getGivingTuesdayPhase(now: Date = currentTime()): GivingTuesdayPhase | null {
  const date = givingTuesdayDate();
  if (!date) return null;
  const daysUntil = daysBetween(centralDate(now), date);
  if (daysUntil > LEAD_DAYS || daysUntil < -THANKS_DAYS) return null;
  if (daysUntil > 0) return { phase: "upcoming", date, daysUntil };
  if (daysUntil === 0) return { phase: "live", date };
  return { phase: "thanks", date };
}

/** "Tuesday, December 1" */
export function formatGivingTuesdayDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}
