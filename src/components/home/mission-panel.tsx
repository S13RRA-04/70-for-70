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
        "flex h-full flex-col border",
        featured
          ? "border-bronze/30 bg-ink p-8 text-off-white sm:p-10 lg:p-14"
          : "border-ink/10 bg-off-white p-6 sm:p-7",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "font-display font-semibold",
          featured ? "text-lg text-bronze-light" : "text-sm text-bronze",
        )}
      >
        {number}
      </span>
      <h3
        className={cn(
          "font-display font-bold uppercase tracking-tight",
          featured ? "mt-5 text-4xl sm:text-6xl" : "mt-3 text-xl sm:text-2xl",
          featured ? "text-off-white" : "text-ink",
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "flex-1 leading-relaxed",
          featured
            ? "mt-6 max-w-md text-base text-off-white/75 sm:text-lg"
            : "mt-3 text-sm text-charcoal-light",
        )}
      >
        {description}
      </p>
      <CTAButton
        href={ctaHref}
        variant="ghost"
        tone={featured ? "dark" : "light"}
        size={featured ? "lg" : "md"}
        className={cn("self-start px-0 py-0", featured ? "mt-8" : "mt-5")}
      >
        {ctaLabel}
      </CTAButton>
    </div>
  );
}
