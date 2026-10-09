"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/journal/bike-build/status-badge";
import type { BikeBuildContributor, BikeBuildDiagramHotspot } from "@/types/bike-build";
import type { BikeBuildComponentRow, BikeBuildTimelineEntry } from "@/types/bike-build";
import { cn } from "@/lib/utils";

/** A hotspot's component rows, pre-joined server-side with whichever live mission partner's name matched (see findProvidingPartner) — kept as plain data since this is a Client Component and can't accept a server function prop. */
export interface DiagramHotspotData {
  hotspot: BikeBuildDiagramHotspot;
  rows: (BikeBuildComponentRow & { partnerName: string | null })[];
  contributor: BikeBuildContributor | null;
  relatedEntry: BikeBuildTimelineEntry | null;
}

/** Must match public/journal/building-the-bike/bike-diagram.svg's own viewBox exactly — every hotspot's x/y/glowRadius in BIKE_BUILD_DIAGRAM_HOTSPOTS is hand-placed against this same space. */
const BIKE_VIEWBOX = { x: -0.17, y: 29.46, width: 145.51, height: 91.02 };

function toPercent(value: number, origin: number, span: number): number {
  return ((value - origin) / span) * 100;
}

function Marker({
  data,
  isGlowing,
  isSelected,
  onHover,
  onHoverEnd,
  onSelect,
}: {
  data: DiagramHotspotData;
  isGlowing: boolean;
  isSelected: boolean;
  onHover: () => void;
  onHoverEnd: () => void;
  onSelect: () => void;
}) {
  const { hotspot, rows } = data;
  const allConfirmed = rows.length > 0 && rows.every((r) => r.status === "confirmed" || r.status === "complete");

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      onFocus={onHover}
      onBlur={onHoverEnd}
      aria-expanded={isSelected}
      aria-controls="bike-diagram-detail-panel"
      aria-label={hotspot.label}
      style={{
        left: `${toPercent(hotspot.x, BIKE_VIEWBOX.x, BIKE_VIEWBOX.width)}%`,
        top: `${toPercent(hotspot.y, BIKE_VIEWBOX.y, BIKE_VIEWBOX.height)}%`,
      }}
      className={cn(
        "absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-off-white/90 shadow-sm backdrop-blur-[1px] transition-all duration-150",
        isGlowing
          ? "scale-125 border-bronze text-bronze shadow-md"
          : allConfirmed
            ? "border-bronze/50 text-bronze/80 hover:scale-110 hover:border-bronze"
            : "border-ink/25 text-charcoal-light/60 hover:scale-110 hover:border-ink/50",
      )}
    >
      <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
    </button>
  );
}

/** Soft radial highlight over one region of the real bike artwork, in the same viewBox the image itself uses — see BIKE_VIEWBOX. Purely decorative (aria-hidden); the accessible name lives on the Marker button above it. */
function GlowLayer({ hotspots, glowingId }: { hotspots: DiagramHotspotData[]; glowingId: string | null }) {
  return (
    <svg
      viewBox={`${BIKE_VIEWBOX.x} ${BIKE_VIEWBOX.y} ${BIKE_VIEWBOX.width} ${BIKE_VIEWBOX.height}`}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <filter id="bike-glow-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        <radialGradient id="bike-glow-fill">
          <stop offset="0%" stopColor="#a97a4c" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#a97a4c" stopOpacity="0" />
        </radialGradient>
      </defs>
      {hotspots.map(({ hotspot }) => (
        <circle
          key={hotspot.id}
          cx={hotspot.x}
          cy={hotspot.y}
          r={hotspot.glowRadius}
          fill="url(#bike-glow-fill)"
          filter="url(#bike-glow-blur)"
          className="transition-opacity duration-200"
          opacity={glowingId === hotspot.id ? 1 : 0}
        />
      ))}
    </svg>
  );
}

