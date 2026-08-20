import Link from "next/link";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  tone?: "dark" | "light";
  size?: "md" | "lg";
  /** Renders a plain <a> instead of next/link — for cross-domain links (see CAMPAIGN_HOME_LINK) where client-side routing doesn't apply. */
  external?: boolean;
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
  external = false,
  className,
}: CTAButtonProps) {
  const classes = cn(
    "inline-flex items-center gap-1.5 rounded-sm font-semibold uppercase tracking-wide transition-colors",
    SIZE_CLASSES[size],
    variant === "primary" && "bg-bronze text-off-white hover:bg-bronze-light",
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

  if (external) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
