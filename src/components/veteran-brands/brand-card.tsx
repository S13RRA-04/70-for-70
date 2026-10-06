import { ExternalLink } from "lucide-react";
import { SERVICE_BRAND_CATEGORIES, type ServiceBrand } from "@/lib/content/veteran-brands";

/** Deterministic accent per card so the grid isn't monochrome — not tied to category, purely visual rhythm. Same technique as ResourceCard. */
const AVATAR_ACCENTS = [
  "bg-bronze/15 text-bronze",
  "bg-olive/15 text-olive",
  "bg-charcoal/10 text-charcoal-light",
] as const;

function accentForName(name: string): string {
  const sum = [...name].reduce((total, char) => total + char.charCodeAt(0), 0);
  return AVATAR_ACCENTS[sum % AVATAR_ACCENTS.length];
}

export function BrandCard({ brand }: { brand: ServiceBrand }) {
  const initial = brand.name.trim().charAt(0).toUpperCase();

  return (
    <a
      href={brand.url}
      target="_blank"
      rel="noopener noreferrer"
      data-analytics-event="veteran_brand_click"
      className="hover-lift group flex flex-col rounded-sm border border-ink/10 bg-off-white p-5 transition-colors hover:border-bronze/40"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-base font-semibold ${accentForName(brand.name)}`}
        >
          {initial}
        </span>
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold uppercase leading-tight tracking-wide text-ink">
            {brand.name}
          </p>
          <p className="mt-0.5 text-xs text-charcoal-light">{brand.product}</p>
        </div>
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-light">{brand.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {brand.categoryIds.map((id) => (
          <span
            key={id}
            className="rounded-full border border-ink/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-charcoal-light"
          >
            {SERVICE_BRAND_CATEGORIES.find((c) => c.id === id)?.label}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-end border-t border-ink/10 pt-3">
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-bronze group-hover:text-bronze-dark">
          Visit
          <ExternalLink size={12} aria-hidden="true" />
        </span>
      </div>
    </a>
  );
}
