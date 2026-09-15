import Link from "next/link";
import { getMissionPartners } from "@/lib/data/mission-partners";
import { getCurrentEventConfig } from "@/lib/data/event-config";
import { getGiveawayPrizes } from "@/lib/data/giveaway-prizes";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { MissionPartnerCard, type MissionPartnerCardSize } from "@/components/partners/mission-partner-card";
import { CurrentGearNeeds } from "@/components/sponsors/current-gear-needs";
import { EventGiveawaySection } from "@/components/22-for-the-22/event-giveaway-section";
import { CTAButton } from "@/components/shared/cta-button";
import { EmptyState } from "@/components/shared/empty-state";
import { CAMPAIGN_NAME, CAMPAIGN_URL, EVENT22_CAMPAIGN_URL, MISSION_PARTNER_TIERS } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import type { MissionPartnerTier } from "@/types/database";

export const metadata = pageMetadata({
  title: "Partners & Supporters",
  description: "Organizations and brands supporting Tri For The 22 through gear, resources, fundraising, and outreach.",
  canonical: `${CAMPAIGN_URL}/sponsors`,
});

/** Card size per tier — see the visual-hierarchy spec on MissionPartnerCardSize. */
const TIER_CARD_SIZE: Record<MissionPartnerTier, MissionPartnerCardSize> = {
  "presenting-partner": "large",
  "mission-sponsor": "large",
  "mission-partner": "medium",
  advocate: "medium",
  ally: "compact",
  "campaign-supporter": "compact",
};

const GRID_COLS: Record<MissionPartnerCardSize, string> = {
  large: "sm:grid-cols-2",
  medium: "sm:grid-cols-2 lg:grid-cols-3",
  compact: "sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
};

/**
 * Partners & Supporters — gear/resource/monetary mission partners
 * (mission_partners table), grouped by formal recognition tier (see
 * MISSION_PARTNER_TIERS in src/lib/constants.ts), plus the current
 * gear/support wishlist — split out from the former /partners page so
 * they get their own page distinct from the nonprofit beneficiaries (see
 * src/app/beneficiaries/page.tsx). Tiers reflect the cumulative
 * fair-market value of cash + in-kind support a partner has provided, not
 * cash alone (see the "Support the Campaign" section below).
 *
 * Distinct from the separate, still-dormant dollar-application pipeline
 * (public.sponsors table, SponsorWall, sponsorship_requests, /admin/sponsorships,
 * /sponsors/request) — that's a formal cash-intake-and-vetting workflow
 * this page does not use; mission_partners.tier is a lighter-weight
 * recognition classification, not that pipeline reactivated.
 *
 * The 22 For the 22 giveaway (a free, no-purchase-necessary drawing — this
 * campaign cannot legally run a raffle) lives on its own subdomain
 * (22.forthe22.org), not here; this page keeps only a teaser link into the
 * giveaway section below.
 *
 * Section order is deliberate — partner logos first (previously buried
 * below a large gear-needs table), then the needs list, then the
 * partnership-level pitch for prospective partners, then disclosures.
 */
