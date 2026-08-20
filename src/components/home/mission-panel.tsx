import { CTAButton } from "@/components/shared/cta-button";
import { cn } from "@/lib/utils";

interface MissionPanelProps {
  number: "01" | "02" | "03";
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  /** CONNECT is the primary functional mission — gets larger type/padding to read as dominant, not equal-weight with the other two. */
  featured?: boolean;
}

export function MissionPanel({
  number,
  title,
  description,
  ctaLabel,
  ctaHref,
  featured = false,
}: MissionPanelProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col border border-ink/10 bg-off-white",
        featured ? "p-8 sm:p-10 lg:p-12" : "p-6 sm:p-8",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("font-display font-semibold text-bronze", featured ? "text-base" : "text-sm")}
      >
        {number}
      </span>
      <h3
        className={cn(
          "font-display font-bold uppercase tracking-tight text-ink",
          featured ? "mt-4 text-3xl sm:text-5xl" : "mt-3 text-2xl sm:text-3xl",
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "flex-1 leading-relaxed text-charcoal-light",
          featured ? "mt-5 max-w-md text-base sm:text-lg" : "mt-3 text-sm",
        )}
      >
        {description}
      </p>
      <CTAButton
        href={ctaHref}
        variant="ghost"
        size={featured ? "lg" : "md"}
        className={cn("self-start px-0 py-0", featured ? "mt-7" : "mt-5")}
      >
        {ctaLabel}
      </CTAButton>
    </div>
  );
}
