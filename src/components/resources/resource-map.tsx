"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { CircleMarker, LayerGroup, Map as LeafletMap } from "leaflet";
import { RotateCcw, Search } from "lucide-react";
import { US_STATE_CENTERS } from "@/lib/geo/us-state-centers";

type Leaflet = typeof import("leaflet");
type LatLng = [lat: number, lng: number];

/** Lower 48 — the default view. Alaska and Hawaii are a pan, the state picker, or a search away. */
const CONTINENTAL_BOUNDS: [LatLng, LatLng] = [
  [24.5, -125],
  [49.5, -66.9],
];
const STATE_ZOOM = 6;
const STATE_ZOOM_OVERRIDES: Record<string, number> = { Alaska: 4 };
const SEARCH_ZOOM = 7;

// Standard OpenStreetMap tiles — free and keyless (CARTO's basemaps now need
// an API key), greyed out with a CSS filter so the bronze pins carry the
// page. Both OSM hosts are allowlisted in the CSP in src/middleware.ts
// (img-src for tiles, connect-src for search).
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const GEOCODE_URL = "https://nominatim.openstreetmap.org/search";

interface GeocodeResult {
  lat: string;
  lon: string;
  address?: { state?: string };
}

type SearchStatus = { kind: "idle" } | { kind: "loading" } | { kind: "error"; message: string };

function pinSize(count: number): number {
  return count >= 30 ? 40 : count >= 15 ? 36 : 32;
}

/**
 * Pannable street map of the directory's state-specific resources — one
 * count pin per state, plus a city/ZIP search that resolves to a state.
 * Resources carry a state, not an address, so pins mark states rather than
 * individual organizations.
 *
 * Leaflet touches `window` at import time, so it's loaded inside the effect
 * rather than at module scope (this component still server-renders its
 * shell). City/ZIP lookup uses OpenStreetMap's Nominatim, whose usage policy
 * allows light, user-initiated searches — submit only, never per keystroke.
 */
