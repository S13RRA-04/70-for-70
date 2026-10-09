"use client";

import { useState } from "react";
import { ChevronDown, Copy, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { NEED_CATEGORIES, type Resource } from "@/lib/content/resources";
import { SITE_URL } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics/plausible";

/** "2026-10-09" -> "Oct 2026" — compact enough for a dense card footer; the full ISO date is still in the title attribute for anyone who wants it. */
function formatVerifiedMonth(iso: string): string {
  const date = new Date(`${iso}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

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
 * Decision-critical fields (org, short description, who qualifies, cost,
 * coverage) render immediately; category, availability, eligibility, and review
 * status — supporting detail, not what most people scan for first — sit
 * behind "View details" so a dense result set stays scannable. The outer
 * element is a plain div, not a link, because "View details" has to be its
 * own button distinct from the outbound "Visit" action.
 */
export function ResourceCard({ resource }: { resource: Resource }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const initial = resource.name.trim().charAt(0).toUpperCase();
  // Plain text, not another pill — audience tags already cover that
  // treatment below, and giving every field its own pill reads as clutter.
  const categoryLabel = NEED_CATEGORIES.find((c) => c.id === resource.needCategoryIds[0])?.label;
  // A rough proxy for "this would overflow the 3-line clamp below" — long
  // enough that the full text belongs in the expanded state, not guessed
  // from a DOM measurement.
  const isLongDescription = resource.description.length > 160;
  const hasDetails = Boolean(categoryLabel || resource.availability || resource.eligibility || resource.verificationStatus || isLongDescription);
  const resourceId = resource.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // Shares a deep link into the directory's existing search — there's no
  // dedicated per-resource page to link to, so this re-finds the same card
  // via its own name (which the directory's search already matches against)
  // plus a hash the directory scrolls to on load (see ResourceDirectory's
  // hash-scroll effect).
  async function handleCopyLink() {
    const url = `${SITE_URL}/resources?q=${encodeURIComponent(resource.name)}#${resourceId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackEvent("resource_result_click", { resource: resource.name, action: "copy_link" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — no-op.
    }
  }

  return (
    <div
      data-resource-id={resourceId}
      className="flex flex-col rounded-sm border border-ink/10 bg-off-white p-5 transition-colors duration-150 focus-within:border-bronze/50"
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

      <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-charcoal-light">
        {resource.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {resource.audienceTags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-ink/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-charcoal-light"
          >
            {tag}
          </span>
        ))}
        {resource.audienceTags.length > 3 && (
          <span className="px-1 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-charcoal-light">
            +{resource.audienceTags.length - 3} more
          </span>
        )}
      </div>

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
          <div className={cn("grid transition-[grid-template-rows,opacity] duration-300", expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
            <div id={`${resourceId}-details`} className="overflow-hidden">
            <div className="mt-2 space-y-1.5 text-xs leading-relaxed text-charcoal-light">
              {isLongDescription && <p>{resource.description}</p>}
              {categoryLabel && <p><span className="font-semibold text-ink">Category:</span> {categoryLabel}</p>}
              {resource.availability && <p><span className="font-semibold text-ink">Availability:</span> {resource.availability}</p>}
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
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink/10 pt-3">
        <div className="text-xs text-charcoal-light">
          <span className="font-semibold text-ink">{resource.cost}</span>
          <span className="mx-1.5 text-ink/20">·</span>
          {resource.geographicScope}
          {resource.verifiedDate && (
            <>
              <span className="mx-1.5 text-ink/20">·</span>
              <span title={`Last reviewed ${resource.verifiedDate}`}>
                Reviewed {formatVerifiedMonth(resource.verifiedDate)}
              </span>
            </>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label={copied ? "Link copied" : "Copy link to this resource"}
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
          >
            {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
          </button>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics-event="resource_outbound_click"
            className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
          >
            Visit
            <ExternalLink size={12} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
