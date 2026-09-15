import type { PerformanceSnapshotRow } from "@/types/database";

const CHART_WIDTH = 280;
const CHART_HEIGHT = 96;
const PADDING_X = 12;
const PADDING_Y = 16;

/**
 * recorded_on is a date-only string (e.g. "2026-09-08"), which `new Date()`
 * parses as UTC midnight — formatting that with the shared formatDateLong()
 * (no explicit timeZone) rolls back a day in any timezone behind UTC. Fixed
 * locally here rather than in the shared utility, which is used broadly
 * enough elsewhere (journal timestamps, etc.) that changing its default
 * timezone behavior is a separate, wider-blast-radius decision.
 */
function formatRecordedOn(dateOnly: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(dateOnly));
}

/**
 * Small inline-SVG line chart for one metric's history (from
 * getPerformanceMetricHistory, src/lib/data/performance-snapshots.ts) — no
 * charting library, matches the site's existing "no unnecessary chart
 * chrome" bar. A single data point (most metrics today only have one
 * recorded reading) renders as "Establishing baseline" rather than a fake
 * trend line — real history only, never invented datapoints.
 */
export function PerformanceTrendChart({
  label,
  rows,
}: {
  label: string;
  rows: PerformanceSnapshotRow[];
}) {
  const points = rows.filter((r) => r.value_numeric !== null);

  if (points.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-ink/15 bg-off-white p-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">{label}</p>
        <p className="mt-2 text-xs text-charcoal-light">No recorded data yet.</p>
      </div>
    );
  }

  const latest = points[points.length - 1];

  if (points.length === 1) {
    return (
      <div className="rounded-sm border border-ink/10 bg-off-white p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">{label}</p>
        <p className="mt-2 font-display text-2xl font-semibold text-ink">{latest.value_display}</p>
        <p className="mt-1 text-xs text-charcoal-light">
          Establishing baseline — recorded {formatRecordedOn(latest.recorded_on)}.
        </p>
      </div>
    );
  }

  const values = points.map((p) => p.value_numeric!);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const plotWidth = CHART_WIDTH - PADDING_X * 2;
  const plotHeight = CHART_HEIGHT - PADDING_Y * 2;

  const coords = points.map((p, i) => {
    const x = PADDING_X + (points.length === 1 ? plotWidth / 2 : (i / (points.length - 1)) * plotWidth);
    const y = PADDING_Y + plotHeight - ((p.value_numeric! - min) / range) * plotHeight;
    return { x, y, row: p };
  });

  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ");
  const first = points[0];
  const changedFavorably = latest.value_numeric! !== first.value_numeric!;

  return (
    <div className="rounded-sm border border-ink/10 bg-off-white p-5">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">{label}</p>
        <p className="font-display text-lg font-semibold text-ink">{latest.value_display}</p>
      </div>

      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="mt-3 h-24 w-full"
        role="img"
        aria-label={`${label} trend: ${points.map((p) => `${formatRecordedOn(p.recorded_on)}, ${p.value_display}`).join("; ")}`}
      >
        <path d={path} fill="none" stroke="var(--color-bronze, #a97a4c)" strokeWidth={2} />
        {coords.map((c) => (
          <circle key={c.row.id} cx={c.x} cy={c.y} r={3} fill="var(--color-bronze, #a97a4c)">
            <title>
              {formatRecordedOn(c.row.recorded_on)}: {c.row.value_display}
            </title>
          </circle>
        ))}
      </svg>

      <p className="mt-1 text-xs text-charcoal-light">
        {formatRecordedOn(first.recorded_on)} → {formatRecordedOn(latest.recorded_on)}
        {changedFavorably ? ` · ${first.value_display} → ${latest.value_display}` : ""}
      </p>
    </div>
  );
}
