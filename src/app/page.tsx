import Link from "next/link";
import { getCampaign } from "@/lib/data/campaign";
import { getMilesWithDonations } from "@/lib/data/miles";
import { getPartners } from "@/lib/data/partners";
import { getSponsors } from "@/lib/data/sponsors";
import { getLatestPosts } from "@/lib/data/posts";
import { getTrainingSnapshot } from "@/lib/whoop/client";
import { CampaignProgress } from "@/components/campaign/campaign-progress";
import { RaceProgress } from "@/components/campaign/race-progress";
import { MilestoneRail } from "@/components/campaign/milestone-rail";
import { MileGrid } from "@/components/miles/mile-grid";
import { PartnerCard } from "@/components/partners/partner-card";
import { UpdateCard } from "@/components/updates/update-card";
import { TrainingSnapshot } from "@/components/training/training-snapshot";
import { SponsorWall } from "@/components/sponsors/sponsor-wall";
import { CTASection } from "@/components/shared/cta-section";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { ShareButtons } from "@/components/shared/share-buttons";
import { EmailSignupForm } from "@/components/forms/email-signup-form";
import { ABOUT_CONTENT } from "@/lib/content/about";
import { SITE_TAGLINE, SITE_URL } from "@/lib/constants";
import { formatCurrency, formatNumber, milesFunded, percentFunded } from "@/lib/utils";

const HERO_SUPPORTING_SENTENCE =
  "I'm taking on a 70.3-mile triathlon to raise $70,000 for organizations helping veterans find recovery, community, and their next mission.";

