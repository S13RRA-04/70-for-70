import { cn, formatDateLong } from "@/lib/utils";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { WhoopTrainingSnapshot } from "@/types/whoop";

function recoveryBandClass(score: number | null): string {
  if (score === null) return "";
  if (score >= 67) return "border-olive/40 bg-olive/5";
  if (score >= 34) return "border-bronze/40 bg-bronze/5";
  return "border-red-300 bg-red-50";
}

function formatDuration(startIso: string, endIso: string): string {
  const minutes = Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000);
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return hours > 0 ? `${hours}h ${remaining}m` : `${remaining}m`;
}

/** WHOOP's sport_name comes back as a lowercase, hyphenated slug (e.g. "yard-work"). */
function formatSportName(sportName: string): string {
  return sportName
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function WorkoutList({ workouts }: { workouts: WhoopTrainingSnapshot["recentWorkouts"] }) {
  return (
    <ul className="mt-2 space-y-2">
      {workouts.map((workout) => (
        <li
          key={workout.id}
          className="flex items-center justify-between rounded-sm border border-ink/10 bg-off-white px-3 py-2 text-sm"
        >
          <div>
            <p className="font-medium text-ink">{formatSportName(workout.sportName)}</p>
            <p className="text-xs text-charcoal-light">{formatDateLong(workout.start)}</p>
          </div>
          <div className="text-right text-xs text-charcoal-light">
            <p>{formatDuration(workout.start, workout.end)}</p>
            {workout.strain !== null && (
              <p className={cn("font-medium text-ink")}>Strain {workout.strain.toFixed(1)}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function TrainingSnapshot({
  snapshot,
  maxWorkouts,
  compact,
}: {
  snapshot: WhoopTrainingSnapshot | null;
  /** Caps the "Recent Workouts" list — omit to show everything WHOOP returned (see getTrainingSnapshot's own fetch limit). Ignored when `compact` is set (compact always shows exactly 1, with the rest behind "View Training Details"). */
  maxWorkouts?: number;
  /**
   * Shows only the latest workout up front; any additional recent workouts
   * move behind a "View Training Details" <details> instead of duplicating
   * the recovery/sleep/strain cards a second time. For the compact "Today's
   * Training Status" module on /the-race — everywhere else keeps the full
   * list via `maxWorkouts`.
   */
  compact?: boolean;
}) {
  if (!snapshot) {
    return (
      <EmptyState
        title="Live training data is on the way."
        description="Recovery, sleep, and strain will appear here once training data is connected."
      />
    );
  }

  const recentWorkouts =
    maxWorkouts !== undefined ? snapshot.recentWorkouts.slice(0, maxWorkouts) : snapshot.recentWorkouts;
  const visibleWorkouts = compact ? snapshot.recentWorkouts.slice(0, 1) : recentWorkouts;
  const remainingWorkouts = compact ? snapshot.recentWorkouts.slice(1) : [];

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Recovery"
          value={snapshot.recoveryScorePercent !== null ? `${snapshot.recoveryScorePercent}%` : "—"}
          className={recoveryBandClass(snapshot.recoveryScorePercent)}
        />
        <StatCard
          label="Sleep Performance"
          value={
            snapshot.sleepPerformancePercent !== null
              ? `${snapshot.sleepPerformancePercent}%`
              : "—"
          }
        />
        <StatCard
          label="Day Strain"
          value={snapshot.cycleStrain !== null ? snapshot.cycleStrain.toFixed(1) : "—"}
        />
      </div>

      {visibleWorkouts.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            {compact ? "Latest Session" : "Recent Workouts"}
          </p>
          <WorkoutList workouts={visibleWorkouts} />
        </div>
      )}

      {compact && remainingWorkouts.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light">
            View Training Details ↓
          </summary>
          <div className="mt-2">
            <WorkoutList workouts={remainingWorkouts} />
          </div>
        </details>
      )}

      <p className="mt-4 text-xs text-charcoal-light">
        Training data via WHOOP. Last updated {formatDateLong(snapshot.fetchedAt)}.
      </p>
    </div>
  );
}
