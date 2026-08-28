import Link from "next/link";
import { cn } from "@/lib/utils";
import type { GearJourneyTeaser as GearJourneyTeaserData } from "@/lib/content/gear-journey";

/**
 * Compact "Latest Gear-Journey Update" callout, styled like BikeBuildTeaser.
 * Content comes from getGearJourneyTeaser(), which always reflects the
 * newest GEAR_JOURNEY_TIMELINE entry (or the opening post if none exist
 * yet), so this never needs editing when a new update is added.
 */
export function GearJourneyTeaser({ teaser, className }: { teaser: GearJourneyTeaserData; className?: string }) {
  return (
    <Link
      href={teaser.href}
      className={cn(
        "block rounded-sm border border-bronze/30 bg-bronze/5 p-5 transition-colors hover:bg-bronze/10",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
        Latest Gear-Journey Update &middot; {teaser.displayDate}
      </p>
      <p className="mt-1 font-display text-lg font-semibold uppercase tracking-wide text-ink">{teaser.title}</p>
      <p className="mt-1 text-sm text-charcoal-light">{teaser.summary}</p>
      <span className="mt-2 inline-block text-xs font-semibold uppercase tracking-wide text-bronze">
        Read the Full Story &rarr;
      </span>
    </Link>
  );
}
