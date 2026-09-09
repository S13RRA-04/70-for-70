import Link from "next/link";
import { getMissionPartners } from "@/lib/data/mission-partners";
import { getRaffleItems } from "@/lib/data/raffle-items";
import { getCurrentEventConfig } from "@/lib/data/event-config";
import { getGiveawayPrizes } from "@/lib/data/giveaway-prizes";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { MissionPartnerCard } from "@/components/partners/mission-partner-card";
import { CurrentGearNeeds } from "@/components/sponsors/current-gear-needs";
import { FundraiserRaffleSection } from "@/components/sponsors/fundraiser-raffle-section";
import { EventGiveawaySection } from "@/components/22-for-the-22/event-giveaway-section";
import { CTAButton } from "@/components/shared/cta-button";
import { EmptyState } from "@/components/shared/empty-state";
import { CAMPAIGN_NAME, CAMPAIGN_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Partners & Supporters",
  description: "Organizations and brands supporting Tri For The 22 through gear, resources, fundraising, and outreach.",
  canonical: `${CAMPAIGN_URL}/sponsors`,
});

/**
 * Partners & Supporters — gear/resource partners (e.g. ISM Saddles,
 * Zealios), the Fundraiser Raffle's confirmed donors, and the current
 * gear/support wishlist, split out from the former /partners page so they
 * get their own page distinct from the nonprofit beneficiaries (see
 * src/app/beneficiaries/page.tsx). Distinct from the paid dollar-tier
 * sponsorship program (SPONSORSHIP_LEVELS in src/lib/constants.ts, request
 * form at /sponsors/request), which remains retired pending written
 * federal ethics approval.
 *
 * Section order is deliberate — partner logos first (previously buried
 * below a large gear-needs table), then the raffle, then the needs list,
 * then a general "become a supporter" path, then disclosures.
 */
export default async function SponsorsPage() {
  const [partners, raffleItems, currentEvent] = await Promise.all([
    getMissionPartners(),
    getRaffleItems(),
    getCurrentEventConfig(),
  ]);
  const giveawayPrizes = currentEvent ? await getGiveawayPrizes(currentEvent.id) : [];
  const generalPartners = partners.filter(
    (p) => p.partner_type !== "raffle-supporter" && p.partner_type !== "giveaway-supporter",
  );

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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {generalPartners.map((partner) => (
                <MissionPartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <FundraiserRaffleSection partners={partners} raffleItems={raffleItems} />

      {currentEvent && (
        <section className="border-b border-ink/10 bg-sand-light">
          <EventGiveawaySection prizes={giveawayPrizes} partners={partners} />
          <Container className="pb-16">
            <CTAButton href="/22forthe22">See the Full 22 For the 22 Event Page</CTAButton>
          </Container>
        </section>
      )}

      <section className="border-b border-ink/10 py-12">
        <Container>
          <CurrentGearNeeds />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl text-center">
          <SectionHeading
            align="center"
            eyebrow="Get Involved"
            title="Become a Supporter"
            description="Gear, services, promotion, or a raffle item — if your organization wants to back the mission, we'd like to hear from you."
          />
          <CTAButton href="/contact" className="mt-6">
            Get in Touch
          </CTAButton>
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
