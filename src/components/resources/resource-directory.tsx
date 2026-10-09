"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Check, Copy, X } from "lucide-react";
import { NEED_CATEGORIES, slugifyResourceName, type Resource } from "@/lib/content/resources";
import { ResourceCard } from "@/components/resources/resource-card";
import { StateMap } from "@/components/resources/state-map";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterChip } from "@/components/shared/filter-chip";
import { SearchField } from "@/components/shared/search-field";
import { RevealGrid } from "@/components/shared/reveal-on-scroll";
import { trackEvent } from "@/lib/analytics/plausible";
import { cn } from "@/lib/utils";

/** Cards rendered per "page" — a plain client-side slice of sortedResults, not a route param, since the whole list is already filtered/sorted client-side. Keeps the unfiltered 1,000+-resource view from mounting every card (and its own useState pair) at once. */
const RESULTS_PAGE_SIZE = 24;

/** A single active-filter tag in the "Active filters" row, with its own remove button. Extracted so the 4 call sites below (need/audience/state/search) share one implementation instead of repeating the same markup. */
function RemovableFilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="rounded-full border border-ink/20 bg-sand-light px-3 py-1 text-[11px] font-semibold text-ink"
    >
      {label} <span aria-hidden="true">×</span>
    </button>
  );
}

/** "Who are you?" — the curated filter-row subset. Cards may show additional audience tags beyond this list. */
export const PRIMARY_AUDIENCE_TAGS = [
  "Veteran",
  "Active Military",
  "Law Enforcement",
  "Fire",
  "EMS",
  "Dispatch",
  "Corrections",
  "Family",
  "Disabled",
] as const;

/** "Nationwide" vs "State-Specific" — independent of which state is selected on the map. */
type ResourceScope = "all" | "national" | "state";
const SCOPE_LABELS = { national: "Nationwide", state: "State-Specific" } as const;

function toResourceScope(raw: string | null): ResourceScope {
  return raw === "national" || raw === "state" ? raw : "all";
}

/**
 * "Relevance" is the data's own curated order (see resources.ts's doc
 * comment — entries are grouped by need category on purpose), not a search
 * ranking; there's no scoring to rank by, so it's really "as curated."
 * "Recent" uses verifiedDate, falling back to last for any entry missing
 * one rather than treating an unset date as "oldest" or "newest" — either
 * would misrepresent entries research hasn't dated yet.
 */
type ResourceSort = "relevance" | "name" | "recent";
const SORT_LABELS: Record<ResourceSort, string> = {
  relevance: "Relevance",
  name: "Name (A–Z)",
  recent: "Recently Verified",
};

function toResourceSort(raw: string | null): ResourceSort {
  return raw === "name" || raw === "recent" ? raw : "relevance";
}

function FilterRow({
  label,
  options,
  activeValues,
  onSelect,
  chipSize = "md",
}: {
  label: string;
  options: readonly string[];
  /** Every option currently applied — usually 0 or 1, but a gateway card can land here with several at once. */
  activeValues: readonly string[];
  onSelect: (value: string | null) => void;
  /** "md" for the primary "What Do You Need?" row, "sm" for the secondary rows below it — a visual size step reinforces which filter matters most. */
  chipSize?: "sm" | "md";
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">{label}</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        <FilterChip label="All" active={activeValues.length === 0} onClick={() => onSelect(null)} size={chipSize} />
        {options.map((option) => (
          <FilterChip
            key={option}
            label={option}
            active={activeValues.includes(option)}
            onClick={() => onSelect(activeValues.length === 1 && activeValues.includes(option) ? null : option)}
            size={chipSize}
          />
        ))}
      </div>
    </div>
  );
}

