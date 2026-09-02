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

/** The training-arc ladder shown by TrainingTimeline and the Journal hero's status strip — single source of truth for both. */
export const TRAINING_PHASE_LABELS = ["Base", "Build", "Specific", "Peak", "Race"] as const;

/**
 * Which rung of TRAINING_PHASE_LABELS is "current," derived from real dates
 * only. Returns undefined (never a guess) until both a training start date
 * and a race date are known — see RACE_INFO.trainingStartDate, still a TODO
 * as of this writing. Shared by /the-race and /journal so both pages agree.
 */
export function getCurrentTrainingPhaseIndex(now: Date = new Date()): number | undefined {
  const { trainingStartDate, raceDate } = RACE_INFO;
  if (!trainingStartDate || !raceDate) return undefined;

  const start = new Date(trainingStartDate).getTime();
  const end = new Date(raceDate).getTime();
  const current = now.getTime();
  if (current <= start) return 0;
  if (current >= end) return TRAINING_PHASE_LABELS.length - 1;

  const fraction = (current - start) / (end - start);
  return Math.min(TRAINING_PHASE_LABELS.length - 1, Math.floor(fraction * TRAINING_PHASE_LABELS.length));
}
