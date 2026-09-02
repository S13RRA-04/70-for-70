import Image from "next/image";

export interface TimelineEntry {
  year: string;
  label: string;
  /** Optional supporting photo shown as a small thumbnail next to the entry. */
  image?: { src: string; alt: string };
  /** Optional link to an official race-result/profile page verifying this entry. */
  resultsUrl?: string;
}

/**
 * Generic vertical timeline — distinct from MilestoneRail (campaign
 * fundraising-progress ticks). For narrative/biographical sequences like
 * the About page's Movement chapter.
 */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative space-y-7 border-l border-ink/15 pl-6">
      {entries.map((entry) => (
        <li key={entry.year} className="relative flex items-center gap-4">
          <span
            aria-hidden="true"
            className="absolute -left-[29px] top-1 h-3 w-3 rounded-full border-2 border-bronze bg-off-white"
          />
          <div className="flex-1">
            <p className="font-display text-lg font-bold text-bronze">{entry.year}</p>
            <p className="mt-0.5 text-sm text-charcoal-light">{entry.label}</p>
            {entry.resultsUrl && (
              <a
                href={entry.resultsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
              >
                See Results &rarr;
              </a>
            )}
          </div>
          {entry.image && (
            <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-sm sm:w-20">
              <Image src={entry.image.src} alt={entry.image.alt} fill sizes="80px" className="object-cover" />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
