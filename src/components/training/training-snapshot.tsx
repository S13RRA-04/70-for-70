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

export function TrainingSnapshot({ snapshot }: { snapshot: WhoopTrainingSnapshot | null }) {
  if (!snapshot) {
    return (
      <EmptyState
        title="Live training data is on the way."
        description="Recovery, sleep, and strain will appear here once training data is connected."
      />
    );
  }

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

      {snapshot.recentWorkouts.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            Recent Workouts
          </p>
          <ul className="mt-2 space-y-2">
            {snapshot.recentWorkouts.map((workout) => (
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
        </div>
      )}

      <p className="mt-4 text-xs text-charcoal-light">
        Training data via WHOOP. Last updated {formatDateLong(snapshot.fetchedAt)}.
      </p>
    </div>
  );
}
