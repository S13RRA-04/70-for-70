import { StatusBadge } from "@/components/journal/bike-build/status-badge";
import type { BikeBuildComponentRow } from "@/types/bike-build";

/**
 * Reusable part-by-part inventory board. Wrapped in its own scroll
 * container so the table never forces the page to scroll horizontally on
 * narrow screens — see BIKE_BUILD_COMPONENT_STATUS for the editable rows.
 */
export function ComponentStatusBoard({ rows }: { rows: BikeBuildComponentRow[] }) {
  return (
    <div className="overflow-x-auto rounded-sm border border-ink/10">
      <table className="w-full min-w-[620px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 bg-sand-light">
            <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
              Component
            </th>
            <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
              Status
            </th>
            <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
              Notes
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.component} className="border-b border-ink/10 bg-off-white last:border-0">
              <th scope="row" className="px-4 py-3 align-top font-semibold text-ink">
                {row.component}
              </th>
              <td className="px-4 py-3 align-top">
                <StatusBadge status={row.status} label={row.statusLabel} />
              </td>
              <td className="px-4 py-3 align-top text-charcoal-light">{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
