import Image from "next/image";
import Link from "next/link";
import { formatDateLong } from "@/lib/utils";
import { JOURNAL_PLACEHOLDER_IMAGE } from "@/lib/constants";

/**
 * Pinned card for the Journal index pointing at the standalone
 * /journal/gear-journey feature — styled to match BikeBuildIndexCard so the
 * two ongoing series read as part of the same family. Uses the shared
 * journal placeholder crest instead of a real photo, same as any
 * journal_entries row without an image — no campaign gear photography
 * exists yet.
 */
export function GearJourneyIndexCard({ lastUpdated }: { lastUpdated: string }) {
  return (
    <Link
      href="/journal/gear-journey"
      className="group flex flex-col overflow-hidden rounded-sm border border-ink/10 bg-off-white transition-shadow hover:shadow-md sm:flex-row"
    >
      <div className="relative aspect-[16/9] w-full shrink-0 bg-sand-light sm:w-1/2">
        <Image
          src={JOURNAL_PLACEHOLDER_IMAGE}
          alt=""
          aria-hidden="true"
          fill
          className="object-contain p-6"
          sizes="(min-width: 640px) 50vw, 100vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-bronze px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-off-white">
          Ongoing Series
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
          Ongoing Series &middot; Updated {formatDateLong(lastUpdated)}
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold uppercase tracking-wide text-ink group-hover:text-bronze sm:text-3xl">
          The Gear Journey
        </h3>
        <p className="mt-2 text-base text-charcoal-light">
          What it actually costs — in money, favors, and awkward asks — to get a brand-new triathlete to the
          starting line.
        </p>
        <span className="mt-3 text-xs font-semibold uppercase tracking-wide text-bronze">
          Follow the Journey &rarr;
        </span>
      </div>
    </Link>
  );
}
