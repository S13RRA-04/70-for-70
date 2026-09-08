import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_PERFORMANCE_SNAPSHOTS } from "./seed-data";
import type { PerformanceMetricCategory, PerformanceSnapshotRow } from "@/types/database";

function sortByDisplayOrder(rows: PerformanceSnapshotRow[]): PerformanceSnapshotRow[] {
  return [...rows].sort(
    (a, b) => a.category.localeCompare(b.category) || a.display_order - b.display_order,
  );
}

/**
 * "Latest snapshot" is every row sharing the most recent recorded_on —
 * not a separate flag, so a future insert of a new dated row set becomes
 * the latest snapshot automatically. Returns [] rather than throwing when
 * no rows exist yet, so the panel can render its own empty state.
 */
async function getAllPerformanceSnapshots(): Promise<PerformanceSnapshotRow[]> {
  if (!isSupabaseConfigured()) {
    return [...SEED_PERFORMANCE_SNAPSHOTS];
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("performance_snapshots")
    .select("*")
    .order("recorded_on", { ascending: false });

  if (error || !data) {
    console.error("Failed to load performance snapshots, falling back to seed data:", error);
    return [...SEED_PERFORMANCE_SNAPSHOTS];
  }

  return data;
}

export async function getLatestPerformanceSnapshot(): Promise<{
  recordedOn: string | null;
  rows: PerformanceSnapshotRow[];
}> {
  const all = await getAllPerformanceSnapshots();
  if (all.length === 0) return { recordedOn: null, rows: [] };

  const recordedOn = all.reduce((latest, row) => (row.recorded_on > latest ? row.recorded_on : latest), all[0].recorded_on);
  return { recordedOn, rows: sortByDisplayOrder(all.filter((row) => row.recorded_on === recordedOn)) };
}

export type PerformanceSnapshotByCategory = Partial<Record<PerformanceMetricCategory, PerformanceSnapshotRow[]>>;

export function groupSnapshotByCategory(rows: PerformanceSnapshotRow[]): PerformanceSnapshotByCategory {
  const grouped: PerformanceSnapshotByCategory = {};
  for (const row of rows) {
    (grouped[row.category] ??= []).push(row);
  }
  return grouped;
}

/**
 * Full history for one metric_key, oldest first — the shape a future trend
 * chart (swim pace, FTP, VO2 max, TrainingPeaks Fitness) needs. Not wired
 * into any page yet; exists so that UI can be added later without a data
 * layer change.
 */
export async function getPerformanceMetricHistory(metricKey: string): Promise<PerformanceSnapshotRow[]> {
  const all = await getAllPerformanceSnapshots();
  return all
    .filter((row) => row.metric_key === metricKey)
    .sort((a, b) => a.recorded_on.localeCompare(b.recorded_on));
}
