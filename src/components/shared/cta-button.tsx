import Link from "next/link";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/shared/magnetic";

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
   * to the new foundation (nav, footer, mobile menu). Not meant to be
   * applied retroactively across the site in one pass.
   */
  accent?: "bronze" | "black";
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
}: CTAButtonProps) {
  const classes = cn(
    "inline-flex items-center gap-1.5 rounded-sm font-semibold uppercase tracking-wide transition-colors",
    SIZE_CLASSES[size],
    variant === "primary" &&
      (accent === "black"
        ? "bg-anchor text-off-white hover:bg-anchor-light"
        : tone === "dark"
          ? "bg-bronze text-ink hover:bg-bronze-light"
          : "bg-bronze-text text-off-white hover:bg-bronze-dark"),
    variant === "secondary" &&
      (tone === "dark"
        ? "border border-off-white/40 text-off-white hover:bg-off-white/10"
        : "border border-ink/20 text-ink hover:bg-ink/5"),
    variant === "ghost" &&
      (tone === "dark"
        ? "text-off-white/70 hover:text-off-white"
        : "text-ink/70 hover:text-ink"),
    className,
  );

  const button = external ? (
    <a href={href} className={classes}>
      {children}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );

  if (magnetic && variant === "primary") {
    return <Magnetic>{button}</Magnetic>;
  }
  return button;
}
