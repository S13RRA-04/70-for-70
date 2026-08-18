import "server-only";
import { getValidAccessToken } from "./tokens";
import { WHOOP_API_BASE_URL, isWhoopConfigured } from "./config";
import type { WhoopProfile, WhoopTrainingSnapshot, WhoopWorkoutSummary } from "@/types/whoop";

/** How long a fetched WHOOP snapshot is reused before hitting the API again. */
const SNAPSHOT_REVALIDATE_SECONDS = 30 * 60;

async function whoopFetch<T>(path: string, accessToken: string): Promise<T> {
  const res = await fetch(`${WHOOP_API_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: SNAPSHOT_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`WHOOP API request failed (${path}): ${res.status}`);
  }

  return res.json();
}

interface WhoopCollection<T> {
  records: T[];
  next_token: string | null;
}

interface WhoopCycle {
  score_state: string;
  score?: { strain: number };
}

interface WhoopRecovery {
  score_state: string;
  score?: { recovery_score: number };
}

interface WhoopSleep {
  score_state: string;
  score?: { sleep_performance_percentage: number };
}

interface WhoopWorkout {
  id: string;
  sport_name: string;
  start: string;
  end: string;
  score_state: string;
  score?: { strain: number; average_heart_rate: number; kilojoule: number };
}

export async function getWhoopProfile(accessToken: string): Promise<WhoopProfile> {
  const data = await whoopFetch<{
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
  }>("/user/profile/basic", accessToken);

  return {
    userId: data.user_id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
  };
}

/**
 * Returns a public-safe snapshot of the athlete's most recent training
 * data, or null if WHOOP isn't connected or the API call fails for any
 * reason (never throws — this is used directly by public pages).
 */
export async function getTrainingSnapshot(): Promise<WhoopTrainingSnapshot | null> {
  if (!isWhoopConfigured()) return null;

  try {
    const accessToken = await getValidAccessToken();
    if (!accessToken) return null;

    const [cycles, recoveries, sleeps, workouts] = await Promise.all([
      whoopFetch<WhoopCollection<WhoopCycle>>("/cycle?limit=1", accessToken),
      whoopFetch<WhoopCollection<WhoopRecovery>>("/recovery?limit=1", accessToken),
      whoopFetch<WhoopCollection<WhoopSleep>>("/activity/sleep?limit=1", accessToken),
      whoopFetch<WhoopCollection<WhoopWorkout>>("/activity/workout?limit=5", accessToken),
    ]);

    const latestCycle = cycles.records[0];
    const latestRecovery = recoveries.records[0];
    const latestSleep = sleeps.records[0];

    const recentWorkouts: WhoopWorkoutSummary[] = workouts.records
      .filter((w) => w.score_state === "SCORED")
      .map((w) => ({
        id: w.id,
        sportName: w.sport_name,
        start: w.start,
        end: w.end,
        strain: w.score?.strain ?? null,
        averageHeartRate: w.score?.average_heart_rate ?? null,
        kilojoule: w.score?.kilojoule ?? null,
      }));

    return {
      fetchedAt: new Date().toISOString(),
      cycleStrain:
        latestCycle?.score_state === "SCORED" ? (latestCycle.score?.strain ?? null) : null,
      recoveryScorePercent:
        latestRecovery?.score_state === "SCORED"
          ? (latestRecovery.score?.recovery_score ?? null)
          : null,
      sleepPerformancePercent:
        latestSleep?.score_state === "SCORED"
          ? (latestSleep.score?.sleep_performance_percentage ?? null)
          : null,
      recentWorkouts,
    };
  } catch (error) {
    console.error("Failed to fetch WHOOP training snapshot:", error);
    return null;
  }
}
