import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HandCoins, HandHelping, Handshake, Share2, type LucideIcon } from "lucide-react";
import { getCampaign } from "@/lib/data/campaign";
import { getAllocationBreakdown } from "@/lib/data/allocation";
import { getPartners } from "@/lib/data/partners";
import { getMissionPartners, isCampaignPartner } from "@/lib/data/mission-partners";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { getLatestJournalEntries } from "@/lib/data/journal";
import { HOW_THIS_BEGAN } from "@/lib/content/the-story";
import { MissionProgress } from "@/components/campaign/mission-progress";
import { CampaignStatusBar } from "@/components/campaign/campaign-status-bar";
import { CampaignPhaseBanner } from "@/components/campaign/campaign-phase-banner";
import { getCampaignPhase } from "@/lib/campaign-phase";
import { MerchTicker } from "@/components/campaign/merch-ticker";
import { EventPromoSection } from "@/components/campaign/event-promo-section";
import { getCurrentEventConfig } from "@/lib/data/event-config";
import { isEventPromoWindowNow } from "@/lib/22-for-the-22/event-status";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { PartnerLogoWall } from "@/components/partners/partner-logo-wall";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { CTASection } from "@/components/shared/cta-section";
import { EmptyState } from "@/components/shared/empty-state";
import { JournalCard } from "@/components/journal/journal-card";
import { ShareButtons } from "@/components/shared/share-buttons";
import {
  CAMPAIGN_NAME,
  CAMPAIGN_URL,
  CURRENT_CAMPAIGN,
  DONATE_LINK,
  EVENT22_CAMPAIGN_NAME,
  EVENT22_CAMPAIGN_URL,
  LIVE_CAMPAIGN_URL,
  RACE_TOTAL_DISTANCE,
  RUCK_CAMPAIGN_NAME,
  RUCK_CAMPAIGN_URL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { RevealGrid, RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { pageMetadata } from "@/lib/metadata";
import { jsonLdScriptProps } from "@/lib/json-ld";

const HOMEPAGE_TITLE = "Tri For The 22 | Supporting Veterans, First Responders & Their Families";
const HOMEPAGE_DESCRIPTION =
  "Tri For The 22 is an endurance fundraising campaign supporting veteran organizations including Mighty Oaks Warrior Programs and Veterans and Athletes United, as part of the broader For The 22 mission.";
const HOMEPAGE_OG_TITLE = "For The 22 — Movement Creates Momentum";
const HOMEPAGE_OG_DESCRIPTION =
  "One mission. Multiple ways to serve. Supporting veterans, first responders, and their families through resources, fundraising, endurance, and community action.";

export const metadata: Metadata = {
  ...pageMetadata({
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    canonical: `${CAMPAIGN_URL}/`,
  }),
  title: { absolute: HOMEPAGE_TITLE },
  openGraph: { title: HOMEPAGE_OG_TITLE, description: HOMEPAGE_OG_DESCRIPTION, url: `${CAMPAIGN_URL}/`, type: "website" },
  twitter: { card: "summary_large_image", title: HOMEPAGE_OG_TITLE, description: HOMEPAGE_OG_DESCRIPTION },
};

/** Identifies the campaign itself to search engines as a distinct WebSite, separate from the ORGANIZATION_JSON_LD (For The 22 the org) rendered on every route in the root layout. */
const CAMPAIGN_WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: CAMPAIGN_NAME,
  url: CAMPAIGN_URL,
  description: HOMEPAGE_DESCRIPTION,
};

/** First sentence of a longer description, for compact summary cards — falls back to the whole string if there's no sentence break. */
function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](?=\s|$)/);
  return match ? match[0] : text;
}

interface InvolvementCta {
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  icon: LucideIcon;
}

