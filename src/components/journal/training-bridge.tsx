import Link from "next/link";
import { Waves, Bike, Footprints } from "lucide-react";
import { formatDateLong } from "@/lib/utils";
import type { TrainingDiscipline } from "@/types/database";
import type { WhoopWorkoutSummary } from "@/types/whoop";

const DISCIPLINE_META: Record<TrainingDiscipline, { label: string; Icon: typeof Waves }> = {
  swim: { label: "Swim", Icon: Waves },
  bike: { label: "Bike", Icon: Bike },
  run: { label: "Run", Icon: Footprints },
};

const DISCIPLINE_ORDER: TrainingDiscipline[] = ["swim", "bike", "run"];

function formatDuration(startIso: string, endIso: string): string {
  const minutes = Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000);
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return hours > 0 ? `${hours}h ${remaining}m` : `${remaining}m`;
}

/**
 * Compact swim/bike/run bridge from the Journal to /the-race — not a
 * duplicate of the full dashboard there. WHOOP only supplies
 * duration/strain/heart rate, never distance or pace (see
 * WhoopWorkoutSummary) — so this shows what's actually available per
 * discipline rather than fabricating a distance figure. A discipline with
 * no recent session says so honestly instead of being silently omitted.
 */
export function TrainingBridge({
  recentDisciplineWorkouts,
}: {
  recentDisciplineWorkouts: { discipline: TrainingDiscipline; workout: WhoopWorkoutSummary }[];
}) {
  const byDiscipline = new Map(recentDisciplineWorkouts.map((r) => [r.discipline, r.workout]));

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        {DISCIPLINE_ORDER.map((discipline) => {
          const { label, Icon } = DISCIPLINE_META[discipline];
          const workout = byDiscipline.get(discipline);
          return (
            <div key={discipline} className="rounded-sm border border-ink/10 bg-off-white p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bronze">
                <Icon size={14} aria-hidden />
                {label}
              </div>
              {workout ? (
                <>
                  <time dateTime={workout.start} className="mt-2 block text-sm text-charcoal-light">
                    {formatDateLong(workout.start)}
                  </time>
                  <p className="mt-1 text-sm font-medium text-ink">{formatDuration(workout.start, workout.end)}</p>
                  {workout.strain !== null && (
                    <p className="mt-0.5 text-xs text-charcoal-light">Strain {workout.strain.toFixed(1)}</p>
                  )}
                </>
              ) : (
                <p className="mt-2 text-sm text-charcoal-light/70">No recent session data.</p>
              )}
            </div>
          );
        })}
      </div>
      <Link
        href="/the-race"
        className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
      >
        View Full Training Dashboard &rarr;
      </Link>
    </div>
  );
}
