"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Camera, Link2, ZoomIn } from "lucide-react";
import { PhotoLightbox } from "@/components/shared/photo-lightbox";
import type { BikeBuildTimelineNode } from "@/lib/content/building-the-bike";
import type { BikeBuildTimelineEntry } from "@/types/bike-build";
import { cn } from "@/lib/utils";

/**
 * node.date is a date-only string (e.g. "2026-09-30"), which `new Date()`
 * parses as UTC midnight — formatting that without an explicit timeZone
 * rolls the displayed date back a day in any timezone behind UTC (this ran
 * in a US timezone and showed "Aug 1" as "Jul 31"). Same fix as
 * performance-trend-chart.tsx's formatRecordedOn, applied locally rather
 * than in the shared formatDateLong utility, which is used broadly enough
 * elsewhere (real timestamps, not just calendar dates) that changing its
 * default timezone behavior is a separate, wider-blast-radius decision.
 */
function formatNodeDate(dateOnly: string, opts: { month: "short" | "long" }): string {
  return new Intl.DateTimeFormat("en-US", { month: opts.month, day: "numeric", timeZone: "UTC" }).format(
    new Date(dateOnly),
  );
}

function nodeMonthKey(dateOnly: string): string {
  return dateOnly.slice(0, 7); // "2026-09-30" -> "2026-09"
}

function Node({
  node,
  isActive,
  isPast,
  isLast,
  monthLabel,
  onToggle,
}: {
  node: BikeBuildTimelineNode;
  isActive: boolean;
  /** This node or an earlier one is the active one — colors the line segment leading into it to trace progress through the story. */
  isPast: boolean;
  isLast: boolean;
  /** Set only on the first node of a new month, so a label can introduce that cluster of dates. */
  monthLabel: string | null;
  onToggle: () => void;
}) {
  const hasPhotos = node.photos.length > 0;

  return (
    <li className="group relative flex shrink-0 scroll-mx-4 snap-center flex-col items-center pt-6">
      {monthLabel && (
        <span className="absolute -top-0.5 left-0 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-light/50">
          {monthLabel}
        </span>
      )}

      {!isLast && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-1/2 top-[26px] h-0.5 w-12 transition-colors sm:w-16",
            isPast ? "bg-bronze/40" : "bg-ink/10",
          )}
        />
      )}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isActive}
        aria-label={`${node.displayDate}: ${node.entries.map((e) => e.title).join(", ")}`}
        className={cn(
          "relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold shadow-sm transition-all duration-150",
          isActive
            ? "scale-110 border-bronze bg-bronze text-off-white shadow-md"
            : hasPhotos
              ? "border-bronze/50 bg-off-white text-bronze hover:scale-105 hover:border-bronze"
              : "border-ink/20 bg-off-white text-charcoal-light/60 hover:scale-105 hover:border-ink/40",
        )}
      >
        {hasPhotos ? node.photos.length : <Camera size={13} className="opacity-30" aria-hidden />}
      </button>

      {/* Hover/focus preview — desktop only; touch users get the same info by tapping (which opens the panel below). */}
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2.5 hidden w-56 -translate-x-1/2 rounded-sm border border-ink/10 bg-ink px-3 py-2.5 text-off-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 sm:block"
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest text-bronze-light">{node.displayDate}</p>
        <div className="mt-1 space-y-1">
          {node.entries.map((entry) => (
            <p key={entry.id} className="text-xs leading-snug">
              {entry.summary}
            </p>
          ))}
        </div>
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-ink"
        />
      </div>

      <time
        dateTime={node.date}
        className={cn(
          "mt-2.5 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide transition-colors",
          isActive ? "text-bronze" : "text-charcoal-light",
        )}
      >
        {formatNodeDate(node.date, { month: "short" })}
      </time>
    </li>
  );
}

