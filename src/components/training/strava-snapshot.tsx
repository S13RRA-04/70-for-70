import { formatDateLong } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import type { StravaTrainingSnapshot } from "@/types/strava";

const METERS_PER_MILE = 1609.344;
const MPS_TO_MPH = 2.23694;

function formatDistance(meters: number): string {
  const miles = meters / METERS_PER_MILE;
  return `${miles.toFixed(miles < 10 ? 2 : 1)} mi`;
}

function formatMovingTime(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

/** Runs get a min/mi pace; every other sport gets an mph speed. */
function formatPaceOrSpeed(sportType: string, averageSpeedMps: number): string | null {
  if (averageSpeedMps <= 0) return null;

  if (/run/i.test(sportType)) {
    const secPerMile = METERS_PER_MILE / averageSpeedMps;
    const minutes = Math.floor(secPerMile / 60);
    const seconds = Math.round(secPerMile % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")} /mi`;
  }

  return `${(averageSpeedMps * MPS_TO_MPH).toFixed(1)} mph`;
}

/** Strava's sport_type is already PascalCase but compound names run together (e.g. "WeightTraining"). */
function formatSportType(sportType: string): string {
  return sportType.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

export function StravaSnapshot({ snapshot }: { snapshot: StravaTrainingSnapshot | null }) {
  if (!snapshot) {
    return (
      <EmptyState
        title="Live Strava data is on the way."
        description="Recent rides, runs, and swims will appear here once Strava is connected."
      />
    );
  }

  if (snapshot.recentActivities.length === 0) {
    return (
      <EmptyState
        title="No recent Strava activity yet."
        description="New activities will appear here as soon as they're recorded."
      />
    );
  }

  return (
    <div>
      <ul className="space-y-2">
        {snapshot.recentActivities.map((activity) => {
          const paceOrSpeed = formatPaceOrSpeed(activity.sportType, activity.averageSpeedMetersPerSecond);
          return (
            <li
              key={activity.id}
              className="flex items-center justify-between rounded-sm border border-ink/10 bg-off-white px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium text-ink">{activity.name}</p>
                <p className="text-xs text-charcoal-light">
                  {formatSportType(activity.sportType)} &middot; {formatDateLong(activity.startDate)}
                </p>
              </div>
              <div className="text-right text-xs text-charcoal-light">
                <p>
                  {formatDistance(activity.distanceMeters)} &middot; {formatMovingTime(activity.movingTimeSeconds)}
                </p>
                {paceOrSpeed && <p className="font-medium text-ink">{paceOrSpeed}</p>}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs text-charcoal-light">
        Activity via Strava ({snapshot.athleteName}). Last updated {formatDateLong(snapshot.fetchedAt)}.
      </p>
    </div>
  );
}
