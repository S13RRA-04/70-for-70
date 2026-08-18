/** Row shape for public.whoop_tokens. Server-only — never sent to the browser. */
export interface WhoopTokenRow {
  id: string;
  whoop_user_id: string;
  access_token: string;
  refresh_token: string;
  scope: string;
  expires_at: string;
  connected_at: string;
  updated_at: string;
}

export interface WhoopProfile {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface WhoopWorkoutSummary {
  id: string;
  sportName: string;
  start: string;
  end: string;
  strain: number | null;
  averageHeartRate: number | null;
  kilojoule: number | null;
}

/**
 * Public-safe derived snapshot — the only WHOOP-sourced shape that reaches
 * a page component or the browser. Never includes tokens or raw API responses.
 */
export interface WhoopTrainingSnapshot {
  fetchedAt: string;
  cycleStrain: number | null;
  recoveryScorePercent: number | null;
  sleepPerformancePercent: number | null;
  recentWorkouts: WhoopWorkoutSummary[];
}
