import Link from "next/link";
import { getMissionPartners } from "@/lib/data/mission-partners";
import { getCurrentEventConfig } from "@/lib/data/event-config";
import { getGiveawayPrizes } from "@/lib/data/giveaway-prizes";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { MissionPartnerCard, type MissionPartnerCardSize } from "@/components/partners/mission-partner-card";
import { PresentingPartnerFeature } from "@/components/partners/presenting-partner-feature";
import { OfficialDesignationFeature } from "@/components/partners/official-designation-feature";
import { TeamBenefitPartnerFeature } from "@/components/partners/team-benefit-partner-feature";
import { PartnershipStoryBreak } from "@/components/sponsors/partnership-story-break";
import { SponsorshipProgression } from "@/components/sponsors/sponsorship-progression";
import { DonateVsPartner } from "@/components/sponsors/donate-vs-partner";
import { CurrentGearNeeds } from "@/components/sponsors/current-gear-needs";
import { EventGiveawaySection } from "@/components/22-for-the-22/event-giveaway-section";
import { CTAButton } from "@/components/shared/cta-button";
import { EmptyState } from "@/components/shared/empty-state";
import { CAMPAIGN_NAME, CAMPAIGN_URL, EVENT22_CAMPAIGN_URL, MISSION_PARTNER_TIERS } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import type { MissionPartnerTier } from "@/types/database";

/** The one functional designation with its own featured treatment today — see spec section 6/19. */
const OFFICIAL_BICYCLE_SUPPORT_DESIGNATION = "Official Bicycle Support Partner";

export const metadata = pageMetadata({
  title: "Partners & Supporters",
  description: "Organizations and brands supporting Tri For The 22 through gear, resources, fundraising, and outreach.",
  canonical: `${CAMPAIGN_URL}/sponsors`,
});

