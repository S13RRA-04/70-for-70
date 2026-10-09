import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Backpack, Bike, Footprints, Music } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { MissionProgress } from "@/components/campaign/mission-progress";
import { CampaignCard } from "@/components/campaign/campaign-card";
import { RevealGrid, RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { EmptyState } from "@/components/shared/empty-state";
import { CampaignJournalEntryCard } from "@/components/campaign/campaign-journal-entry";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { getAllocationBreakdown } from "@/lib/data/allocation";
import { getCampaign } from "@/lib/data/campaign";
import { getPartners } from "@/lib/data/partners";
import { CONTRIBUTION_MECHANISMS } from "@/lib/content/campaigns";
import { getLatestCampaignJournalEntries } from "@/lib/content/campaign-journal";
import {
  CAMPAIGN_URL,
  DONATE_LINK,
  MISSION_NAME,
  MISSION_ORIGIN_LINE,
  MISSION_SUPPORTING_LINE,
  MOVEMENT_CAMPAIGNS,
  isCurrentCampaign,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";
import { formatCurrency } from "@/lib/utils";

/** However many entries exist, /campaigns only ever teases this many — the rest live on /campaigns/journal. */
const JOURNAL_TEASER_COUNT = 2;

// generateMetadata so the fundraising-goal figure below reads the live
// Supabase-driven value instead of a separately hand-typed dollar figure
// that can't track it.
export async function generateMetadata(): Promise<Metadata> {
  const { fundraisingGoal } = await getFundraisingImpactStats();
  return pageMetadata({
    title: MISSION_NAME,
    description: `${MISSION_SUPPORTING_LINE} Tri For The 22, Ruck For The 22, For The 22: Live, 22 For the 22, auctions, merchandise, sponsorships, and direct giving all contribute toward ${SITE_NAME}'s shared ${formatCurrency(fundraisingGoal)} fundraising goal.`,
    canonical: "/campaigns",
  });
}

/**
 * Mission areas for the "What's Next?" closer — areas of need, NOT promised
 * beneficiaries. Kept as plain labels with that caveat stated on the page,
 * so nothing here reads as a commitment to a specific organization.
 */
const FUTURE_MISSION_AREAS = [
  "Mental Health & Recovery",
  "First Responder Support",
  "Adaptive Sport & Recreation",
  "Families & Transition",
] as const;

/** BreadcrumbList per credibility plan §25 — Home→page shape. */
const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: "Campaigns", url: `${SITE_URL}/campaigns` },
]);

