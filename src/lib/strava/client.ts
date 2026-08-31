import "server-only";
import { getValidAccessToken } from "./tokens";
import { STRAVA_API_BASE_URL, isStravaConfigured } from "./config";
import type { StravaActivitySummary, StravaAthlete, StravaTrainingSnapshot } from "@/types/strava";

/** How long a fetched Strava snapshot is reused before hitting the API again. */
const SNAPSHOT_REVALIDATE_SECONDS = 30 * 60;

const RECENT_ACTIVITY_COUNT = 5;

async function stravaFetch<T>(path: string, accessToken: string): Promise<T> {
  const res = await fetch(`${STRAVA_API_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: SNAPSHOT_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`Strava API request failed (${path}): ${res.status}`);
  }

  return res.json();
}

interface StravaAthleteResponse {
  id: number;
  username: string | null;
  firstname: string;
  lastname: string;
}

interface StravaActivityResponse {
  id: number;
  name: string;
  type: string;
  sport_type: string;
  start_date: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  average_speed: number;
}

export async function getStravaAthlete(accessToken: string): Promise<StravaAthlete> {
  const data = await stravaFetch<StravaAthleteResponse>("/athlete", accessToken);

  return {
    id: data.id,
    username: data.username,
    firstName: data.firstname,
    lastName: data.lastname,
  };
}

/**
 * Returns a public-safe snapshot of the athlete's most recent Strava
 * activities, or null if Strava isn't connected or the API call fails for
 * any reason (never throws — this is used directly by public pages).
 */
export async function getStravaTrainingSnapshot(): Promise<StravaTrainingSnapshot | null> {
  if (!isStravaConfigured()) return null;

  try {
    const accessToken = await getValidAccessToken();
    if (!accessToken) return null;

    const [athlete, activities] = await Promise.all([
      stravaFetch<StravaAthleteResponse>("/athlete", accessToken),
      stravaFetch<StravaActivityResponse[]>(
        `/athlete/activities?per_page=${RECENT_ACTIVITY_COUNT}`,
        accessToken,
      ),
    ]);

    const recentActivities: StravaActivitySummary[] = activities.map((a) => ({
      id: a.id,
      name: a.name,
      sportType: a.sport_type || a.type,
      startDate: a.start_date,
      distanceMeters: a.distance,
      movingTimeSeconds: a.moving_time,
      totalElevationGainMeters: a.total_elevation_gain,
      averageSpeedMetersPerSecond: a.average_speed,
    }));

    return {
      fetchedAt: new Date().toISOString(),
      athleteName: `${athlete.firstname} ${athlete.lastname}`.trim(),
      recentActivities,
    };
  } catch (error) {
    console.error("Failed to fetch Strava training snapshot:", error);
    return null;
  }
}
