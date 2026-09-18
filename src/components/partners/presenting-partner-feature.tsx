import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { CTAButton } from "@/components/shared/cta-button";
import type { MissionPartnerRow } from "@/types/database";

/**
 * Full-width, premium treatment for Presenting Partner tier — the most
 * visually dominant sponsorship level on the page. Deliberately distinct
 * from the grid cards other tiers use (see MissionPartnerCard): largest
 * logo, strongest border, generous spacing, and a subdued topo-map texture
 * (the same one CampaignPageHero uses) rather than a flat fill, so it reads
 * as the top of the mountain without turning into a gold-medal graphic.
 */
export function PresentingPartnerFeature({
  partner,
  secondaryLinkHref,
  secondaryLinkLabel,
}: {
  partner: MissionPartnerRow;
  /** Optional internal link to related campaign content (e.g. MBC's build story) — distinct from the partner's own website link below. */
  secondaryLinkHref?: string;
  secondaryLinkLabel?: string;
}) {
  const blurb = partner.description || partner.support_type;

  return (
    <div className="relative overflow-hidden rounded-sm border-2 border-bronze bg-ink text-off-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url(/topo-map.png)" }}
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-10 p-8 sm:p-14 md:flex-row md:items-center">
        <PartnerLogo
          name={partner.name}
          logoUrl={partner.logo_url}
          logoLightUrl={partner.logo_light_url}
          logoDarkUrl={partner.logo_dark_url}
          background="dark"
          className="h-44 w-full shrink-0 md:w-80"
        />

        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">Presenting Partner</p>
          <h3 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-off-white sm:text-4xl">
            {partner.name}
          </h3>

          {partner.designation && (
            <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-off-white/80">
              {partner.designation}
            </p>
          )}

          {blurb && <p className="mt-4 max-w-xl text-base leading-relaxed text-off-white/80">{blurb}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            {partner.website_url && (
              <Link
                href={partner.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-bronze-light hover:text-bronze focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-light"
              >
                Visit {partner.name}
                <ExternalLink size={14} aria-hidden />
              </Link>
            )}

            {secondaryLinkHref && secondaryLinkLabel && (
              <Link
                href={secondaryLinkHref}
                className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-off-white/70 hover:text-off-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-off-white/70"
              >
                {secondaryLinkLabel} &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Tasteful empty state for the Presenting Partner slot when no organization
 * has reached that level yet — a placeholder that reads as an open
 * opportunity, not a broken/missing section. Shares the same footprint and
 * texture as the filled version so the page's visual rhythm doesn't shift
 * once a real Presenting Partner is confirmed.
 */
export function PresentingPartnerPlaceholder() {
  return (
    <div className="relative overflow-hidden rounded-sm border-2 border-dashed border-bronze/50 bg-ink/95 text-off-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url(/topo-map.png)" }}
        aria-hidden="true"
      />
      <div className="relative flex flex-col items-center gap-4 p-10 text-center sm:p-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">Presenting Partner</p>
        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-off-white sm:text-3xl">
          Presenting Partner Opportunity Available
        </h3>
        <p className="max-w-lg text-sm leading-relaxed text-off-white/70">
          The campaign&apos;s top recognition level — including logo placement on Cody&apos;s race kit for IRONMAN
          70.3 Chattanooga — is still open.
        </p>
        <CTAButton href="/contact?item=Campaign%20Partnership" tone="dark" className="mt-2">
          Inquire About This Level
        </CTAButton>
      </div>
    </div>
  );
}