/** Joins beneficiary names into natural list copy ("A, B, and C"). */
function joinNames(names: string[]): string {
  if (names.length === 0) return "its beneficiary organizations";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export default async function CampaignsPage() {
  const [fundraisingStats, beneficiaries, campaign] = await Promise.all([
    getFundraisingImpactStats(),
    getPartners(),
    getCampaign(),
  ]);
  const allocationBreakdown = await getAllocationBreakdown(campaign);
  const current = MOVEMENT_CAMPAIGNS.filter(isCurrentCampaign);
  const beneficiaryNames = beneficiaries.map((b) => b.name);
  const journalEntries = getLatestCampaignJournalEntries(JOURNAL_TEASER_COUNT);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      {/* Hero — plan's standard intro: what campaigns are for, org-wide. The
          4-icon grid previews the portfolio below instead of leaving the
          opposite side of the text empty. */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-7">
              <SectionHeading
                as="h1"
                eyebrow="Campaigns"
                title="Movement That Moves the Mission"
                description={`${SITE_NAME} turns movement, events, storytelling, and community participation into direct support for organizations serving veterans, first responders, and their families.`}
              />
              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-bronze">{MISSION_ORIGIN_LINE}</p>
            </div>
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-4">
                {/* Fixed order (not Object.values on CAMPAIGN_ICONS) — a "22" key would otherwise sort first as an integer-like property key. */}
                {[Bike, Backpack, Music, Footprints].map((Icon, i) => (
                  <div
                    key={i}
                    className="flex aspect-square items-center justify-center rounded-sm border border-bronze/20 bg-off-white text-bronze"
                  >
                    <Icon className="h-9 w-9" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Current Mission — a campaign-index summary of the shared goal.
          MissionProgress already names the mission and states the "one
          shared goal" framing, so this section leans on that visual/numeric
          component rather than restating it in prose. /70k remains the
          authoritative mission overview. */}
      <section className="border-b border-ink/10 py-14 sm:py-16">
        <Container>
          <RevealOnScroll className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
          <SectionHeading eyebrow="Current Mission" title="Where We Stand" />
          <div className="mt-6">
            <MissionProgress
              totalRaised={fundraisingStats.amountRaised}
              goal={fundraisingStats.fundraisingGoal}
              breakdown={allocationBreakdown}
            />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <CTAButton href={`${CAMPAIGN_URL}${DONATE_LINK.href}`} external magnetic>
              {DONATE_LINK.label}
            </CTAButton>
            <CTAButton href={`${CAMPAIGN_URL}/beneficiaries`} external variant="secondary">
              Meet the Beneficiaries
            </CTAButton>
          </div>
          <p className="mt-4 text-sm text-charcoal-light">
            <Link href="/70k" className="font-semibold text-bronze hover:text-bronze-dark">
              See the full {MISSION_NAME} overview &rarr;
            </Link>
          </p>
          </div>
          <div className="relative min-h-[300px] overflow-hidden rounded-sm lg:col-span-5 lg:min-h-[400px]">
            <Image src="/the-race/chattanooga-river-bridge.jpg" alt="Chattanooga riverfront near the race course" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-6 pt-20 text-off-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-bronze-light">One mission. Many ways in.</p>
            </div>
          </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* Current campaigns — status, dates, location, and links all come from
          the shared MovementCampaign records. */}
      <section className="py-16 sm:py-24">
        <Container>
          <RevealGrid>
            <div className="grid gap-5 lg:grid-cols-2">
              {current.map((campaign) => (
                <CampaignCard key={campaign.name} campaign={campaign} />
              ))}
            </div>
          </RevealGrid>
        </Container>
      </section>

      {/* Campaign Journal teaser — mission-wide announcements (new efforts
          launching, cross-campaign milestones), not any single campaign's
          own journal/training log. Only the latest JOURNAL_TEASER_COUNT
          entries render here, however many exist in total — the full
          archive lives at /campaigns/journal so this page stays a fixed
          size. See src/lib/content/campaign-journal.ts for how to publish
          a new entry. */}
      <section id="journal" className="scroll-mt-20 border-t border-ink/10 py-16 sm:py-20">
        <Container>
          <RevealOnScroll>
            <SectionHeading
              eyebrow="Campaign Journal"
              title="Mission-Wide Announcements"
              description="New campaigns, cross-campaign milestones, and other updates that span the whole For The 22 mission — not any single campaign's own journal."
            />
          </RevealOnScroll>
          {journalEntries.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title="No Announcements Yet"
                description="Mission-wide updates will appear here as they happen."
              />
            </div>
          ) : (
            <>
              <RevealGrid>
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {journalEntries.map((entry) => (
                    <CampaignJournalEntryCard key={entry.id} entry={entry} variant="teaser" />
                  ))}
                </div>
              </RevealGrid>
              <p className="mt-6">
                <Link href="/campaigns/journal" className="text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark">
                  View the Full Campaign Journal &rarr;
                </Link>
              </p>
            </>
          )}
        </Container>
      </section>

      {/* Beyond the campaign cards — complementary contribution channels.
          The canonical mission detail remains on /70k. */}
      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <RevealOnScroll>
            <SectionHeading
              eyebrow="How the Mission Grows"
              title="Beyond the Campaigns"
              description="Auctions, merchandise, corporate sponsorships, and direct giving all feed the same shared goal — no single event carries it alone."
            />
          </RevealOnScroll>
          <RevealGrid>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {CONTRIBUTION_MECHANISMS.map((mechanism) => (
                <div key={mechanism.name} className="flex flex-col rounded-sm border border-ink/10 bg-off-white p-6">
                  <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
                    {mechanism.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-charcoal-light">{mechanism.description}</p>
                  {mechanism.href && (
                    <CTAButton href={mechanism.href} external={mechanism.external} variant="ghost" className="mt-4 px-0">
                      Learn More &rarr;
                    </CTAButton>
                  )}
                </div>
              ))}
            </div>
          </RevealGrid>
        </Container>
      </section>

      {/* What's Next? — plan §11: the $70K Mission is a milestone, not the
          ceiling. Beneficiary names come from data; future mission areas are
          labeled as areas, not promised beneficiaries. */}
      <section className="border-y border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container className="max-w-2xl">
          <RevealOnScroll>
            <SectionHeading eyebrow="What's Next?" title="The Beginning, Not the Finish Line" tone="dark" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-off-white/80">
              <p>
                The current campaigns are working toward a shared {formatCurrency(fundraisingStats.fundraisingGoal)} goal
                benefiting {joinNames(beneficiaryNames)}.
              </p>
              <p>
                But {SITE_NAME} was never intended to end with one race, one fundraising goal, or
                {beneficiaryNames.length > 0 ? ` ${beneficiaryNames.length === 2 ? "two" : String(beneficiaryNames.length)} organizations` : " a fixed list of organizations"}.
              </p>
              <p>
                We are exploring future fundraising opportunities supporting additional verified
                nonprofit organizations serving veterans, first responders, and their families.
              </p>
            </div>
            <blockquote className="mt-8 border-l-2 border-bronze pl-5 font-display text-xl font-semibold uppercase tracking-tight text-bronze-light sm:text-2xl">
              The $70K Mission has a finish line. {SITE_NAME} does not.
            </blockquote>
            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">
                Areas of Future Focus
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {FUTURE_MISSION_AREAS.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border border-off-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-off-white/80"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-off-white/50">
                Mission areas of interest — not commitments to specific organizations or campaigns.
              </p>
            </div>
          </RevealOnScroll>
        </Container>
      </section>

    </>
  );
}
