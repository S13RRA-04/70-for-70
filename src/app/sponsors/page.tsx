import Link from "next/link";
import { getMissionPartners, isCampaignPartner } from "@/lib/data/mission-partners";
import { getCurrentEventConfig } from "@/lib/data/event-config";
import { getGiveawayPrizes } from "@/lib/data/giveaway-prizes";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { MissionPartnerCard } from "@/components/partners/mission-partner-card";
import { SponsorSection } from "@/components/partners/sponsor-section";
import { PresentingPartnerFeature, PresentingPartnerPlaceholder } from "@/components/partners/presenting-partner-feature";
import { TeamBenefitPartnerFeature } from "@/components/partners/team-benefit-partner-feature";
import { PartnershipStoryBreak } from "@/components/sponsors/partnership-story-break";
import { EventGiveawaySection } from "@/components/22-for-the-22/event-giveaway-section";
import { CTAButton } from "@/components/shared/cta-button";
import { EmptyState } from "@/components/shared/empty-state";
import { CAMPAIGN_NAME, CAMPAIGN_URL, EVENT22_CAMPAIGN_URL, MISSION_PARTNER_TIERS } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, CAMPAIGN_HOME_CRUMB, jsonLdScriptProps } from "@/lib/json-ld";
import { RevealGrid } from "@/components/shared/reveal-on-scroll";
import type { MissionPartnerRow, PartnerType } from "@/types/database";