function DetailPanel({ data }: { data: DiagramHotspotData | null }) {
  if (!data) {
    return (
      <div
        id="bike-diagram-detail-panel"
        className="flex h-full min-h-[220px] items-center justify-center rounded-sm border border-dashed border-ink/15 bg-sand-light p-6 text-center text-sm text-charcoal-light"
      >
        Tap or click a part of the bike to see its status, story, and who helped get it there.
      </div>
    );
  }

  const { hotspot, rows, contributor, relatedEntry } = data;

  return (
    <div id="bike-diagram-detail-panel" className="rounded-sm border border-bronze/30 bg-bronze/5 p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">{hotspot.label}</h3>

      <ul className="mt-3 space-y-2.5">
        {rows.map((row) => (
          <li key={row.component}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-ink">{row.component}</span>
              <StatusBadge status={row.status} label={row.statusLabel} />
            </div>
            <p className="mt-1 text-sm text-charcoal-light">
              {row.notes}
              {row.partnerName && (
                <span className="ml-1.5 whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-bronze">
                  &mdash; {row.partnerName} &#10003;
                </span>
              )}
            </p>
          </li>
        ))}
      </ul>

      {contributor && (
        <p className="mt-4 border-t border-ink/10 pt-4 text-sm text-charcoal-light">
          <span className="font-semibold text-ink">{contributor.name}</span> &mdash; {contributor.role}.{" "}
          {contributor.note}
        </p>
      )}

      {relatedEntry && (
        <a
          href={`#${relatedEntry.id}`}
          className="mt-4 inline-block text-sm font-semibold text-bronze hover:text-bronze-dark"
        >
          Read the full story: {relatedEntry.title} &rarr;
        </a>
      )}
    </div>
  );
}

/**
 * The flagship interactive piece of /journal/building-the-bike: the real
 * bike illustration (public/journal/building-the-bike/bike-diagram.svg),
 * with markers that highlight the matching part of that artwork on
 * hover/focus and open its real status, story, and sponsor credit on
 * click — all looked up from BIKE_BUILD_COMPONENT_STATUS /
 * BIKE_BUILD_CONFIRMED_CONTRIBUTORS / BIKE_BUILD_TIMELINE via
 * getDiagramHotspotDetail, never re-typed here.
 */
export function InteractiveBikeDiagram({ hotspots }: { hotspots: DiagramHotspotData[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const active = hotspots.find((h) => h.hotspot.id === activeId) ?? null;
  const glowingId = hoveredId ?? activeId;

  return (
    <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-start">
      <div
        className="relative w-full rounded-sm border border-ink/10 bg-off-white p-4"
        style={{ aspectRatio: `${BIKE_VIEWBOX.width} / ${BIKE_VIEWBOX.height}` }}
      >
        {/*
         * A plain <img>, not next/image: Next's built-in optimizer refuses
         * to process SVGs unless images.dangerouslyAllowSVG is set in
         * next.config, and that's a site-wide security-relevant flag not
         * worth flipping for one static local decorative asset — same
         * reasoning as the raw <img> usages elsewhere (journal-image-upload.tsx,
         * journal-markdown.tsx).
         */}
        <img
          src="/journal/building-the-bike/bike-diagram.svg"
          alt="Side-view illustration of the Stradalli race bike, with clickable highlights over each major component"
          className="absolute inset-0 h-full w-full object-contain p-4"
        />
        <GlowLayer hotspots={hotspots} glowingId={glowingId} />
        {hotspots.map((data) => (
          <Marker
            key={data.hotspot.id}
            data={data}
            isGlowing={glowingId === data.hotspot.id}
            isSelected={activeId === data.hotspot.id}
            onHover={() => setHoveredId(data.hotspot.id)}
            onHoverEnd={() => setHoveredId(null)}
            onSelect={() => setActiveId((current) => (current === data.hotspot.id ? null : data.hotspot.id))}
          />
        ))}
      </div>

      <DetailPanel data={active} />
    </div>
  );
}
