import type { Metadata } from "next";
import Link from "next/link";
import { Waves, HandHelping, Handshake, HandCoins, Share2, type LucideIcon } from "lucide-react";
import { getCampaign } from "@/lib/data/campaign";
import { getAllocationBreakdown } from "@/lib/data/allocation";
import { getPartners } from "@/lib/data/partners";
import { getMissionPartners } from "@/lib/data/mission-partners";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { getJournalEntries, getLatestJournalEntries } from "@/lib/data/journal";
import { getJournalMilestonesWithStatus } from "@/lib/data/journal-milestones";
import { findAboutSubsection } from "@/lib/content/about";
import { HOW_THIS_BEGAN } from "@/lib/content/the-story";
import {
  BIKE_BUILD_CONFIRMED_CONTRIBUTORS,
  BIKE_BUILD_HERO_PHOTO,
  getBikeBuildStatusOverview,
} from "@/lib/content/building-the-bike";
import { getDaysToRace } from "@/lib/campaign-phase";
import { CampaignProgress } from "@/components/campaign/campaign-progress";
import { CampaignStatusBar } from "@/components/campaign/campaign-status-bar";
import { MerchTicker } from "@/components/campaign/merch-ticker";
import { EventPromoSection } from "@/components/campaign/event-promo-section";
import { getCurrentEventConfig } from "@/lib/data/event-config";
import { isEventPromoWindowNow } from "@/lib/22-for-the-22/event-status";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { PartnerLogoWall } from "@/components/partners/partner-logo-wall";
import { Countdown } from "@/components/shared/countdown";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { CTASection } from "@/components/shared/cta-section";
import { EmptyState } from "@/components/shared/empty-state";
import { JournalCard } from "@/components/journal/journal-card";
import { RoadSoFar } from "@/components/journal/road-so-far";
import { BikeBuildStatusPreview } from "@/components/journal/bike-build/bike-build-status-preview";
import { ShareButtons } from "@/components/shared/share-buttons";
import {
  CAMPAIGN_NAME,
  CAMPAIGN_URL,
  CURRENT_CAMPAIGN,
  DONATE_LINK,
  FUNDRAISING_GOAL,
  RACE_INFO,
  RACE_TOTAL_DISTANCE,
} from "@/lib/constants";
import { formatCurrency, formatDateLong } from "@/lib/utils";
import { RevealGrid } from "@/components/shared/reveal-on-scroll";
import { pageMetadata } from "@/lib/metadata";
import { jsonLdScriptProps } from "@/lib/json-ld";

const HERO_HEADLINE = `${RACE_TOTAL_DISTANCE} MILES. ${formatCurrency(FUNDRAISING_GOAL)}. ONE MISSION.`;

/**
 * Brand-first, bypassing the root layout's "%s | {CAMPAIGN_NAME}" title
 * template (see generateMetadata in src/app/layout.tsx) via title.absolute —
 * the homepage is the one place branded searches ("Tri For The 22") should
 * see the campaign name lead the title, unlike every other page where it
 * trails as the site identifier.
 */
const HOMEPAGE_TITLE = `${CAMPAIGN_NAME} | Cody Hitson's IRONMAN 70.3 Campaign`;
const HOMEPAGE_DESCRIPTION =
  "Tri For The 22 follows Cody Hitson's road to IRONMAN 70.3 Chattanooga while raising awareness and support for veterans, first responders, and their families.";

