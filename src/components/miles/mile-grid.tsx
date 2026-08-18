"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { MILE_SEGMENTS } from "@/lib/constants";
import { MileCard } from "./mile-card";
import { MileDetailModal } from "./mile-detail-modal";
import type { MileStatus } from "@/types/database";
import type { MileWithDonations } from "@/types/content";

const SEGMENT_ACCENT: Record<(typeof MILE_SEGMENTS)[number]["accent"], string> = {
  charcoal: "bg-charcoal",
  olive: "bg-olive",
  bronze: "bg-bronze",
};

type FilterValue = "all" | MileStatus;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "partially_funded", label: "Partially Funded" },
  { value: "funded", label: "Funded" },
  { value: "requested", label: "Requested" },
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

  const filteredMiles = useMemo(
    () => (filter === "all" ? miles : miles.filter((m) => m.status === filter)),
    [miles, filter],
  );

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
          <div
            role="group"
            aria-label="Filter miles by status"
            className="flex flex-wrap gap-2"
          >
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                aria-pressed={filter === f.value}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
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
        {segments.map((segment) => (
          <div key={segment.key}>
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className={cn("h-2.5 w-2.5 rounded-full", SEGMENT_ACCENT[segment.accent])}
              />
              <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                {segment.label}{" "}
                <span className="text-charcoal-light/60">
                  ({segment.start === segment.end
                    ? `Mile ${segment.start}`
                    : `Miles ${segment.start}–${segment.end}`})
                </span>
              </p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
              {segment.miles.map((mile) => (
                <MileCard key={mile.id} mile={mile} onSelect={setSelectedMileNumber} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <MileDetailModal mile={selectedMile} onClose={() => setSelectedMileNumber(null)} />
    </div>
  );
}
