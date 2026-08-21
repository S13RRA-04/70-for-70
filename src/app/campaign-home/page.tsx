import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCampaign } from "@/lib/data/campaign";
import { getMilesWithDonations } from "@/lib/data/miles";
import { getPartners } from "@/lib/data/partners";
import { getSponsors } from "@/lib/data/sponsors";
import { getLatestPosts } from "@/lib/data/posts";
import { getTrainingSnapshot } from "@/lib/whoop/client";
import { CampaignProgress } from "@/components/campaign/campaign-progress";
import { CampaignPhaseBanner } from "@/components/campaign/campaign-phase-banner";
import { RaceProgress } from "@/components/campaign/race-progress";
import { MileGrid } from "@/components/miles/mile-grid";
import { PartnerCard } from "@/components/partners/partner-card";
import { UpdateCard } from "@/components/updates/update-card";
import { TrainingSnapshot } from "@/components/training/training-snapshot";
import { SponsorWall } from "@/components/sponsors/sponsor-wall";
import { CTASection } from "@/components/shared/cta-section";
import { CTAButton } from "@/components/shared/cta-button";
import { MobileActionBar } from "@/components/shared/mobile-action-bar";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ShareButtons } from "@/components/shared/share-buttons";
import { EmailSignupForm } from "@/components/forms/email-signup-form";
import {
  ATHLETIC_TEAM_NAME,
  CAMPAIGN_NAME,
  CAMPAIGN_URL,
  CURRENT_CAMPAIGN,
  DONATE_LINK,
  DOLLARS_PER_MILE,
  ORG_HOME_LINK,
  RACE_INFO,
  RACE_TOTAL_DISTANCE,
  SITE_TAGLINE,
  TOTAL_FUNDRAISING_MILES,
} from "@/lib/constants";
import { formatCurrency, formatNumber, milesFunded, percentFunded } from "@/lib/utils";
import { getCampaignPhase } from "@/lib/campaign-phase";

const HERO_SUPPORTING_SENTENCE = `One athlete taking on ${CURRENT_CAMPAIGN.event} to raise awareness and support organizations helping veterans recover, reconnect, and move forward.`;

export const metadata: Metadata = {
  title: `${CAMPAIGN_NAME} | ${SITE_TAGLINE}`,
  description:
    "Tri For The 22 pairs a 70.3-mile triathlon with a $70,000 fundraising goal in support of veteran-focused nonprofit organizations.",
  alternates: { canonical: `${CAMPAIGN_URL}/` },
};

/**
 * The campaign homepage — rendered at "/" on tri.forthe22.org via a
 * transparent middleware rewrite (see src/middleware.ts). The movement
 * homepage at src/app/page.tsx renders at "/" on forthe22.org instead.
 *
 * Section order follows the fundraising-microsite spec: hero → one
 * fundraising-progress interface (not duplicated) → campaign explanation
 * → beneficiaries → fund-a-mile → race/training → sponsors → latest
 * update(s) → final donate CTA. The founder story is deliberately NOT
 * reproduced here — it lives on ForThe22.org (see the "Why 70 Miles?"
 * section's link out) so it has one authoritative home instead of two.
 */
