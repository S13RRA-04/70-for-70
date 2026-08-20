"use client";

import { cn } from "@/lib/utils";
import { US_STATES_GRID } from "@/lib/content/us-states";

const MAX_ROW = Math.max(...US_STATES_GRID.map((s) => s.row));
const MAX_COL = Math.max(...US_STATES_GRID.map((s) => s.col));

/**
 * Schematic tile-grid state picker (see us-states.ts for why this isn't a
 * traced coastline map). Every state is clickable — even ones without a
 * regional resource pass yet still surface nationwide entries, so there's
 * no dead end — but states with real local data (activeStates) render in
 * bronze so it's obvious where the directory currently goes deeper.
 */
export function StateMap({
  activeStates,
  selected,
  onSelect,
}: {
  /** Full state names with at least one region-specific entry, e.g. "Alabama". */
  activeStates: Set<string>;
  selected: string | null;
  onSelect: (state: string | null) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Filter resources by state"
      className="grid gap-1"
      style={{
        gridTemplateColumns: `repeat(${MAX_COL + 1}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${MAX_ROW + 1}, minmax(0, 1fr))`,
      }}
    >
      {US_STATES_GRID.map((s) => {
        const isActive = activeStates.has(s.name);
        const isSelected = selected === s.name;
        return (
          <button
            key={s.code}
            type="button"
            aria-pressed={isSelected}
            title={isActive ? s.name : `${s.name} — nationwide resources (regional pass coming soon)`}
            onClick={() => onSelect(isSelected ? null : s.name)}
            style={{ gridRow: s.row + 1, gridColumn: s.col + 1 }}
            className={cn(
              "aspect-square rounded-[3px] text-[9px] font-bold uppercase leading-none transition-colors sm:text-[10px]",
              isSelected
                ? "bg-bronze text-off-white"
                : isActive
                  ? "bg-bronze/25 text-ink hover:bg-bronze/40"
                  : "bg-ink/[0.06] text-charcoal-light/60 hover:bg-ink/10",
            )}
          >
            {s.code}
          </button>
        );
      })}
    </div>
  );
}
