import { cn } from "@/lib/utils";
import { MARK_COLORS } from "@/lib/ring-colors";

/**
 * The signature stripe — the mark's three ring colors (Ranger Green, Blue,
 * Muted Gold) in ring order, equal weight. None of them is navy, so it reads
 * the same on paper and on navy.
 */
const STRIPE = MARK_COLORS.map((c) => ({ hex: c.hex, flex: 1 }));

/**
 * For The 22: Live's stripe — the seven ring colors of the Live badge
 * (public/brand/live/badge.webp), not the org mark's three. No navy segment,
 * so it reads the same on paper and on jet.
 */
const LIVE_STRIPE = [
  { hex: "#4B5521", flex: 3 },
  { hex: "#D3202A", flex: 2 },
  { hex: "#17447F", flex: 3 },
  { hex: "#F5D000", flex: 2 },
  { hex: "#17734A", flex: 2 },
  { hex: "#1E78C8", flex: 3 },
  { hex: "#8C8C8C", flex: 2 },
] as const;

export function BrandStripe({
  className,
  variant = "org",
}: {
  className?: string;
  variant?: "org" | "live";
}) {
  const stripe = variant === "live" ? LIVE_STRIPE : STRIPE;
  return (
    <div aria-hidden="true" className={cn("flex h-[5px] gap-[3px]", className)}>
      {stripe.map((segment, i) => (
        <span
          key={i}
          style={{ flex: segment.flex, background: segment.hex }}
        />
      ))}
    </div>
  );
}
