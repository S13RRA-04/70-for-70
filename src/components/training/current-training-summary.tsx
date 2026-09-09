import { StatCard } from "@/components/shared/stat-card";
import type { PerformanceSnapshotRow } from "@/types/database";

const HIGHLIGHTS: { metricKey: string; label: string; sublabel?: string }[] = [
  { metricKey: "swim_pace_100yd", label: "Swim", sublabel: "Repeatable pace" },
  { metricKey: "bike_ftp_watts", label: "Bike", sublabel: "Current FTP" },
  { metricKey: "run_avg_pace", label: "Run", sublabel: "Latest aerobic benchmark" },
  { metricKey: "vo2max", label: "VO₂ Max" },
];

/**
 * Four-card summary only — the full performance_snapshots panel (every
 * measured category, TrainingPeaks load, the benchmark checklist) lives on
 * /the-race's Training Dashboard now, not here. This is deliberately just
 * enough to say "training is real and current," pointing anyone who wants
 * more at the dashboard rather than reproducing it. Picks a fixed set of
 * metric_keys out of whatever the latest snapshot contains — a highlight
 * missing from that set (no reading recorded yet) is simply skipped, never
 * shown as a placeholder.
 */
export function CurrentTrainingSummary({ rows }: { rows: PerformanceSnapshotRow[] }) {
  const byMetricKey = new Map(rows.map((row) => [row.metric_key, row]));
  const cards = HIGHLIGHTS.map((h) => ({ ...h, row: byMetricKey.get(h.metricKey) })).filter((c) => c.row);

  if (cards.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((c) => (
        <StatCard key={c.metricKey} label={c.label} value={c.row!.value_display} sublabel={c.sublabel} />
      ))}
    </div>
  );
}
