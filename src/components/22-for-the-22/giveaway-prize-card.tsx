import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { formatValueRange } from "@/components/sponsors/raffle-value";
import type { GiveawayPrizeRow, MissionPartnerRow } from "@/types/database";

/**
 * One giveaway prize card — structurally a clone of RaffleSupporterCard but
 * its own component, since this event's copy must say "giveaway," never
 * "raffle." `partner` is the donor's mission_partners row when one exists
 * (GiveawayPrizeRow.partner_id) — null is valid, a prize can be logged
 * before its donor has a full profile.
 */
export function GiveawayPrizeCard({ prize, partner }: { prize: GiveawayPrizeRow; partner: MissionPartnerRow | null }) {
  const displayName = partner?.name ?? prize.brand;

  return (
    <div className="flex flex-col rounded-sm border border-ink/10 bg-off-white p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center rounded-full bg-bronze px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-off-white">
          Confirmed Giveaway Supporter
        </span>
        {prize.featured && (
          <span className="inline-flex items-center rounded-full border border-bronze/40 bg-bronze/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-bronze">
            Featured Prize
          </span>
        )}
      </div>

      {partner ? (
        <PartnerLogo
          name={partner.name}
          logoUrl={partner.logo_url}
          logoLightUrl={partner.logo_light_url}
          logoDarkUrl={partner.logo_dark_url}
          background={partner.logo_background}
          className="mt-4 h-20 w-full"
        />
      ) : null}

      <h3 className="mt-4 font-display text-xl font-semibold uppercase tracking-wide text-ink">{displayName}</h3>

      <div className="mt-3 space-y-2 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">Prize</p>
          <p className="mt-0.5 text-ink">
            {prize.quantity > 1 ? `${prize.quantity}× ${prize.prize_name}` : prize.prize_name}
          </p>
        </div>
        {(prize.retail_value_min !== null || prize.retail_value_max !== null) && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">Retail Value</p>
            <p className="mt-0.5 text-ink">
              Approximately {formatValueRange(prize.retail_value_min ?? prize.retail_value_max ?? 0, prize.retail_value_max ?? prize.retail_value_min ?? 0)}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">Winner Count</p>
          <p className="mt-0.5 text-ink">{prize.winner_count}</p>
        </div>
        <p className={prize.status === "received" ? "font-medium text-olive" : "text-charcoal-light"}>
          {prize.status === "received" ? "✓ Prize Received" : "Confirmed — Awaiting Delivery"}
        </p>
      </div>

      {(prize.donor_note || partner?.description) && (
        <p className="mt-3 flex-1 text-sm text-charcoal-light">{prize.donor_note ?? partner?.description}</p>
      )}

      {(prize.website_url ?? partner?.website_url) && (
        <Link
          href={(prize.website_url ?? partner?.website_url)!}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
        >
          Visit {displayName} <ExternalLink size={13} aria-hidden />
        </Link>
      )}
    </div>
  );
}
