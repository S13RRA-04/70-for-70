import { RACE_INFO } from "@/lib/constants";

/**
 * Derived purely from RACE_INFO.raceDate — not from CAMPAIGN_LIVE (that
 * flag only gates whether the campaign domain serves real pages at all;
 * see launch-gate.ts, which is read exclusively from middleware.ts). Any
 * page that renders this helper is already past that gate, so there's no
 * "pre-launch" phase to represent here.
 *
 * Until raceDate is confirmed this always returns "active" — a deliberate
 * no-op, not a guess, so nothing site-visible changes until a real date
 * is set.
 */
export type CampaignPhase = "active" | "race-week" | "race-day" | "completed";

function toDateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function getCampaignPhase(now: Date = new Date()): CampaignPhase {
  const { raceDate } = RACE_INFO;
  if (!raceDate) return "active";

  const race = toDateOnly(new Date(raceDate));
  const today = toDateOnly(now);
  const diffDays = Math.round((race.getTime() - today.getTime()) / 86_400_000);

  if (diffDays < 0) return "completed";
  if (diffDays === 0) return "race-day";
  if (diffDays <= 7) return "race-week";
  return "active";
}
