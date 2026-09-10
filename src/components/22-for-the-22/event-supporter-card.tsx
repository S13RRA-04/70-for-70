import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PartnerLogo } from "@/components/shared/partner-logo";
import type { MissionPartnerRow } from "@/types/database";

/**
 * Distinguishes "Giveaway Supporter" (donated a giveaway prize) from
 * "Campaign Supporter" (backs the broader campaign) — never labeled
 * "sponsor" for a product donor, per the 22 For the 22 supporters spec.
 * Logo only renders when logo_permission is true — the general partner
 * grid elsewhere (MissionPartnerCard) doesn't gate on this field, but this
 * card was built specifically to respect it.
 */
export function EventSupporterCard({ partner }: { partner: MissionPartnerRow }) {
  const badge = partner.partner_type === "giveaway-supporter" ? "Giveaway Supporter" : "Campaign Supporter";

  return (
    <div className="flex flex-col rounded-sm border border-ink/10 bg-off-white p-6">
      {partner.logo_permission && (
        <PartnerLogo
          name={partner.name}
          logoUrl={partner.logo_url}
          logoLightUrl={partner.logo_light_url}
          logoDarkUrl={partner.logo_dark_url}
          background={partner.logo_background}
          className="h-20 w-full"
        />
      )}

      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-bronze">{badge}</p>
      <p className="mt-1 font-display text-lg font-semibold uppercase tracking-wide text-ink">{partner.name}</p>
      <p className="mt-2 text-sm text-charcoal-light">{partner.description}</p>

      {partner.website_url && (
        <Link
          href={partner.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
        >
          Visit Website
          <ExternalLink size={13} aria-hidden />
        </Link>
      )}
    </div>
  );
}
