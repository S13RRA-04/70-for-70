"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RESOURCES } from "@/lib/content/resources";
import { ResourceCard } from "@/components/resources/resource-card";
import { StateMap } from "@/components/resources/state-map";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterChip } from "@/components/shared/filter-chip";
import { SearchField } from "@/components/shared/search-field";

export interface NeedCategory {
  id: string;
  label: string;
}

/** "What do you need?" — the primary way this directory is organized; sport is one entry point among several. */
export const NEED_CATEGORIES: NeedCategory[] = [
  { id: "mental-health", label: "Mental Health" },
  { id: "sports-fitness", label: "Sports & Fitness" },
  { id: "equipment-grants", label: "Equipment & Grants" },
  { id: "outdoor-programs", label: "Outdoor Programs" },
  { id: "family-support", label: "Family Support" },
  { id: "purpose-community", label: "Purpose & Community" },
  { id: "career-education", label: "Career & Education" },
  { id: "financial-assistance", label: "Financial Assistance" },
  { id: "housing-transportation", label: "Housing & Transportation" },
  { id: "legal-benefits", label: "Legal & Benefits" },
];

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

function FilterRow({
  label,
  options,
  activeValues,
  onSelect,
}: {
  label: string;
  options: readonly string[];
  /** Every option currently applied — usually 0 or 1, but a gateway card can land here with several at once. */
  activeValues: readonly string[];
  onSelect: (value: string | null) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">{label}</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        <FilterChip label="All" active={activeValues.length === 0} onClick={() => onSelect(null)} />
        {options.map((option) => (
          <FilterChip
            key={option}
            label={option}
            active={activeValues.includes(option)}
            onClick={() => onSelect(activeValues.length === 1 && activeValues.includes(option) ? null : option)}
          />
        ))}
      </div>
    </div>
  );
}

export function ResourceDirectory() {
  // Deep-link support so the homepage gateway (see ResourceCategoryGrid) can
  // land here pre-filtered via ?q=&need=&audience=. `need` may be a
  // comma-separated list of ids since a few gateway cards span more than
  // one taxonomy category; a single id (the only form older links use)
  // still works unchanged.
  const params = useSearchParams();
  const [needIds, setNeedIds] = useState<string[]>(() => {
    const raw = params.get("need");
    return raw ? raw.split(",").filter(Boolean) : [];
  });
  const [audience, setAudience] = useState<string | null>(() => params.get("audience"));
  const [search, setSearch] = useState(() => params.get("q") ?? "");
  const [stateFilter, setStateFilter] = useState<string | null>(() => params.get("state"));

  // The lazy initializers above cover the normal case (a fresh page load,
  // filtered from the first server-rendered paint). This covers the one
  // they can't: Next's client router reusing this already-mounted page
  // instance when navigating from one gateway card to another, where only
  // the query string changes and the initializers never re-run. Comparing
  // during render (React's documented way to adjust state when a prop
  // changes, rather than an Effect) lets us reset synchronously, before
  // the stale-filter results ever paint. In-page filter-chip clicks don't
  // touch the URL, so paramsKey stays put and they aren't overwritten.
  const paramsKey = params.toString();
  const [lastParamsKey, setLastParamsKey] = useState(paramsKey);
  if (paramsKey !== lastParamsKey) {
    setLastParamsKey(paramsKey);
    const raw = params.get("need");
    setNeedIds(raw ? raw.split(",").filter(Boolean) : []);
    setAudience(params.get("audience"));
    setSearch(params.get("q") ?? "");
    setStateFilter(params.get("state"));
  }

  const activeStates = useMemo(() => {
    const states = new Set<string>();
    for (const resource of RESOURCES) {
      if (resource.state) states.add(resource.state);
    }
    return states;
  }, []);

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();

    return RESOURCES.filter((resource) => {
      const matchesNeed =
        needIds.length === 0 || resource.needCategoryIds.some((id) => needIds.includes(id));
      const matchesAudience = !audience || resource.audienceTags.includes(audience);
      // Nationwide entries (no state set) always count as a match — picking
      // a state should add local resources on top of nationwide ones, not
      // hide them.
      const matchesState = !stateFilter || !resource.state || resource.state === stateFilter;

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

      return matchesNeed && matchesAudience && matchesState && matchesSearch;
    });
  }, [needIds, audience, stateFilter, search]);

  return (
    <div>
      {/* Full-width on its own — a real US choropleth needs real room; small
          Northeast states are unusable squeezed into a sidebar column. */}
      <div className="rounded-sm border border-ink/10 bg-sand-light p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            Where Are You?
          </p>
          {stateFilter && (
            <button
              type="button"
              onClick={() => setStateFilter(null)}
              className="text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
            >
              {stateFilter} &middot; Clear
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-charcoal-light/80">
          Bronze states have region-specific resources; every state still shows nationwide
          programs.
        </p>
        <div className="mx-auto mt-4 max-w-3xl">
          <StateMap activeStates={activeStates} selected={stateFilter} onSelect={setStateFilter} />
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-6">
        <div className="lg:sticky lg:top-24 lg:col-span-4 lg:max-h-[calc(100vh-7rem)] lg:space-y-5 lg:overflow-y-auto lg:pr-1 xl:col-span-3">
          <SearchField
            id="resource-search"
            value={search}
            onChange={setSearch}
            label="Search resources"
            placeholder="Search organizations, services, or needs…"
            className="scroll-mt-20"
          />

          <div className="space-y-5 rounded-sm border border-ink/10 bg-sand-light p-5">
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
            />
          </div>
        </div>

        <div className="lg:col-span-8 xl:col-span-9">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            {results.length} {results.length === 1 ? "resource" : "resources"}
            {stateFilter && ` in ${stateFilter} + nationwide`}
          </p>

          {results.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="No resources match that combination yet."
                description="Try a different search term or clearing one of the filters."
              />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((resource) => (
                <ResourceCard key={resource.name} resource={resource} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
