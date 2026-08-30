import { formatCurrency } from "@/lib/utils";
import { DONOR_TIERS, type PublicSupporter } from "@/lib/donor-tiers";

/**
 * Public giving ladder for /donate — what each cumulative-giving level is
 * called and what it provides, plus (when there are any) the supporters
 * who've reached each level. Cumulative giving is tracked per donor across
 * both beneficiary organizations combined, from self-reported/verified
 * donations — see getPublicSupporterWall().
 */
export function GivingLevels({ supporters }: { supporters: PublicSupporter[] }) {
  const bySupporterTier = new Map<string, PublicSupporter[]>();
  for (const supporter of supporters) {
    const list = bySupporterTier.get(supporter.tier) ?? [];
    list.push(supporter);
    bySupporterTier.set(supporter.tier, list);
  }

  return (
    <div className="space-y-3">
      {[...DONOR_TIERS].reverse().map((tier) => {
        const tierSupporters = bySupporterTier.get(tier.name) ?? [];
        return (
          <div key={tier.name} className="rounded-sm border border-ink/10 bg-off-white p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="font-display text-sm font-semibold uppercase tracking-wide text-ink">{tier.name}</p>
              <p className="text-sm font-semibold tabular-nums text-bronze">{formatCurrency(tier.threshold)}+</p>
            </div>
            <p className="mt-1.5 text-sm text-charcoal-light">{tier.benefit}</p>
            {tierSupporters.length > 0 && (
              <p className="mt-3 text-sm text-ink">
                {tierSupporters.map((s) => s.display_name).join(", ")}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
