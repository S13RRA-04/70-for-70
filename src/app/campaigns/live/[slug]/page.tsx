import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { RevealGrid } from "@/components/shared/reveal-on-scroll";
import { JournalMarkdown } from "@/components/journal/journal-markdown";
import { MissionProgress } from "@/components/campaign/mission-progress";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { getLiveEventBySlug, getLiveEventPerformers, getLiveAuctionItems } from "@/lib/data/live-events";
import { getMissionPartners } from "@/lib/data/mission-partners";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { formatCurrency, formatDateLong } from "@/lib/utils";
import { CAMPAIGN_URL, MISSION_NAME, SITE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export async function generateMetadata(props: PageProps<"/campaigns/live/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const event = await getLiveEventBySlug(slug);
  if (!event) return {};

  return pageMetadata({
    title: event.title,
    description: event.tagline ?? `${event.title} — a For The 22: Live benefit concert.`,
    canonical: `/campaigns/live/${event.slug}`,
  });
}

export default async function LiveEventPage(props: PageProps<"/campaigns/live/[slug]">) {
  const { slug } = await props.params;
  const event = await getLiveEventBySlug(slug);
  if (!event) notFound();

  const [performers, auctionItems, missionPartners, fundraisingStats] = await Promise.all([
    getLiveEventPerformers(event.id),
    getLiveAuctionItems(event.id),
    getMissionPartners(),
    getFundraisingImpactStats(),
  ]);
  const sponsors = missionPartners.filter((p) => p.associated_campaigns?.includes("live"));

  const breadcrumbJsonLdData = breadcrumbJsonLd([
    { name: "For The 22: Live", url: `${SITE_URL}/campaigns/live` },
    { name: "Shows", url: `${SITE_URL}/campaigns/live/events` },
    { name: event.title, url: `${SITE_URL}/campaigns/live/${event.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(breadcrumbJsonLdData)} />
      <section className="border-b border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">For The 22: Live</p>
          <h1 className="mt-3 text-balance font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            {event.title}
          </h1>
          {event.tagline && <p className="mt-3 text-lg text-off-white/85">{event.tagline}</p>}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm font-semibold uppercase tracking-wide text-off-white/70">
            {event.starts_at && <span>{formatDateLong(event.starts_at)}</span>}
            {event.venue_name && (
              <span>
                {event.venue_name}
                {event.venue_city && `, ${event.venue_city}`}
                {event.venue_state && `, ${event.venue_state}`}
              </span>
            )}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {event.ticket_url && (
              <CTAButton href={event.ticket_url} external tone="dark" magnetic>
                Get Tickets
              </CTAButton>
            )}
            <CTAButton href={`${CAMPAIGN_URL}/donate`} external variant="secondary" tone="dark">
              Support the Mission
            </CTAButton>
          </div>
        </Container>
      </section>

      {event.description && (
        <section className="py-16 sm:py-20">
          <Container className="max-w-3xl">
            <JournalMarkdown body={event.description} />
          </Container>
        </section>
      )}

      {performers.length > 0 && (
        <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Lineup" title="Performers" />
            <RevealGrid>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {performers.map((performer) => (
                  <div key={performer.id} className="rounded-sm border border-ink/10 bg-off-white p-6">
                    <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
                      {performer.name}
                    </h3>
                    {performer.billing && (
                      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-bronze">
                        {performer.billing}
                      </p>
                    )}
                    {performer.bio && <p className="mt-3 text-sm text-charcoal-light">{performer.bio}</p>}
                  </div>
                ))}
              </div>
            </RevealGrid>
          </Container>
        </section>
      )}

      {auctionItems.length > 0 && (
        <section className="border-t border-ink/10 py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Silent Auction" title="Auction Items" />
            <RevealGrid>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {auctionItems.map((item) => (
                  <div key={item.id} className="rounded-sm border border-ink/10 bg-off-white p-6">
                    <h3 className="font-display text-base font-semibold uppercase tracking-wide text-ink">
                      {item.title}
                    </h3>
                    {item.description && <p className="mt-2 text-sm text-charcoal-light">{item.description}</p>}
                    {item.starting_bid != null && (
                      <p className="mt-3 text-sm font-semibold text-bronze-text">
                        Starting Bid: {formatCurrency(item.starting_bid)}
                      </p>
                    )}
                    {item.status === "closed" ? (
                      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-charcoal-light">Closed</p>
                    ) : (
                      item.bidding_url && (
                        <CTAButton href={item.bidding_url} external variant="secondary" className="mt-4">
                          Bid Now
                        </CTAButton>
                      )
                    )}
                  </div>
                ))}
              </div>
            </RevealGrid>
          </Container>
        </section>
      )}

      {sponsors.length > 0 && (
        <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="With Thanks To" title="Event Sponsors" />
            <div className="mt-8 flex flex-wrap items-center gap-8">
              {sponsors.map((sponsor) => (
                <PartnerLogo
                  key={sponsor.id}
                  name={sponsor.name}
                  logoUrl={sponsor.logo_url}
                  logoLightUrl={sponsor.logo_light_url}
                  logoDarkUrl={sponsor.logo_dark_url}
                  background={sponsor.logo_background}
                  className="h-12 w-fit"
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="border-t border-ink/10 py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="The Bigger Picture" title={MISSION_NAME} />
          <div className="mt-6">
            <MissionProgress totalRaised={fundraisingStats.amountRaised} goal={fundraisingStats.fundraisingGoal} />
          </div>
        </Container>
      </section>
    </>
  );
}
