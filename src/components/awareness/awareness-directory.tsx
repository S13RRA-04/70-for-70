"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AWARENESS_CATEGORIES, type AwarenessCategoryId, type AwarenessEntry } from "@/lib/content/awareness-calendar";
import { FilterChip } from "@/components/shared/filter-chip";
import { SearchField } from "@/components/shared/search-field";
import { EmptyState } from "@/components/shared/empty-state";
import { RevealGrid } from "@/components/shared/reveal-on-scroll";

/** Softer border/no CTA affordance for remembrance-tone entries — the list view's equivalent of the detail page's tone-aware framing. */
const TONE_LABEL: Record<AwarenessEntry["tone"], string> = {
  remember: "Remembrance",
  celebrate: "Celebration",
  "raise-awareness": "Awareness",
};

function EntryCard({ entry }: { entry: AwarenessEntry }) {
  return (
    <Link
      href={`/awareness/${entry.slug}`}
      className="hover-lift group flex flex-col rounded-xl border border-line bg-white p-5 hover:border-bronze/40"
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-bronze">{entry.displayDate}</p>
      <p className="mt-1.5 font-display text-xl uppercase text-ink group-hover:text-bronze">
        {entry.name}
      </p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-light">{entry.summary}</p>
      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-charcoal-light/70">
        {TONE_LABEL[entry.tone]}
      </p>
    </Link>
  );
}

/**
 * Local-state-only filtering (search text + multi-select category chips) —
 * deliberately simpler than ResourceDirectory's URL-synced/debounced
 * version. This directory is ~70 entries, not hundreds, and filter state
 * surviving a reload isn't important here, so the added complexity of a
 * router/useSearchParams round-trip wasn't worth it for v1.
 */
export function AwarenessDirectory({ entries }: { entries: AwarenessEntry[] }) {
  const [search, setSearch] = useState("");
  const [categoryIds, setCategoryIds] = useState<AwarenessCategoryId[]>([]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesSearch = !q || entry.name.toLowerCase().includes(q) || entry.summary.toLowerCase().includes(q);
      const matchesCategory = categoryIds.length === 0 || categoryIds.some((id) => entry.categoryIds.includes(id));
      return matchesSearch && matchesCategory;
    });
  }, [entries, search, categoryIds]);

  const priorityEntries = filtered.filter((e) => e.priority);
  const otherEntries = filtered.filter((e) => !e.priority);

  function toggleCategory(id: AwarenessCategoryId) {
    setCategoryIds((current) => (current.includes(id) ? current.filter((c) => c !== id) : [...current, id]));
  }

  return (
    <div>
      <SearchField
        value={search}
        onChange={setSearch}
        label="Search the Awareness Calendar"
        placeholder="Search by name or keyword..."
      />

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal-light">Filter by Who It&apos;s For</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <FilterChip label="All" active={categoryIds.length === 0} onClick={() => setCategoryIds([])} />
          {AWARENESS_CATEGORIES.map((category) => (
            <FilterChip
              key={category.id}
              label={category.label}
              active={categoryIds.includes(category.id)}
              onClick={() => toggleCategory(category.id)}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No observances match your filters."
            description="Try a different search term or clear the category filters."
            onAction={{ label: "Clear Filters", onClick: () => { setSearch(""); setCategoryIds([]); } }}
          />
        </div>
      ) : (
        <>
          {priorityEntries.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-bronze">Campaign Opportunities</p>
              <p className="mt-1 max-w-2xl text-sm text-charcoal-light">
                Not every observance gets a campaign built around it &mdash; these are the ones that do.
              </p>
              <RevealGrid>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {priorityEntries.map((entry) => (
                    <EntryCard key={entry.slug} entry={entry} />
                  ))}
                </div>
              </RevealGrid>
            </div>
          )}

          {otherEntries.length > 0 && (
            <div className="mt-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal-light">
                {priorityEntries.length > 0 ? "The Rest of the Calendar" : "Observances"}
              </p>
              <RevealGrid>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {otherEntries.map((entry) => (
                    <EntryCard key={entry.slug} entry={entry} />
                  ))}
                </div>
              </RevealGrid>
            </div>
          )}
        </>
      )}
    </div>
  );
}