export function ResourceDirectory({ resources }: { resources: Resource[] }) {
  // Deep-link support so the homepage quick-finder and network/state pages
  // can land here pre-filtered via ?q=&need=&audience=. `need` may be a
  // comma-separated list of ids since a few callers span more than one
  // taxonomy category; a single id (the only form older links use) still
  // works unchanged.
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [needIds, setNeedIds] = useState<string[]>(() => {
    const raw = params.get("need");
    return raw ? raw.split(",").filter(Boolean) : [];
  });
  const [audience, setAudience] = useState<string | null>(() => params.get("audience"));
  const [search, setSearch] = useState(() => params.get("q") ?? "");
  const [stateFilter, setStateFilter] = useState<string | null>(() => params.get("state"));
  const [scope, setScope] = useState<ResourceScope>(() => toResourceScope(params.get("scope")));
  const [sort, setSort] = useState<ResourceSort>(() => toResourceSort(params.get("sort")));
  const [accessFilters, setAccessFilters] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(RESULTS_PAGE_SIZE);
  const [searchLinkCopied, setSearchLinkCopied] = useState(false);
  // Below `lg:`, the filter chip stack (3 groups, up to ~20 buttons total)
  // starts collapsed so a mobile visitor reaches search + results without
  // scrolling past it first — `lg:` always shows it regardless of this
  // state (see the className below). Opens automatically once any filter
  // is actually active, so a deep-linked/gateway-card visit doesn't hide
  // the filters that are already applied.
  const [filtersOpen, setFiltersOpen] = useState(false);
  // Coverage + the 8-option "Confirmed Access & Organization" row sit behind
  // their own nested disclosure so the default view only surfaces Search,
  // Need, and Who Are You — the three dimensions most people actually touch
  // first. Auto-opens when one of its own filters is active so deep links do
  // not hide applied state.
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  // The state map used to render open, full-width, above search — forcing
  // every visitor through it even though most people come here to search or
  // browse by need, not by state. Collapsed by default now, same
  // auto-opens-when-its-filter-is-active pattern as moreFiltersOpen below,
  // so a deep link with ?state= still shows the map it came from.
  const [mapOpen, setMapOpen] = useState(false);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filtersOpen) return;
    const panel = filterPanelRef.current;
    if (!panel) return;
    const trigger = filterTriggerRef.current;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector));
    focusable[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setFiltersOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const current = Array.from(panel!.querySelectorAll<HTMLElement>(focusableSelector));
      if (current.length === 0) return;
      const first = current[0];
      const last = current[current.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [filtersOpen]);

  // In-page filter changes now sync back to the URL (debounced below) so a
  // filtered view is shareable/bookmarkable — it previously never touched
  // the URL at all once mounted. That write is itself a URL change, which
  // would otherwise be indistinguishable from someone landing via a new
  // gateway-card link or hitting back/forward — both of which *should*
  // reset local state from the URL. This flag marks "that next params
  // change is one I just wrote myself," so the reset logic below only
  // fires for real external navigation. State, not a ref, since it's read
  // and set during render (same pattern as lastParamsKey just below) —
  // React's hooks lint forbids reading/writing a ref's .current in render.
  const [isSelfWrite, setIsSelfWrite] = useState(false);

  // The lazy initializers above cover the normal case (a fresh page load,
  // filtered from the first server-rendered paint). This covers the one
  // they can't: Next's client router reusing this already-mounted page
  // instance when navigating from one gateway card to another (or the user
  // hitting back/forward), where only the query string changes and the
  // initializers never re-run. Comparing during render (React's documented
  // way to adjust state when a prop changes, rather than an Effect) lets us
  // reset synchronously, before the stale-filter results ever paint.
  const paramsKey = params.toString();
  const [lastParamsKey, setLastParamsKey] = useState(paramsKey);
  if (paramsKey !== lastParamsKey) {
    setLastParamsKey(paramsKey);
    if (isSelfWrite) {
      setIsSelfWrite(false);
    } else {
      const raw = params.get("need");
      setNeedIds(raw ? raw.split(",").filter(Boolean) : []);
      setAudience(params.get("audience"));
      setSearch(params.get("q") ?? "");
      setStateFilter(params.get("state"));
      setScope(toResourceScope(params.get("scope")));
      setSort(toResourceSort(params.get("sort")));
    }
  }

  // Debounced so typing a search query doesn't fire a navigation per
  // keystroke — chip/map clicks already only fire a few times a session, so
  // they don't need the delay, but share the same effect for one code path.
  useEffect(() => {
    const timeout = setTimeout(() => {
      const next = new URLSearchParams();
      if (needIds.length > 0) next.set("need", needIds.join(","));
      if (audience) next.set("audience", audience);
      if (search) next.set("q", search);
      if (stateFilter) next.set("state", stateFilter);
      if (scope !== "all") next.set("scope", scope);
      if (sort !== "relevance") next.set("sort", sort);
      const nextKey = next.toString();
      if (nextKey === paramsKey) return;
      setIsSelfWrite(true);
      router.replace(nextKey ? `${pathname}?${nextKey}` : pathname, { scroll: false });
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needIds, audience, search, stateFilter, scope, sort]);

  const activeStates = useMemo(() => {
    const states = new Set<string>();
    for (const resource of resources) {
      if (resource.state) states.add(resource.state);
    }
    return states;
  }, [resources]);

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesNeed =
        needIds.length === 0 || resource.needCategoryIds.some((id) => needIds.includes(id));
      const matchesAudience = !audience || resource.audienceTags.includes(audience);
      // Nationwide entries (no state set) always count as a match — picking
      // a state should add local resources on top of nationwide ones, not
      // hide them.
      const matchesState = !stateFilter || !resource.state || resource.state === stateFilter;
      const matchesScope = scope === "all" || (scope === "national" ? !resource.state : Boolean(resource.state));
      const matchesAccess = accessFilters.every((filter) => {
        if (filter === "Self-referral") return resource.selfReferral === true;
        if (filter === "No employer referral") return resource.employerInvolvementRequired === false;
        if (filter === "Independent provider") return resource.outsideAgencyProvider === true;
        if (filter === "Anonymous initial contact") return resource.anonymousInitialContact === true;
        if (filter === "Virtual access") return resource.virtualAvailable === true;
        if (filter === "No insurance required") return resource.insuranceRequired === false;
        if (filter === "Peer-led") return resource.peerLed === true;
        if (filter === "Faith-based organization") return resource.faithBased === true;
        return true;
      });

      const needLabels = resource.needCategoryIds.map(
        (id) => NEED_CATEGORIES.find((c) => c.id === id)?.label ?? "",
      );
      const matchesSearch =
        !query ||
        resource.name.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.audienceTags.some((tag) => tag.toLowerCase().includes(query)) ||
        needLabels.some((label) => label.toLowerCase().includes(query)) ||
        resource.cost.toLowerCase().includes(query) ||
        resource.geographicScope.toLowerCase().includes(query) ||
        (resource.state?.toLowerCase().includes(query) ?? false);

      return matchesNeed && matchesAudience && matchesState && matchesScope && matchesAccess && matchesSearch;
    });
  }, [resources, needIds, audience, stateFilter, scope, accessFilters, search]);

  const sortedResults = useMemo(() => {
    if (sort === "relevance") return results;
    const copy = [...results];
    if (sort === "name") {
      copy.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // "recent" — no verifiedDate sorts last, never treated as newest or oldest.
      copy.sort((a, b) => {
        if (!a.verifiedDate && !b.verifiedDate) return 0;
        if (!a.verifiedDate) return 1;
        if (!b.verifiedDate) return -1;
        return b.verifiedDate.localeCompare(a.verifiedDate);
      });
    }
    return copy;
  }, [results, sort]);

  // Resets the page back to the first batch whenever the actual result set
  // changes shape — otherwise tightening a filter after scrolling deep into
  // "Load More" could leave visibleCount far past the new, smaller total,
  // or just strand a visitor on page 6 of a now-unrelated search.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setVisibleCount(RESULTS_PAGE_SIZE), [needIds, audience, search, stateFilter, scope, accessFilters, sort]);

  const visibleResults = sortedResults.slice(0, visibleCount);
  const hasMoreResults = visibleCount < sortedResults.length;

  // Tracked on its own debounce (not folded into the URL-sync effect above)
  // so it fires once per pause in typing, carrying the result count at that
  // moment — not on every keystroke, and not for an empty/cleared query.
  useEffect(() => {
    const query = search.trim();
    if (!query) return;
    const timeout = setTimeout(() => {
      trackEvent("resource_search", { query, results: String(results.length) });
    }, 500);
    return () => clearTimeout(timeout);
  }, [search, results.length]);

  // Lands a copied resource link (see ResourceCard's handleCopyLink) on the
  // actual card, not just the top of the filtered list — results render
  // from a search match on the resource's own name, so the matching card is
  // always present once results settle. Runs once results stop changing
  // (not on every keystroke/filter tweak) so it doesn't fight a visitor who
  // starts typing their own search.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash || results.length === 0) return;
    // A hash target past the current page (page size, no narrowing search)
    // wouldn't be in the DOM yet to scroll to — expand to include it first.
    const targetIndex = sortedResults.findIndex((r) => slugifyResourceName(r.name) === hash);
    if (targetIndex >= visibleCount) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisibleCount(targetIndex + 1);
      return;
    }
    const el = document.querySelector(`[data-resource-id="${hash}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("ring-2", "ring-bronze", "ring-offset-2");
    const timeout = setTimeout(() => el.classList.remove("ring-2", "ring-bronze", "ring-offset-2"), 2500);
    return () => clearTimeout(timeout);
  }, [results.length, sortedResults, visibleCount]);

  // Drives the collapsible chip panel's own auto-open — search is always
  // visible outside that panel, so it doesn't need to force it open.
  const chipFilterCount = [needIds.length > 0, Boolean(audience), scope !== "all", accessFilters.length > 0].filter(Boolean).length;
  // Drives the toggle button's "N Active" badge and whether a "Clear all"
  // control appears — this one DOES count search/state, since both are
  // genuinely active filters even though they live outside the chip panel.
  // Previously only chipFilterCount was shown here, so a visitor who'd only
  // searched or only picked a state saw a bare "Filters" label that
  // understated how filtered the view already was.
  const totalActiveFilterCount = chipFilterCount + (search ? 1 : 0) + (stateFilter ? 1 : 0);
  const showMap = mapOpen || Boolean(stateFilter);
  const moreFiltersActiveCount = (scope !== "all" ? 1 : 0) + accessFilters.length;
  const showMoreFilters = moreFiltersOpen || moreFiltersActiveCount > 0;

  function clearAllFilters() {
    setNeedIds([]);
    setAudience(null);
    setSearch("");
    setStateFilter(null);
    setScope("all");
    setAccessFilters([]);
  }

  return (
    <div>
      {/* Lets a keyboard user bypass the "Browse by State" toggle (and, once
          open, ~50 individually-tabbable state shapes) to reach search
          directly — sr-only until focused. */}
      <a
        href="#resource-search"
        className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:uppercase focus:tracking-wide focus:text-off-white"
      >
        Skip to search &amp; filters
      </a>

      {/* Collapsed by default (see mapOpen/showMap above) — most visitors
          come here to search or filter by need, not browse a US map, and a
          full-width choropleth forced above the fold pushed that below a
          long scroll for everyone else. Still full-width, not squeezed into
          the sidebar column, once opened — small Northeast states need the
          room. */}
      <div className="rounded-sm border border-ink/10 bg-sand-light p-5 sm:p-6">
        <button
          type="button"
          onClick={() => setMapOpen((v) => !v)}
          aria-expanded={showMap}
          aria-controls="resource-state-map"
          className="flex w-full flex-wrap items-baseline justify-between gap-2 text-left"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            {stateFilter ? `Browsing ${stateFilter}` : "Browse by State"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-bronze">
            {showMap ? "Hide Map" : "Show Map"}
            <ChevronDown size={14} aria-hidden="true" className={cn("transition-transform", showMap && "rotate-180")} />
          </span>
        </button>
        {showMap && (
          <div id="resource-state-map">
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-xs text-charcoal-light/80">
                Bronze states have region-specific resources; every state still shows nationwide
                programs.
              </p>
              {stateFilter && (
                <button
                  type="button"
                  onClick={() => setStateFilter(null)}
                  className="shrink-0 text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
                >
                  Clear State
                </button>
              )}
            </div>
            <div className="mx-auto mt-4 max-w-3xl">
              <StateMap activeStates={activeStates} selected={stateFilter} onSelect={setStateFilter} />
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-6">
        <div className="space-y-3 lg:sticky lg:top-24 lg:col-span-4 lg:max-h-[calc(100vh-7rem)] lg:space-y-5 lg:overflow-y-auto lg:pr-1 xl:col-span-3">
          <SearchField
            id="resource-search"
            value={search}
            onChange={setSearch}
            label="Search resources"
            placeholder="Search organizations, services, or needs…"
            className="scroll-mt-20"
          />

          <button
            ref={filterTriggerRef}
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            aria-controls="resource-filter-panel"
            className="sticky bottom-4 z-30 flex min-h-12 w-full items-center justify-between rounded-sm border border-ink/20 bg-ink px-4 py-3 text-xs font-semibold uppercase tracking-wide text-off-white shadow-lg lg:hidden"
          >
            <span>Filters{totalActiveFilterCount > 0 ? ` · ${totalActiveFilterCount} Active` : ""}</span>
            <ChevronDown size={14} aria-hidden="true" className={cn("transition-transform", filtersOpen && "rotate-180")} />
          </button>

          {filtersOpen && (
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 z-40 bg-ink/55 lg:hidden"
            />
          )}
          <div
            ref={filterPanelRef}
            id="resource-filter-panel"
            role="dialog"
            aria-modal={filtersOpen ? "true" : undefined}
            aria-label="Resource filters"
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] space-y-5 overflow-y-auto rounded-t-lg border border-ink/10 bg-sand-light p-5 shadow-2xl transition-transform duration-300 lg:static lg:z-auto lg:block lg:max-h-none lg:rounded-sm lg:shadow-none",
              filtersOpen ? "translate-y-0" : "pointer-events-none translate-y-full",
              "lg:pointer-events-auto lg:translate-y-0",
            )}
          >
            <div className="flex items-center justify-between border-b border-ink/10 pb-3 lg:hidden">
              <div>
                <p className="font-display text-lg font-semibold uppercase text-ink">Filter Resources</p>
                <p className="text-xs text-charcoal-light">{results.length} results</p>
              </div>
              <button type="button" onClick={() => setFiltersOpen(false)} className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-ink/15 bg-off-white" aria-label="Close filters">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <FilterRow
              label="What Do You Need?"
              options={NEED_CATEGORIES.map((c) => c.label)}
              activeValues={needIds.map((id) => NEED_CATEGORIES.find((c) => c.id === id)?.label ?? "")}
              onSelect={(label) =>
                setNeedIds(label ? [NEED_CATEGORIES.find((c) => c.label === label)?.id ?? ""].filter(Boolean) : [])
              }
            />
            <FilterRow
              label="Who Are You?"
              options={PRIMARY_AUDIENCE_TAGS}
              activeValues={audience ? [audience] : []}
              onSelect={setAudience}
              chipSize="sm"
            />
            <div className="border-t border-ink/10 pt-4">
              <button
                type="button"
                onClick={() => setMoreFiltersOpen((v) => !v)}
                aria-expanded={showMoreFilters}
                aria-controls="resource-more-filters"
                className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-widest text-charcoal-light hover:text-ink"
              >
                <span>More Filters{moreFiltersActiveCount > 0 ? ` · ${moreFiltersActiveCount} Active` : ""}</span>
                <ChevronDown size={14} aria-hidden="true" className={cn("transition-transform", showMoreFilters && "rotate-180")} />
              </button>
              {showMoreFilters && (
                <div id="resource-more-filters" className="mt-4 space-y-5">
                  <FilterRow
                    label="Coverage"
                    options={[SCOPE_LABELS.national, SCOPE_LABELS.state]}
                    activeValues={scope === "all" ? [] : [SCOPE_LABELS[scope]]}
                    onSelect={(label) =>
                      setScope(label === SCOPE_LABELS.national ? "national" : label === SCOPE_LABELS.state ? "state" : "all")
                    }
                    chipSize="sm"
                  />
                  <FilterRow
                    label="Confirmed Access & Organization"
                    options={["Self-referral", "No employer referral", "Independent provider", "Anonymous initial contact", "Virtual access", "No insurance required", "Peer-led", "Faith-based organization"]}
                    activeValues={accessFilters}
                    onSelect={(value) => setAccessFilters(value ? (accessFilters.includes(value) ? accessFilters.filter((item) => item !== value) : [...accessFilters, value]) : [])}
                    chipSize="sm"
                  />
                  <p className="text-[11px] leading-relaxed text-charcoal-light">These filters only match details explicitly confirmed from provider information. Missing information, including faith affiliation, is treated as unknown.</p>
                </div>
              )}
            </div>
            <button type="button" onClick={() => setFiltersOpen(false)} className="sticky bottom-0 w-full rounded-sm bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-wide text-off-white lg:hidden">
              Show {results.length} {results.length === 1 ? "Resource" : "Resources"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8 xl:col-span-9">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            {/* aria-live so a screen-reader user hears the updated count after
                a chip/search/map change, instead of having to re-navigate
                here to discover the list changed at all. */}
            <p aria-live="polite" className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
              {results.length} {results.length === 1 ? "resource" : "resources"}
              {needIds.length > 0 &&
                ` · ${needIds.map((id) => NEED_CATEGORIES.find((c) => c.id === id)?.label).filter(Boolean).join(", ")}`}
              {audience && ` · ${audience}`}
              {search && ` · matching "${search}"`}
              {stateFilter && (scope === "state" ? ` in ${stateFilter} only` : ` in ${stateFilter} + nationwide`)}
              {!stateFilter && scope !== "all" && ` · ${SCOPE_LABELS[scope]} only`}
            </p>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                Sort
                <select
                  value={sort}
                  onChange={(e) => setSort(toResourceSort(e.target.value))}
                  className="rounded-sm border border-ink/20 bg-off-white px-2 py-1 text-xs font-semibold uppercase tracking-wide text-ink"
                >
                  {(Object.keys(SORT_LABELS) as ResourceSort[]).map((value) => (
                    <option key={value} value={value}>
                      {SORT_LABELS[value]}
                    </option>
                  ))}
                </select>
              </label>
              {totalActiveFilterCount > 0 && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      setSearchLinkCopied(true);
                      trackEvent("resource_search", { query: search || "(filters only)", results: String(results.length) });
                      setTimeout(() => setSearchLinkCopied(false), 2000);
                    } catch {
                      // Clipboard API unavailable — no-op.
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
                >
                  {searchLinkCopied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
                  {searchLinkCopied ? "Link Copied" : "Share This Search"}
                </button>
              )}
              {totalActiveFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {totalActiveFilterCount > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Active filters">
              {needIds.map((id) => (
                <RemovableFilterPill
                  key={id}
                  label={NEED_CATEGORIES.find((c) => c.id === id)?.label ?? id}
                  onRemove={() => setNeedIds(needIds.filter((item) => item !== id))}
                />
              ))}
              {audience && <RemovableFilterPill label={audience} onRemove={() => setAudience(null)} />}
              {stateFilter && <RemovableFilterPill label={stateFilter} onRemove={() => setStateFilter(null)} />}
              {search && <RemovableFilterPill label={`“${search}”`} onRemove={() => setSearch("")} />}
            </div>
          )}

          {results.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="No resources match that combination yet."
                description="Try a different search term, or clear your filters to see everything."
                onAction={{ label: "Clear All Filters", onClick: clearAllFilters }}
              />
            </div>
          ) : (
            <>
              <RevealGrid>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {visibleResults.map((resource) => (
                    <ResourceCard key={resource.name} resource={resource} />
                  ))}
                </div>
              </RevealGrid>

              {hasMoreResults && (
                <div className="mt-8 flex flex-col items-center gap-2">
                  <p className="text-xs text-charcoal-light">
                    Showing {visibleResults.length} of {sortedResults.length}
                  </p>
                  <button
                    type="button"
                    onClick={() => setVisibleCount((count) => count + RESULTS_PAGE_SIZE)}
                    className="rounded-sm border border-ink/20 bg-off-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
                  >
                    Load More Resources
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