export const metadata = pageMetadata({
  title: "Partners & Supporters",
  description: "Organizations and brands supporting Tri For The 22 through gear, resources, fundraising, and outreach.",
  canonical: `${CAMPAIGN_URL}/sponsors`,
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([CAMPAIGN_HOME_CRUMB, { name: "Sponsors", url: `${CAMPAIGN_URL}/sponsors` }]);

/**
 * Support TYPE, not sponsorship RANK — shown as a small category chip on
 * untiered "Campaign Partners & Services" cards only (see MissionPartnerCard).
 * Deliberately doesn't cover every PartnerType: campaign-sponsor and
 * team-benefit-partner have their own dedicated presentation elsewhere and
 * don't need a redundant category chip too.
 */
const PARTNER_TYPE_CATEGORY_LABEL: Partial<Record<PartnerType, string>> = {
  "gear-partner": "Gear",
  "service-partner": "Service",
  "print-partner": "Printing",
  "training-partner": "Training",
  "accommodations-partner": "Lodging",
};

const TIERED_ORDER = MISSION_PARTNER_TIERS.filter((tier) => tier.id !== "presenting-partner").map((tier) => tier.id);
const PRESENTING_PARTNER_TIER = MISSION_PARTNER_TIERS.find((tier) => tier.id === "presenting-partner")!;

/** MBC's role designation also earns it a link to the campaign's build story — see PresentingPartnerFeature's secondaryLink props. */
const OFFICIAL_BICYCLE_SUPPORT_DESIGNATION = "Official Bicycle Support Partner";

/**
 * Partners & Supporters — gear/resource/monetary mission partners
 * (mission_partners table), ranked by formal recognition tier (see
 * MISSION_PARTNER_TIERS in src/lib/constants.ts) so visual prominence
 * (section spacing, card size/border, logo scale) decreases as the page
 * moves downward — see src/lib/tier-theme.ts for the per-tier config that
 * drives it. Split out from the former /partners page so it gets its own
 * page distinct from the nonprofit beneficiaries (see
 * src/app/beneficiaries/page.tsx). Tiers reflect the cumulative
 * fair-market value of cash + in-kind support a partner has provided, not
 * cash alone. This page is recognition-only — prospective-sponsor sales
 * material (value props, the tier progression ladder, in-kind categories,
 * current gear needs) lives on /become-a-partner instead, so confirmed
 * partners never have to scroll through a pitch to find their own listing.
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
 * A partner's sponsorship TIER and campaign ROLE (e.g. Montgomery Bicycle
 * Club's "Official Bicycle Support Partner") are independent concepts —
 * role designations render as a small badge on whatever card the partner
 * already has, never as their own separate tier/section (see
 * PartnerRoleBadge and MissionPartnerRow.designation's doc comment).
 *
 * Section order: tier hierarchy → untiered campaign partners → a
 * team-benefit spotlight → the 22 For the 22 giveaway → a closing story
 * break → final CTA (which points to /become-a-partner for anyone wanting
 * to join this list, not a sales pitch on this page itself).
 */
export default async function SponsorsPage() {
  const [partners, currentEvent] = await Promise.all([getMissionPartners(), getCurrentEventConfig()]);
  const giveawayPrizes = currentEvent ? await getGiveawayPrizes(currentEvent.id) : [];
  const generalPartners = partners.filter(isCampaignPartner);

  const presentingPartners = generalPartners.filter((p) => p.tier === "presenting-partner");
  const teamBenefitPartner = generalPartners.find((p) => p.partner_type === "team-benefit-partner");

  const tieredPartners: Record<string, MissionPartnerRow[]> = {};
  for (const tierId of TIERED_ORDER) {
    tieredPartners[tierId] = generalPartners.filter((p) => p.tier === tierId);
  }

  // Everyone without a formal dollar/FMV tier yet — gear, service, print, training,
  // and lodging partners, functional-role partners like MBC, and team-benefit
  // partners like XTERRA (which also gets its own spotlight section below).
  const campaignPartnersAndServices = generalPartners.filter((p) => !p.tier);

  const hasAnyCurrentPartners = generalPartners.length > 0;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          eyebrow="Campaign Partners"
          title="Partners in the Mission"
          description={`${CAMPAIGN_NAME} is being built with the help of businesses, organizations, and communities contributing equipment, services, expertise, and financial support on the road to IRONMAN 70.3 Chattanooga.`}
        />
      </CampaignPageHero>

      {!hasAnyCurrentPartners ? (
        <section className="py-16 sm:py-20">
          <Container>
            <EmptyState
              title="Partners will be listed here soon."
              description="Confirmed campaign partners will appear on this page as relationships are finalized."
            />
          </Container>
        </section>
      ) : (
        <>
          {/* Presenting Partner — the most visually dominant level, or a tasteful "open" placeholder. */}
          <section className="border-b border-ink/10 bg-ink py-16 sm:py-20">
            <Container>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-off-white sm:text-4xl">
                  {PRESENTING_PARTNER_TIER.name}
                </h2>
                <p className="text-sm text-off-white/60">
                  {PRESENTING_PARTNER_TIER.range} in qualifying campaign support
                </p>
              </div>

              <div className="mt-6">
                {presentingPartners.length > 0 ? (
                  <div className="space-y-8">
                    {presentingPartners.map((partner) => (
                      <PresentingPartnerFeature
                        key={partner.id}
                        partner={partner}
                        secondaryLinkHref={
                          partner.designation === OFFICIAL_BICYCLE_SUPPORT_DESIGNATION
                            ? "/journal/building-the-bike"
                            : undefined
                        }
                        secondaryLinkLabel={
                          partner.designation === OFFICIAL_BICYCLE_SUPPORT_DESIGNATION
                            ? "See the Bike Build"
                            : undefined
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <PresentingPartnerPlaceholder />
                )}
              </div>
            </Container>
          </section>

          {/* Campaign Partner → Supporting Partner → In-Kind Partner → Community Partner → Campaign Supporter, decreasing prominence. */}
          {TIERED_ORDER.map((tierId) => (
            <SponsorSection
              key={tierId}
              tier={tierId as Exclude<(typeof TIERED_ORDER)[number], "presenting-partner">}
              partners={tieredPartners[tierId]}
            />
          ))}

          {/* Campaign Partners & Services — support that doesn't fit the dollar/FMV tier hierarchy. */}
          {campaignPartnersAndServices.length > 0 && (
            <section className="border-t border-ink/10 bg-sand-light/50 py-12 sm:py-14">
              <Container>
                <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink">
                  Campaign Partners &amp; Services
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-charcoal-light">
                  Organizations standing with the mission through gear, services, and expertise — contributions
                  that move the campaign forward just as much as the formal tiers above, outside a dollar figure.
                </p>
                <RevealGrid step={45}>
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {campaignPartnersAndServices.map((partner) => (
                      <MissionPartnerCard
                        key={partner.id}
                        partner={partner}
                        categoryLabel={
                          partner.partner_type ? PARTNER_TYPE_CATEGORY_LABEL[partner.partner_type] : undefined
                        }
                      />
                    ))}
                  </div>
                </RevealGrid>
              </Container>
            </section>
          )}

        </>
      )}

      {/* Team benefit partnership — a discount/pricing arrangement for approved team members, not a monetary tier. */}
      {teamBenefitPartner && (
        <section className="border-b border-ink/10 py-16 sm:py-20">
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
        <section className="border-b border-ink/10 bg-sand-light">
          <EventGiveawaySection prizes={giveawayPrizes} partners={partners} />
          <Container className="pb-16">
            <CTAButton href={EVENT22_CAMPAIGN_URL}>See the Full 22 For the 22 Event Page</CTAButton>
          </Container>
        </section>
      )}

      <PartnershipStoryBreak />

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
            <CTAButton href="/become-a-partner" tone="dark">
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
            <Link href="/beneficiaries" className="font-semibold text-bronze hover:text-bronze-dark">
              See Beneficiaries &rarr;
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
