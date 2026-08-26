import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getCampaign } from "@/lib/data/campaign";
import { getPartners } from "@/lib/data/partners";
import { getFeaturedJournalEntry, getLatestJournalEntries } from "@/lib/data/journal";
import { getTrainingSnapshot } from "@/lib/whoop/client";
import { getRecentDisciplineWorkouts } from "@/lib/training-stats";
import { CampaignProgress } from "@/components/campaign/campaign-progress";
import { CampaignPhaseBanner } from "@/components/campaign/campaign-phase-banner";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { JournalCard } from "@/components/journal/journal-card";
import { Countdown } from "@/components/shared/countdown";
import { CTAButton } from "@/components/shared/cta-button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ShareButtons } from "@/components/shared/share-buttons";
import { EmailSignupForm } from "@/components/forms/email-signup-form";
import { FocusScrollSection } from "@/components/shared/focus-scroll-section";
import {
  CAMPAIGN_NAME,
  CAMPAIGN_URL,
  CURRENT_CAMPAIGN,
  DONATE_LINK,
  DOLLARS_PER_MILE,
  FUND_A_MILE_LINK,
  ORG_HOME_LINK,
  RACE_INFO,
  RACE_TOTAL_DISTANCE,
  SITE_NAME,
  SITE_TAGLINE,
  TOTAL_FUNDRAISING_MILES,
} from "@/lib/constants";
import { formatCurrency, formatDateLong } from "@/lib/utils";
import { getCampaignPhase } from "@/lib/campaign-phase";
import { pageMetadata } from "@/lib/metadata";

const HERO_EXPLAINER = `${TOTAL_FUNDRAISING_MILES} fundraising miles, ${formatCurrency(DOLLARS_PER_MILE)} each — one athlete's 70.3-mile race mapped to a ${formatCurrency(70_000)} goal for veterans.`;

export const metadata = pageMetadata({
  // Root layout's title template already appends " | {CAMPAIGN_NAME}" on
  // the campaign host (see generateMetadata in src/app/layout.tsx) — a
  // title here that repeats CAMPAIGN_NAME renders duplicated twice.
  title: SITE_TAGLINE,
  description:
    "Tri For The 22 pairs a 70.3-mile triathlon with a $70,000 fundraising goal in support of veteran-focused nonprofit organizations.",
  canonical: `${CAMPAIGN_URL}/`,
});

/** First sentence of a longer description, for compact summary cards — falls back to the whole string if there's no sentence break. */
function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](?=\s|$)/);
  return match ? match[0] : text;
}

/**
 * The campaign homepage — rendered at "/" on tri.forthe22.org via a
 * transparent middleware rewrite (see src/middleware.ts). The movement
 * homepage at src/app/page.tsx renders at "/" on forthe22.org instead.
 *
 * Six sections, per AGENTS.md's Homepage spec: (1) responsive HTML hero,
 * (2) campaign concept, (3) beneficiary summary, (4) Road to Chattanooga
 * (phase + one training update + latest journal entry), (5) support &
 * follow (compact progress preview + CTAs + share/newsletter). Full
 * beneficiary bios, the mile grid, and the full training dashboard each
 * have exactly one canonical home elsewhere (/partners, /fund-a-mile,
 * /the-race) — this page only previews and links to them.
 */
