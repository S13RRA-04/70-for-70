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
   * Primary-variant fill color. "bronze" is the legacy name for the default
   * (navy, or olive on Ruck — see --property-action). "black" is the jet
   * remembrance fill. "emergency" is
   * reserved for crisis CTAs ("Need Help Now") only — a fixed solid fill
   * regardless of `tone`, so it reads the same reserved way everywhere it
   * appears. Not meant to be applied retroactively across the site in one
   * pass.
   */
  accent?: "bronze" | "black" | "emergency";
  /** Renders a plain <a> instead of next/link — for cross-domain links (see CAMPAIGN_HOME_LINK) where client-side routing doesn't apply. */
  external?: boolean;
  /** Opens in a new tab with rel="noopener noreferrer" — for genuinely third-party destinations (e.g. an external auction/ticketing platform), distinct from `external`'s same-tab cross-subdomain nav. Requires `external`. */
  newTab?: boolean;
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
  /** Forwarded onto the rendered <a> — see AnalyticsEventListener, which reads this attribute off any link/button site-wide. */
  "data-analytics-event"?: string;
}

const SIZE_CLASSES = {
  md: "px-5 text-[15px]",
  lg: "min-h-[50px] px-6 text-base",
} as const;

export function CTAButton({
  href,
  children,
  variant = "primary",
  tone = "light",
  size = "md",
  accent = "bronze",
  external = false,
  newTab = false,
  magnetic = false,
  className,
  "aria-current": ariaCurrent,
  "data-analytics-event": analyticsEvent,
}: CTAButtonProps) {
  const classes = cn(
    "action-control inline-flex items-center justify-center gap-2 font-bold",
    SIZE_CLASSES[size],
    variant === "primary" &&
      (accent === "emergency"
        ? "bg-signal text-white hover:bg-signal-dark"
        : accent === "black"
          ? "bg-jet text-white hover:bg-navy"
          : tone === "dark"
            ? "bg-white text-navy hover:bg-paper"
            : "property-button-primary"),
    variant === "secondary" &&
      (tone === "dark"
        ? "border-2 border-white text-white hover:bg-white/10"
        : "border-2 border-navy bg-white/60 text-navy hover:bg-white"),
    variant === "ghost" &&
      (tone === "dark"
        ? "text-white/75 hover:text-white"
        : "text-navy hover:text-help"),
    ariaCurrent && "ring-2 ring-offset-2 ring-navy/40",
    className,
  );

  const button = external ? (
    <a
      href={href}
      className={classes}
      aria-current={ariaCurrent}
      data-analytics-event={analyticsEvent}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      <ExternalLink size={14} aria-hidden="true" />
    </a>
  ) : (
    <Link href={href} className={classes} aria-current={ariaCurrent} data-analytics-event={analyticsEvent}>
      {children}
    </Link>
  );

  if (magnetic && variant === "primary") {
    return <Magnetic>{button}</Magnetic>;
  }
  return button;
}