export default async function SponsorsPage() {
  const [partners, currentEvent] = await Promise.all([getMissionPartners(), getCurrentEventConfig()]);
  const giveawayPrizes = currentEvent ? await getGiveawayPrizes(currentEvent.id) : [];
  const generalPartners = partners.filter((p) => p.partner_type !== "giveaway-supporter");

  const tieredGroups = MISSION_PARTNER_TIERS.map((tier) => ({
    tier,
    partners: generalPartners.filter((p) => p.tier === tier.id),
  })).filter((group) => group.partners.length > 0);

  const officialPartners = generalPartners.filter((p) => !p.tier && p.designation);
  const additionalPartners = generalPartners.filter((p) => !p.tier && !p.designation);

  return (
    <>
      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          title="Partners & Supporters"
          description={`The organizations and brands helping move ${CAMPAIGN_NAME} forward — from training and equipment support to fundraising and community outreach.`}
        />
      </CampaignPageHero>

      <section className="py-16 sm:py-20">
        <Container>
          {generalPartners.length === 0 ? (
            <EmptyState
              title="Partners will be listed here soon."
              description="Confirmed campaign partners will appear on this page as relationships are finalized."
            />
          ) : (
            <div className="space-y-12">
              {tieredGroups.map(({ tier, partners: tierPartners }) => {
                const size = TIER_CARD_SIZE[tier.id];
                return (
                  <div key={tier.id}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-bronze">{tier.name}</p>
                    <div className={`mt-4 grid gap-6 ${GRID_COLS[size]}`}>
                      {tierPartners.map((partner) => (
                        <MissionPartnerCard key={partner.id} partner={partner} size={size} />
                      ))}
                    </div>
                  </div>
                );
              })}

              {officialPartners.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-bronze">Official Partners</p>
                  <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {officialPartners.map((partner) => (
                      <MissionPartnerCard key={partner.id} partner={partner} size="medium" />
                    ))}
                  </div>
                </div>
              )}

              {additionalPartners.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
                    Additional Campaign Partners
                  </p>
                  <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {additionalPartners.map((partner) => (
                      <MissionPartnerCard key={partner.id} partner={partner} size="medium" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Container>
      </section>

      {currentEvent && (
        <section className="border-b border-ink/10 bg-sand-light">
          <EventGiveawaySection prizes={giveawayPrizes} partners={partners} />
          <Container className="pb-16">
            <CTAButton href={EVENT22_CAMPAIGN_URL}>See the Full 22 For the 22 Event Page</CTAButton>
          </Container>
        </section>
      )}

      <section className="border-b border-ink/10 py-12">
        <Container>
          <CurrentGearNeeds />
        </Container>
      </section>

      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Support the Campaign"
            title="Become a Tri For the 22 Partner"
            description="Tri For the 22 is being built with the help of businesses and organizations providing equipment, services, expertise, and financial support. Partnership opportunities recognize the organizations helping get the campaign to the starting line while keeping fundraising for the beneficiary organizations separate."
          />

          <div className="mt-10 space-y-6">
            {MISSION_PARTNER_TIERS.map((tier, i) => (
              <div
                key={tier.id}
                className={`rounded-sm border p-6 ${
                  i === 0 ? "border-bronze/40 bg-bronze/5" : "border-ink/10 bg-off-white"
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p
                    className={`font-display font-bold uppercase tracking-wide text-ink ${
                      i === 0 ? "text-2xl" : "text-lg"
                    }`}
                  >
                    {tier.name}
                  </p>
                  <p className="text-sm font-semibold uppercase tracking-wide text-bronze">{tier.range}</p>
                </div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-charcoal-light">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
                {"note" in tier && tier.note && (
                  <p className="mt-3 text-xs leading-relaxed text-charcoal-light/80">{tier.note}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-3 text-sm leading-relaxed text-charcoal-light">
            <p>
              Support doesn&apos;t have to come in the form of a check. Tri For the 22 recognizes qualifying
              contributions of equipment, products, printing, professional services, and other campaign needs
              toward partnership levels based on their fair-market value.
            </p>
            <p>Partnership levels may reflect the cumulative value of qualifying support provided during the campaign.</p>
          </div>

          <div className="mt-10 rounded-sm border border-ink/10 bg-sand-light p-8 text-center">
            <p className="font-display text-2xl font-bold uppercase tracking-tight text-ink">Join the Mission</p>
            <p className="mt-2 text-sm text-charcoal-light">
              Have equipment, services, expertise, or resources that could help move Tri For the 22 toward
              Chattanooga? Let&apos;s talk.
            </p>
            <CTAButton href="/contact?item=Campaign%20Partnership" className="mt-6">
              Become a Partner
            </CTAButton>
          </div>
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-sand-light py-10">
        <Container>
          <p className="max-w-2xl text-sm text-charcoal-light">
            Inclusion on this page reflects a confirmed support relationship. It does not mean an
            organization operates, endorses, or is responsible for this site&apos;s content, and
            does not imply endorsement by any employer, government agency, or other third party
            unless explicitly stated.
          </p>
          <p className="mt-4 max-w-2xl text-sm text-charcoal-light">
            Looking for who the campaign raises money for, not who supports it?{" "}
            <Link href="/beneficiaries" className="font-semibold text-bronze hover:text-bronze-light">
              See Beneficiaries &rarr;
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
