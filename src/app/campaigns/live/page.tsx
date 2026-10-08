import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { CTASection } from "@/components/shared/cta-section";
import { RevealGrid } from "@/components/shared/reveal-on-scroll";
import { MissionProgress } from "@/components/campaign/mission-progress";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { LIVE_CAMPAIGN_DESCRIPTION, LIVE_CAMPAIGN_TAGLINE, LIVE_CONTRIBUTION_METHODS, UPCOMING_LIVE_PERFORMERS } from "@/lib/content/live-campaign";
import { LIVE_AUCTION } from "@/lib/content/live-auction";
import { CAMPAIGN_URL, LIVE_CAMPAIGN_URL, MISSION_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: `For The 22: Live | ${LIVE_CAMPAIGN_TAGLINE}`,
  description: LIVE_CAMPAIGN_DESCRIPTION,
  canonical: "/",
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "For The 22: Live", url: LIVE_CAMPAIGN_URL },
]);

const CONTRIBUTION_ICONS = [Ticket, HandCoins, Handshake, Gavel, Music2, Shirt] as const;

export default async function LiveCampaignPage() {
  const fundraisingStats = await getFundraisingImpactStats();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <section className="relative overflow-hidden border-b border-off-white/10 bg-ink py-16 text-off-white sm:py-24">
        <Image src="/topo-map.png" alt="" fill priority aria-hidden="true" className="object-cover opacity-[0.07]" />
        <div className="absolute -right-10 top-1/2 font-display text-[14rem] font-bold uppercase leading-none text-off-white/[0.03] sm:text-[22rem]" aria-hidden="true">Live</div>
        <Container className="relative grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
          <SectionHeading as="h1" tone="dark" eyebrow="For The 22: Live" title={LIVE_CAMPAIGN_TAGLINE} />
          <p className="mt-5 text-base leading-relaxed text-off-white/85">{LIVE_CAMPAIGN_DESCRIPTION}</p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-bronze-light">
            Contributes to {MISSION_NAME}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CTAButton href="/events" tone="dark" magnetic>
              See Upcoming Shows
            </CTAButton>
            <CTAButton href={`${CAMPAIGN_URL}/donate`} external variant="secondary" tone="dark">
              Support the Mission
            </CTAButton>
          </div>
          </div>
          <div className="border-l border-bronze/50 pl-7"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">Benefit concert series</p><p className="mt-3 font-display text-4xl font-semibold uppercase leading-tight">Artists. Community. A mission bigger than the stage.</p></div>
        </Container>
      </section>

      <section className="border-b border-ink/10 bg-off-white py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Upcoming Performances" title="The Next Show Starts Here" description="Confirmed artists joining For The 22: Live. Dates and streaming details publish as they are finalized." />
          <RevealGrid><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {UPCOMING_LIVE_PERFORMERS.map((performer) => <article key={performer.name} className="group overflow-hidden border border-ink/10 bg-ink text-off-white focus-within:border-bronze"><div className="aspect-[3/2] bg-[radial-gradient(circle_at_30%_20%,rgba(169,122,76,0.35),transparent_45%)] p-6"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">Artist announcement</p><h2 className="mt-12 font-display text-3xl font-semibold uppercase">{performer.name}</h2></div><div className="p-6"><p className="text-sm leading-relaxed text-off-white/70">{performer.details}</p>{performer.registrationUrl && <CTAButton href={performer.registrationUrl} external tone="dark" className="mt-5">Register</CTAButton>}</div></article>)}
          </div></RevealGrid>
          <CTAButton href="/events" variant="secondary" className="mt-8">See All Performances</CTAButton>
        </Container>
      </section>

      <section className="border-b border-off-white/10 bg-charcoal py-16 text-off-white sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="flex aspect-square max-w-md items-center justify-center border border-bronze/30 bg-ink"><div className="text-center"><Gavel className="mx-auto h-14 w-14 text-bronze-light" aria-hidden="true" /><p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-off-white/60">Donated by</p><p className="mt-2 font-display text-4xl font-bold uppercase">{LIVE_AUCTION.donor}</p></div></div>
          <div>
          <SectionHeading
            tone="dark"
            eyebrow="Featured Auction"
            title={LIVE_AUCTION.title}
            description={`Bidding opens ${LIVE_AUCTION.opensOn}. Winner announced ${LIVE_AUCTION.winnerAnnouncement}.`}
          />
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-off-white/70">
            {LIVE_AUCTION.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <CTAButton href="/auction" tone="dark">Auction Details</CTAButton>
            <CTAButton href={LIVE_AUCTION.biddingUrl} external variant="secondary" tone="dark">
              View on 32auctions
            </CTAButton>
          </div>
          </div>
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
              {LIVE_CONTRIBUTION_METHODS.map((method, index) => {
                const Icon = CONTRIBUTION_ICONS[index];
                return (
                <div key={method.label} className="border-t-2 border-bronze bg-off-white p-5">
                  <Icon className="h-5 w-5 text-bronze" aria-hidden="true" />
                  <h3 className="font-display text-base font-semibold uppercase tracking-wide text-ink">
                    {method.label}
                  </h3>
                  <p className="mt-2 text-sm text-charcoal-light">{method.description}</p>
                </div>
              )})}
            </div>
          </RevealGrid>
        </Container>
      </section>

      <CTASection
        title="See the Full Lineup"
        description="Upcoming shows, performers, and ticket links."
        buttons={[{ label: "See Upcoming Shows", href: "/events" }]}
      />
    </>
  );
}
import Image from "next/image";
import { Gavel, HandCoins, Handshake, Music2, Shirt, Ticket } from "lucide-react";
