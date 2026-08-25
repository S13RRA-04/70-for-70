"use client";

import { useMemo, useState } from "react";
import { Waves, Bike, Footprints } from "lucide-react";
import { cn } from "@/lib/utils";
import { MILE_SEGMENTS } from "@/lib/constants";
import { MileCard } from "./mile-card";
import { MileDetailModal } from "./mile-detail-modal";
import { MileStatusLegend } from "./mile-status-legend";
import type { MileStatus } from "@/types/database";
import type { MileWithDonations } from "@/types/content";

const SEGMENT_ACCENT: Record<(typeof MILE_SEGMENTS)[number]["accent"], string> = {
  charcoal: "bg-charcoal",
  olive: "bg-olive",
  bronze: "bg-bronze",
};

const SEGMENT_ICON: Record<(typeof MILE_SEGMENTS)[number]["key"], typeof Waves> = {
  swim: Waves,
  bike: Bike,
  run: Footprints,
};

type FilterValue = "all" | MileStatus;

/** Mirrors the public status taxonomy in mileStatusLabel() — "requested" filters alongside "reserved" under one Reserved pill, not its own. */
const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "partially_funded", label: "In Progress" },
  { value: "funded", label: "Funded" },
  { value: "reserved", label: "Reserved" },
];

export function MileGrid({
  miles,
  showFilters = true,
}: {
  miles: MileWithDonations[];
  showFilters?: boolean;
}) {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [selectedMileNumber, setSelectedMileNumber] = useState<number | null>(null);

  const filteredMiles = useMemo(() => {
    if (filter === "all") return miles;
    // "reserved" filter covers both "reserved" and "requested" rows — see
    // the FILTERS comment above and mileStatusLabel().
    if (filter === "reserved") return miles.filter((m) => m.status === "reserved" || m.status === "requested");
    return miles.filter((m) => m.status === filter);
  }, [miles, filter]);

  const selectedMile = miles.find((m) => m.mile_number === selectedMileNumber) ?? null;

  const segments = MILE_SEGMENTS.map((segment) => ({
    ...segment,
    miles: filteredMiles.filter(
      (m) => m.mile_number >= segment.start && m.mile_number <= segment.end,
    ),
  })).filter((segment) => segment.miles.length > 0);

  return (
    <div>
      {showFilters && (
        <>
          <MileStatusLegend />

          <div
            role="group"
            aria-label="Filter miles by status"
            className="mt-4 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible"
          >
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                aria-pressed={filter === f.value}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                  filter === f.value
                    ? "border-ink bg-ink text-off-white"
                    : "border-ink/20 text-charcoal hover:border-ink/40",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <p className="mt-3 text-sm text-charcoal-light">
            Showing {filteredMiles.length} of {miles.length} miles
          </p>
        </>
      )}

      <div className="mt-6 space-y-8">
        {segments.map((segment) => {
          const SegmentIcon = SEGMENT_ICON[segment.key];
          return (
          <div key={segment.key}>
            <div className="flex items-center gap-2">
              <SegmentIcon
                aria-hidden
                size={16}
                className={cn(
                  "shrink-0",
                  segment.accent === "charcoal" && "text-charcoal",
                  segment.accent === "olive" && "text-olive",
                  segment.accent === "bronze" && "text-bronze",
                )}
              />
              <span
                aria-hidden
                className={cn("h-2.5 w-2.5 rounded-full", SEGMENT_ACCENT[segment.accent])}
              />
              <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                {segment.label}{" "}
                <span className="text-charcoal-light/80">
                  ({segment.start === segment.end
                    ? `Mile ${segment.start}`
                    : `Miles ${segment.start}–${segment.end}`})
                </span>
              </p>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-1.5 sm:grid-cols-10">
              {segment.miles.map((mile) => (
                <MileCard key={mile.id} mile={mile} onSelect={setSelectedMileNumber} />
              ))}
            </div>
          </div>
          );
        })}
      </div>

      <MileDetailModal mile={selectedMile} onClose={() => setSelectedMileNumber(null)} />
    </div>
  );
}