/** The brief's four "Move the Mission Forward" buckets — Donate/Partner/Share already get their own buttons in the fundraising-goal section earlier on the page, so this grid is deliberately just Participate + the other three restated as a complete, scannable set rather than a near-duplicate of that section. */
const INVOLVEMENT_CTAS: InvolvementCta[] = [
  {
    title: "Donate",
    description: "Support Mighty Oaks and Veterans and Athletes United through the current campaign.",
    ctaLabel: "Support the Mission",
    href: DONATE_LINK.href,
    icon: HandCoins,
  },
  {
    title: "Participate",
    description: "Join the Triathlon Team, volunteer race weekend, or take part in a future For The 22 challenge.",
    ctaLabel: "See How to Join",
    href: "/get-involved",
    icon: HandHelping,
  },
  {
    title: "Partner",
    description: "Businesses, organizations, and clubs can support the mission through sponsorship or in-kind contributions.",
    ctaLabel: "Become a Partner",
    href: "/become-a-partner",
    icon: Handshake,
  },
  {
    title: "Share",
    description: "Help put veteran and first-responder resources in front of the people who need them.",
    ctaLabel: "Share the Mission",
    href: CAMPAIGN_URL,
    icon: Share2,
  },
];

interface MissionCampaignCard {
  name: string;
  description: string;
  href: string;
  external: boolean;
}

/** "Mission in Action" — Tri, 22, and Ruck as sibling campaigns under For The 22 itself, the senior/closing card. Deliberately not a new /campaigns route on this domain — that path is already the org's own campaign index (see src/app/campaigns/page.tsx); this section links out to it instead of duplicating it. */
const MISSION_CAMPAIGN_CARDS: MissionCampaignCard[] = [
  {
    name: CAMPAIGN_NAME,
    description: "Endurance fundraising centered on IRONMAN 70.3 Chattanooga.",
    href: "/the-race",
    external: false,
  },
  {
    name: EVENT22_CAMPAIGN_NAME,
    description: "Community-based movement focused on awareness, participation, and remembrance.",
    href: EVENT22_CAMPAIGN_URL,
    external: true,
  },
  {
    name: RUCK_CAMPAIGN_NAME,
    description: "A ruck-focused challenge promoting veteran and first-responder awareness and participation.",
    href: RUCK_CAMPAIGN_URL,
    external: true,
  },
  {
    name: "For The 22: Live",
    description: "Music moves the mission — a benefit concert series supporting the same shared goal.",
    href: LIVE_CAMPAIGN_URL,
    external: true,
  },
  {
    name: SITE_NAME,
    description: "The permanent resource and mission hub serving veterans, first responders, and their families.",
    href: SITE_URL,
    external: true,
  },
];

/**
 * The campaign homepage — rendered at "/" on tri.forthe22.org via a
 * transparent middleware rewrite (see src/middleware.ts). The movement
 * homepage at src/app/page.tsx renders at "/" on forthe22.org instead.
 *
 * State-driven repositioning, following the Journal's pattern (current
 * state → context → progress → story → action) rather than reading as a
 * brochure for the whole campaign universe: Hero, live status bar, a
 * one-line Latest Update pointer, Current Campaign (race state/countdown,
 * now with CampaignPhaseBanner), The $70K Mission (fundraising progress —
 * grouped with Current Campaign as the "what's happening now" block, ahead
 * of any explanatory copy), Who Your Support Helps, What Is For The 22,
 * Organizations Standing With the Mission, Mission in Action, Ways to Get
 * Involved, Stories From the Mission, Why Cody Chose to Carry This Mission,
 * ForThe22.org CTA, Final CTA. Detailed follow-along content still lives on
 * its own pages (/journal, /the-race, /journal/building-the-bike,
 * /sponsors, /get-involved) — this page previews and links to them, it
 * doesn't duplicate them.
 *
 * A conditional section — EventPromoSection, between the hero and Live
 * Campaign Status — only renders during 22 For the 22's promo window (see
 * isEventPromoWindowNow), so the homepage doesn't carry stale event content
 * most of the year.
 */
