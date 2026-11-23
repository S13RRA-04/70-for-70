"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  Accessibility,
  Activity,
  Baby,
  Briefcase,
  Clock3,
  DollarSign,
  HeartPulse,
  Home,
  MapPin,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
  Sunrise,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { DirectoryCard } from "@/components/resources/directory-card";
import { trackEvent } from "@/lib/analytics/plausible";
import { cn } from "@/lib/utils";
import {
  AUDIENCES,
  AUDIENCE_BY_ID,
  EMPTY_DIRECTORY_STATE,
  LAST_RESULTS_KEY,
  MAX_QUERY_LENGTH,
  NEEDS,
  NEED_BY_ID,
  filterDirectory,
  needFacetCounts,
  parseDirectoryState,
  resolveStateInput,
  serializeDirectoryState,
  showsCrisisCard,
  type DirectoryResource,
  type DirectoryState,
  type NeedId,
} from "@/lib/resources/directory";

/** Leaflet + tiles load only once someone opens the map. */
const ResourceMap = dynamic(() => import("@/components/resources/resource-map").then((m) => m.ResourceMap), {
  ssr: false,
  loading: () => <div className="grid h-[260px] place-items-center text-sm text-muted">Loading map…</div>,
});

const PAGE_SIZE = 24;

const NEED_ICONS: Record<NeedId, LucideIcon> = {
  mental: HeartPulse,
  addiction: Sunrise,
  health: Accessibility,
  financial: DollarSign,
  housing: Home,
  family: Users,
  career: Briefcase,
  legal: Scale,
  fitness: Activity,
  aging: Clock3,
  children: Baby,
  access: MapPin,
  safety: ShieldCheck,
};

const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-[4px] border-[1.5px] px-[18px] text-sm font-bold";
const btnPrimary = `${btn} border-navy bg-navy text-white hover:bg-navy-hover`;
const btnOutline = `${btn} border-navy bg-white text-navy hover:bg-paper`;
const linkButton = "py-2 text-sm font-bold text-help underline underline-offset-2 hover:text-help-dark";

function programs(count: number) {
  return count === 1 ? "1 program" : `${count} programs`;
}

