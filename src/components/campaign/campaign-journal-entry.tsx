import Image from "next/image";
import Link from "next/link";
import { cn, formatDateLong } from "@/lib/utils";
import type { CampaignJournalEntry } from "@/types/campaign-journal";

interface CampaignJournalEntryCardProps {
  entry: CampaignJournalEntry;
  /**
   * "teaser" is a clamped card linking to the full entry on
   * /campaigns/journal — used on /campaigns so that page stays a fixed
   * size no matter how many entries exist. "full" renders the complete
   * entry — used on /campaigns/journal itself.
   */
  variant?: "teaser" | "full";
  className?: string;
}

export function CampaignJournalEntryCard({ entry, variant = "full", className }: CampaignJournalEntryCardProps) {
  const isTeaser = variant === "teaser";

  const header = (
    <div className="flex items-start gap-4">
      {entry.image && (
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-ink/10 bg-off-white">
          <Image src={entry.image.src} alt={entry.image.alt} fill className="object-contain p-1.5" sizes="48px" />
        </div>
      )}
      <div className="min-w-0">
        <time dateTime={entry.date} className="text-xs font-semibold uppercase tracking-widest text-bronze">
          {formatDateLong(entry.date)}
        </time>
        <h3
          className={cn(
            "mt-1 font-display font-bold uppercase tracking-tight text-ink",
            isTeaser ? "text-lg" : "text-xl sm:text-2xl",
          )}
        >
          {entry.title}
        </h3>
      </div>
    </div>
  );

  if (isTeaser) {
    return (
      <Link
        href={`/campaigns/journal#${entry.id}`}
        className={cn(
          "hover-lift block rounded-sm border border-ink/10 bg-off-white p-5 transition-colors hover:bg-sand-light",
          className,
        )}
      >
        {header}
        <p className="mt-3 line-clamp-2 text-sm text-charcoal-light">{entry.summary}</p>
        <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-wide text-bronze">
          Read Update &rarr;
        </span>
      </Link>
    );
  }

  return (
    <article id={entry.id} className={cn("scroll-mt-20", className)}>
      {header}
      <p className="mt-3 text-base leading-relaxed text-charcoal-light">{entry.summary}</p>
      <div className="mt-3 space-y-3">
        {entry.body.map((paragraph, i) => (
          <p key={i} className="text-base leading-relaxed text-charcoal-light">
            {paragraph}
          </p>
        ))}
      </div>
      {entry.link && (
        <a
          href={entry.link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
        >
          {entry.link.label} &rarr;
        </a>
      )}
    </article>
  );
}
