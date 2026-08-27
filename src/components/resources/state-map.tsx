"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
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

const MAP_WIDTH = 960;
const MAP_HEIGHT = 520;
const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
const ZOOM_STEP = 1.5;
const DRAG_THRESHOLD_PX = 4;

interface View {
  zoom: number;
  /** Pan offset as a fraction of the map's own width/height (so it scales with the responsive layout). */
  x: number;
  y: number;
}

const DEFAULT_VIEW: View = { zoom: MIN_ZOOM, x: 0, y: 0 };

function clampView(view: View): View {
  const zoom = Math.min(Math.max(view.zoom, MIN_ZOOM), MAX_ZOOM);
  if (zoom <= MIN_ZOOM) return DEFAULT_VIEW;
  const maxOffset = 0.5 * (1 - 1 / zoom);
  return {
    zoom,
    x: Math.min(Math.max(view.x, -maxOffset), maxOffset),
    y: Math.min(Math.max(view.y, -maxOffset), maxOffset),
  };
}

function ZoomButton({
  onClick,
  label,
  disabled,
  children,
}: {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-sm border border-ink/15 bg-off-white text-charcoal-light transition-colors hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

/**
 * Real US geography (react-simple-maps + us-atlas states-10m topojson,
 * bundled locally rather than fetched from a CDN) rendered with the
 * Albers USA composite projection, which relocates Alaska and Hawaii as
 * insets below the continental map the way most US choropleths do.
 *
 * Zoom/pan is implemented as a plain CSS transform driven by our own state,
 * NOT react-simple-maps' ZoomableGroup — that component's d3-zoom
 * integration calls the projection's `.invert()` at the end of every
 * gesture to report a geographic center, and Albers USA's `.invert()`
 * returns null for any point outside its three defined regions (mainland /
 * AK inset / HI inset). Landing there — trivially possible when panning or
 * double-clicking near the map's own blank margins — throws an uncaught
 * TypeError inside the library's own gesture-end handler (confirmed via
 * manual testing). A hand-rolled transform sidesteps that class of bug
 * entirely: it never asks the projection to invert anything.
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
  const [view, setView] = useState<View>(DEFAULT_VIEW);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number; moved: boolean } | null>(
    null,
  );

  const handleZoomIn = useCallback(() => {
    setView((v) => clampView({ ...v, zoom: v.zoom * ZOOM_STEP }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setView((v) => clampView({ ...v, zoom: v.zoom / ZOOM_STEP }));
  }, []);

  const handleReset = useCallback(() => setView(DEFAULT_VIEW), []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (view.zoom <= MIN_ZOOM) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = { startX: event.clientX, startY: event.clientY, originX: view.x, originY: view.y, moved: false };
    },
    [view.zoom, view.x, view.y],
  );

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!drag || !rect) return;
    const dxPx = event.clientX - drag.startX;
    const dyPx = event.clientY - drag.startY;
    if (Math.abs(dxPx) > DRAG_THRESHOLD_PX || Math.abs(dyPx) > DRAG_THRESHOLD_PX) drag.moved = true;
    setView((v) => clampView({ ...v, x: drag.originX + dxPx / rect.width, y: drag.originY + dyPx / rect.height }));
  }, []);

  const handlePointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (drag?.moved) {
      // A drag that just ended over a state shouldn't also toggle its
      // selection — swallow the single click the browser fires on release.
      const container = event.currentTarget;
      const swallow = (clickEvent: MouseEvent) => {
        clickEvent.stopPropagation();
        clickEvent.preventDefault();
      };
      container.addEventListener("click", swallow, { capture: true, once: true });
    }
  }, []);

  // A native, explicitly non-passive listener — React's synthetic onWheel is
  // registered passive by default, which silently no-ops preventDefault()
  // (and logs a console warning) instead of stopping the browser's own
  // Ctrl/Cmd+scroll page-zoom from firing alongside ours.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return; // plain scroll always passes through to the page
      event.preventDefault();
      const factor = event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
      setView((v) => clampView({ ...v, zoom: v.zoom * factor }));
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div>
      <div
        ref={containerRef}
        role="group"
        aria-label="Filter resources by state"
        className="overflow-hidden"
        style={{ touchAction: view.zoom > MIN_ZOOM ? "none" : "pan-y", cursor: view.zoom > MIN_ZOOM ? "grab" : "default" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          style={{
            transform: `translate(${view.x * 100}%, ${view.y * 100}%) scale(${view.zoom})`,
            transformOrigin: "center center",
          }}
        >
          <ComposableMap projection="geoAlbersUsa" width={MAP_WIDTH} height={MAP_HEIGHT} className="h-auto w-full">
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
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-[11px] text-charcoal-light/70">
          Zoom in for a closer look at smaller states — drag to pan, or Ctrl/Cmd + scroll.
        </p>
        <div className="flex shrink-0 gap-1">
          <ZoomButton onClick={handleZoomIn} label="Zoom in" disabled={view.zoom >= MAX_ZOOM}>
            <Plus size={16} aria-hidden="true" />
          </ZoomButton>
          <ZoomButton onClick={handleZoomOut} label="Zoom out" disabled={view.zoom <= MIN_ZOOM}>
            <Minus size={16} aria-hidden="true" />
          </ZoomButton>
          <ZoomButton onClick={handleReset} label="Reset zoom" disabled={view.zoom === MIN_ZOOM}>
            <RotateCcw size={14} aria-hidden="true" />
          </ZoomButton>
        </div>
      </div>
    </div>
  );
}
