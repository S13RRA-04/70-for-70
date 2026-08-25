import { weeksBetween } from "@/lib/utils";
import { RACE_INFO } from "@/lib/constants";
import type { TrainingDiscipline } from "@/types/database";
import type { WhoopWorkoutSummary } from "@/types/whoop";

/**
 * Classifies a WHOOP sport_name (e.g. "swimming", "cycling", "running",
 * "yard-work", "walking") into a race discipline, or null for anything
 * that isn't swim/bike/run — used to keep low-signal activities (dog
 * walks, yard work, generic "Other" sessions) out of curated race-focused
 * summaries (homepage "Road to Chattanooga", /the-race's recent activity)
 * without hiding them from the full WHOOP dashboard, which still shows
 * every workout unfiltered.
 */
export function classifyTrainingDiscipline(sportName: string): TrainingDiscipline | null {
  const s = sportName.toLowerCase();
  if (s.includes("swim")) return "swim";
  if (s.includes("cycl") || s.includes("bik")) return "bike";
  if (s.includes("run")) return "run";
  return null;
}

/** Most recent swim/bike/run workout per discipline, newest first within each — everything else (walks, yard work, etc.) excluded. */
export function getRecentDisciplineWorkouts(
  workouts: WhoopWorkoutSummary[],
): { discipline: TrainingDiscipline; workout: WhoopWorkoutSummary }[] {
  const seen = new Set<TrainingDiscipline>();
  const result: { discipline: TrainingDiscipline; workout: WhoopWorkoutSummary }[] = [];

  for (const workout of workouts) {
    const discipline = classifyTrainingDiscipline(workout.sportName);
    if (!discipline || seen.has(discipline)) continue;
    seen.add(discipline);
    result.push({ discipline, workout });
  }

  return result;
}

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
