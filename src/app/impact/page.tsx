import Link from "next/link";
import { Handshake, MapPinned, Megaphone, Users } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { CTASection } from "@/components/shared/cta-section";
import { MissionProgress } from "@/components/campaign/mission-progress";
import { getMissionMetrics } from "@/lib/data/mission-metrics";
import { getAllocationBreakdown } from "@/lib/data/allocation";
import { getCampaign } from "@/lib/data/campaign";
import { CAMPAIGN_URL, MISSION_NAME, SITE_NAME, SITE_URL } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "Mission in Motion",
  description: `How ${SITE_NAME} moves the mission: the resource directory connecting people to support, and the campaigns mobilizing direct funding for organizations serving veterans, first responders, and their families.`,
  canonical: "/impact",
});

/** BreadcrumbList per credibility plan §25 — Home→page shape. */
const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: "Impact", url: `${SITE_URL}/impact` },
]);

export default async function ImpactPage() {
  const [metrics, campaign] = await Promise.all([getMissionMetrics(), getCampaign()]);
  const allocationBreakdown = await getAllocationBreakdown(campaign);

  const lastUpdated = new Date(metrics.lastUpdated).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const supportStats = [
    { label: "Raised to Date", value: metrics.totalRaised === null ? null : formatCurrency(metrics.totalRaised) },
    { label: "Verified Supporters", value: metrics.supporters === null ? null : String(metrics.supporters) },
    { label: "Campaign Partners", value: metrics.campaignPartners === null ? null : String(metrics.campaignPartners) },
    { label: "Beneficiary Organizations", value: metrics.beneficiaries === null ? null : String(metrics.beneficiaries) },
  ].filter((stat): stat is { label: string; value: string } => stat.value !== null);

  const connectStats = [
    { label: "Resources Listed", value: metrics.resources === null ? null : String(metrics.resources) },
    { label: "Areas of Need", value: metrics.resourceCategories === null ? null : String(metrics.resourceCategories) },
    { label: "States Covered", value: metrics.statesRepresented === null ? null : String(metrics.statesRepresented) },
    { label: "National Resources", value: metrics.nationalResources === null ? null : String(metrics.nationalResources) },
  ].filter((stat): stat is { label: string; value: string } => stat.value !== null);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      {/* Hero */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading
            as="h1"
            eyebrow="Impact"
            title="Mission in Motion"
            description={`${SITE_NAME} moves the mission two ways: connecting people to support that already exists, and mobilizing communities to fund the organizations doing the work. This is the live picture of both.`}
          />
        </Container>
      </section>

      {/* Connecting People */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="border border-ink/10 bg-off-white p-8">
            <MapPinned className="h-6 w-6 text-bronze" aria-hidden="true" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-bronze">
              Connecting People
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
              A Directory Built Around Real Need
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal-light">
              Every entry is reviewed for legitimacy and relevance before it goes live, organized
              by what someone needs and who they are — not by which organization paid for placement.
              The directory stays free, independent, and open to everyone who serves.
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {connectStats.map((stat) => (
                <div key={stat.label} className="rounded-sm border border-ink/10 bg-sand-light/60 p-4 text-center">
                  <dd className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                    {stat.value}
                  </dd>
                  <dt className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-charcoal-light">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
            <CTAButton href="/resources" variant="secondary" className="mt-6">
              Explore the Directory
            </CTAButton>
          </div>
        </Container>
      </section>

      {/* Mobilizing Support */}
      <section className="border-y border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="border border-ink/10 bg-off-white p-8">
            <Megaphone className="h-6 w-6 text-bronze" aria-hidden="true" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-bronze">
              Mobilizing Support
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
              Direct Funding, Shared Goal
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal-light">
              Campaigns, events, partnerships, and merchandise all feed one number:{" "}
              {MISSION_NAME}. Every figure below comes from the same verified-donation record
              every other page on this site reads — no separate totals, no rounding up.
            </p>
            {metrics.totalRaised !== null && metrics.fundraisingGoal !== null && (
              <div className="mt-6">
                <MissionProgress
                  totalRaised={metrics.totalRaised}
                  goal={metrics.fundraisingGoal}
                  breakdown={allocationBreakdown}
                />
              </div>
            )}
            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {supportStats.map((stat) => (
                <div key={stat.label} className="rounded-sm border border-ink/10 bg-sand-light/60 p-4 text-center">
                  <dd className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                    {stat.value}
                  </dd>
                  <dt className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-charcoal-light">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <CTAButton href="/campaigns" variant="secondary">
                See {MISSION_NAME}
              </CTAButton>
              <CTAButton href={`${CAMPAIGN_URL}/donate`} external variant="secondary">
                Donate
              </CTAButton>
            </div>
          </div>
        </Container>
      </section>

      {/* Who benefits + freshness stamp */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-ink/10 p-6">
              <Users className="h-6 w-6 text-bronze" aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-tight text-ink">
                Who It Reaches
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-light">
                Veterans, active military, law enforcement, fire, EMS, dispatch, corrections,
                caregivers, families, and the communities around them — wherever they are in the
                country.
              </p>
            </div>
            <div className="border border-ink/10 p-6">
              <Handshake className="h-6 w-6 text-bronze" aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-tight text-ink">
                How Funds Reach Beneficiaries
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-light">
                {SITE_NAME} doesn&apos;t run the programs it supports. Funds move to the
                confirmed beneficiary organizations behind each campaign — the breakdown is
                published alongside the totals.
              </p>
              <CTAButton href="/campaigns" variant="ghost" className="mt-3 px-0">
                See the Campaigns &rarr;
              </CTAButton>
            </div>
          </div>
          <p className="mt-8 text-xs uppercase tracking-widest text-charcoal-light">
            Fundraising totals verified {lastUpdated}
          </p>
        </Container>
      </section>

      <CTASection
        title="Two Ways to Move the Mission"
        buttons={[
          { label: "Find Support", href: "/resources" },
          { label: "Fund the Mission", href: `${CAMPAIGN_URL}/donate`, variant: "secondary" },
        ]}
      />

      <div className="border-t border-ink/10 py-8 text-center text-sm text-charcoal-light">
        Want the full picture?{" "}
        <Link href="/network" className="font-semibold text-bronze hover:text-bronze-dark">
          Explore the network &rarr;
        </Link>
      </div>
    </>
  );
}