/** Full entry content — body, technical details, cost table, photos, contributors, related links. Same shape the old flat "How We Got Here" list used to render, now living inside a node's expanded panel. */
function EntryDetail({ entry }: { entry: BikeBuildTimelineEntry }) {
  return (
    <div id={entry.id} className="scroll-mt-24">
      <h3 className="flex items-center gap-2 font-display text-lg font-semibold uppercase tracking-wide text-ink sm:text-xl">
        {entry.title}
        <a
          href={`#${entry.id}`}
          aria-label={`Link to this update: ${entry.title}`}
          className="text-charcoal-light/40 hover:text-bronze"
        >
          <Link2 size={15} aria-hidden="true" />
        </a>
      </h3>
      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-bronze">{entry.status}</p>

      <div className="mt-3 space-y-3">
        {entry.body.map((paragraph, i) => (
          <p key={i} className="leading-relaxed text-charcoal-light">
            {paragraph}
          </p>
        ))}
      </div>

      {entry.technicalDetails && (
        <div className="mt-5 rounded-sm border border-ink/10 bg-off-white p-4">
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

      {entry.costTable && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            {entry.costTable.heading}
          </p>
          {entry.costTable.note && (
            <p className="mt-1 text-xs text-charcoal-light/80">{entry.costTable.note}</p>
          )}
          <div className="mt-3 overflow-x-auto rounded-sm border border-ink/10">
            <table className="w-full min-w-[420px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 bg-sand-light">
                  <th scope="col" className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                    Part
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                    Estimated Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {entry.costTable.rows.map((row) => (
                  <tr key={row.part} className="border-b border-ink/10 bg-off-white last:border-0">
                    <td className="px-4 py-2.5 align-top text-ink">{row.part}</td>
                    <td className="px-4 py-2.5 align-top text-charcoal-light">{row.cost}</td>
                  </tr>
                ))}
                <tr className="bg-bronze/5">
                  <td className="px-4 py-2.5 font-semibold text-ink">{entry.costTable.totalLabel}</td>
                  <td className="px-4 py-2.5 font-semibold text-ink">{entry.costTable.totalValue}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {entry.photos && entry.photos.length > 0 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {entry.photos.map((photo) => (
            <figure key={photo.src} className="overflow-hidden rounded-sm border border-ink/10">
              <PhotoLightbox src={photo.src} alt={photo.alt} caption={photo.caption} width={photo.width} height={photo.height}>
                <div className="relative aspect-[4/3] w-full bg-sand-light">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                  />
                  <span className="absolute right-2 top-2 rounded-full bg-ink/60 p-1.5 text-off-white opacity-0 transition-opacity group-hover:opacity-100">
                    <ZoomIn size={14} aria-hidden />
                  </span>
                </div>
              </PhotoLightbox>
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
  );
}

/**
 * The build timeline — one node per calendar date something happened,
 * oldest first. This *is* "How We Got Here" now: hovering a node (desktop)
 * previews that date's update(s) in a tooltip; clicking expands the node
 * into the full entry (or entries, if more than one happened that day),
 * body text, technical details, and photos included — the same content the
 * earlier flat, always-expanded list used to render.
 *
 * Opens on the node containing the featured/latest entry by default. Also
 * restores state from a URL fragment on mount (e.g. a shared
 * #entry-id permalink from before this became node-based), so old links
 * into specific updates keep working.
 */
export function BuildTimelineNodes({ nodes }: { nodes: BikeBuildTimelineNode[] }) {
  // The truly latest node, not "any node with a featured entry" — several
  // older entries still carry featured: true from when each was the
  // newest at the time, and BIKE_BUILD_TIMELINE never goes back to clear
  // it off the previous one. `nodes` is oldest-first, so the last node is
  // unambiguously current, matching getLatestBikeBuildEntry()'s own logic.
  const [activeDate, setActiveDate] = useState<string | null>(() => nodes.at(-1)?.date ?? null);

  useEffect(() => {
    // window.location isn't available during SSR, so the featured-entry
    // default above is what the server renders; this corrects it on the
    // client to whichever node a shared #entry-id permalink points at. A
    // genuine "sync from an external system" case, not derivable from
    // props/state alone — the two-pass (SSR default, client corrects) is
    // the intended, hydration-safe pattern here.
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const match = nodes.find((node) => node.entries.some((entry) => entry.id === hash));
    if (!match) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveDate(match.date);
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ block: "start" });
    });
    // Only ever run once, on mount — nodes is static content, not reactive state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = nodes.find((node) => node.date === activeDate) ?? null;
  const activeIndex = nodes.findIndex((node) => node.date === activeDate);

  if (nodes.length === 0) return null;

  return (
    <div>
      <div className="relative">
        {/* Edge fade masks hint that the row scrolls — same technique MerchTicker uses for its marquee edges. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-off-white to-transparent sm:w-12" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-off-white to-transparent sm:w-12" aria-hidden="true" />
        <ol className="scrollbar-hide flex snap-x snap-proximity items-start gap-8 overflow-x-auto px-4 pb-3 pt-2 sm:gap-10">
          {nodes.map((node, i) => {
            const monthLabel =
              i === 0 || nodeMonthKey(node.date) !== nodeMonthKey(nodes[i - 1].date)
                ? formatNodeDate(node.date, { month: "long" }).split(" ")[0]
                : null;
            return (
              <Node
                key={node.date}
                node={node}
                isActive={node.date === activeDate}
                isPast={activeIndex >= 0 && i <= activeIndex}
                isLast={i === nodes.length - 1}
                monthLabel={monthLabel}
                onToggle={() => setActiveDate((current) => (current === node.date ? null : node.date))}
              />
            );
          })}
        </ol>
      </div>

      {active && (
        <div className="mt-6 divide-y divide-ink/10 rounded-sm border border-bronze/30 bg-bronze/5">
          {active.entries.map((entry) => (
            <div key={entry.id} className="p-5 sm:p-6">
              <EntryDetail entry={entry} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
