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

const VIEWBOX_WIDTH = 400;
const VIEWBOX_HEIGHT = 220;

/**
 * Simplified line-art side-view schematic, not a photo — every real build
 * photo is a candid, cluttered, oddly-angled garage shot (frame on a stand,
 * wheel off, parts loose on a workbench), so there's no clean reference
 * image to pin precise hotspots to. The schematic trades photographic
 * accuracy for something that stays legible, centered, and correctly
 * proportioned at any screen size. Coordinates are hand-placed in the same
 * 400x220 space BIKE_BUILD_DIAGRAM_HOTSPOTS' x/y use.
 */
function BikeSchematic() {
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label="Simplified side-view diagram of the Stradalli race bike"
    >
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-ink/25">
        {/* Rear wheel */}
        <circle cx="80" cy="150" r="50" />
        {/* Front wheel */}
        <circle cx="320" cy="150" r="50" />
        {/* Chainring / crank */}
        <circle cx="165" cy="150" r="22" />
        {/* Cassette */}
        <circle cx="80" cy="150" r="13" />

        {/* Frame triangle */}
        <path d="M 145 55 L 290 65" />
        <path d="M 165 150 L 300 115" />
        <path d="M 165 150 L 80 150" />
        <path d="M 145 55 L 80 150" />
        <path d="M 145 55 L 165 150" />

        {/* Fork */}
        <path d="M 300 115 L 320 150" />

        {/* Seatpost + saddle */}
        <path d="M 145 55 L 138 45" />
        <path d="M 126 43 L 150 43" strokeWidth="5" />

        {/* Stem + bars */}
        <path d="M 290 65 L 315 50" />
        <path d="M 315 50 L 330 68" />

        {/* Aerobars */}
        <path d="M 300 44 L 352 40" />

        {/* Chain (drivetrain) */}
        <path d="M 165 128 L 92 138" strokeDasharray="4 4" />
        <path d="M 165 172 L 92 162" strokeDasharray="4 4" />

        {/* Pedal / crank arm */}
        <path d="M 165 150 L 190 172" strokeWidth="4" />

        {/* Brake marks */}
        <path d="M 296 100 L 306 112" strokeWidth="4" className="text-ink/35" />
        <path d="M 90 112 L 100 124" strokeWidth="4" className="text-ink/35" />
      </g>
    </svg>
  );
}

function Marker({
  data,
  isActive,
  onSelect,
}: {
  data: DiagramHotspotData;
  isActive: boolean;
  onSelect: () => void;
}) {
  const { hotspot, rows } = data;
  const allConfirmed = rows.length > 0 && rows.every((r) => r.status === "confirmed" || r.status === "complete");

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-expanded={isActive}
      aria-controls="bike-diagram-detail-panel"
      aria-label={hotspot.label}
      style={{
        left: `${(hotspot.x / VIEWBOX_WIDTH) * 100}%`,
        top: `${(hotspot.y / VIEWBOX_HEIGHT) * 100}%`,
      }}
      className={cn(
        "absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 shadow-sm transition-all duration-150",
        isActive
          ? "scale-125 border-bronze bg-bronze-text text-off-white shadow-md"
          : allConfirmed
            ? "border-bronze/60 bg-off-white text-bronze hover:scale-110 hover:border-bronze"
            : "border-ink/25 bg-off-white text-charcoal-light/60 hover:scale-110 hover:border-ink/50",
      )}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-current" aria-hidden="true" />
    </button>
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
 * The flagship interactive piece of /journal/building-the-bike: a clickable
 * schematic of the race bike where each marker opens the real status,
 * story, and sponsor credit for that part — all looked up from
 * BIKE_BUILD_COMPONENT_STATUS / BIKE_BUILD_CONFIRMED_CONTRIBUTORS /
 * BIKE_BUILD_TIMELINE via getDiagramHotspotDetail, never re-typed here.
 */
export function InteractiveBikeDiagram({ hotspots }: { hotspots: DiagramHotspotData[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = hotspots.find((h) => h.hotspot.id === activeId) ?? null;

  return (
    <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-start">
      <div className="relative aspect-[400/220] w-full rounded-sm border border-ink/10 bg-off-white p-6">
        <BikeSchematic />
        {hotspots.map((data) => (
          <Marker
            key={data.hotspot.id}
            data={data}
            isActive={activeId === data.hotspot.id}
            onSelect={() => setActiveId((current) => (current === data.hotspot.id ? null : data.hotspot.id))}
          />
        ))}
      </div>

      <DetailPanel data={active} />
    </div>
  );
}
