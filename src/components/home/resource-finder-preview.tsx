"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchField } from "@/components/shared/search-field";
import { FilterChip } from "@/components/shared/filter-chip";
import { CTAButton } from "@/components/shared/cta-button";

/** A curated subset of NEED_CATEGORIES for the compact homepage widget — the full list lives on /resources. */
const NEED_PREVIEW = [
  { id: "sports-fitness", label: "Sports & Fitness" },
  { id: "equipment-grants", label: "Equipment & Grants" },
  { id: "mental-health", label: "Mental Health" },
  { id: "career-education", label: "Career" },
  { id: "financial-assistance", label: "Financial Help" },
  { id: "family-support", label: "Family Support" },
] as const;

const AUDIENCE_PREVIEW = ["Veteran", "Law Enforcement", "Fire", "EMS", "Disabled"] as const;

/**
 * A real, usable search-and-filter widget on the homepage itself — not just
 * a link out to /resources. Submitting navigates to /resources with the
 * current search/need/audience carried over as query params, which
 * ResourceDirectory reads on mount (see its useSearchParams usage).
 */
export function ResourceFinderPreview() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [needId, setNeedId] = useState<string | null>(null);
  const [audience, setAudience] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (needId) params.set("need", needId);
    if (audience) params.set("audience", audience);
    const qs = params.toString();
    router.push(qs ? `/resources?${qs}` : "/resources");
  }

  return (
    <form onSubmit={handleSubmit}>
      <SearchField
        value={search}
        onChange={setSearch}
        label="Search resources"
        placeholder="Search resources…"
      />

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
          What Do You Need?
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {NEED_PREVIEW.map((c) => (
            <FilterChip
              key={c.id}
              label={c.label}
              active={needId === c.id}
              onClick={() => setNeedId(needId === c.id ? null : c.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
          Who Are You?
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {AUDIENCE_PREVIEW.map((tag) => (
            <FilterChip
              key={tag}
              label={tag}
              active={audience === tag}
              onClick={() => setAudience(audience === tag ? null : tag)}
            />
          ))}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
        >
          Find Resources
        </button>
        <CTAButton href="/resources" variant="ghost">
          Browse All Resources →
        </CTAButton>
      </div>
    </form>
  );
}
