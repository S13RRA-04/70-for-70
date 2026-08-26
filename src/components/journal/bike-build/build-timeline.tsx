import Image from "next/image";
import { Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BikeBuildTimelineEntry } from "@/types/bike-build";

/**
 * Vertical, mobile-friendly timeline. Renders `entries` in the order
 * given — the content module keeps them oldest-first, so this component
 * never sorts or filters. Adding an update is purely a content-file change
 * (see src/lib/content/building-the-bike.ts); nothing here needs editing.
 */
export function BuildTimeline({ entries }: { entries: BikeBuildTimelineEntry[] }) {
  return (
    <ol className="space-y-10">
      {entries.map((entry) => (
        <li
          key={entry.id}
          id={entry.id}
          className={cn(
            "relative scroll-mt-24 border-l-2 pl-6 sm:pl-8",
            entry.featured ? "border-bronze" : "border-ink/10",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-off-white",
              entry.featured ? "bg-bronze" : "bg-ink/30",
            )}
          />

          <div
            className={cn(
              "rounded-sm border p-5 sm:p-6",
              entry.featured ? "border-bronze/40 bg-bronze/5" : "border-ink/10 bg-off-white",
            )}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-widest text-bronze">
              <time dateTime={entry.date}>{entry.displayDate}</time>
              <span aria-hidden="true" className="text-charcoal-light/40">
                &middot;
              </span>
              <span className="text-charcoal-light">{entry.status}</span>
              {entry.featured && (
                <span className="rounded-full bg-bronze px-2.5 py-0.5 text-[10px] text-off-white">Latest Update</span>
              )}
            </div>

            <h3 className="mt-2 flex items-center gap-2 font-display text-xl font-semibold uppercase tracking-wide text-ink sm:text-2xl">
              {entry.title}
              <a
                href={`#${entry.id}`}
                aria-label={`Link to this update: ${entry.title}`}
                className="text-charcoal-light/40 hover:text-bronze"
              >
                <Link2 size={16} aria-hidden="true" />
              </a>
            </h3>

            <div className="mt-3 space-y-3">
              {entry.body.map((paragraph, i) => (
                <p key={i} className="leading-relaxed text-charcoal-light">
                  {paragraph}
                </p>
              ))}
            </div>

            {entry.technicalDetails && (
              <div className="mt-5 rounded-sm border border-ink/10 bg-sand-light/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                  {entry.technicalDetails.heading}
                </p>
                {entry.technicalDetails.note && (
                  <p className="mt-1 text-xs text-charcoal-light/80">{entry.technicalDetails.note}</p>
                )}
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
                  {entry.technicalDetails.items.map((item) => (
                    <div key={item.label}>
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-light/70">
                        {item.label}
                      </dt>
                      <dd className="text-sm text-ink">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {entry.photos && entry.photos.length > 0 && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {entry.photos.map((photo) => (
                  <figure key={photo.src} className="overflow-hidden rounded-sm border border-ink/10">
                    <div className="relative aspect-[4/3] w-full bg-sand-light">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        loading="lazy"
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="bg-off-white px-3 py-2 text-xs text-charcoal-light">
                      {photo.isEstimate && <span className="font-semibold text-bronze">Approximate: </span>}
                      {photo.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}

            {entry.contributors && entry.contributors.length > 0 && (
              <p className="mt-5 text-sm text-charcoal-light">
                <span className="font-semibold text-ink">With thanks to:</span> {entry.contributors.join(", ")}
              </p>
            )}

            {entry.relatedLinks && entry.relatedLinks.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {entry.relatedLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="font-semibold text-bronze hover:text-bronze-light">
                      {link.label} &rarr;
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}

      <li className="relative border-l-2 border-dashed border-ink/15 pl-6 sm:pl-8">
        <span
          aria-hidden="true"
          className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-off-white bg-ink/20"
        />
        <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-charcoal-light/70">
          To Be Continued
        </p>
      </li>
    </ol>
  );
}
