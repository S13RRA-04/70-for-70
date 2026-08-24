import type { JournalEntryRow } from "@/types/database";

const DISCIPLINE_LABELS: Record<NonNullable<JournalEntryRow["training_discipline"]>, string> = {
  swim: "Swim",
  bike: "Bike",
  run: "Run",
  brick: "Brick",
  strength: "Strength",
  rest: "Rest",
};

/** Only renders the training_* fields that are actually set — kept visually secondary to the story, per spec. */
export function TrainingMetricsPanel({ entry }: { entry: JournalEntryRow }) {
  const metrics: { label: string; value: string }[] = [];

  if (entry.training_discipline) metrics.push({ label: "Discipline", value: DISCIPLINE_LABELS[entry.training_discipline] });
  if (entry.training_distance != null) metrics.push({ label: "Distance", value: `${entry.training_distance} mi` });
  if (entry.training_duration_minutes != null) metrics.push({ label: "Time", value: `${entry.training_duration_minutes} min` });
  if (entry.training_pace) metrics.push({ label: "Avg Pace", value: entry.training_pace });
  if (entry.training_swim_pace) metrics.push({ label: "Swim Pace", value: entry.training_swim_pace });
  if (entry.training_elevation_ft != null) metrics.push({ label: "Elevation", value: `${entry.training_elevation_ft} ft` });
  if (entry.training_bike_power_watts != null) metrics.push({ label: "Avg Power", value: `${entry.training_bike_power_watts}w` });
  if (entry.training_avg_hr != null) metrics.push({ label: "Avg HR", value: `${entry.training_avg_hr} bpm` });
  if (entry.training_rpe != null) metrics.push({ label: "RPE", value: `${entry.training_rpe}/10` });
  if (entry.training_phase) metrics.push({ label: "Phase", value: entry.training_phase });

  if (metrics.length === 0) return null;

  return (
    <dl className="mt-8 grid grid-cols-2 gap-4 rounded-sm border border-ink/10 bg-off-white p-5 sm:grid-cols-3">
      {metrics.map((metric) => (
        <div key={metric.label}>
          <dt className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">{metric.label}</dt>
          <dd className="mt-1 font-display text-lg font-semibold text-ink">{metric.value}</dd>
        </div>
      ))}
    </dl>
  );
}
