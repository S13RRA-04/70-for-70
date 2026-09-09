import { formatDateLong } from "@/lib/utils";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { groupSnapshotByCategory } from "@/lib/data/performance-snapshots";
import type { PerformanceMetricCategory, PerformanceSnapshotRow } from "@/types/database";

const CATEGORY_LABELS: Record<PerformanceMetricCategory, string> = {
  swim: "Swim",
  bike: "Bike",
  run: "Latest Outdoor Run",
  ride: "Latest Outdoor Ride",
  aerobic: "Aerobic Fitness",
  trainingpeaks: "TrainingPeaks",
};

/** Rendering order for the "Measured" half — ride/run last since each is the most recent single workout, not a standing benchmark like swim/bike/aerobic. */
const MEASURED_CATEGORY_ORDER: PerformanceMetricCategory[] = ["swim", "bike", "aerobic", "ride", "run"];

function CategoryGroup({ category, rows }: { category: PerformanceMetricCategory; rows: PerformanceSnapshotRow[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
        {CATEGORY_LABELS[category]}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {rows.map((row) => (
          <StatCard
            key={row.id}
            label={row.label}
            value={row.value_display}
            sublabel={row.is_measured ? undefined : "Prediction, not a completed test"}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Compact stat-card view of the latest performance_snapshots row set —
 * distinct from TrainingObjectivesChecklist (a completion ladder of
 * milestones) in that this is just "here's the number," dated and split
 * between directly measured metrics and TrainingPeaks' platform-calculated
 * training-load score, which is not the same kind of fact and is labeled
 * as such rather than presented with equal certainty.
 */
export function PerformanceMetricsPanel({
  recordedOn,
  rows,
}: {
  recordedOn: string | null;
  rows: PerformanceSnapshotRow[];
}) {
  if (!recordedOn || rows.length === 0) {
    return (
      <EmptyState
        title="Performance numbers are on the way."
        description="Swim, bike, and aerobic benchmarks will appear here once the first test data is recorded."
      />
    );
  }

  const grouped = groupSnapshotByCategory(rows);
  const trainingPeaksRows = grouped.trainingpeaks ?? [];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
        Updated {formatDateLong(recordedOn)}
      </p>

      <div className="mt-4 space-y-6">
        {MEASURED_CATEGORY_ORDER.filter((category) => (grouped[category]?.length ?? 0) > 0).map((category) => (
          <CategoryGroup key={category} category={category} rows={grouped[category]!} />
        ))}
      </div>

      {trainingPeaksRows.length > 0 && (
        <div className="mt-6 rounded-sm border border-dashed border-ink/15 bg-sand-light/40 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            Platform-Calculated — TrainingPeaks
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {trainingPeaksRows.map((row) => (
              <StatCard key={row.id} label={row.label} value={row.value_display} />
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-charcoal-light">
            TrainingPeaks baseline established September 2026. Fitness, Fatigue, and Form are still
            calibrating as training history accumulates — these are the platform&apos;s model of
            training load, not a direct physical measurement like the numbers above.
          </p>
        </div>
      )}
    </div>
  );
}
