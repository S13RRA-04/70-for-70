import { MERCH_PROCEEDS_ALLOCATION } from "@/lib/constants";

/**
 * The 22/58/20 net-merchandise-proceeds breakdown — see
 * MERCH_PROCEEDS_ALLOCATION and the Terms of Use's "Merchandise and
 * Program Proceeds" section for the definitions behind these numbers.
 */
export function ProceedsBreakdown() {
  return (
    <div className="rounded-sm border border-ink/10 bg-off-white p-6">
      <div className="grid gap-6 sm:grid-cols-3">
        {MERCH_PROCEEDS_ALLOCATION.map((row) => (
          <div key={row.label}>
            <p className="font-display text-3xl font-bold text-bronze">{row.percentage}%</p>
            <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-ink">
              {row.label}
            </p>
            <p className="mt-2 text-sm text-charcoal-light">{row.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-charcoal-light">
        These percentages apply only to the net merchandise proceeds actually received by For
        The 22 after the third-party merchandise provider deducts its applicable costs and fees.
      </p>
    </div>
  );
}
