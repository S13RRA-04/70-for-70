import { PartnerLogo } from "@/components/shared/partner-logo";
import { CTAButton } from "@/components/shared/cta-button";
import type { MissionPartnerRow } from "@/types/database";

/**
 * Featured treatment for a "team benefit" partner (see PartnerType) —
 * a discount/pricing arrangement for approved team members, not a
 * monetary sponsorship tier. Deliberately never renders a discount code
 * or a link that could auto-apply one: `ctaHref` should always point to an
 * internal page (the team page's benefits section, or the team-application
 * workflow), never a public shop URL.
 */
export function TeamBenefitPartnerFeature({
  partner,
  categories,
  benefitTitle,
  benefitCopy,
  disclaimer,
  ctaHref,
  ctaLabel,
}: {
  partner: MissionPartnerRow;
  categories: string[];
  benefitTitle: string;
  benefitCopy: string;
  disclaimer: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="overflow-hidden rounded-sm border border-bronze/40 bg-off-white">
      <div className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-start">
        <PartnerLogo
          name={partner.name}
          logoUrl={partner.logo_url}
          logoLightUrl={partner.logo_light_url}
          logoDarkUrl={partner.logo_dark_url}
          background={partner.logo_background}
          className="h-24 w-full shrink-0 md:w-56"
        />

        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze">
            {partner.relationship_label}
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
            {partner.name}
          </h3>

          {partner.description && (
            <p className="mt-4 max-w-xl text-base leading-relaxed text-charcoal-light">{partner.description}</p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-ink/15 bg-sand-light px-3 py-1 text-xs font-semibold uppercase tracking-wide text-charcoal-light"
              >
                {category}
              </span>
            ))}
          </div>

          <div className="mt-6 rounded-sm border border-bronze/30 bg-bronze/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-bronze">{benefitTitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-light">{benefitCopy}</p>
          </div>

          <CTAButton href={ctaHref} className="mt-6">
            {ctaLabel}
          </CTAButton>

          <p className="mt-5 max-w-xl text-xs leading-relaxed text-charcoal-light/70">{disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
