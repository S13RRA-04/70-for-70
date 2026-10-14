import { PartnerLogo } from "@/components/shared/partner-logo";
import type { MissionPartnerRow } from "@/types/database";

/**
 * Featured treatment for an "athlete affiliation" partner (partner_type:
 * "athlete-affiliation" — a team/organization Cody personally represents,
 * e.g. Blue70 Racing), deliberately styled apart from MissionPartnerCard/
 * TeamBenefitPartnerFeature's bronze-bordered sponsor treatment: no tier
 * badge, no donate-adjacent framing, no "PROUDLY SPONSORED BY" language —
 * see mission-partners.ts's isCampaignPartner(), which keeps this partner
 * out of the general sponsor grid/count entirely. "Selected to represent"
 * is the whole pitch; this component should never imply Blue70 is a
 * financial campaign sponsor.
 */
export function AthleteAffiliationFeature({
  partner,
  ctaHref,
  ctaLabel,
}: {
  partner: MissionPartnerRow;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="overflow-hidden rounded-sm border border-ink/15 bg-sand-light">
      <div className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-start">
        <PartnerLogo
          name={partner.name}
          logoUrl={partner.logo_url}
          logoLightUrl={partner.logo_light_url}
          logoDarkUrl={partner.logo_dark_url}
          background={partner.logo_background}
          className="h-20 w-full shrink-0 md:w-48"
        />

        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal-light">Athlete Affiliation</p>
          <h3 className="mt-2 font-display text-2xl uppercase text-ink sm:text-3xl">
            Selected to {partner.name}
          </h3>
          {partner.designation && (
            <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-charcoal-light">
              {partner.designation}
            </p>
          )}

          {partner.description && (
            <p className="mt-4 max-w-xl text-base leading-relaxed text-charcoal-light">{partner.description}</p>
          )}

          <a
            href={ctaHref}
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
          >
            {ctaLabel} &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
