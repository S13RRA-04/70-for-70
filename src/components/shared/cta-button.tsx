import Link from "next/link";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/shared/magnetic";
import { ExternalLink } from "lucide-react";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  tone?: "dark" | "light";
  size?: "md" | "lg";
  /**
   * Primary-variant fill color. Defaults to "bronze" so every existing call
   * site is unaffected — "black" opts into the rebrand's anchor-black
   * accent and should only be used by components that have been migrated
   * to the new foundation (nav, footer, mobile menu). "emergency" is
   * reserved for crisis CTAs ("Need Help Now") only — a fixed solid fill
   * regardless of `tone`, so it reads the same reserved way everywhere it
   * appears. Not meant to be applied retroactively across the site in one
   * pass.
   */
  accent?: "bronze" | "black" | "emergency";
  /** Renders a plain <a> instead of next/link — for cross-domain links (see CAMPAIGN_HOME_LINK) where client-side routing doesn't apply. */
  external?: boolean;
  /**
   * Opt in to the magnetic hover (see src/components/shared/magnetic.tsx).
   * Intentionally off by default — the effect only reads as responsive on the
   * one or two highest-intent actions per page, and on a button repeated down
   * a column it reads as jitter. Primary variant only; ignored otherwise so a
   * call site can't accidentally get a magnetic ghost link.
   */
  magnetic?: boolean;
  className?: string;
  /** Set when this CTA's own href is the current page — e.g. the nav's CTA-treated "Find Resources"/"Need Help Now" links, which otherwise get none of the plain nav links' active-page styling. */
  "aria-current"?: "page";
}

const SIZE_CLASSES = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
} as const;

export function CTAButton({
  href,
  children,
  variant = "primary",
  tone = "light",
  size = "md",
  accent = "bronze",
  external = false,
  magnetic = false,
  className,
  "aria-current": ariaCurrent,
}: CTAButtonProps) {
  const classes = cn(
    "action-control inline-flex items-center gap-1.5 font-semibold uppercase tracking-wide",
    SIZE_CLASSES[size],
    variant === "primary" &&
      (accent === "emergency"
        ? "bg-signal text-off-white hover:bg-signal-dark"
        : accent === "black"
          ? "bg-anchor text-off-white hover:bg-anchor-light"
          : tone === "dark"
            ? "bg-bronze text-ink hover:bg-bronze-light"
            : "property-button-primary"),
    variant === "secondary" &&
      (tone === "dark"
        ? "border border-off-white/40 text-off-white hover:bg-off-white/10"
        : "border border-ink/20 text-ink hover:bg-ink/5"),
    variant === "ghost" &&
      (tone === "dark"
        ? "text-off-white/70 hover:text-off-white"
        : "text-ink/70 hover:text-ink"),
    ariaCurrent && "ring-2 ring-offset-2 ring-ink/40",
    className,
  );

  const button = external ? (
    <a href={href} className={classes} aria-current={ariaCurrent}>
      {children}
      <ExternalLink size={14} aria-hidden="true" />
    </a>
  ) : (
    <Link href={href} className={classes} aria-current={ariaCurrent}>
      {children}
    </Link>
  );

  if (magnetic && variant === "primary") {
    return <Magnetic>{button}</Magnetic>;
  }
  return button;
}
