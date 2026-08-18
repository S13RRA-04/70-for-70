import Link from "next/link";
import { getCampaign } from "@/lib/data/campaign";
import { getMilesWithDonations } from "@/lib/data/miles";
import { getPartners } from "@/lib/data/partners";
import { getLatestPosts } from "@/lib/data/posts";
import { CampaignProgress } from "@/components/campaign/campaign-progress";
import { RaceProgress } from "@/components/campaign/race-progress";
import { MileGrid } from "@/components/miles/mile-grid";
import { PartnerCard } from "@/components/partners/partner-card";
import { UpdateCard } from "@/components/updates/update-card";
import { CTASection } from "@/components/shared/cta-section";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { SITE_TAGLINE } from "@/lib/constants";
import { formatCurrency, formatNumber, milesFunded, percentFunded } from "@/lib/utils";

export default async function HomePage() {
  const [campaign, miles, partners, latestPosts] = await Promise.all([
    getCampaign(),
    getMilesWithDonations(),
    getPartners(),
    getLatestPosts(3),
  ]);

  const percent = percentFunded(campaign.amount_raised, campaign.fundraising_goal);
  const miles70 = milesFunded(campaign.amount_raised);
  const remainingMiles = Math.max(70 - miles70, 0);
  const teaserMiles = miles.slice(0, 14);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-off-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: "url(/hero-placeholder.svg)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" aria-hidden="true" />

        <Container className="relative py-24 sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-bronze-light">
            TODO — hero photography pending
          </p>
          <h1 className="mt-4 text-balance font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl">
            70 for 70
          </h1>
          <p className="mt-5 max-w-xl text-lg text-off-white/85 sm:text-xl">{SITE_TAGLINE}</p>

          <div className="mt-10 max-w-xl rounded-sm border border-off-white/15 bg-ink/40 p-6 backdrop-blur-sm">
            <p className="font-display text-3xl font-semibold tabular-nums sm:text-4xl">
              {formatCurrency(campaign.amount_raised)}{" "}
              <span className="text-lg font-medium text-off-white/70">raised</span>
            </p>
            <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-bronze-light">
              {formatNumber(miles70, 1)} of 70 miles funded &middot; {Math.round(percent)}% to goal
            </p>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-off-white/15">
              <div
                className="h-full rounded-full bg-bronze"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-off-white/60">
              Goal: {formatCurrency(campaign.fundraising_goal)} &middot;{" "}
              {formatNumber(remainingMiles, 1)} miles remaining
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/fund-a-mile"
              data-analytics-event="fund_mile_click"
              className="rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
            >
              Fund a Mile
            </Link>
            <Link
              href="/donate"
              data-analytics-event="donate_click"
              className="rounded-sm border border-off-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-off-white/10"
            >
              Support the Mission
            </Link>
            <Link
              href="/sponsors"
              className="text-sm font-semibold uppercase tracking-wide text-off-white/70 underline-offset-4 hover:text-off-white hover:underline"
            >
              Become a Sponsor
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
            description="Every $1,000 raised funds one mile of the race. Track fundraising progress against the campaign goal and the IRONMAN 70.3 course itself."
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

      {/* Fund a Mile teaser */}
      <section className="bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Fund a Mile"
            title="70 Miles. 70 Ways to Help."
            description="Sponsor a full mile or contribute alongside other supporters — no single mile requires one donor."
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
      <section className="py-16 sm:py-20">
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

      {/* Latest updates */}
      {latestPosts.length > 0 && (
        <section className="bg-sand-light py-16 sm:py-20">
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
