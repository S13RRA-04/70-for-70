/** Visible legend for the mile grid's fill-bar status system — see mile-card.tsx. */
const LEGEND_ITEMS = [
  { label: "Available", swatch: "bg-off-white border border-ink/15" },
  { label: "In Progress", swatch: "bg-bronze/60" },
  { label: "Funded", swatch: "bg-olive" },
  { label: "Reserved", swatch: "bg-charcoal/30" },
] as const;

export function MileStatusLegend() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Mile status legend">
      {LEGEND_ITEMS.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-xs font-medium text-charcoal-light">
          <span aria-hidden="true" className={`h-3 w-3 shrink-0 rounded-sm ${item.swatch}`} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
