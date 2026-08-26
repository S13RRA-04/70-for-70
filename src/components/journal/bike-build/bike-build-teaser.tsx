import Link from "next/link";
import { cn } from "@/lib/utils";
import type { BikeBuildTeaser as BikeBuildTeaserData } from "@/lib/content/building-the-bike";

/**
 * Compact "Latest Bike-Build Update" callout — used on the Journal index
 * and The Race page. Content comes from getBikeBuildTeaser(), which always
 * reflects the newest BIKE_BUILD_TIMELINE entry, so this never needs
 * editing when a new update is added.
 */
export function BikeBuildTeaser({ teaser, className }: { teaser: BikeBuildTeaserData; className?: string }) {
  return (
    <Link
      href={teaser.href}
      className={cn(
        "block rounded-sm border border-bronze/30 bg-bronze/5 p-5 transition-colors hover:bg-bronze/10",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
        Latest Bike-Build Update &middot; {teaser.displayDate}
      </p>
      <p className="mt-1 font-display text-lg font-semibold uppercase tracking-wide text-ink">{teaser.title}</p>
      <p className="mt-1 text-sm text-charcoal-light">{teaser.summary}</p>
      <span className="mt-2 inline-block text-xs font-semibold uppercase tracking-wide text-bronze">
        Read the Full Story &rarr;
      </span>
    </Link>
  );
}
