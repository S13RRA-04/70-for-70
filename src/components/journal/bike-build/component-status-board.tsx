import Link from "next/link";
import { StatusBadge } from "@/components/journal/bike-build/status-badge";
import type { BikeBuildComponentRow } from "@/types/bike-build";

interface ComponentStatusBoardProps {
  rows: BikeBuildComponentRow[];
  /**
   * When provided, renders an extra column with a link built from each row
   * — e.g. GEAR_NEEDS_CATEGORIES linking to a general contact page.
   * Omitted entirely on the bike-build page's own usage, which has no such
   * link.
   */
  actionHref?: (row: BikeBuildComponentRow) => string;
  actionLabel?: string;
}

/**
 * Reusable part-by-part inventory board. Wrapped in its own scroll
 * container so the table never forces the page to scroll horizontally on
 * narrow screens — see BIKE_BUILD_COMPONENT_STATUS for the editable rows.
 */
export function ComponentStatusBoard({ rows, actionHref, actionLabel = "Offer to Help" }: ComponentStatusBoardProps) {
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
            {actionHref && (
              <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                <span className="sr-only">Action</span>
              </th>
            )}
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
              {actionHref && (
                <td className="px-4 py-3 align-top">
                  <Link
                    href={actionHref(row)}
                    className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
                  >
                    {actionLabel} &rarr;
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
