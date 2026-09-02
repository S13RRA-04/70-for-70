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
export type TrainingPhaseLabel = (typeof TRAINING_PHASE_LABELS)[number];

/**
 * The athlete's actual current block in the training arc — updated by hand
 * as each block actually completes, not computed from
 * RACE_INFO.trainingStartDate/raceDate. Real periodization blocks aren't
 * equal-length time slices, so a date-fraction formula would rarely match
 * how the plan is actually structured; a reported, ground-truth value is
 * more honest than a computed guess. Null means no phase is claimed as
 * "current."
 */
export const CURRENT_TRAINING_PHASE: TrainingPhaseLabel | null = "Build";

/**
 * Which rung of TRAINING_PHASE_LABELS is "current." Returns undefined
 * (never a guess) until CURRENT_TRAINING_PHASE is set. Shared by /the-race
 * and /journal so both pages agree.
 */
export function getCurrentTrainingPhaseIndex(): number | undefined {
  if (!CURRENT_TRAINING_PHASE) return undefined;
  const index = TRAINING_PHASE_LABELS.indexOf(CURRENT_TRAINING_PHASE);
  return index === -1 ? undefined : index;
}
