import Image from "next/image";
import Link from "next/link";
import { Award } from "lucide-react";
import type { InstitutionalRecognition as Recognition } from "@/lib/content/recognitions";
import { cn } from "@/lib/utils";

type Variant = "feature" | "listing" | "callout" | "inline";

/**
 * The one visual system for grants, official selections, memberships, and
 * awards (data in src/lib/content/recognitions.ts) — deliberately distinct
 * from PartnerLogo/PartnerLogoWall so a grantor never reads as one more
 * sponsor tile.
 *
 * - `feature` — dark band treatment for a campaign homepage.
 * - `listing` — a row above a partner logo wall, under its own label.
 * - `callout` — a quiet left-ruled note inside a content page; pass
 *   `title`/`body` to say what the recognition means in that context.
 * - `inline` — a single line inside a card.
 *
 * The recognizing body's logo always sits on its own white plate, so its
 * brand colors stay contained instead of bleeding into the page palette.
 */
export function InstitutionalRecognition({
  recognition,
  variant = "feature",
  title,
  body,
  headingLevel = "h2",
  className,
}: {
  recognition: Recognition;
  variant?: Variant;
  /** Overrides the designation as the visible title (callout only — the designation still renders as the eyebrow). */
  title?: string;
  /** Overrides the description. */
  body?: string;
  /** Heading level for the designation in `feature`/`listing` — match the surrounding outline. */
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  const Heading = headingLevel;
  const description = body ?? recognition.description;

  if (variant === "inline") {
    return (
      <p className={cn("flex items-start gap-2 text-sm font-semibold leading-snug", className)}>
        <Award size={16} className="mt-0.5 shrink-0" aria-hidden />
        <span>{recognition.designation}</span>
      </p>
    );
  }

  if (variant === "callout") {
    return (
      <aside
        aria-label={`${recognition.organization} recognition`}
        className={cn("flex gap-4 border-l-2 border-bronze bg-off-white px-5 py-4", className)}
      >
        <Award size={20} className="mt-0.5 shrink-0 text-bronze" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-ink">{title ?? recognition.designation}</p>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-charcoal-light">{description}</p>
          <DetailsLink recognition={recognition} className="mt-2 text-xs text-bronze hover:text-bronze-dark" />
        </div>
      </aside>
    );
  }

  if (variant === "listing") {
    return (
      <div
        className={cn(
          "flex flex-col gap-5 rounded-sm border border-ink/15 bg-off-white p-5 sm:flex-row sm:items-center",
          className,
        )}
      >
        <LogoPlate recognition={recognition} className="h-20 w-28 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal-light">
            {recognition.organization} · {recognition.year}
          </p>
          <Heading className="mt-1 text-balance font-display text-xl uppercase leading-tight text-ink">
            {recognition.designation}
          </Heading>
          <DetailsLink recognition={recognition} className="mt-2 text-xs text-bronze hover:text-bronze-dark" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8", className)}>
      <LogoPlate recognition={recognition} className="h-24 w-32 sm:h-28 sm:w-36" />
      <div className="min-w-0 sm:border-l sm:border-off-white/20 sm:pl-8">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-bronze-light">
          <Award size={14} aria-hidden />
          Institutional Recognition
        </p>
        <Heading className="mt-2 text-balance font-display text-2xl uppercase leading-tight sm:text-3xl">
          {recognition.designation}
        </Heading>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-off-white/80">{description}</p>
        <DetailsLink
          recognition={recognition}
          className="mt-4 text-xs tracking-[0.2em] text-bronze-light hover:text-off-white"
        />
      </div>
    </div>
  );
}

function LogoPlate({ recognition, className }: { recognition: Recognition; className?: string }) {
  if (!recognition.logo) return null;
  return (
    <div className={cn("flex items-center justify-center rounded-sm bg-white p-3 shadow-sm", className)}>
      <Image
        src={recognition.logo.src}
        alt={recognition.logo.alt}
        width={recognition.logo.width}
        height={recognition.logo.height}
        sizes="144px"
        className="h-full w-auto max-w-full object-contain"
      />
    </div>
  );
}

function DetailsLink({ recognition, className }: { recognition: Recognition; className?: string }) {
  const base = "inline-flex font-semibold uppercase tracking-wide";
  if (recognition.detailsHref) {
    return (
      <Link href={recognition.detailsHref} className={cn(base, className)}>
        Read the announcement &rarr;
      </Link>
    );
  }
  if (recognition.sourceUrl) {
    return (
      <a href={recognition.sourceUrl} className={cn(base, className)} target="_blank" rel="noopener noreferrer">
        About the program at {recognition.organization} &rarr;
      </a>
    );
  }
  return null;
}
