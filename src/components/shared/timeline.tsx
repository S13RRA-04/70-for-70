export interface TimelineEntry {
  year: string;
  label: string;
}

/**
 * Generic vertical timeline — distinct from MilestoneRail (campaign
 * fundraising-progress ticks). For narrative/biographical sequences like
 * the About page's story arc.
 */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative space-y-7 border-l border-ink/15 pl-6">
      {entries.map((entry) => (
        <li key={entry.year} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[29px] top-1 h-3 w-3 rounded-full border-2 border-bronze bg-off-white"
          />
          <p className="font-display text-lg font-bold text-bronze">{entry.year}</p>
          <p className="mt-0.5 text-sm text-charcoal-light">{entry.label}</p>
        </li>
      ))}
    </ol>
  );
}
