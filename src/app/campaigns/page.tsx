import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { MissionProgress } from "@/components/campaign/mission-progress";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { getAllocationBreakdown } from "@/lib/data/allocation";
import { getCampaign } from "@/lib/data/campaign";
import { getPartners } from "@/lib/data/partners";
import { CONTRIBUTION_MECHANISMS } from "@/lib/content/campaigns";
import {
  CAMPAIGN_URL,
  DONATE_LINK,
  MISSION_NAME,
  MISSION_ORIGIN_LINE,
  MISSION_SUPPORTING_LINE,
  CAMPAIGN_STATUS_LABELS,
  MOVEMENT_CAMPAIGNS,
  isCurrentCampaign,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: MISSION_NAME,
  description: `${MISSION_SUPPORTING_LINE} Tri For The 22, Ruck For The 22, For The 22: Live, 22 For the 22, auctions, merchandise, sponsorships, and direct giving all contribute toward ${SITE_NAME}'s shared $70,000 fundraising goal.`,
  canonical: "/campaigns",
});

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

function formatCampaignDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      {/* Hero — plan's standard intro: what campaigns are for, org-wide. */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading
            as="h1"
            eyebrow="Campaigns"
            title="Movement That Moves the Mission"
            description={`${SITE_NAME} turns movement, events, storytelling, and community participation into direct support for organizations serving veterans, first responders, and their families.`}
          />
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-bronze">{MISSION_ORIGIN_LINE}</p>
        </Container>
      </section>

      {/* Current Mission — a campaign-index summary of the shared goal.
          MissionProgress already names the mission and states the "one
          shared goal" framing, so this section leans on that visual/numeric
          component rather than restating it in prose. /70k remains the
          authoritative mission overview. */}
      <section className="border-b border-ink/10 py-14 sm:py-16">
        <Container className="max-w-2xl">
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
        </Container>
      </section>

      {/* Current campaigns — status, dates, location, and links all come from
          the shared MovementCampaign records. */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <>
            <div className="space-y-8">
              {current.map((campaign) => {
                const isSameSite = "url" in campaign && campaign.url.startsWith("/");
                const dateLine = campaign.startDate
                  ? campaign.endDate
                    ? `${formatCampaignDate(campaign.startDate)}–${formatCampaignDate(campaign.endDate)}`
                    : formatCampaignDate(campaign.startDate)
                  : null;
                const statusLine = [
                  CAMPAIGN_STATUS_LABELS[campaign.status],
                  campaign.type,
                  campaign.location,
                  dateLine,
                ]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <div key={campaign.name} className="border border-ink/10 bg-off-white p-8">
                    <p className="text-xs font-semibold uppercase tracking-widest text-bronze">{statusLine}</p>
                    <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
                      {campaign.name}
                    </h2>
                    {"description" in campaign && (
                      <p className="mt-4 max-w-xl text-base leading-relaxed text-charcoal-light">
                        {campaign.description}
                      </p>
                    )}
                    <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                      Contributes to {MISSION_NAME}
                    </p>
                    {"url" in campaign && (
                      <CTAButton href={campaign.url} external={!isSameSite} className="mt-6">
                        Explore {campaign.name}
                      </CTAButton>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        </Container>
      </section>

      {/* Beyond the campaign cards — complementary contribution channels.
          The canonical mission detail remains on /70k. */}
      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="How the Mission Grows"
            title="Beyond the Campaigns"
            description="Auctions, merchandise, corporate sponsorships, and direct giving all feed the same shared goal — no single event carries it alone."
          />
          <>
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
          </>
        </Container>
      </section>

      {/* What's Next? — plan §11: the $70K Mission is a milestone, not the
          ceiling. Beneficiary names come from data; future mission areas are
          labeled as areas, not promised beneficiaries. */}
      <section className="border-y border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="What's Next?" title="The Beginning, Not the Finish Line" tone="dark" />
          <div className="mt-6 space-y-4 text-base leading-relaxed text-off-white/80">
            <p>
              The current campaigns are working toward a shared $70,000 goal benefiting{" "}
              {joinNames(beneficiaryNames)}.
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
        </Container>
      </section>

    </>
  );
}
