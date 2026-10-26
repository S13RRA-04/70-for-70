import { cn } from "@/lib/utils";
import { MARK_COLORS } from "@/lib/ring-colors";

/**
 * The signature stripe — the mark's three ring colors (Ranger Green, Blue,
 * Muted Gold) in ring order, equal weight. Shared by every host, Live
 * included (its badge carries the same three-color ring). None of the colors
 * is navy, so it reads the same on paper, navy, and jet.
 */
const STRIPE = MARK_COLORS.map((c) => ({ hex: c.hex, flex: 1 }));

export function BrandStripe({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex h-[5px] gap-[3px]", className)}>
      {STRIPE.map((segment, i) => (
        <span key={i} style={{ flex: segment.flex, background: segment.hex }} />
      ))}
    </div>
  );
}
