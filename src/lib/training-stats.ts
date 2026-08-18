import { weeksBetween } from "@/lib/utils";
import { RACE_INFO } from "@/lib/constants";

/**
 * Provider-neutral training volume for the Race page's "The Work" section
 * — same pattern as race-day.ts and the WHOOP client. All-null fields are
 * hidden (EmptyState) rather than shown as zeros. When a real provider
 * (Garmin, TrainingPeaks, etc.) is chosen, only this function's
 * implementation changes — TrainingStats and the Race page don't.
 */
export interface TrainingStats {
  swimSessions: number | null;
  bikeMiles: number | null;
  runMiles: number | null;
  totalHours: number | null;
  weeksCompleted: number | null;
  weeksRemaining: number | null;
}

export async function getTrainingStats(): Promise<TrainingStats> {
  const now = new Date().toISOString();

  const weeksCompleted =
    RACE_INFO.trainingStartDate && new Date(RACE_INFO.trainingStartDate) <= new Date()
      ? weeksBetween(RACE_INFO.trainingStartDate, now)
      : null;

  const weeksRemaining =
    RACE_INFO.raceDate && new Date(RACE_INFO.raceDate) >= new Date()
      ? weeksBetween(now, RACE_INFO.raceDate)
      : null;

  return {
    swimSessions: null,
    bikeMiles: null,
    runMiles: null,
    totalHours: null,
    weeksCompleted,
    weeksRemaining,
  };
}
