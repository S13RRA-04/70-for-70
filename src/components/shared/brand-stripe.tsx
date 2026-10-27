import { cn } from "@/lib/utils";

/**
 * The signature stripe — the only place every ring color appears together.
 * Segment order and weights match the brand mockup; don't reorder or use
 * these hues elsewhere as a set.
 */
const STRIPE = [
  { hex: "#4B5521", flex: 3 },
  { hex: "#C8162B", flex: 2 },
  { hex: "#121E3D", flex: 3 },
  { hex: "#F5D000", flex: 2 },
  { hex: "#17734A", flex: 2 },
  { hex: "#0A6AA6", flex: 3 },
  { hex: "#3A4F6B", flex: 2 },
  { hex: "#BDBDBD", flex: 2 },
  { hex: "#111111", flex: 2 },
] as const;

/**
 * For The 22: Live's stripe — the seven ring colors of the Live badge
 * (public/brand/live/badge.webp), not the org mark's nine. No navy segment,
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
  /** On a navy surface the navy segment would vanish — swap it for the ring's royal blue. */
  onNavy = false,
  variant = "org",
}: {
  className?: string;
  onNavy?: boolean;
  variant?: "org" | "live";
}) {
  const stripe = variant === "live" ? LIVE_STRIPE : STRIPE;
  return (
    <div aria-hidden="true" className={cn("flex h-[5px] gap-[3px]", className)}>
      {stripe.map((segment, i) => (
        <span
          key={i}
          style={{
            flex: segment.flex,
            background: onNavy && segment.hex === "#121E3D" ? "#0A2D85" : segment.hex,
          }}
        />
      ))}
    </div>
  );
}
