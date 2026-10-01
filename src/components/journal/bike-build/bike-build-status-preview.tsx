import Image from "next/image";
import Link from "next/link";
import type { BikeBuildStatusOverview } from "@/lib/content/building-the-bike";

interface BikeBuildStatusPreviewProps {
  overview: BikeBuildStatusOverview;
  photo: { src: string; alt: string };
  /** A few contributing-partner names to name-check — not the full credits list (see ContributorsSection for that, on the full build page). */
  contributorNames: string[];
}

/**
 * Homepage "Building the Bike" preview — a status/percentage snapshot, not
 * the "latest update" teaser BikeBuildTeaser renders elsewhere (see
 * /the-race, which links to the newest timeline entry instead). Percentage
 * is derived from overview.confirmedCount/totalCount rather than stored,
 * so it can never drift from the component-status board on the full page.
 */
export function BikeBuildStatusPreview({ overview, photo, contributorNames }: BikeBuildStatusPreviewProps) {
  const percent = Math.round((overview.confirmedCount / overview.totalCount) * 100);

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-ink/10">
        <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-bronze">{overview.badge}</p>
        <p className="mt-2 font-display text-5xl font-bold tabular-nums text-ink sm:text-6xl">{percent}%</p>
        <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-charcoal-light">Build Status</p>

        <p className="mt-4 text-base text-charcoal-light">
          {overview.confirmedCount} of {overview.totalCount} components confirmed.
          {contributorNames.length > 0 && (
            <> Built with the help of {contributorNames.join(", ")}, and other campaign partners.</>
          )}
        </p>

        <Link
          href="/journal/building-the-bike"
          className="mt-6 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
        >
          See the Full Build &rarr;
        </Link>
      </div>
    </div>
  );
}
