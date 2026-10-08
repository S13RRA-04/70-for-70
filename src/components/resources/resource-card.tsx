"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { NEED_CATEGORIES, type Resource } from "@/lib/content/resources";

/** Deterministic accent per card so the grid isn't monochrome — not tied to category, purely visual rhythm. */
const AVATAR_ACCENTS = [
  "bg-bronze/15 text-bronze",
  "bg-olive/15 text-olive",
  "bg-charcoal/10 text-charcoal-light",
] as const;

function accentForName(name: string): string {
  const sum = [...name].reduce((total, char) => total + char.charCodeAt(0), 0);
  return AVATAR_ACCENTS[sum % AVATAR_ACCENTS.length];
}

/**
 * Decision-critical fields (org, description, category, who qualifies,
 * cost, availability) render immediately; eligibility detail and review
 * status — supporting detail, not what most people scan for first — sit
 * behind "View details" so a dense result set stays scannable. The outer
 * element is a plain div, not a link, because "View details" has to be its
 * own button distinct from the outbound "Visit" action.
 */
export function ResourceCard({ resource }: { resource: Resource }) {
  const [expanded, setExpanded] = useState(false);
  const initial = resource.name.trim().charAt(0).toUpperCase();
  // Plain text, not another pill — audience tags already cover that
  // treatment below, and giving every field its own pill reads as clutter.
  const categoryLabel = NEED_CATEGORIES.find((c) => c.id === resource.needCategoryIds[0])?.label;
  // A rough proxy for "this would overflow the 3-line clamp below" — long
  // enough that the full text belongs in the expanded state, not guessed
  // from a DOM measurement.
  const isLongDescription = resource.description.length > 160;
  const hasDetails = Boolean(resource.eligibility || resource.verificationStatus || isLongDescription);
  const resourceId = resource.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <div
      data-resource-id={resourceId}
      className="hover-lift flex flex-col rounded-sm border border-ink/10 bg-off-white p-5 transition-colors hover:border-bronze/40"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-base font-semibold ${accentForName(resource.name)}`}
        >
          {initial}
        </span>
        <p className="min-w-0 font-display text-sm font-semibold uppercase leading-tight tracking-wide text-ink">
          {resource.name}
        </p>
      </div>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-charcoal-light">
        {resource.description}
      </p>

      {categoryLabel && (
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-bronze-text">{categoryLabel}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {resource.audienceTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-ink/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-charcoal-light"
          >
            {tag}
          </span>
        ))}
      </div>

      {resource.availability && (
        <p className="mt-3 text-xs text-charcoal-light">
          <span className="font-semibold text-ink">Availability:</span> {resource.availability}
        </p>
      )}

      {hasDetails && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={`${resourceId}-details`}
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
          >
            View details
            <ChevronDown size={13} aria-hidden="true" className={cn("transition-transform", expanded && "rotate-180")} />
          </button>
          {expanded && (
            <div id={`${resourceId}-details`} className="mt-2 space-y-1.5 text-xs leading-relaxed text-charcoal-light">
              {isLongDescription && <p>{resource.description}</p>}
              {resource.eligibility && (
                <p>
                  <span className="font-semibold text-ink">Eligibility:</span> {resource.eligibility}
                </p>
              )}
              {resource.verificationStatus && (
                <p className="font-semibold uppercase tracking-widest text-olive">
                  {resource.verificationStatus.replaceAll("-", " ")} ·{" "}
                  <a href="/standards" className="normal-case tracking-normal text-bronze hover:text-bronze-dark">
                    see review standard
                  </a>
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink/10 pt-3">
        <div className="text-xs text-charcoal-light">
          <span className="font-semibold text-ink">{resource.cost}</span>
          <span className="mx-1.5 text-ink/20">·</span>
          {resource.geographicScope}
        </div>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-event="resource_outbound_click"
          className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
        >
          Visit
          <ExternalLink size={12} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}