export default async function CampaignHomePage() {
  const [campaign, partners, featuredEntry, recentEntries, trainingSnapshot] = await Promise.all([
    getCampaign(),
    getPartners(),
    getFeaturedJournalEntry(),
    getLatestJournalEntries(1),
    getTrainingSnapshot(),
  ]);

  const latestJournalEntry = featuredEntry ?? recentEntries[0] ?? null;
  const recentDisciplineWorkout = trainingSnapshot ? getRecentDisciplineWorkouts(trainingSnapshot.recentWorkouts)[0] : undefined;
  const phase = getCampaignPhase();

  return (
    <>
      {/* 1. Hero — real HTML facts (not baked into the banner image), plus the countdown and both primary CTAs. */}
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

        <Container className="relative py-16 sm:py-24">
          <a
            href={ORG_HOME_LINK.href}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light hover:underline"
          >
            {SITE_NAME} Presents
          </a>
          <h1 className="mt-3 text-balance font-display text-[clamp(2.25rem,7vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-tight">
            {CAMPAIGN_NAME}
          </h1>

          <p className="mt-4 text-lg font-semibold uppercase tracking-wide text-bronze-light sm:text-xl">
            {CURRENT_CAMPAIGN.event} &middot; May 16, 2027 &middot; {RACE_INFO.raceLocation}
          </p>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-off-white/80">{HERO_EXPLAINER}</p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href={FUND_A_MILE_LINK.href}
              data-analytics-event="fund_mile_click"
              className="rounded-sm bg-bronze px-8 py-4 text-base font-semibold uppercase tracking-wide text-off-white shadow-sm transition-colors hover:bg-bronze-light"
            >
              {FUND_A_MILE_LINK.label}
            </Link>
            <Link
              href={DONATE_LINK.href}
              className="rounded-sm border border-off-white/40 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-off-white/10"
            >
              {DONATE_LINK.label}
            </Link>
          </div>

          {RACE_INFO.raceDate && (
            <div className="mt-10 max-w-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-off-white/60">
                Race Day Countdown
              </p>
              <Countdown targetIso={RACE_INFO.raceDate} />
            </div>
          )}
        </Container>
      </section>

      {/* 2. Campaign concept — trimmed "why 70 miles", not the full mission page. */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <FocusScrollSection>
            <SectionHeading eyebrow="The Concept" title="Why 70 Miles?" />
            <p className="mt-5 text-base leading-relaxed text-charcoal-light">
              {CAMPAIGN_NAME} maps {TOTAL_FUNDRAISING_MILES} fundraising miles onto the{" "}
              {RACE_TOTAL_DISTANCE}-mile {CURRENT_CAMPAIGN.event} course — one mile funded is{" "}
              {formatCurrency(DOLLARS_PER_MILE)} raised, going to {CURRENT_CAMPAIGN.beneficiaries.join(" and ")}.
            </p>
            <Link
              href="/the-mission"
              className="mt-5 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
            >
              Read the Full Campaign Story &rarr;
            </Link>
          </FocusScrollSection>
        </Container>
      </section>

      {/* 3. Beneficiary summary — compact cards, full bios live on /partners. */}
      <section className="py-16 sm:py-20">
        <Container>
          <FocusScrollSection>
            <SectionHeading
              eyebrow="Who It Supports"
              title="Beneficiary Organizations"
              description={`${CAMPAIGN_NAME} raises funds in support of veteran-focused nonprofit organizations.`}
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {partners.map((partner) => (
                <div key={partner.id} className="flex flex-col rounded-sm border border-ink/10 bg-off-white p-6">
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
                    href="/partners#beneficiaries"
                    className="mt-4 inline-flex w-fit text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
                  >
                    Learn More &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </FocusScrollSection>
        </Container>
      </section>

      {/* 4. Road to Chattanooga — phase, one training update, latest journal entry, links out. */}
      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <FocusScrollSection>
            <SectionHeading eyebrow="Follow Along" title="Road to Chattanooga" />
            <div className="mt-8">
              <CampaignPhaseBanner phase={phase} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {recentDisciplineWorkout ? (
                <div className="rounded-sm border border-ink/10 bg-off-white p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                    Latest Training
                  </p>
                  <p className="mt-2 font-display text-lg font-semibold uppercase tracking-wide text-ink">
                    {recentDisciplineWorkout.discipline === "swim" && "Swim"}
                    {recentDisciplineWorkout.discipline === "bike" && "Bike"}
                    {recentDisciplineWorkout.discipline === "run" && "Run"}
                  </p>
                  <p className="mt-1 text-sm text-charcoal-light">
                    {formatDateLong(recentDisciplineWorkout.workout.start)}
                    {recentDisciplineWorkout.workout.strain !== null &&
                      ` · Strain ${recentDisciplineWorkout.workout.strain.toFixed(1)}`}
                  </p>
                </div>
              ) : (
                <div className="rounded-sm border border-ink/10 bg-off-white p-6">
                  <p className="text-sm text-charcoal-light">
                    Training data will appear here once it&apos;s connected.
                  </p>
                </div>
              )}

              {latestJournalEntry && (
                <div className="lg:row-span-1">
                  <JournalCard entry={latestJournalEntry} />
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold uppercase tracking-wide">
              <Link href="/the-race" className="text-bronze hover:text-bronze-light">
                The Race &amp; Training &rarr;
              </Link>
              <Link href="/journal" className="text-bronze hover:text-bronze-light">
                The Journal &rarr;
              </Link>
            </div>
          </FocusScrollSection>
        </Container>
      </section>

      {/* 5. Support & follow — compact progress preview + both CTAs + share/newsletter. One closing section, not two. */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <FocusScrollSection>
            <SectionHeading eyebrow="Support the Mission" title="Every Mile Counts" />
            <div className="mt-8">
              <CampaignProgress totalRaised={campaign.amount_raised} goal={campaign.fundraising_goal} showStats={false} />
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <CTAButton href={FUND_A_MILE_LINK.href}>{FUND_A_MILE_LINK.label}</CTAButton>
              <CTAButton href={DONATE_LINK.href} variant="secondary">
                {DONATE_LINK.label}
              </CTAButton>
            </div>

            <div className="mt-10 flex flex-col gap-6 border-t border-ink/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                  Get Campaign Updates
                </p>
                <div className="mt-3">
                  <EmailSignupForm />
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                  Share {CAMPAIGN_NAME}
                </p>
                <ShareButtons
                  url={CAMPAIGN_URL}
                  title={`I'm helping move ${CAMPAIGN_NAME} one mile closer to ${formatCurrency(campaign.fundraising_goal)} for veterans.`}
                />
              </div>
            </div>

            {RACE_INFO.registrationUrl && (
              <a
                href={RACE_INFO.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-charcoal-light hover:text-ink"
              >
                Register for the Race
                <ExternalLink size={13} aria-hidden />
              </a>
            )}
          </FocusScrollSection>
        </Container>
      </section>
    </>
  );
}