export function ResourceMap({
  stateCounts,
  selected,
  onSelect,
}: {
  /** State-specific resource count per full state name, e.g. "Alabama" → 29. */
  stateCounts: Map<string, number>;
  selected: string | null;
  onSelect: (state: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<Leaflet | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const pinLayerRef = useRef<LayerGroup | null>(null);
  const searchPointRef = useRef<CircleMarker | null>(null);
  // A search that lands in a different state flies to the searched point,
  // not that state's pin — the selection effect below picks this up instead
  // of its usual state-center target.
  const pendingViewRef = useRef<LatLng | null>(null);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<SearchStatus>({ kind: "idle" });

  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | null = null;

    import("leaflet").then(({ default: L }) => {
      if (cancelled || !containerRef.current) return;
      map = L.map(containerRef.current, {
        // Plain scrolling should move the page, not zoom the map.
        scrollWheelZoom: false,
        // Same reasoning for one-finger swipes on touch screens; pinch still zooms.
        dragging: !L.Browser.mobile,
        minZoom: 3,
        maxZoom: 12,
      });
      map.attributionControl.setPrefix(false);
      L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION, maxZoom: 19, className: "grayscale opacity-80" }).addTo(map);
      map.fitBounds(CONTINENTAL_BOUNDS);

      leafletRef.current = L;
      mapRef.current = map;
      pinLayerRef.current = L.layerGroup().addTo(map);
      setReady(true);
    });

    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
      pinLayerRef.current = null;
      searchPointRef.current = null;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const layer = pinLayerRef.current;
    if (!ready || !L || !layer) return;

    layer.clearLayers();
    for (const [state, count] of stateCounts) {
      const center = US_STATE_CENTERS[state];
      if (!center) continue;
      const isSelected = state === selected;
      const size = pinSize(count);
      const label = `${state}: ${count} state-specific ${count === 1 ? "resource" : "resources"}`;
      const marker = L.marker(center, {
        title: label,
        riseOnHover: true,
        zIndexOffset: isSelected ? 1000 : 0,
        icon: L.divIcon({
          className: "",
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
          html: `<span class="flex h-full w-full items-center justify-center rounded-full border-2 border-off-white text-[11px] font-bold shadow-md transition-transform hover:scale-110 ${
            isSelected ? "bg-ink text-off-white" : "bg-bronze text-off-white"
          }">${count}</span>`,
        }),
      });
      const toggle = () => onSelect(isSelected ? null : state);
      marker.on("click", toggle);
      marker.addTo(layer);

      const el = marker.getElement();
      if (el) {
        el.setAttribute("aria-label", label);
        el.setAttribute("aria-pressed", String(isSelected));
        el.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle();
          }
        });
      }
    }
  }, [ready, stateCounts, selected, onSelect]);

  // Follows the selection wherever it changes from — a pin, the picker, a
  // search, or the directory's own "Clear State" / URL deep link.
  const isFirstViewRef = useRef(true);
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    if (isFirstViewRef.current) {
      isFirstViewRef.current = false;
      // Initial render already fit the lower 48; only a deep-linked state needs a move.
      if (!selected) return;
    }

    const pending = pendingViewRef.current;
    pendingViewRef.current = null;
    if (pending) {
      map.flyTo(pending, SEARCH_ZOOM);
    } else if (selected && US_STATE_CENTERS[selected]) {
      map.flyTo(US_STATE_CENTERS[selected], STATE_ZOOM_OVERRIDES[selected] ?? STATE_ZOOM);
    } else if (!selected) {
      map.flyToBounds(CONTINENTAL_BOUNDS);
    }
  }, [ready, selected]);

  function showSearchPoint(point: LatLng) {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    searchPointRef.current?.remove();
    searchPointRef.current = L.circleMarker(point, {
      radius: 7,
      weight: 2,
      fillOpacity: 1,
      interactive: false,
      // CSS beats Leaflet's SVG fill/stroke attributes, so the dot follows the site theme.
      className: "fill-ink stroke-off-white",
    }).addTo(map);
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;
    setStatus({ kind: "loading" });

    try {
      const params = new URLSearchParams({
        q,
        format: "jsonv2",
        countrycodes: "us",
        addressdetails: "1",
        limit: "1",
        "accept-language": "en",
      });
      const response = await fetch(`${GEOCODE_URL}?${params}`);
      if (!response.ok) throw new Error(`Geocoder responded ${response.status}`);
      const [result] = (await response.json()) as GeocodeResult[];
      const state = result?.address?.state;
      if (!result || !state) {
        setStatus({ kind: "error", message: `Couldn't find "${q}" in the U.S. Try a city and state, or a 5-digit ZIP.` });
        return;
      }

      const point: LatLng = [Number(result.lat), Number(result.lon)];
      showSearchPoint(point);
      setStatus({ kind: "idle" });
      if (state === selected) {
        mapRef.current?.flyTo(point, SEARCH_ZOOM);
      } else {
        pendingViewRef.current = point;
        onSelect(state);
      }
    } catch {
      setStatus({ kind: "error", message: "Location search is unavailable right now — pick a state below instead." });
    }
  }

  function handleReset() {
    searchPointRef.current?.remove();
    searchPointRef.current = null;
    setQuery("");
    setStatus({ kind: "idle" });
    if (selected) onSelect(null);
    else mapRef.current?.flyToBounds(CONTINENTAL_BOUNDS);
  }

  const states = [...stateCounts.keys()].sort((a, b) => a.localeCompare(b));

  return (
    <div>
      <form onSubmit={handleSearch} role="search" className="flex gap-2">
        <label htmlFor="resource-map-location" className="sr-only">
          City or ZIP code
        </label>
        <input
          id="resource-map-location"
          type="text"
          inputMode="search"
          autoComplete="postal-code"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your city or ZIP code"
          className="min-w-0 flex-1 rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink placeholder:text-charcoal-light/70 focus:border-ink/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status.kind === "loading"}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-sm bg-ink px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-off-white hover:bg-ink/85 disabled:opacity-60"
        >
          <Search size={14} aria-hidden="true" />
          {status.kind === "loading" ? "Finding…" : "Find"}
        </button>
      </form>
      <p aria-live="polite" className="mt-1.5 min-h-4 text-[11px] text-charcoal-light/80">
        {status.kind === "error" ? status.message : ""}
      </p>

      <div
        ref={containerRef}
        role="region"
        aria-label="Map of state-specific resources"
        // `isolate` keeps Leaflet's internal z-indexes (up to 1000) from
        // stacking over the sticky site header and the mobile filter sheet.
        className="isolate mt-2 h-[22rem] w-full overflow-hidden rounded-sm border border-ink/10 bg-sand sm:h-[28rem]"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-light">
          State
          <select
            value={selected ?? ""}
            onChange={(e) => onSelect(e.target.value || null)}
            className="rounded-sm border border-ink/20 bg-off-white px-2 py-1 text-xs font-semibold normal-case tracking-normal text-ink"
          >
            <option value="">All states</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state} ({stateCounts.get(state)})
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
        >
          <RotateCcw size={12} aria-hidden="true" />
          Reset Map
        </button>
      </div>
    </div>
  );
}