export default async function HomePage() {
  const [campaign, miles, partners, sponsors, latestPosts, trainingSnapshot] = await Promise.all([
    getCampaign(),
    getMilesWithDonations(),
    getPartners(),
    getSponsors(),
    getLatestPosts(3),
    getTrainingSnapshot(),
  ]);

  const percent = percentFunded(campaign.amount_raised, campaign.fundraising_goal);
  const miles70 = milesFunded(campaign.amount_raised);
  const remainingMiles = Math.max(70 - miles70, 0);
  const teaserMiles = miles.slice(0, 14);
  const hasStarted = campaign.amount_raised > 0;

  return (
    <>
      {/* Hero — who, why, what, and the dominant next action */}
      <section className="relative overflow-hidden bg-ink text-off-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: "url(/hero-placeholder.svg)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" aria-hidden="true" />

        <Container className="relative py-24 sm:py-32">
          <h1 className="text-balance font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl">
            70 for 70
          </h1>
          <p className="mt-4 max-w-xl text-lg font-medium text-off-white/90 sm:text-xl">
            {SITE_TAGLINE}
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-off-white/75">
            {HERO_SUPPORTING_SENTENCE}
          </p>

          <div className="mt-10 max-w-xl rounded-sm border border-off-white/15 bg-ink/40 p-6 backdrop-blur-sm">
            {hasStarted ? (
              <p className="font-display text-3xl font-semibold tabular-nums sm:text-4xl">
                {formatCurrency(campaign.amount_raised)}{" "}
                <span className="text-lg font-medium text-off-white/70">
                  raised of {formatCurrency(campaign.fundraising_goal)}
                </span>
              </p>
            ) : (
              <p className="font-display text-2xl font-semibold uppercase tracking-wide sm:text-3xl">
                The Starting Line
              </p>
            )}
            <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-bronze-light">
              {formatNumber(miles70, 1)} of 70 miles funded &middot; {Math.round(percent)}% to goal
            </p>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-off-white/15">
              <div className="h-full rounded-full bg-bronze" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-2 text-xs text-off-white/60">
              {hasStarted
                ? `Goal: ${formatCurrency(campaign.fundraising_goal)} · ${formatNumber(remainingMiles, 1)} miles remaining`
                : "$0 raised. 70 miles ahead. Somebody has to fund the first one."}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/fund-a-mile"
              data-analytics-event="fund_mile_click"
              className="rounded-sm bg-bronze px-8 py-4 text-base font-semibold uppercase tracking-wide text-off-white shadow-sm transition-colors hover:bg-bronze-light"
            >
              {hasStarted ? "Fund a Mile" : "Claim the First Mile"}
            </Link>
            <a
              href="#why-im-doing-this"
              className="rounded-sm border border-off-white/40 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-off-white/10"
            >
              Why I&apos;m Doing This
            </a>
            <Link
              href="/sponsors/request"
              className="text-sm font-semibold uppercase tracking-wide text-off-white/70 underline-offset-4 hover:text-off-white hover:underline"
            >
              Request to Sponsor
            </Link>
          </div>
        </Container>
      </section>

      {/* Progress */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Campaign Progress"
            title="70 Miles. $70,000. One Mission."
            description="Every $1,000 raised funds one mile of the race. Track fundraising progress against the campaign goal and the 70.3-mile race course itself."
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                Fundraising Progress
              </p>
              <CampaignProgress totalRaised={campaign.amount_raised} goal={campaign.fundraising_goal} />
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                Race Course Progress
              </p>
              <RaceProgress totalRaised={campaign.amount_raised} />
            </div>
          </div>
        </Container>
      </section>

      {/* Why I'm Doing This — the human face, before any more fundraising mechanics */}
      <section id="why-im-doing-this" className="scroll-mt-20 border-y border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:items-center">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
            <MediaPlaceholder />
          </div>

          <div>
            <SectionHeading eyebrow="Who's Behind 70 for 70" title="Why I'm Doing This" />
            <div className="mt-5 space-y-4">
              {ABOUT_CONTENT.homepageTeaser.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-charcoal-light">
                  {paragraph}
                </p>
              ))}
            </div>
            <Link
              href="/about"
              className="mt-6 inline-flex rounded-sm bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-charcoal"
            >
              Read My Story
            </Link>
          </div>
        </Container>
      </section>

      {/* Fund a Mile teaser */}
      <section className="py-16 sm:py-20">
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
            <Link
              href="/fund-a-mile"
              className="inline-flex rounded-sm bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-charcoal"
            >
              View All 70 Miles
            </Link>
          </div>
        </Container>
      </section>

      {/* Partners */}
      <section className="bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Who It Supports"
            title="Beneficiary Organizations"
            description="70 for 70 raises funds in support of veteran-focused nonprofit organizations."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        </Container>
      </section>

      {/* Latest Training */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Live" title="Latest Training" />
          <div className="mt-8">
            <TrainingSnapshot snapshot={trainingSnapshot} />
          </div>
        </Container>
      </section>

      {/* Fundraising Milestones */}
      <section className="bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="How Far We've Come" title="Fundraising Milestones" />
          <div className="mt-8">
            <MilestoneRail totalRaised={campaign.amount_raised} goal={campaign.fundraising_goal} />
          </div>
        </Container>
      </section>

      {/* Sponsors */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Backing the Mission"
            title="Sponsors"
            description="Organizations and businesses supporting 70 for 70 alongside individual donors."
          />
          <div className="mt-8">
            <SponsorWall sponsors={sponsors} />
          </div>
          <div className="mt-8">
            <Link
              href="/sponsors"
              className="inline-flex rounded-sm bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-charcoal"
            >
              Become a Sponsor
            </Link>
          </div>
        </Container>
      </section>

      {/* Latest updates */}
      {latestPosts.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Follow Along" title="Latest Updates" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Email signup */}
      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="Stay Close" title="Follow the Road to 70.3" />
          <div className="mt-6">
            <EmailSignupForm />
          </div>
        </Container>
      </section>

      {/* Share */}
      <section className="py-10">
        <Container className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            Share 70 for 70
          </p>
          <ShareButtons
            url={SITE_URL}
            title="I'm helping move 70 for 70 one mile closer to $70,000 for veterans."
          />
        </Container>
      </section>

      <CTASection
        eyebrow="Join the Mission"
        title="Every Mile Counts"
        description="Fund a mile, support the mission, or bring your company on board as a sponsor."
        buttons={[
          { label: "Fund a Mile", href: "/fund-a-mile" },
          { label: "Become a Sponsor", href: "/sponsors", variant: "secondary" },
        ]}
      />
    </>
  );
}
