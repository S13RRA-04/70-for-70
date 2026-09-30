"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { PhotoLightbox } from "@/components/shared/photo-lightbox";
import type { BikeBuildTimelineNode } from "@/lib/content/building-the-bike";
import { cn, formatDateShort } from "@/lib/utils";

function Node({
  node,
  isActive,
  isLast,
  onToggle,
}: {
  node: BikeBuildTimelineNode;
  isActive: boolean;
  isLast: boolean;
  onToggle: () => void;
}) {
  const hasPhotos = node.photos.length > 0;

  return (
    <li className="group relative flex shrink-0 flex-col items-center">
      {!isLast && (
        <span aria-hidden="true" className="absolute left-1/2 top-4 h-0.5 w-10 bg-ink/10 sm:w-14" />
      )}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isActive}
        aria-label={`${node.displayDate}: ${node.entries.map((e) => e.title).join(", ")}`}
        className={cn(
          "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-colors",
          isActive
            ? "border-bronze bg-bronze text-off-white"
            : hasPhotos
              ? "border-bronze/50 bg-off-white text-bronze hover:border-bronze"
              : "border-ink/20 bg-off-white text-charcoal-light/60 hover:border-ink/40",
        )}
      >
        {hasPhotos ? node.photos.length : <Camera size={12} className="opacity-30" aria-hidden />}
      </button>

      {/* Hover/focus preview — desktop only; touch users get the same info by tapping (which opens the panel below). */}
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-56 -translate-x-1/2 rounded-sm border border-ink/10 bg-ink px-3 py-2.5 text-off-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 sm:block"
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

      <time dateTime={node.date} className="mt-2 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide text-charcoal-light">
        {formatDateShort(node.date)}
      </time>
    </li>
  );
}

/**
 * Interactive build timeline — one node per calendar date something
 * happened, oldest first. Hovering (desktop) previews that date's update(s)
 * in a tooltip; clicking any node expands a panel below with the full
 * synopsis and that date's photos (each opening full-size via the existing
 * PhotoLightbox). Replaces the earlier auto-scrolling photo marquee.
 */
export function BuildTimelineNodes({ nodes }: { nodes: BikeBuildTimelineNode[] }) {
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const active = nodes.find((node) => node.date === activeDate) ?? null;

  if (nodes.length === 0) return null;

  return (
    <div>
      <ol className="flex items-start gap-8 overflow-x-auto px-1 pb-2 pt-2 sm:gap-10">
        {nodes.map((node, i) => (
          <Node
            key={node.date}
            node={node}
            isActive={node.date === activeDate}
            isLast={i === nodes.length - 1}
            onToggle={() => setActiveDate((current) => (current === node.date ? null : node.date))}
          />
        ))}
      </ol>

      {active && (
        <div className="mt-6 rounded-sm border border-bronze/30 bg-bronze/5 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-bronze">{active.displayDate}</p>
          <div className="mt-3 space-y-3">
            {active.entries.map((entry) => (
              <div key={entry.id}>
                <p className="font-display text-sm font-semibold uppercase tracking-wide text-ink">{entry.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-charcoal-light">{entry.summary}</p>
              </div>
            ))}
          </div>

          {active.photos.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {active.photos.map((photo) => (
                <PhotoLightbox
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  caption={photo.caption}
                  width={photo.width}
                  height={photo.height}
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-sm border border-ink/10 bg-off-white">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      loading="lazy"
                      sizes="(min-width: 768px) 22vw, 45vw"
                      className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                    />
                  </div>
                </PhotoLightbox>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm italic text-charcoal-light/70">No photos from this update.</p>
          )}
        </div>
      )}
    </div>
  );
}