export function ResourceDirectory({ resources }: { resources: DirectoryResource[] }) {
  const params = useSearchParams();
  const [state, setStateValue] = useState<DirectoryState>(() => parseDirectoryState(params));
  const [qInput, setQInput] = useState(state.q);
  const [locationInput, setLocationInput] = useState(state.state ?? "");
  const [locationError, setLocationError] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);

  // The URL is written with history.replaceState below. A params change that
  // doesn't match what we last wrote is outside navigation (a header link, a
  // homepage deep link, back/forward), so state is re-read from it. Adjusted
  // during render — React's pattern for deriving state from a changed input.
  const paramsKey = params.toString();
  const [syncedKey, setSyncedKey] = useState(paramsKey);
  if (paramsKey !== syncedKey) {
    setSyncedKey(paramsKey);
    if (paramsKey !== serializeDirectoryState(state)) {
      const next = parseDirectoryState(params);
      setStateValue(next);
      setQInput(next.q);
      setLocationInput(next.state ?? "");
      setVisible(PAGE_SIZE);
    }
  }

  function update(patch: Partial<DirectoryState>) {
    setStateValue((current) => ({ ...current, ...patch }));
    setVisible(PAGE_SIZE);
  }

  useEffect(() => {
    const query = serializeDirectoryState(state);
    const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    if (`${window.location.pathname}${window.location.search}` !== url) window.history.replaceState(null, "", url);
    try {
      window.sessionStorage.setItem(LAST_RESULTS_KEY, url);
    } catch {
      // Storage unavailable (private mode) — "Back to results" falls back to /resources.
    }
  }, [state]);

  // Search input: debounced 200ms, capped at 100 chars.
  useEffect(() => {
    if (qInput === state.q) return;
    const timeout = setTimeout(() => update({ q: qInput.slice(0, MAX_QUERY_LENGTH) }), 200);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qInput]);

  const results = useMemo(() => filterDirectory(resources, state), [resources, state]);
  const counts = useMemo(() => needFacetCounts(resources, state), [resources, state]);
  const stateCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const resource of resources) if (resource.state) map.set(resource.state, (map.get(resource.state) ?? 0) + 1);
    return map;
  }, [resources]);

  useEffect(() => {
    const query = state.q.trim();
    if (!query) return;
    const timeout = setTimeout(() => trackEvent("resource_search", { query, results: String(results.length) }), 800);
    return () => clearTimeout(timeout);
  }, [state.q, results.length]);

  function toggleNeed(id: NeedId) {
    update({ needs: state.needs.includes(id) ? state.needs.filter((need) => need !== id) : [...state.needs, id] });
  }

  function applyLocation(raw: string): boolean {
    if (!raw.trim()) {
      setLocationError(false);
      update({ state: null });
      return true;
    }
    const resolved = resolveStateInput(raw);
    setLocationError(!resolved);
    if (resolved) {
      setLocationInput(resolved);
      update({ state: resolved });
    }
    return Boolean(resolved);
  }

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    const q = qInput.slice(0, MAX_QUERY_LENGTH);
    if (!applyLocation(locationInput)) return;
    update({ q });
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clearAll() {
    setQInput("");
    setLocationInput("");
    setLocationError(false);
    update({ ...EMPTY_DIRECTORY_STATE, sort: state.sort });
  }

  const active: { key: string; label: string; remove: () => void }[] = [];
  if (state.who !== "all") active.push({ key: "who", label: AUDIENCE_BY_ID[state.who].label, remove: () => update({ who: "all" }) });
  for (const id of state.needs) active.push({ key: `need-${id}`, label: NEED_BY_ID[id].label, remove: () => toggleNeed(id) });
  if (state.freeOnly) active.push({ key: "free", label: "Free only", remove: () => update({ freeOnly: false }) });
  if (state.state) active.push({ key: "state", label: state.state, remove: () => { setLocationInput(""); update({ state: null }); } });
  if (state.q.trim()) active.push({ key: "q", label: `“${state.q.trim()}”`, remove: () => { setQInput(""); update({ q: "" }); } });
  const filtered = active.length > 0;

  return (
    <>
      {/* Search panel */}
      <form role="search" onSubmit={handleSearch} className="flex flex-col gap-[18px] rounded-lg border border-line bg-white p-5">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-[3_1_320px] flex-col gap-1.5 text-[13px] font-bold text-navy">
            What do you need help with?
            <input
              id="resource-search"
              type="search"
              value={qInput}
              maxLength={MAX_QUERY_LENGTH}
              autoComplete="off"
              onChange={(e) => setQInput(e.target.value)}
              placeholder="Try “PTSD”, “rent help”, “caregiver”, or a program name"
              className="h-[52px] rounded-md border-[1.5px] border-[#8a909c] bg-white px-4 text-base font-normal text-navy placeholder:text-[#5f636b]"
            />
          </label>
          <label className="flex flex-[1_1_180px] flex-col gap-1.5 text-[13px] font-bold text-navy">
            State or ZIP (optional)
            <input
              type="text"
              value={locationInput}
              autoComplete="postal-code"
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="e.g. 35203 or Alabama"
              aria-invalid={locationError || undefined}
              aria-describedby={locationError ? "location-error" : undefined}
              className="h-[52px] rounded-md border-[1.5px] border-[#8a909c] bg-white px-4 text-base font-normal text-navy placeholder:text-[#5f636b]"
            />
          </label>
          <button type="submit" className={cn(btnPrimary, "h-[52px] px-7 tracking-[1px]")}>
            SEARCH
          </button>
        </div>
        {locationError && (
          <p id="location-error" role="alert" className="-mt-2 text-sm font-semibold text-purpose">
            We couldn&apos;t match that location. Try a 5-digit ZIP or a state name.
          </p>
        )}
        <div role="group" aria-labelledby="who-label" className="flex items-center gap-2 max-md:-mr-4 max-md:overflow-x-auto max-md:pr-4 md:flex-wrap">
          <span id="who-label" className="mr-1.5 shrink-0 text-[13px] font-bold text-navy">I am:</span>
          {[{ id: "all" as const, label: "Anyone" }, ...AUDIENCES].map((audience) => (
            <button
              key={audience.id}
              type="button"
              aria-pressed={state.who === audience.id}
              onClick={() => update({ who: audience.id })}
              className="min-h-10 shrink-0 rounded-full border-[1.5px] border-[#8a909c] bg-white px-4 text-sm font-semibold text-navy aria-pressed:border-navy aria-pressed:bg-navy aria-pressed:text-white"
            >
              {audience.label}
            </button>
          ))}
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#e9eef5] px-5 py-4">
        <div>
          <strong className="block text-navy">Not sure what you need?</strong>
          <span className="text-sm">Answer a few private questions and we&apos;ll suggest a short list. Answers stay in this browser.</span>
        </div>
        <Link href="/resources/guide" className={btnOutline}>
          HELP ME FIGURE IT OUT <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Browse by need */}
      <section aria-labelledby="needs-h" className="pb-8 pt-10">
        <h2 id="needs-h" className="mb-3.5 font-display text-[26px] uppercase text-navy">Browse by need</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
          {NEEDS.map((need) => {
            const Icon = NEED_ICONS[need.id];
            return (
              <button
                key={need.id}
                type="button"
                aria-pressed={state.needs.includes(need.id)}
                onClick={() => toggleNeed(need.id)}
                className="flex min-h-[76px] items-center gap-3.5 rounded-lg border-[1.5px] border-line bg-white px-[18px] py-3.5 text-left text-navy hover:border-navy aria-pressed:border-navy aria-pressed:bg-navy aria-pressed:text-white"
              >
                <Icon size={28} strokeWidth={1.8} aria-hidden="true" className="shrink-0" />
                <span>
                  <span className="block text-base font-bold">{need.label}</span>
                  <span className="block text-[13px] opacity-85">{programs(counts[need.id])}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Results */}
      <section ref={resultsRef} aria-label="Results" className="flex scroll-mt-24 flex-wrap items-start gap-8 pb-12">
        <aside
          id="resource-filters"
          aria-label="Filters"
          className={cn(
            "flex flex-[1_1_260px] flex-col gap-6 rounded-lg border border-line bg-white p-5 md:max-w-[300px]",
            !filtersOpen && "max-md:hidden",
            "max-md:basis-full",
          )}
        >
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2.5 text-[13px] font-bold tracking-[1.5px] text-navy">TYPE OF HELP</legend>
            {NEEDS.map((need) => {
              const on = state.needs.includes(need.id);
              const disabled = counts[need.id] === 0 && !on;
              return (
                <label key={need.id} className={cn("flex min-h-9 items-center gap-2.5 text-[15px]", disabled ? "cursor-default text-[#8a909c]" : "cursor-pointer text-navy")}>
                  <input type="checkbox" checked={on} disabled={disabled} onChange={() => toggleNeed(need.id)} className="h-[18px] w-[18px] accent-navy" />
                  <span>{need.label}</span>
                  <span className="ml-auto text-[13px] text-muted">{counts[need.id]}</span>
                </label>
              );
            })}
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2.5 text-[13px] font-bold tracking-[1.5px] text-navy">COST</legend>
            <label className="flex min-h-9 cursor-pointer items-center gap-2.5 text-[15px] text-navy">
              <input type="checkbox" checked={state.freeOnly} onChange={(e) => update({ freeOnly: e.target.checked })} className="h-[18px] w-[18px] accent-navy" />
              Free programs only
            </label>
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2.5 text-[13px] font-bold tracking-[1.5px] text-navy">LOCATION</legend>
            <span className="text-sm">
              {state.state
                ? `Showing nationwide programs plus ${state.state} programs.`
                : "Nationwide programs always show. Add a state or ZIP above to include local ones."}
            </span>
            <button type="button" aria-expanded={mapOpen} aria-controls="resource-map-panel" onClick={() => setMapOpen((open) => !open)} className={cn(linkButton, "self-start")}>
              {mapOpen ? "Hide map" : "Show map instead"}
            </button>
          </fieldset>
        </aside>

        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
          {mapOpen && (
            <div id="resource-map-panel" className="rounded-lg border border-line bg-white p-4">
              <ResourceMap
                stateCounts={stateCounts}
                selected={state.state}
                onSelect={(selected) => {
                  setLocationInput(selected ?? "");
                  setLocationError(false);
                  update({ state: selected });
                }}
              />
            </div>
          )}

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 aria-live="polite" className="font-display text-[30px] uppercase text-navy">
                {filtered ? (results.length === 1 ? "1 program matches" : `${results.length} programs match`) : "Start here"}
              </h2>
              <span className="text-sm">
                {filtered
                  ? "Most relevant first. Remove a filter to see more."
                  : "Crisis lines and our most-used programs first. Pick who you are or a type of help to narrow it down."}
              </span>
            </div>
            <label className="flex items-center gap-2 text-[13px] font-bold text-navy">
              Sort
              <select
                value={state.sort}
                onChange={(e) => update({ sort: e.target.value === "az" ? "az" : "rec" })}
                className="h-10 rounded-md border-[1.5px] border-[#8a909c] bg-white px-2.5 text-sm text-navy"
              >
                <option value="rec">Recommended</option>
                <option value="az">Name (A–Z)</option>
              </select>
            </label>
          </div>

          <div className="flex items-center gap-2 max-md:sticky max-md:top-[74px] max-md:z-20 max-md:-mx-4 max-md:border-b max-md:border-line max-md:bg-paper max-md:px-4 max-md:py-2.5">
            <button
              type="button"
              aria-expanded={filtersOpen}
              aria-controls="resource-filters"
              onClick={() => setFiltersOpen((open) => !open)}
              className={cn(btnOutline, "shrink-0 md:hidden")}
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              {active.length ? `Filters (${active.length})` : "Filters"}
            </button>
            {filtered && (
              <div className="flex min-w-0 items-center gap-2 max-md:overflow-x-auto md:flex-wrap">
                <span className="shrink-0 text-[13px] font-bold text-navy max-md:sr-only">Filtered by:</span>
                {active.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    aria-label={`Remove filter: ${filter.label}`}
                    onClick={filter.remove}
                    className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full bg-navy px-3 text-sm font-semibold text-white"
                  >
                    <span>{filter.label}</span>
                    <X size={14} aria-hidden="true" />
                  </button>
                ))}
                <button type="button" onClick={clearAll} className={cn(linkButton, "shrink-0")}>
                  Clear all
                </button>
              </div>
            )}
          </div>

          {showsCrisisCard(state) && (
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-lg border-[1.5px] border-purpose bg-[#fdf1f2] px-5 py-[18px]">
              <div>
                <strong className="block text-navy">Need to talk to someone right now?</strong>
                <span>Free, confidential and open 24/7. You don&apos;t have to be in crisis to call.</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <a href="tel:988" className={`${btn} border-purpose bg-purpose text-white`}>Call 988, press 1</a>
                <a href="sms:838255" className={btnOutline}>Text 838255</a>
              </div>
            </div>
          )}

          {results.length > 0 ? (
            <>
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-4">
                {results.slice(0, visible).map((resource) => (
                  <DirectoryCard key={resource.id} resource={resource} />
                ))}
              </ul>
              {visible < results.length && (
                <div className="flex flex-col items-center gap-2 pt-2">
                  <p className="text-sm text-muted">Showing {visible} of {results.length}</p>
                  <button type="button" onClick={() => setVisible((count) => count + PAGE_SIZE)} className={btnOutline}>
                    Show more programs
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-start gap-3 rounded-lg border border-line bg-white p-8">
              <strong className="text-lg text-navy">No programs match all of these filters.</strong>
              <span>Try removing a filter, or ask us — a person on our team will point you to a few options.</span>
              <div className="flex flex-wrap gap-2.5">
                <button type="button" onClick={clearAll} className={btnPrimary}>Clear filters</button>
                <a href="#ask" className={btnOutline}>Ask For The 22</a>
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-between gap-3 pt-2 text-sm">
            <span>
              Every program listed here has been reviewed by our team.{" "}
              <Link href="/standards" className="text-help underline underline-offset-2 hover:text-help-dark">How we review</Link>
            </span>
            <a
              href="#report"
              onClick={() => {
                const panel = document.getElementById("report");
                if (panel instanceof HTMLDetailsElement) panel.open = true;
              }}
              className="text-help underline underline-offset-2 hover:text-help-dark"
            >
              Report outdated info
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
