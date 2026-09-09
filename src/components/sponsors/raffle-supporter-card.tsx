import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { formatValueRange } from "./raffle-value";
import type { MissionPartnerRow, RaffleItemRow } from "@/types/database";

/**
 * A confirmed raffle donor's own card — visually distinct from
 * MissionPartnerCard's generic sponsor grid (different badge, shows
 * contribution + retail value + item status) even though it's the same
 * underlying mission_partners row. Always shows "Raffle Supporter",
 * regardless of what relationship_label happens to say — see partner_type's
 * doc comment in schema.sql.
 */
export function RaffleSupporterCard({ partner, items }: { partner: MissionPartnerRow; items: RaffleItemRow[] }) {
  const totalMin = items.reduce((sum, i) => sum + (i.retail_value_min ?? i.retail_value_max ?? 0) * i.quantity, 0);
  const totalMax = items.reduce((sum, i) => sum + (i.retail_value_max ?? i.retail_value_min ?? 0) * i.quantity, 0);
  const allReceived = items.length > 0 && items.every((i) => i.status === "received");
  const isFeatured = items.some((i) => i.featured);

  return (
    <div className="flex flex-col rounded-sm border border-ink/10 bg-off-white p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center rounded-full bg-bronze px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-off-white">
          Confirmed Raffle Supporter
        </span>
        {isFeatured && (
          <span className="inline-flex items-center rounded-full border border-bronze/40 bg-bronze/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-bronze">
            Featured Prize
          </span>
        )}
      </div>

      <PartnerLogo
        name={partner.name}
        logoUrl={partner.logo_url}
        logoLightUrl={partner.logo_light_url}
        logoDarkUrl={partner.logo_dark_url}
        background={partner.logo_background}
        className="mt-4 h-20 w-full"
      />

      <h3 className="mt-4 font-display text-xl font-semibold uppercase tracking-wide text-ink">{partner.name}</h3>

      {items.length > 0 && (
        <div className="mt-3 space-y-2 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">Contribution</p>
            <p className="mt-0.5 text-ink">
              {items.map((i) => (i.quantity > 1 ? `${i.quantity}× ${i.item_name}` : i.item_name)).join("; ")}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">Retail Value</p>
            <p className="mt-0.5 text-ink">Approximately {formatValueRange(totalMin, totalMax)}</p>
          </div>
          <p className={allReceived ? "font-medium text-olive" : "text-charcoal-light"}>
            {allReceived ? "✓ Item Received" : "Confirmed — Awaiting Delivery"}
          </p>
        </div>
      )}

      <p className="mt-3 flex-1 text-sm text-charcoal-light">{partner.description}</p>

      {partner.website_url && (
        <Link
          href={partner.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
        >
          Visit {partner.name} <ExternalLink size={13} aria-hidden />
        </Link>
      )}
    </div>
  );
}
