import Image from "next/image";
import type { RuckJournalEntry } from "@/lib/content/ruckup22-journal";

/**
 * A mission's participation journal: photos and videos in the order of the
 * day, on a uniform 3:4 grid so it reads left to right. Videos never
 * autoplay or preload — the poster stands in until someone presses play.
 */
export function MissionJournal({ entries }: { entries: RuckJournalEntry[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <figure key={entry.id} id={entry.id} className="scroll-mt-28">
          {entry.video ? (
            <video
              controls
              playsInline
              preload="none"
              poster={entry.video.poster || entry.src}
              aria-label={entry.alt}
              className="aspect-[3/4] w-full rounded-sm bg-ink object-cover"
              style={{ objectPosition: entry.objectPosition }}
            >
              {entry.video.sources.map((source) => (
                <source key={source.src} src={source.src} type={source.type} />
              ))}
            </video>
          ) : (
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-ink">
              <Image
                src={entry.src}
                alt={entry.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
                style={{ objectPosition: entry.objectPosition }}
              />
            </div>
          )}
          <figcaption className="mt-2.5 text-sm leading-relaxed text-charcoal-light">{entry.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