export const metadata: Metadata = {
  ...pageMetadata({
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    canonical: `${CAMPAIGN_URL}/`,
  }),
  title: { absolute: HOMEPAGE_TITLE },
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

interface RoleCta {
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Homepage-local "Choose Your Role" pathways — deliberately not shared with
 * Get Involved's own HELP_PATHWAYS array (src/app/get-involved/page.tsx):
 * that page gets its own rebuild in a later phase and shouldn't be coupled
 * to this homepage teaser in the meantime.
 */
const ROLE_CTAS: RoleCta[] = [
  {
    title: "Race With Us",
    description: "Join the Triathlon Team and train, race, and fundraise under the Tri For The 22 banner.",
    ctaLabel: "Apply to Race",
    href: "/get-involved/triathlon-team",
    icon: Waves,
  },
  {
    title: "Volunteer",
    description: "Help on the ground race weekend in Chattanooga, or spread the word from anywhere.",
    ctaLabel: "See Volunteer Roles",
    href: "/get-involved#roles",
    icon: HandHelping,
  },
  {
    title: "Partner",
    description: "Provide financial, in-kind, promotional, or organizational support.",
    ctaLabel: "Become a Partner",
    href: "/become-a-partner",
    icon: Handshake,
  },
  {
    title: "Donate",
    description: "Fund the mission directly — every dollar moves the campaign toward its goal.",
    ctaLabel: "Support the Mission",
    href: DONATE_LINK.href,
    icon: HandCoins,
  },
];

/**
 * The campaign homepage — rendered at "/" on tri.forthe22.org via a
 * transparent middleware rewrite (see src/middleware.ts). The movement
 * homepage at src/app/page.tsx renders at "/" on forthe22.org instead.
 *
 * 11 fixed sections (the "live campaign dashboard" redesign): Hero, Live
 * Campaign Status, Mission, Road to Chattanooga, Latest From the Road,
 * Building the Bike, Beneficiaries, Campaign Partners, Choose Your Role,
 * Final CTA, Footer (Footer is the shared layout component, not rendered
 * here). Detailed follow-along content still lives on its own pages
 * (/journal, /the-race, /journal/building-the-bike, /sponsors,
 * /get-involved) — this page previews and links to them, it doesn't
 * duplicate them.
 *
 * A conditional 12th section — EventPromoSection, between the hero and
 * Live Campaign Status — only renders during 22 For the 22's promo window
 * (see isEventPromoWindowNow), so the homepage doesn't carry stale event
 * content most of the year.
 */
export default async function CampaignHomePage() {
  const [campaign, partners, missionPartners, currentEvent, fundraisingStats, allEntries] = await Promise.all([
    getCampaign(),
    getPartners(),
    getMissionPartners(),
    getCurrentEventConfig(),
    getFundraisingImpactStats(),
    getJournalEntries(),
  ]);
  const allocationBreakdown = await getAllocationBreakdown(campaign);
  const why22 = findAboutSubsection("why-22");
  const showEventPromo = currentEvent && isEventPromoWindowNow(currentEvent.starts_at, currentEvent.ends_at);

  const roadMilestones = getJournalMilestonesWithStatus(allEntries);
  const latestEntries = await getLatestJournalEntries(3);

  const bikeBuildOverview = getBikeBuildStatusOverview();
  const bikeBuildContributorNames = BIKE_BUILD_CONFIRMED_CONTRIBUTORS.slice(0, 3).map((c) => c.name);

  const generalPartners = missionPartners.filter((p) => p.partner_type !== "giveaway-supporter");
  const presentingPartners = generalPartners.filter((p) => p.tier === "presenting-partner");
  const otherPartners = generalPartners.filter((p) => p.tier !== "presenting-partner");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(CAMPAIGN_WEBSITE_JSON_LD)} />
      <MerchTicker />

      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-ink text-off-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url(/tri-for-the-22-banner.png)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/60" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.08]"
          style={{ backgroundImage: "url(/topo-map.png)" }}
          aria-hidden="true"
        />

        <Container className="relative grid gap-10 py-16 sm:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bronze-light">{CAMPAIGN_NAME}</p>
            <h1 className="mt-2 text-balance font-display text-[clamp(2.25rem,7vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-tight">
              {HERO_HEADLINE}
            </h1>

            <p className="mt-4 text-lg font-semibold uppercase tracking-wide text-bronze-light sm:text-xl">
              {CURRENT_CAMPAIGN.event}
              {RACE_INFO.raceDate && <> &middot; {formatDateLong(RACE_INFO.raceDate)}</>}
              {RACE_INFO.raceLocation && <> &middot; {RACE_INFO.raceLocation}</>}
            </p>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-off-white/80">
              Raising funds and awareness for veterans, first responders, and their families.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <CTAButton href={DONATE_LINK.href} size="lg" magnetic>
                Support the Mission
              </CTAButton>
              <CTAButton href="/journal" variant="secondary" tone="dark" size="lg">
                Follow the Journey
              </CTAButton>
            </div>
          </div>

          <div className="rounded-sm border border-off-white/10 bg-off-white/5 p-6 backdrop-blur-sm sm:p-8">
            <CampaignProgress
              totalRaised={campaign.amount_raised}
              goal={campaign.fundraising_goal}
              showStats={false}
              tone="dark"
              breakdown={allocationBreakdown}
            />

            {RACE_INFO.raceDate && (
              <div className="mt-8 border-t border-off-white/10 pt-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-off-white/60">
                  Race Day Countdown
                </p>
                <Countdown targetIso={RACE_INFO.raceDate} />
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Conditional section — see this page's doc comment. */}
      {showEventPromo && currentEvent && <EventPromoSection event={currentEvent} />}

      {/* 2. Live Campaign Status */}
      <CampaignStatusBar
        amountRaised={fundraisingStats.amountRaised}
        goal={fundraisingStats.fundraisingGoal}
        partnerCount={fundraisingStats.partnerCount}
        daysToRace={getDaysToRace()}
      />

      {/* 3. Mission */}
      <section className="border-b border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container className="max-w-2xl">
          {why22 && (
            <>
              <span
                aria-hidden="true"
                className="font-display text-6xl font-bold leading-none text-bronze-light sm:text-7xl"
              >
                22
              </span>
              <div className="mt-6 space-y-4">
                {why22.body.map((paragraph, i) => (
                  <p key={i} className="text-base leading-relaxed text-off-white/75">
                    {paragraph}
                  </p>
                ))}
              </div>
            </>
          )}

          <p className="mt-6 text-base leading-relaxed text-off-white/75">
            {CAMPAIGN_NAME} pairs a {RACE_TOTAL_DISTANCE}-mile {CURRENT_CAMPAIGN.event} with a{" "}
            {formatCurrency(FUNDRAISING_GOAL)} fundraising goal for {CURRENT_CAMPAIGN.beneficiaries.join(" and ")}
            {" "}— and the mission continues beyond Chattanooga.
          </p>

          <p className="mt-8 font-display text-2xl font-bold uppercase tracking-tight text-bronze-light sm:text-3xl">
            Because 22 &ne; 0.
          </p>

          <Link
            href="/the-mission"
            className="mt-5 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze-light hover:text-off-white"
          >
            Read the Mission &rarr;
          </Link>

          <div className="mt-10 border-t border-off-white/15 pt-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-off-white/60">
              Why I&apos;m Doing This
            </p>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-off-white/75">
              {HOW_THIS_BEGAN.body[1]}
            </p>
            <Link
              href="/the-story"
              className="mt-3 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze-light hover:text-off-white"
            >
              Read My Story &rarr;
            </Link>
          </div>
        </Container>
      </section>

      {/* 4. Road to Chattanooga */}
      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Movement Creates Momentum"
            title="Road to Chattanooga"
            description="Every milestone here is real — derived from what's actually happened, not a hand-set schedule."
          />
          <div className="mt-8">
            <RoadSoFar milestones={roadMilestones} />
          </div>
        </Container>
      </section>

      {/* 5. Latest From the Road */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Follow Along" title="Latest From the Road" />
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
                  title="Journal updates are coming soon."
                  description="Training, campaign, and bike-build updates will appear here as they're published."
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

      {/* 6. Building the Bike */}
      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="The Build" title="Building the Bike" />
          <div className="mt-8">
            <BikeBuildStatusPreview
              overview={bikeBuildOverview}
              photo={BIKE_BUILD_HERO_PHOTO}
              contributorNames={bikeBuildContributorNames}
            />
          </div>
        </Container>
      </section>

      {/* 7. Beneficiaries */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Who It Supports"
            title="Beneficiary Organizations"
            description={`${CAMPAIGN_NAME} raises funds in support of veteran-focused nonprofit organizations.`}
          />
          <RevealGrid>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {partners.map((partner) => (
                <div key={partner.id} className="hover-lift flex flex-col rounded-sm border border-ink/10 bg-off-white p-6">
                <PartnerLogo
                  name={partner.name}
                  logoUrl={partner.logo_url}
                  logoLightUrl={partner.logo_light_url}
                  logoDarkUrl={partner.logo_dark_url}
                  background={partner.logo_background}
                  className="h-14 w-fit"
                />
                <p className="mt-4 text-sm leading-relaxed text-charcoal-light">
                  {firstSentence(partner.description)}
                </p>
                <Link
                  href="/beneficiaries"
                  className="mt-4 inline-flex w-fit text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
                >
                  Learn More &rarr;
                </Link>
                </div>
              ))}
            </div>
          </RevealGrid>
        </Container>
      </section>

      {/* 8. Campaign Partners */}
      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Campaign Partners"
            title="Parts of the Mission"
            description="These aren't logos on a page. They're parts of the mission."
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

      {/* 9. Choose Your Role */}
      <section className="border-b border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container>
          <SectionHeading eyebrow="Get Involved" title="Choose Your Role" tone="dark" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {ROLE_CTAS.map((role) => (
              <div key={role.title} className="flex flex-col rounded-sm border border-off-white/15 bg-off-white/5 p-6">
                <role.icon size={26} className="text-bronze-light" aria-hidden />
                <h3 className="mt-4 font-display text-lg font-semibold uppercase tracking-wide">{role.title}</h3>
                <p className="mt-2 flex-1 text-sm text-off-white/75">{role.description}</p>
                <Link
                  href={role.href}
                  className="mt-5 text-sm font-semibold uppercase tracking-wide text-bronze-light hover:text-off-white"
                >
                  {role.ctaLabel} &rarr;
                </Link>
              </div>
            ))}

            <div className="flex flex-col rounded-sm border border-off-white/15 bg-off-white/5 p-6">
              <Share2 size={26} className="text-bronze-light" aria-hidden />
              <h3 className="mt-4 font-display text-lg font-semibold uppercase tracking-wide">Share the Mission</h3>
              <p className="mt-2 flex-1 text-sm text-off-white/75">
                Help carry the mission further — share it with someone who&apos;d want to be part of it.
              </p>
              <div className="mt-5">
                <ShareButtons
                  url={CAMPAIGN_URL}
                  title={`I'm supporting ${CAMPAIGN_NAME} — ${formatCurrency(FUNDRAISING_GOAL)} for veterans, first responders, and their families.`}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 10. Final CTA */}
      <CTASection
        eyebrow="Join the Mission"
        title="Every Mile, Every Dollar, Moves This Forward"
        description="Chattanooga is getting closer. Be part of it."
        buttons={[{ label: "Support the Mission", href: DONATE_LINK.href }]}
      />
    </>
  );
}