/** Card size per tier — see the visual-hierarchy spec on MissionPartnerCardSize. Presenting Partner isn't in this grid at all — see PresentingPartnerFeature. */
const TIER_CARD_SIZE: Record<Exclude<MissionPartnerTier, "presenting-partner">, MissionPartnerCardSize> = {
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
 * cash alone (see the sponsorship-progression section below).
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
 * Section order establishes credibility before making an ask: current
 * partners and their functional recognition first (evidence of momentum),
 * then the recruitment pitch (aspiration), then the specific remaining
 * needs (a concrete, actionable opportunity), then disclosures. See the
 * redesign spec this order was built from for the full rationale.
 */
export default async function SponsorsPage() {
  const [partners, currentEvent] = await Promise.all([getMissionPartners(), getCurrentEventConfig()]);
  const giveawayPrizes = currentEvent ? await getGiveawayPrizes(currentEvent.id) : [];
  const generalPartners = partners.filter((p) => p.partner_type !== "giveaway-supporter");

  const presentingPartners = generalPartners.filter((p) => p.tier === "presenting-partner");
  const featuredDesignationPartner = generalPartners.find(
    (p) => p.designation === OFFICIAL_BICYCLE_SUPPORT_DESIGNATION,
  );
  const teamBenefitPartner = generalPartners.find((p) => p.partner_type === "team-benefit-partner");

  const tieredGroups = MISSION_PARTNER_TIERS.filter((tier) => tier.id !== "presenting-partner")
    .map((tier) => ({
      tier,
      partners: generalPartners.filter((p) => p.tier === tier.id),
    }))
    .filter((group) => group.partners.length > 0);

  const officialPartners = generalPartners.filter(
    (p) => !p.tier && p.designation && p.id !== featuredDesignationPartner?.id,
  );
  const additionalPartners = generalPartners.filter((p) => !p.tier && !p.designation);

  const hasAnyCurrentPartners = generalPartners.length > 0;

  return (
    <>
      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          eyebrow="Campaign Partners"
          title="Partners in the Mission"
          description={`${CAMPAIGN_NAME} is being built with the help of businesses, organizations, and communities contributing equipment, services, expertise, and financial support on the road to IRONMAN 70.3 Chattanooga.`}
        />
      </CampaignPageHero>

      {/* Current Partners — established first, before any recruitment pitch. */}
      <section className="py-16 sm:py-20">
        <Container>
          {!hasAnyCurrentPartners ? (
            <EmptyState
              title="Partners will be listed here soon."
              description="Confirmed campaign partners will appear on this page as relationships are finalized."
            />
          ) : (
            <div className="space-y-12">
              {presentingPartners.map((partner) => (
                <PresentingPartnerFeature key={partner.id} partner={partner} />
              ))}

              {tieredGroups.map(({ tier, partners: tierPartners }) => {
                const size = TIER_CARD_SIZE[tier.id as Exclude<MissionPartnerTier, "presenting-partner">];
                return (
                  <div key={tier.id}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-bronze">{tier.name}</p>
                    <div className={`mt-4 grid gap-6 ${GRID_COLS[size]}`}>
                      {tierPartners.map((partner) => (
                        <MissionPartnerCard
                          key={partner.id}
                          partner={partner}
                          size={size}
                          tier={tier.id as Exclude<MissionPartnerTier, "presenting-partner">}
                        />
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

      {/* Official functional partnership — e.g. Montgomery Bicycle Club's bike-build support. */}
      {featuredDesignationPartner && (
        <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
          <Container className="max-w-4xl">
            <OfficialDesignationFeature
              partner={featuredDesignationPartner}
              quote="Helping turn a donated frame into the race bike that will carry Tri For the 22 through Chattanooga."
              linkHref="/journal/building-the-bike"
              linkLabel="See the Bike Build"
            />
          </Container>
        </section>
      )}

      {/* Team benefit partnership — a discount/pricing arrangement for approved team members, not a monetary tier. */}
      {teamBenefitPartner && (
        <section className="border-t border-ink/10 py-16 sm:py-20">
          <Container className="max-w-4xl">
            <TeamBenefitPartnerFeature
              partner={teamBenefitPartner}
              categories={["Wetsuits", "Swim Shorts / Apparel", "Goggles", "Swim Gear & Accessories"]}
              benefitTitle="Team Equipment Benefit"
              benefitCopy="Approved Tri For the 22 team members have access to special XTERRA pricing. Qualifying purchases also generate equipment credit for Tri For the 22 that can be redeemed for training and race equipment."
              disclaimer="Product availability, pricing and team benefits are subject to change. Team pricing is available only to approved Tri For the 22 team members."
              ctaHref="/get-involved/triathlon-team#team-equipment-benefits"
              ctaLabel="Learn About Team Benefits"
            />
          </Container>
        </section>
      )}

      {currentEvent && (
        <section className="border-t border-ink/10 bg-sand-light">
          <EventGiveawaySection prizes={giveawayPrizes} partners={partners} />
          <Container className="pb-16">
            <CTAButton href={EVENT22_CAMPAIGN_URL}>See the Full 22 For the 22 Event Page</CTAButton>
          </Container>
        </section>
      )}

      {/* Visual/story break between current-partner recognition and the recruitment pitch below. */}
      <PartnershipStoryBreak />

      {/* Become a Partner — recruitment pitch starts here. */}
      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading
            align="center"
            eyebrow="Support the Campaign"
            title="Become a Tri For the 22 Partner"
            description="Tri For the 22 is being built with the help of businesses and organizations providing equipment, services, expertise, and financial support. Partnership opportunities recognize the organizations helping get the campaign to the starting line while keeping fundraising for the beneficiary organizations separate."
          />
        </Container>
      </section>

      <section className="border-b border-ink/10 py-4 sm:py-8">
        <Container>
          <SponsorshipProgression />

          <div className="mx-auto mt-10 max-w-3xl space-y-3 text-sm leading-relaxed text-charcoal-light">
            <p>
              Support doesn&apos;t have to come in the form of a check. Tri For the 22 recognizes qualifying
              contributions of equipment, products, printing, professional services, and other campaign needs
              toward partnership levels based on their fair-market value.
            </p>
            <p>Partnership levels may reflect the cumulative value of qualifying support provided during the campaign.</p>
          </div>
        </Container>
      </section>

      {/* Donate vs. Partner — kept explicit; sponsorship money is never routed to beneficiaries. */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-4xl">
          <DonateVsPartner />
        </Container>
      </section>

      {/* Current Gear & Support Needs — moved below the partner/partnership story, reframed as actionable opportunities. */}
      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Current Campaign Needs"
            title="Want to Help in a Specific Way?"
            description="These are the equipment, services, and resources still needed on the road to Chattanooga."
          />
          <div className="mt-8">
            <CurrentGearNeeds partners={generalPartners} />
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="border-b border-ink/10 bg-ink py-16 text-center sm:py-20">
        <Container className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">Support the Mission</p>
          <p className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-off-white sm:text-4xl">
            Join the Mission
          </p>
          <p className="mt-3 text-base text-off-white/80">
            Have equipment, services, expertise, or resources that can help move Tri For the 22 toward
            Chattanooga? Let&apos;s talk.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CTAButton href="/contact?item=Campaign%20Partnership" tone="dark">
              Become a Partner
            </CTAButton>
            <CTAButton href="/the-mission" variant="secondary" tone="dark">
              View the Mission
            </CTAButton>
          </div>
        </Container>
      </section>

      <section className="bg-sand-light py-10">
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
