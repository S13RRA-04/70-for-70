/** Row shape for public.strava_tokens. Server-only — never sent to the browser. */
export interface StravaTokenRow {
  id: string;
  strava_athlete_id: string;
  access_token: string;
  refresh_token: string;
  scope: string;
  expires_at: string;
  connected_at: string;
  updated_at: string;
}

export interface StravaAthlete {
  id: number;
  username: string | null;
  firstName: string;
  lastName: string;
}

export interface StravaActivitySummary {
  id: number;
  name: string;
  /** Strava's sport_type (falls back to the older type field) — e.g. "Run", "Ride", "Swim". */
  sportType: string;
  startDate: string;
  distanceMeters: number;
  movingTimeSeconds: number;
  totalElevationGainMeters: number;
  averageSpeedMetersPerSecond: number;
}

/**
 * Public-safe derived snapshot — the only Strava-sourced shape that
 * reaches a page component or the browser. Never includes tokens or raw
 * API responses.
 */
export interface StravaTrainingSnapshot {
  fetchedAt: string;
  athleteName: string;
  recentActivities: StravaActivitySummary[];
}
