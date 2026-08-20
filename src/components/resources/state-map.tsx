"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import statesTopology from "us-atlas/states-10m.json";

// Territories present in the topojson that this directory doesn't track
// state-level resources for (no tile in the old grid map had them either).
const EXCLUDED_TERRITORIES = new Set([
  "American Samoa",
  "Guam",
  "Commonwealth of the Northern Mariana Islands",
  "Puerto Rico",
  "United States Virgin Islands",
]);

const INACTIVE_FILL = "rgba(21, 21, 15, 0.06)";
const INACTIVE_HOVER_FILL = "rgba(21, 21, 15, 0.1)";
const ACTIVE_FILL = "rgba(169, 122, 76, 0.25)";
const ACTIVE_HOVER_FILL = "rgba(169, 122, 76, 0.4)";
const SELECTED_FILL = "#a97a4c"; // --color-bronze
const STROKE = "#f6f3ea"; // --color-off-white

/**
 * Real US geography (react-simple-maps + us-atlas states-10m topojson,
 * bundled locally rather than fetched from a CDN) rendered with the
 * Albers USA composite projection, which relocates Alaska and Hawaii as
 * insets below the continental map the way most US choropleths do.
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
    <div role="group" aria-label="Filter resources by state">
      <ComposableMap projection="geoAlbersUsa" width={960} height={520} className="h-auto w-full">
        <Geographies geography={statesTopology}>
          {({ geographies }) =>
            geographies
              .filter((geo) => !EXCLUDED_TERRITORIES.has(geo.properties.name))
              .map((geo) => {
                const name: string = geo.properties.name;
                const isActive = activeStates.has(name);
                const isSelected = selected === name;

                const defaultFill = isSelected ? SELECTED_FILL : isActive ? ACTIVE_FILL : INACTIVE_FILL;
                const hoverFill = isSelected ? SELECTED_FILL : isActive ? ACTIVE_HOVER_FILL : INACTIVE_HOVER_FILL;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    role="button"
                    aria-pressed={isSelected}
                    aria-label={
                      isActive ? name : `${name} — nationwide resources (regional pass coming soon)`
                    }
                    onClick={() => onSelect(isSelected ? null : name)}
                    onKeyDown={(event: React.KeyboardEvent) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelect(isSelected ? null : name);
                      }
                    }}
                    style={{
                      default: { fill: defaultFill, stroke: STROKE, strokeWidth: 0.75, outline: "none", cursor: "pointer" },
                      hover: { fill: hoverFill, stroke: STROKE, strokeWidth: 0.75, outline: "none", cursor: "pointer" },
                      pressed: { fill: SELECTED_FILL, stroke: STROKE, strokeWidth: 0.75, outline: "none", cursor: "pointer" },
                    }}
                  >
                    <title>{isActive ? name : `${name} — nationwide resources (regional pass coming soon)`}</title>
                  </Geography>
                );
              })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
