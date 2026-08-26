import { StatusBadge } from "@/components/journal/bike-build/status-badge";
import type { BikeBuildStatusSummaryItem } from "@/types/bike-build";

/** Compact "where things stand" grid — see BIKE_BUILD_STATUS_SUMMARY for the editable data. */
export function BuildStatusPanel({ items }: { items: BikeBuildStatusSummaryItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-sm border border-ink/10 bg-off-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-ink">{item.label}</p>
            <StatusBadge status={item.status} label={item.statusLabel} />
          </div>
          {item.detail && <p className="mt-2 text-sm text-charcoal-light">{item.detail}</p>}
        </div>
      ))}
    </div>
  );
}
