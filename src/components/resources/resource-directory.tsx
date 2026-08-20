"use client";

import { useMemo, useState } from "react";
import { RESOURCES } from "@/lib/content/resources";
import { ResourceCard } from "@/components/resources/resource-card";
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
  active,
  onSelect,
}: {
  label: string;
  options: readonly string[];
  active: string | null;
  onSelect: (value: string | null) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">{label}</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        <FilterChip label="All" active={active === null} onClick={() => onSelect(null)} />
        {options.map((option) => (
          <FilterChip
            key={option}
            label={option}
            active={active === option}
            onClick={() => onSelect(option === active ? null : option)}
          />
        ))}
      </div>
    </div>
  );
}

export function ResourceDirectory() {
  const [needId, setNeedId] = useState<string | null>(null);
  const [audience, setAudience] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();

    return RESOURCES.filter((resource) => {
      const matchesNeed = !needId || resource.needCategoryIds.includes(needId);
      const matchesAudience = !audience || resource.audienceTags.includes(audience);

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
        resource.geographicScope.toLowerCase().includes(query);

      return matchesNeed && matchesAudience && matchesSearch;
    });
  }, [needId, audience, search]);

  return (
    <div>
      <SearchField
        id="resource-search"
        value={search}
        onChange={setSearch}
        label="Search resources"
        placeholder="Search organizations, services, or needs…"
        className="mb-5 scroll-mt-20"
      />

      <div className="space-y-5 rounded-sm border border-ink/10 bg-sand-light p-5 sm:p-6">
        <FilterRow
          label="What Do You Need?"
          options={NEED_CATEGORIES.map((c) => c.label)}
          active={needId ? (NEED_CATEGORIES.find((c) => c.id === needId)?.label ?? null) : null}
          onSelect={(label) => setNeedId(label ? (NEED_CATEGORIES.find((c) => c.label === label)?.id ?? null) : null)}
        />
        <FilterRow label="Who Are You?" options={PRIMARY_AUDIENCE_TAGS} active={audience} onSelect={setAudience} />
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
        {results.length} {results.length === 1 ? "resource" : "resources"}
      </p>

      {results.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No resources match that combination yet."
            description="Try a different search term or clearing one of the filters."
          />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((resource) => (
            <ResourceCard key={resource.name} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}