export default async function CampaignHomePage() {
  const [campaign, partners, missionPartners, currentEvent, fundraisingStats, latestEntries] = await Promise.all([
    getCampaign(),
    getPartners(),
    getMissionPartners(),
    getCurrentEventConfig(),
    getFundraisingImpactStats(),
    getLatestJournalEntries(3),
  ]);
  const allocationBreakdown = await getAllocationBreakdown(campaign);
  const showEventPromo = currentEvent && isEventPromoWindowNow(currentEvent.starts_at, currentEvent.ends_at);
  const phase = getCampaignPhase();

  const generalPartners = missionPartners.filter(isCampaignPartner).filter((p) => p.associated_campaigns?.includes("tri"));
  const presentingPartners = generalPartners.filter((p) => p.tier === "presenting-partner");
  const otherPartners = generalPartners.filter((p) => p.tier !== "presenting-partner");

  const shareTitle = `I'm supporting ${CAMPAIGN_NAME} — ${formatCurrency(fundraisingStats.fundraisingGoal)} for veterans, first responders, and their families.`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(CAMPAIGN_WEBSITE_JSON_LD)} />
      <MerchTicker />

      {/* 1. Hero — mission-first, not race-first. The relationship banner
          renders above this at the layout level (MissionRelationshipBanner),
          not here. */}
      <section className="relative overflow-hidden bg-ink text-off-white">
        <Image
          src="/tri-for-the-22-banner.png"
          alt=""
          fill
          priority
          aria-hidden="true"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/60" aria-hidden="true" />
        <Image
          src="/topo-map.png"
          alt=""
          fill
          aria-hidden="true"
          className="object-cover opacity-[0.08]"
        />

        <Container className="relative py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bronze-light">For The 22</p>
          <h1 className="mt-2 text-balance font-display text-hero font-bold uppercase leading-[0.95] tracking-tight">
            Movement Creates Momentum.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-off-white/85">
            Veterans and first responders often carry burdens most people never see. For The 22 exists to connect
            them — and their families — with trusted resources, community, recovery, purpose, and a path forward.
          </p>

          <p className="mt-6 font-display text-2xl font-bold uppercase tracking-tight text-bronze-light sm:text-3xl">
            Because 22 &ne; 0.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CTAButton href={DONATE_LINK.href} size="lg" magnetic>
              Support the Mission
            </CTAButton>
            <CTAButton href={SITE_URL} variant="secondary" tone="dark" size="lg" external>
              Explore ForThe22.org
            </CTAButton>
          </div>
          <Link
            href="/journal"
            className="mt-5 inline-flex text-xs font-semibold uppercase tracking-widest text-off-white/70 hover:text-off-white"
          >
            Follow the {CAMPAIGN_NAME} Campaign &rarr;
          </Link>
          </div>
          <div className="hidden lg:col-span-4 lg:block">
            <div className="border-l border-off-white/20 pl-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">Current pursuit</p>
              <p className="mt-3 font-display text-5xl font-bold leading-none">{RACE_TOTAL_DISTANCE}</p>
              <p className="mt-1 text-sm uppercase tracking-widest text-off-white/65">Miles to move the mission</p>
              <div className="mt-7 h-px bg-off-white/20" />
              <p className="mt-7 text-sm leading-relaxed text-off-white/70">Training, bike build, fundraising, and race-day progress update as the campaign moves.</p>
            </div>
          </div>
          </div>
        </Container>
      </section>

      {/* Conditional section — see this page's doc comment. */}
      {showEventPromo && currentEvent && <EventPromoSection event={currentEvent} />}

      <CampaignStatusBar
        amountRaised={fundraisingStats.amountRaised}
        goal={fundraisingStats.fundraisingGoal}
        partnerCount={fundraisingStats.campaignPartnerCount}
        daysToRace={fundraisingStats.daysToRace}
        distanceMiles={RACE_TOTAL_DISTANCE}
        updatedAt={fundraisingStats.updatedAt}
      />

      {/* Latest Update — a one-line pointer to the newest journal entry,
          directly under the live status bar, so the page reads as a
          currently-updating campaign before any explanatory content. The
          full "Stories From the Mission" section further down still shows
          the latest three in full. */}
      {latestEntries[0] && (
        <div className="border-b border-ink/10 bg-sand-light py-3">
          <Container className="flex flex-wrap items-center justify-between gap-2">
            <p className="min-w-0 truncate text-sm text-charcoal-light">
              <span className="font-semibold uppercase tracking-wide text-bronze-text">Latest:</span>{" "}
              <Link href={`/journal/${latestEntries[0].slug}`} className="font-medium text-ink hover:text-bronze">
                {latestEntries[0].title}
              </Link>
            </p>
            <Link
              href="/journal"
              className="shrink-0 text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
            >
              View All Updates &rarr;
            </Link>
          </Container>
        </div>
      )}

      <section className="border-b border-ink/10 bg-off-white py-6">
        <Container>
          <CampaignPhaseBanner phase={phase} />
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            <CTAButton href="/journal">Follow the Campaign</CTAButton>
            <Link href="/the-race" className="text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark">See the Race Plan &rarr;</Link>
          </div>
        </Container>
      </section>

      {/* 3. The $70K Mission — fundraising progress, grouped with Current
          Campaign above as the page's "what's happening now" block. */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
          <SectionHeading eyebrow="Fund the Mission" title="For The 22's Shared $70,000 Mission Goal" />
          <p className="mt-5 text-base leading-relaxed text-charcoal-light">
            Roughly $1,000 for every mile of {CURRENT_CAMPAIGN.event} — the race that inspired the number.
          </p>

          <div className="mt-8 rounded-sm border border-ink/10 bg-off-white p-6 sm:p-8">
            <MissionProgress
              totalRaised={fundraisingStats.amountRaised}
              goal={fundraisingStats.fundraisingGoal}
              breakdown={allocationBreakdown}
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CTAButton href={DONATE_LINK.href} magnetic>
              Donate
            </CTAButton>
            <CTAButton href="/become-a-partner" variant="secondary">
              Become a Partner
            </CTAButton>
            <CTAButton href={`${SITE_URL}/70k`} variant="secondary" external>
              Explore the Full $70K Mission
            </CTAButton>
            <ShareButtons url={CAMPAIGN_URL} title={shareTitle} />
          </div>
          </div>
          <div className="relative min-h-[340px] overflow-hidden rounded-sm lg:col-span-5 lg:min-h-[480px]">
            <Image src="/journal/building-the-bike/frame-hero.jpg" alt="Tri For The 22 bike frame during the campaign build" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-6 pt-24 text-off-white">
              <p className="font-display text-xl font-semibold uppercase">Built piece by piece. Backed mile by mile.</p>
              <Link href="/journal/building-the-bike" className="mt-3 inline-flex text-xs font-semibold uppercase tracking-widest text-bronze-light">See the bike build &rarr;</Link>
            </div>
          </div>
          </div>
        </Container>
      </section>

      {/* 4. Who Your Support Helps */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Who It Supports"
            title="Who Your Support Helps"
            description={`${CAMPAIGN_NAME} raises awareness and support for organizations already doing meaningful work in the veteran community.`}
          />
          <RevealGrid>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {partners.map((partner) => (
                // The whole card used to carry .hover-lift despite only the
                // inner text link actually being clickable — a hover
                // affordance with nothing behind it. Since every card leads
                // to the same place anyway, making the whole thing a real
                // link (matching JournalCard's pattern) completes that
                // signal instead of stripping it.
                <Link
                  key={partner.id}
                  href="/beneficiaries"
                  className="hover-lift group flex flex-col rounded-sm border border-ink/10 bg-off-white p-6"
                >
                  <PartnerLogo
                    name={partner.name}
                    logoUrl={partner.logo_url}
                    logoLightUrl={partner.logo_light_url}
                    logoDarkUrl={partner.logo_dark_url}
                    background={partner.logo_background}
                    className="h-20 w-fit"
                  />
                  <p className="mt-4 text-sm leading-relaxed text-charcoal-light">
                    {firstSentence(partner.description)}
                  </p>
                  <span className="mt-4 inline-flex w-fit text-xs font-semibold uppercase tracking-wide text-bronze group-hover:text-bronze-dark">
                    Learn About {partner.name} &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </RevealGrid>
          <p className="mt-8 max-w-2xl text-sm text-charcoal-light">
            {CAMPAIGN_NAME} does not operate these programs. We use our platform to raise awareness and direct
            support toward organizations already doing the work.
          </p>
        </Container>
      </section>

      {/* 5. What Is For The 22 — the mark itself as the asymmetrical
          counterweight, since this section is explaining the org the mark
          belongs to, not telling a personal story a photo would suit. */}
      <section className="border-b border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="flex justify-center lg:order-2 lg:col-span-5">
              <div className="relative aspect-square w-full max-w-[260px]">
                <Image src="/logo-white.png" alt="" fill className="object-contain" sizes="260px" />
              </div>
            </div>
            <div className="lg:order-1 lg:col-span-7">
              <SectionHeading eyebrow="More Than One Race" title="What Is For The 22?" tone="dark" />
              <p className="mt-5 max-w-xl text-base leading-relaxed text-off-white/80">
                For The 22 is a broader mission focused on helping veterans, first responders, and their families
                find trusted resources, support, and community.
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-off-white/80">
                {CAMPAIGN_NAME} is one way that mission comes to life — using endurance sport to create attention,
                raise funds, build partnerships, and start conversations that matter.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <CTAButton href={SITE_URL} tone="dark" external>
                  Visit ForThe22.org
                </CTAButton>
                <a
                  href={`${SITE_URL}/resources`}
                  className="text-sm font-semibold uppercase tracking-wide text-bronze-light hover:text-off-white"
                >
                  Explore Resources &rarr;
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Organizations Standing With the Mission — moved up from after
          "Stories From the Mission" so institutional proof (who stands with
          this) reads early, well before the founder story. */}
      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Standing With the Mission"
            title="Organizations Standing With the Mission"
            description="These businesses, clubs, and organizations contribute equipment, services, expertise, visibility, financial support, or community reach to help For The 22 move forward."
          />
          <div className="mt-8">
            <PartnerLogoWall presentingPartners={presentingPartners} otherPartners={otherPartners} />
          </div>
          <Link
            href="/become-a-partner"
            className="mt-8 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
          >
            Become a Partner &rarr;
          </Link>
        </Container>
      </section>

      {/* 7. Mission in Action — eyebrow/title deliberately distinct from
          MISSION_NAME/MISSION_SUPPORTING_LINE, which MissionProgress just
          rendered verbatim in section 6 immediately above. */}
      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Mission in Action" title="Every Campaign Contributes to One Goal" />
          <RevealGrid>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {MISSION_CAMPAIGN_CARDS.map((card, i) => (
                <div
                  key={card.name}
                  className={
                    i === MISSION_CAMPAIGN_CARDS.length - 1
                      ? "flex flex-col rounded-sm border-2 border-bronze bg-ink p-6 text-off-white"
                      : "flex flex-col rounded-sm border border-ink/10 bg-off-white p-6"
                  }
                >
                  <h3 className="font-display text-lg font-semibold uppercase tracking-wide">{card.name}</h3>
                  <p
                    className={
                      i === MISSION_CAMPAIGN_CARDS.length - 1
                        ? "mt-2 flex-1 text-sm text-off-white/75"
                        : "mt-2 flex-1 text-sm text-charcoal-light"
                    }
                  >
                    {card.description}
                  </p>
                  {card.external ? (
                    <a
                      href={card.href}
                      className={
                        i === MISSION_CAMPAIGN_CARDS.length - 1
                          ? "mt-5 text-sm font-semibold uppercase tracking-wide text-bronze-light hover:text-off-white"
                          : "mt-5 text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
                      }
                    >
                      Visit &rarr;
                    </a>
                  ) : (
                    <Link
                      href={card.href}
                      className="mt-5 text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
                    >
                      Learn More &rarr;
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </RevealGrid>
        </Container>
      </section>

      {/* 8. Ways to Get Involved */}
      <section className="border-b border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container>
          <SectionHeading eyebrow="Get Involved" title="Move the Mission Forward" tone="dark" />
          <RevealGrid>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {INVOLVEMENT_CTAS.map((item) => (
                <div key={item.title} className="flex flex-col rounded-sm border border-off-white/15 bg-off-white/5 p-6">
                  <item.icon size={26} className="text-bronze-light" aria-hidden />
                  <h3 className="mt-4 font-display text-lg font-semibold uppercase tracking-wide">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-off-white/75">{item.description}</p>
                  <Link
                    href={item.href}
                    className="mt-5 text-sm font-semibold uppercase tracking-wide text-bronze-light hover:text-off-white"
                  >
                    {item.ctaLabel} &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </RevealGrid>
        </Container>
      </section>

      {/* 9. Stories From the Mission */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Follow Along" title="Stories From the Mission" />
          <div className="mt-8">
            {latestEntries.length > 0 ? (
              <RevealGrid>
                <div className="mt-8 grid gap-6 sm:grid-cols-3">
                  {latestEntries.map((entry, i) => (
                    <JournalCard key={entry.id} entry={entry} isLatest={i === 0} />
                  ))}
                </div>
              </RevealGrid>
            ) : (
              <div className="mt-8">
                <EmptyState
                  title="Stories are coming soon."
                  description="Beneficiary, partnership, and training updates will appear here as they're published."
                />
              </div>
            )}
          </div>
          <Link
            href="/journal"
            className="mt-8 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
          >
            View the Journal &rarr;
          </Link>
        </Container>
      </section>

      {/* 10. Why Cody Chose to Carry This Mission — asymmetrical image/text,
          matching the org homepage's "Why I Started This" treatment, rather
          than a centered text column floating in an empty dark band. */}
      <section className="border-b border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container>
          <RevealOnScroll>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm lg:order-2 lg:col-span-5">
                <Image src="/about/ultra-1.jpg" alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              </div>
              <div className="lg:order-1 lg:col-span-7">
                <SectionHeading eyebrow="The Founder" title="Why Cody Chose to Carry This Mission" tone="dark" />
                <p className="mt-5 max-w-xl text-base leading-relaxed text-off-white/80">
                  {CAMPAIGN_NAME} began with one person deciding to use endurance sport as a platform for something
                  bigger. Cody Hitson is a combat veteran, husband, father, and endurance athlete who created the
                  campaign to support organizations helping veterans and their families rebuild, recover, reconnect,
                  and move forward.
                </p>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-off-white/75">{HOW_THIS_BEGAN.body[1]}</p>
                <Link
                  href="/the-story"
                  className="mt-5 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze-light hover:text-off-white"
                >
                  Read Cody&apos;s Story &rarr;
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* 11. ForThe22.org cross-promo */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
            Need Support? Start Here.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-charcoal-light">
            For The 22 connects veterans, first responders, and their families with vetted resources across mental
            health, physical wellness, faith, family support, career development, financial assistance, community,
            and more.
          </p>
          <a
            href={`${SITE_URL}/resources`}
            className="mt-6 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
          >
            Explore Resources at ForThe22.org &rarr;
          </a>
        </Container>
      </section>

      {/* 12. Final CTA */}
      <CTASection
        eyebrow="Join the Mission"
        title="Every Mile, Every Dollar, Moves This Forward"
        description="Chattanooga is one finish line. The mission continues after it."
        buttons={[{ label: "Support the Mission", href: DONATE_LINK.href }]}
      />
    </>
  );
}
