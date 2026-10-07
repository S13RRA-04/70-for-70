import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { CTASection } from "@/components/shared/cta-section";
import { RevealGrid } from "@/components/shared/reveal-on-scroll";
import { MissionProgress } from "@/components/campaign/mission-progress";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { LIVE_CAMPAIGN_DESCRIPTION, LIVE_CAMPAIGN_TAGLINE, LIVE_CONTRIBUTION_METHODS } from "@/lib/content/live-campaign";
import { LIVE_AUCTION } from "@/lib/content/live-auction";
import { CAMPAIGN_URL, MISSION_NAME, SITE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: `For The 22: Live | ${LIVE_CAMPAIGN_TAGLINE}`,
  description: LIVE_CAMPAIGN_DESCRIPTION,
  canonical: "/campaigns/live",
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Campaigns", url: `${SITE_URL}/campaigns` },
  { name: "For The 22: Live", url: `${SITE_URL}/campaigns/live` },
]);

export default async function LiveCampaignPage() {
  const fundraisingStats = await getFundraisingImpactStats();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <section className="border-b border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading as="h1" tone="dark" eyebrow="For The 22: Live" title={LIVE_CAMPAIGN_TAGLINE} />
          <p className="mt-5 text-base leading-relaxed text-off-white/85">{LIVE_CAMPAIGN_DESCRIPTION}</p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-bronze-light">
            Contributes to {MISSION_NAME}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CTAButton href="/campaigns/live/events" tone="dark" magnetic>
              See Upcoming Shows
            </CTAButton>
            <CTAButton href={`${CAMPAIGN_URL}/donate`} external variant="secondary" tone="dark">
              Support the Mission
            </CTAButton>
            <CTAButton href="/70k" variant="secondary" tone="dark">
              Explore the Full $70K Mission
            </CTAButton>
            <CTAButton href="/campaigns/live/auction" variant="secondary" tone="dark">
              Silent Auction
            </CTAButton>
          </div>
        </Container>
      </section>

      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Online Silent Auction"
            title={LIVE_AUCTION.title}
            description={`Bidding opens ${LIVE_AUCTION.opensOn}. Winner announced ${LIVE_AUCTION.winnerAnnouncement}.`}
          />
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-charcoal-light">
            {LIVE_AUCTION.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <CTAButton href="/campaigns/live/auction">Auction Details</CTAButton>
            <CTAButton href={LIVE_AUCTION.biddingUrl} external variant="secondary">
              View on 32auctions
            </CTAButton>
          </div>
        </Container>
      </section>

      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container className="max-w-2xl">
          <MissionProgress totalRaised={fundraisingStats.amountRaised} goal={fundraisingStats.fundraisingGoal} />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="How It Contributes"
            title="Ways This Series Supports the Mission"
            description="Every show channels support toward The $70K Mission through several contribution methods."
          />
          <RevealGrid>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {LIVE_CONTRIBUTION_METHODS.map((method) => (
                <div key={method.label} className="rounded-sm border border-ink/10 bg-off-white p-6">
                  <h3 className="font-display text-base font-semibold uppercase tracking-wide text-ink">
                    {method.label}
                  </h3>
                  <p className="mt-2 text-sm text-charcoal-light">{method.description}</p>
                </div>
              ))}
            </div>
          </RevealGrid>
        </Container>
      </section>

      <CTASection
        title="See the Full Lineup"
        description="Upcoming shows, performers, and ticket links."
        buttons={[{ label: "See Upcoming Shows", href: "/campaigns/live/events" }]}
      />
    </>
  );
}
