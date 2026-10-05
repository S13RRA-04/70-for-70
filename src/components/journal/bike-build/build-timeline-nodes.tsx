"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, ChevronLeft, ChevronRight, Link2, ZoomIn } from "lucide-react";
import { PhotoLightbox } from "@/components/shared/photo-lightbox";
import { usePointerMotionEnabled } from "@/components/shared/use-media-query";
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
  onPreview,
  onPreviewEnd,
}: {
  node: BikeBuildTimelineNode;
  isActive: boolean;
  /** This node or an earlier one is the active one — colors the line segment leading into it to trace progress through the story. */
  isPast: boolean;
  isLast: boolean;
  /** Set only on the first node of a new month, so a label can introduce that cluster of dates. */
  monthLabel: string | null;
  onToggle: () => void;
  /** Reports this node's button so the parent can measure it and position the shared preview tooltip (see BuildTimelineNodes — the tooltip can't live here, since the scrollable row would clip it). */
  onPreview: (node: BikeBuildTimelineNode, target: HTMLElement) => void;
  onPreviewEnd: () => void;
}) {
  const hasPhotos = node.photos.length > 0;

  return (
    <li className="relative flex shrink-0 scroll-mx-4 snap-center flex-col items-center pt-6">
      {monthLabel && (
        <span className="absolute top-0 left-0 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-light/50">
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
        onMouseEnter={(e) => onPreview(node, e.currentTarget)}
        onMouseLeave={onPreviewEnd}
        onFocus={(e) => onPreview(node, e.currentTarget)}
        onBlur={onPreviewEnd}
        aria-expanded={isActive}
        aria-label={`${node.displayDate}: ${node.entries.map((e) => e.title).join(", ")}`}
        className={cn(
          "relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold shadow-sm transition-all duration-150",
          isActive
            ? "scale-110 border-bronze bg-bronze-text text-off-white shadow-md"
            : hasPhotos
              ? "border-bronze/50 bg-off-white text-bronze hover:scale-105 hover:border-bronze"
              : "border-ink/20 bg-off-white text-charcoal-light/60 hover:scale-105 hover:border-ink/40",
        )}
      >
        {hasPhotos ? node.photos.length : <Camera size={13} className="opacity-30" aria-hidden />}
      </button>

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
              <PhotoLightbox
                src={photo.src}
                alt={photo.alt}
                caption={photo.caption}
                width={photo.width}
                height={photo.height}
                gallery={entry.photos}
              >
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
              <a href={link.href} className="font-semibold text-bronze hover:text-bronze-dark">
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
  const [preview, setPreview] = useState<{ node: BikeBuildTimelineNode; left: number; top: number; arrowOffset: number } | null>(
    null,
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLOListElement>(null);
  const pointerMotionEnabled = usePointerMotionEnabled();
  // Drives the prev/next scroll buttons' disabled state — kept in sync with
  // the row's actual scroll position (see the effect below), not assumed
  // from activeDate, since the row can be scrolled independently of which
  // node is expanded.
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Tooltip is w-56 (224px); clamped so it never runs off the wrapper's
  // edges for the first/last few nodes in the row, with the arrow nudged
  // back toward the actual node so it still visually points at it.
  const TOOLTIP_WIDTH = 224;
  const TOOLTIP_MARGIN = 8;

  function handlePreview(node: BikeBuildTimelineNode, target: HTMLElement) {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const wrapperRect = wrapper.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const rawCenter = targetRect.left - wrapperRect.left + targetRect.width / 2;
    const halfWidth = TOOLTIP_WIDTH / 2;
    const clampedCenter = Math.min(
      Math.max(rawCenter, halfWidth + TOOLTIP_MARGIN),
      wrapperRect.width - halfWidth - TOOLTIP_MARGIN,
    );
    setPreview({
      node,
      left: clampedCenter,
      top: targetRect.top - wrapperRect.top - 14,
      arrowOffset: Math.min(Math.max(rawCenter - clampedCenter, -(halfWidth - 16)), halfWidth - 16),
    });
  }

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

  // Edge panning: holding the pointer near either end of the scrollable row
  // auto-scrolls that direction, so the nodes it hides aren't reachable only
  // by an explicit drag/scroll gesture. Pointer-only and off under
  // prefers-reduced-motion, same gating as Magnetic/TiltCard.
  useEffect(() => {
    if (!pointerMotionEnabled) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // How close to an edge (in px) panning starts, and the fastest it goes
    // right at the edge — scaled linearly in between so it reads as easing
    // in, not an on/off toggle.
    const EDGE_ZONE = 72;
    const MAX_SPEED = 8;

    let frame = 0;
    let speed = 0;

    const tick = () => {
      frame = 0;
      if (speed === 0) return;
      scroller.scrollLeft += speed;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const rect = scroller.getBoundingClientRect();
      const fromLeft = event.clientX - rect.left;
      const fromRight = rect.width - fromLeft;

      if (fromLeft < EDGE_ZONE && scroller.scrollLeft > 0) {
        speed = -MAX_SPEED * (1 - Math.max(fromLeft, 0) / EDGE_ZONE);
      } else if (fromRight < EDGE_ZONE && scroller.scrollLeft < scroller.scrollWidth - scroller.clientWidth - 1) {
        speed = MAX_SPEED * (1 - Math.max(fromRight, 0) / EDGE_ZONE);
      } else {
        speed = 0;
      }

      if (speed !== 0 && !frame) frame = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      speed = 0;
    };

    scroller.addEventListener("pointermove", onMove, { passive: true });
    scroller.addEventListener("pointerleave", onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      scroller.removeEventListener("pointermove", onMove);
      scroller.removeEventListener("pointerleave", onLeave);
    };
  }, [pointerMotionEnabled]);

  // Keeps the prev/next buttons' enabled state in sync with the row's
  // actual scroll position — both the edge-pan effect above and native
  // drag/swipe/wheel scrolling can move it, so this has to watch `scroll`
  // directly rather than only reacting to the buttons' own clicks.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const update = () => {
      setCanScrollLeft(scroller.scrollLeft > 1);
      setCanScrollRight(scroller.scrollLeft < scroller.scrollWidth - scroller.clientWidth - 1);
    };

    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  /** Scrolls roughly one "page" of nodes at a time — not a fixed node count, so it scales with however many fit at the current width. */
  function scrollByPage(direction: -1 | 1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: direction * scroller.clientWidth * 0.75, behavior: "smooth" });
  }

  const active = nodes.find((node) => node.date === activeDate) ?? null;
  const activeIndex = nodes.findIndex((node) => node.date === activeDate);

  if (nodes.length === 0) return null;

  return (
    <div>
      <div ref={wrapperRef} className="relative">
        {/* Edge fade masks hint that the row scrolls — same technique MerchTicker uses for its marquee edges. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-off-white to-transparent sm:w-12" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-off-white to-transparent sm:w-12" aria-hidden="true" />

        {/* Manual scroll controls — the row also edge-pans on hover and
            drag/swipes natively, but neither of those is discoverable by
            looking at it, and edge-panning is pointer-only (see the effect
            above). Hidden entirely rather than shown disabled once there's
            nothing further in that direction. */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            aria-label="Scroll timeline left, to earlier updates"
            className="absolute left-1 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-off-white text-charcoal-light shadow-sm transition-colors hover:border-bronze hover:text-bronze sm:left-2"
          >
            <ChevronLeft size={16} aria-hidden />
          </button>
        )}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            aria-label="Scroll timeline right, to later updates"
            className="absolute right-1 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-off-white text-charcoal-light shadow-sm transition-colors hover:border-bronze hover:text-bronze sm:right-2"
          >
            <ChevronRight size={16} aria-hidden />
          </button>
        )}
        <ol
          ref={scrollerRef}
          className="scrollbar-hide flex snap-x snap-proximity items-start gap-8 overflow-x-auto px-4 pb-3 pt-2 sm:gap-10"
        >
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
                onPreview={handlePreview}
                onPreviewEnd={() => setPreview(null)}
              />
            );
          })}
        </ol>

        {/*
         * Rendered as a sibling of the scrollable <ol>, not a descendant.
         * The row is overflow-x-auto, which per the CSS overflow spec
         * forces overflow-y to auto too (you can't have one axis scroll
         * and the other stay visible) — a tooltip popping up above a node
         * was getting silently clipped by that vertical scrollport with no
         * way to scroll to it. Measuring the hovered button's position on
         * hover/focus and rendering the tooltip here, outside the clipped
         * container, is what actually makes it visible.
         */}
        {preview && (
          <div
            role="tooltip"
            style={{ left: preview.left, top: preview.top }}
            className="pointer-events-none absolute z-30 hidden w-56 -translate-x-1/2 -translate-y-full rounded-sm border border-ink/10 bg-ink px-3 py-2.5 text-off-white shadow-lg sm:block"
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-bronze-light">
              {preview.node.displayDate}
            </p>
            <div className="mt-1 space-y-1">
              {preview.node.entries.map((entry) => (
                <p key={entry.id} className="text-xs leading-snug">
                  {entry.summary}
                </p>
              ))}
            </div>
            <span
              aria-hidden="true"
              style={{ left: `calc(50% + ${preview.arrowOffset}px)` }}
              className="absolute top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-ink"
            />
          </div>
        )}
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
