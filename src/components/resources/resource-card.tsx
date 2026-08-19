import { ExternalLink } from "lucide-react";
import type { Resource } from "@/lib/content/resources";

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

export function ResourceCard({ resource }: { resource: Resource }) {
  const initial = resource.name.trim().charAt(0).toUpperCase();

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      data-analytics-event="resource_click"
      className="group flex flex-col rounded-sm border border-ink/10 bg-off-white p-5 transition-colors hover:border-bronze/40"
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

      <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-light">
        {resource.description}
      </p>

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

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink/10 pt-3">
        <div className="text-xs text-charcoal-light">
          <span className="font-semibold text-ink">{resource.cost}</span>
          <span className="mx-1.5 text-ink/20">·</span>
          {resource.geographicScope}
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-bronze group-hover:text-bronze-light">
          Visit
          <ExternalLink size={12} aria-hidden="true" />
        </span>
      </div>
    </a>
  );
}
