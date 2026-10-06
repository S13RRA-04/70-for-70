import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGrid } from "@/components/shared/reveal-on-scroll";
import { CTAButton } from "@/components/shared/cta-button";
import { MissionProgress } from "@/components/campaign/mission-progress";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { getPartners } from "@/lib/data/partners";
import {
  MISSION_NAME,
  MISSION_ORIGIN_LINE,
  MISSION_SUPPORTING_LINE,
  MOVEMENT_CAMPAIGNS,
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

/** BreadcrumbList per credibility plan §25 — same Home→page shape as /70k. */
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
  const [fundraisingStats, beneficiaries] = await Promise.all([
    getFundraisingImpactStats(),
    getPartners(),
  ]);
  const current = MOVEMENT_CAMPAIGNS.filter((c) => c.status === "current");
  const future = MOVEMENT_CAMPAIGNS.filter((c) => c.status === "future");
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

      {/* Current Mission — the shared $70K goal every campaign feeds. */}
      <section className="border-b border-ink/10 py-14 sm:py-16">
        <Container className="max-w-2xl">
          <SectionHeading
            eyebrow="Current Mission"
            title={MISSION_NAME}
            description={`What began as a 70.3-mile triathlon challenge grew into something bigger. ${SITE_NAME} is working toward a shared $70,000 fundraising goal in support of ${joinNames(beneficiaryNames)}. Tri For The 22 inspired the number — but reaching it will take more than one athlete and one race. That's why every ${SITE_NAME} campaign contributes toward the same mission.`}
          />
          <div className="mt-8">
            <MissionProgress totalRaised={fundraisingStats.amountRaised} goal={fundraisingStats.fundraisingGoal} />
          </div>
          <p className="mt-4 text-sm text-charcoal-light">Every campaign below contributes toward this total.</p>
          <p className="mt-3 text-sm text-charcoal-light">
            See where the wider mission stands —{" "}
            <Link href="/impact" className="font-semibold text-bronze hover:text-bronze-dark">
              Mission in Motion &rarr;
            </Link>
          </p>
        </Container>
      </section>

      {/* Current campaigns — per-campaign status comes from MOVEMENT_CAMPAIGNS
          (statusLabel/statusNote), not hardcoded per card. */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <RevealGrid>
            <div className="space-y-8">
              {current.map((campaign) => {
                const isSameSite = "url" in campaign && campaign.url.startsWith("/");
                const statusLine = [
                  "statusLabel" in campaign ? campaign.statusLabel : "Active",
                  campaign.discipline,
                  "statusNote" in campaign ? campaign.statusNote : null,
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
          </RevealGrid>
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

      {future.length > 0 && (
        <section className="bg-sand-light py-16 sm:py-20">
          <Container className="max-w-3xl">
            <SectionHeading
              eyebrow="Future Campaigns"
              title="Possible Future Campaigns"
              description={`If ${current.map((c) => c.name).join(" or ") || "the current campaigns"} go well, future personal challenges may follow the same "[Mission] For The 22" naming idea — not a managed program or a commitment with dates, just a naming convention.`}
            />
            <RevealGrid>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {future.map((campaign) => (
                  <div key={campaign.name} className="rounded-sm border border-ink/10 bg-off-white p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light/80">
                      Future
                    </p>
                    <p className="mt-1 font-display text-base font-semibold uppercase tracking-wide text-ink">
                      {campaign.name}
                    </p>
                    <p className="mt-0.5 text-xs text-charcoal-light">{campaign.discipline}</p>
                  </div>
                ))}
              </div>
            </RevealGrid>
          </Container>
        </section>
      )}
    </>
  );
}
