import Image from "next/image";
import Link from "next/link";
import { formatDateLong } from "@/lib/utils";

/**
 * Pinned card for the Journal index pointing at the standalone
 * /journal/building-the-bike feature — styled to match JournalCard's
 * "featured" layout so it reads as part of the same series even though it
 * isn't a Supabase journal_entries row (see that page's own doc comment
 * for why it's a static route instead).
 */
export function BikeBuildIndexCard({ lastUpdated }: { lastUpdated: string }) {
  return (
    <Link
      href="/journal/building-the-bike"
      className="group flex flex-col overflow-hidden rounded-sm border border-ink/10 bg-off-white transition-shadow hover:shadow-md sm:flex-row"
    >
      <div className="relative aspect-[16/9] w-full shrink-0 bg-sand-light sm:w-1/2">
        <Image
          src="/journal/building-the-bike/frame-hero.jpg"
          alt="The donated 2012 Stradalli carbon frame that's the foundation of the bike build."
          fill
          className="object-cover"
          sizes="(min-width: 640px) 50vw, 100vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-bronze px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-off-white">
          Build In Progress
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
          Ongoing Series &middot; Updated {formatDateLong(lastUpdated)}
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold uppercase tracking-wide text-ink group-hover:text-bronze sm:text-3xl">
          Building the Bike
        </h3>
        <p className="mt-2 text-base text-charcoal-light">
          The continuing story of turning a donated frame into a race-ready machine — one setback, one favor, and
          one part at a time.
        </p>
        <span className="mt-3 text-xs font-semibold uppercase tracking-wide text-bronze">Follow the Build &rarr;</span>
      </div>
    </Link>
  );
}
