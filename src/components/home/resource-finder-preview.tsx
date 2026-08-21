"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FilterChip } from "@/components/shared/filter-chip";
import { CTAButton } from "@/components/shared/cta-button";
import { US_STATES_GRID } from "@/lib/content/us-states";

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

const SORTED_STATES = [...US_STATES_GRID].sort((a, b) => a.name.localeCompare(b.name));

/**
 * A real, usable "I Am / I Need / Where" gateway on the homepage itself —
 * not just a link out to /resources. Submitting navigates to /resources
 * with the current audience/need/state carried over as query params, which
 * ResourceDirectory reads on mount (see its useSearchParams usage).
 */
export function ResourceFinderPreview() {
  const router = useRouter();
  const [needId, setNeedId] = useState<string | null>(null);
  const [audience, setAudience] = useState<string | null>(null);
  const [state, setState] = useState<string>("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (needId) params.set("need", needId);
    if (audience) params.set("audience", audience);
    if (state) params.set("state", state);
    const qs = params.toString();
    router.push(qs ? `/resources?${qs}` : "/resources");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
          I Am
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

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
          I Need
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

      <div className="mt-6">
        <label htmlFor="resource-finder-state" className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
          Where
        </label>
        <select
          id="resource-finder-state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="mt-2.5 w-full max-w-xs rounded-sm border border-ink/20 bg-off-white px-4 py-2.5 text-sm text-ink"
        >
          <option value="">Nationwide</option>
          {SORTED_STATES.map((s) => (
            <option key={s.code} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="rounded-sm bg-anchor px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-anchor-light"
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
