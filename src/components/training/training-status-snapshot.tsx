import { Waves, Bike, Footprints } from "lucide-react";
import { CTAButton } from "@/components/shared/cta-button";
import type { PerformanceSnapshotRow } from "@/types/database";

/** Same representative metric per discipline already used elsewhere on this page (see the-race/page.tsx's TREND_METRICS) — not a new/different benchmark choice. */
const DISCIPLINE_METRICS = [
  { key: "swim_pace_fastest", label: "Swim", Icon: Waves },
  { key: "bike_ftp_watts", label: "Bike", Icon: Bike },
  { key: "run_avg_pace", label: "Run", Icon: Footprints },
];

/**
 * A snapshot, not the training journal — three cards, one current benchmark
 * per discipline, then a CTA out to the fuller training content. See
 * PerformanceMetricsPanel/TrainingObjectivesChecklist (rendered lower on
 * this page, tucked behind a disclosure) for the complete picture.
 */
export function TrainingStatusSnapshot({ rows }: { rows: PerformanceSnapshotRow[] }) {
  const byMetricKey = new Map(rows.map((row) => [row.metric_key, row]));

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        {DISCIPLINE_METRICS.map(({ key, label, Icon }) => {
          const row = byMetricKey.get(key);
          return (
            <div key={key} className="rounded-sm border border-ink/10 bg-off-white p-5">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                <Icon size={14} className="text-bronze" aria-hidden />
                {label}
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-ink">{row?.value_display ?? "TBD"}</p>
              {row && <p className="mt-1 text-xs text-charcoal-light">{row.label}</p>}
            </div>
          );
        })}
      </div>
      <CTAButton href="/journal" className="mt-6">
        Follow Live Training
      </CTAButton>
    </div>
  );
}