export default async function CampaignHomePage() {
  const [campaign, miles, partners, sponsors, latestPosts, trainingSnapshot] = await Promise.all([
    getCampaign(),
    getMilesWithDonations(),
    getPartners(),
    getSponsors(),
    getLatestPosts(2),
    getTrainingSnapshot(),
  ]);

  const percent = percentFunded(campaign.amount_raised, campaign.fundraising_goal);
  const miles70 = milesFunded(campaign.amount_raised);
  const teaserMiles = miles.slice(0, 14);
  const phase = getCampaignPhase();

  return (
    <>
      {/* Hero — Tier 1: brand hierarchy, campaign facts, two CTAs max */}
      <section className="relative overflow-hidden bg-ink text-off-white">
        {/* The banner graphic already carries the title, tagline, stats, and
            mark — shown at its native aspect ratio, not cropped as a cover
            background, so nothing bakes into an inaccessible image alone
            without an equivalent below. */}
        <div className="relative aspect-[3/1] w-full">
          <Image
            src="/tri-for-the-22-banner.png"
            alt={`${CAMPAIGN_NAME} — ${RACE_TOTAL_DISTANCE} Miles. ${formatCurrency(campaign.fundraising_goal)}. One Mission. Chattanooga 2027.`}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>

        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.08]"
            style={{ backgroundImage: "url(/topo-map.png)" }}
            aria-hidden="true"
          />
          <Container className="relative py-10 sm:py-14">
            <a
              href={ORG_HOME_LINK.href}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light hover:underline"
            >
              {ATHLETIC_TEAM_NAME} Presents
            </a>
            <h1 className="sr-only">{CAMPAIGN_NAME}</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-off-white/75">
              {HERO_SUPPORTING_SENTENCE}
            </p>

            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-sm text-off-white/70">
              {RACE_INFO.raceLocation && (
                <div>
                  <dt className="sr-only">Location</dt>
                  <dd>{RACE_INFO.raceLocation}</dd>
                </div>
              )}
              <div>
                <dt className="sr-only">Beneficiaries</dt>
                <dd>{CURRENT_CAMPAIGN.beneficiaries.join(" · ")}</dd>
              </div>
            </dl>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href={DONATE_LINK.href}
                data-analytics-event="support_campaign_click"
                className="rounded-sm bg-bronze px-8 py-4 text-base font-semibold uppercase tracking-wide text-off-white shadow-sm transition-colors hover:bg-bronze-light"
              >
                Support the Campaign
              </Link>
              <Link
                href="/fund-a-mile"
                className="rounded-sm border border-off-white/40 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-off-white/10"
              >
                Fund a Mile
              </Link>
            </div>

            <a
              href="#why-70-miles"
              className="mt-8 inline-flex text-xs font-semibold uppercase tracking-widest text-off-white/60 hover:text-off-white"
            >
              Why I&apos;m Racing &rarr;
            </a>
          </Container>
        </div>
      </section>

      {/* Fundraising Progress — Tier 1: one strong interface, not several cards */}
      <section className="bg-off-white py-16 sm:py-20">
        <Container className="max-w-2xl">
          <CampaignPhaseBanner phase={phase} />
          <CampaignProgress totalRaised={campaign.amount_raised} goal={campaign.fundraising_goal} />
        </Container>
      </section>

      {/* Why 70 Miles? — Tier 3: one concise editorial explanation, no card */}
      <section id="why-70-miles" className="scroll-mt-20 border-y border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="The Concept" title="Why 70 Miles?" />
          <div className="mt-5 space-y-4 text-base leading-relaxed text-charcoal-light">
            <p>
              {CAMPAIGN_NAME} maps {TOTAL_FUNDRAISING_MILES} fundraising miles onto the{" "}
              {RACE_TOTAL_DISTANCE}-mile {CURRENT_CAMPAIGN.event} course — one mile funded is{" "}
              {formatCurrency(DOLLARS_PER_MILE)} raised, until the full {formatCurrency(campaign.fundraising_goal)}{" "}
              goal is reached.
            </p>
            <p>
              Every dollar goes to {CURRENT_CAMPAIGN.beneficiaries.join(", ")} — nonprofit
              organizations helping veterans rebuild recovery, community, and purpose after
              service.
            </p>
          </div>
          <a
            href={`${ORG_HOME_LINK.href}/about`}
            className="mt-6 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
          >
            Read the Full Story on {ORG_HOME_LINK.label} &rarr;
          </a>
        </Container>
      </section>

      {/* Beneficiary Organizations — Tier 2: wide feature panels, not small cards */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Who It Supports"
            title="Beneficiary Organizations"
            description={`${CAMPAIGN_NAME} raises funds in support of veteran-focused nonprofit organizations.`}
          />
          <div className="mt-8 flex flex-col gap-6">
            {partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/partners"
              className="text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
            >
              View All Partners &rarr;
            </Link>
          </div>
        </Container>
      </section>

      {/* Fund a Mile — Tier 2: functional preview */}
      <section className="bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Fund a Mile"
            title="70 Miles. 70 Ways to Help."
            description="Fund a full mile or contribute toward one alongside other supporters — no single mile requires one donor."
          />
          <div className="mt-8">
            <MileGrid miles={teaserMiles} showFilters={false} />
          </div>
          <div className="mt-8">
            <CTAButton href="/fund-a-mile">View All 70 Miles</CTAButton>
          </div>
        </Container>
      </section>

      {/* Race + Training — Tier 2: athletic dashboard split */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="The Race" title="Race &amp; Training Progress" />
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                Course Progress
              </p>
              <RaceProgress totalRaised={campaign.amount_raised} />
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                Latest Training
              </p>
              {trainingSnapshot ? (
                <TrainingSnapshot snapshot={trainingSnapshot} />
              ) : (
                <p className="text-sm text-charcoal-light">
                  Training data will appear here once it&apos;s connected.
                </p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Sponsors — Tier 2 */}
      <section className="bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Backing the Mission"
            title="Campaign Sponsors"
            description={`Organizations and businesses supporting ${CAMPAIGN_NAME} alongside individual donors.`}
          />
          <div className="mt-8">
            <SponsorWall sponsors={sponsors} />
          </div>
          <div className="mt-8">
            <CTAButton href="/sponsors">Become a Sponsor</CTAButton>
          </div>
        </Container>
      </section>

      {/* Latest Update(s) — Tier 3: one or two, not a full archive grid */}
      {latestPosts.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Follow Along" title="Latest Update" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {latestPosts.map((post) => (
                <UpdateCard key={post.id} post={post} />
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/updates"
                className="text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
              >
                View All Updates &rarr;
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* Follow + Share — secondary utility, kept light-touch ahead of the final CTA */}
      <section className="border-t border-ink/10 bg-sand-light py-10 sm:py-12">
        <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
              Follow the Road to {RACE_TOTAL_DISTANCE}
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
        </Container>
      </section>

      {/* Final Donate CTA — Tier 1 */}
      <CTASection
        eyebrow="Join the Mission"
        title={`${formatNumber(miles70, 1)} of ${TOTAL_FUNDRAISING_MILES} Miles Funded (${Math.round(percent)}%)`}
        description="Every mile counts. Support the campaign, fund a mile, or bring your company on board as a sponsor."
        buttons={[
          { label: "Support the Campaign", href: DONATE_LINK.href },
          { label: "Fund a Mile", href: "/fund-a-mile", variant: "secondary" },
        ]}
      />

      <div className="h-16 sm:hidden" aria-hidden="true" />
      <MobileActionBar
        secondary={{ label: "Fund a Mile", href: "/fund-a-mile" }}
        primary={{ label: DONATE_LINK.label, href: DONATE_LINK.href }}
      />
    </>
  );
}
