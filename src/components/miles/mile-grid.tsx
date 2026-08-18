"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { MileCard } from "./mile-card";
import { MileDetailModal } from "./mile-detail-modal";
import type { MileStatus } from "@/types/database";
import type { MileWithDonations } from "@/types/content";

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

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
        {filteredMiles.map((mile) => (
          <MileCard key={mile.id} mile={mile} onSelect={setSelectedMileNumber} />
        ))}
      </div>

      <MileDetailModal mile={selectedMile} onClose={() => setSelectedMileNumber(null)} />
    </div>
  );
}
