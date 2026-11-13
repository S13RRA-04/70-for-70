import Image from "next/image";
import Link from "next/link";
import { Handshake, Users } from "lucide-react";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { PillarNextSteps } from "@/components/shared/pillar-next-steps";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { CTASection } from "@/components/shared/cta-section";
import { RevealGrid, RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { MissionProgress } from "@/components/campaign/mission-progress";
import { PartnerCard } from "@/components/partners/partner-card";
import { getMissionMetrics } from "@/lib/data/mission-metrics";
import { getAllocationBreakdown } from "@/lib/data/allocation";
import { getCampaign } from "@/lib/data/campaign";
import { getPartners } from "@/lib/data/partners";
import { DONATE_LINK, MISSION_NAME, MOVEMENT_CAMPAIGNS, SITE_NAME, SITE_URL, isCurrentCampaign } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "Impact",
  description: `The fundraising behind ${MISSION_NAME} and the organizations it funds — Mighty Oaks Foundation and Veterans and Athletes United — with every total verified and published.`,
  canonical: "/impact",
});

/** BreadcrumbList per credibility plan §25 — Home→page shape. */
const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: "Impact", url: `${SITE_URL}/impact` },
]);

/**
 * The Impact pillar's hub: where the money goes. Leads with the shared
 * fundraising total, then the beneficiary organizations themselves
 * (#beneficiaries — the old Tri /beneficiaries URL redirects here), then
 * the campaigns raising for them. Resource-directory reach belongs to the
 * Connection pillar (/resources), not here.
 */
export default async function ImpactPage() {
  const [metrics, campaign, beneficiaries] = await Promise.all([getMissionMetrics(), getCampaign(), getPartners()]);
  const allocationBreakdown = await getAllocationBreakdown(campaign);
  const allocationByOrg = new Map(
    allocationBreakdown?.byOrganization.map((entry) => [entry.organization, entry.amount]) ?? [],
  );
  const fundraisers = MOVEMENT_CAMPAIGNS.filter(isCurrentCampaign);

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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <PageHero
        pillar="impact"
        eyebrow="03 · Impact"
        title="Where the mission lands"
        description={`Every ${SITE_NAME} campaign raises money for the same organizations, toward one shared goal. Here's what's been raised, who it funds, and how it gets there.`}
        aside={
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src="/about/hiking.jpg"
              alt="Moving forward together on the trail"
              fill
              priority
              sizes="(min-width: 1024px) 34vw, 100vw"
              className="object-cover"
            />
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <CTAButton href={DONATE_LINK.href} size="lg" magnetic>
            Donate
          </CTAButton>
          <CTAButton href="#beneficiaries" variant="secondary" size="lg">
            Who we fund
          </CTAButton>
        </div>
      </PageHero>

      {/* The fundraising — one shared total, from the verified-donation record. */}
      <section className="py-16 sm:py-20">
        <Container>
          <RevealOnScroll>
            <SectionHeading eyebrow={MISSION_NAME} title="The fundraising" />
            {metrics.totalRaised !== null && metrics.fundraisingGoal !== null && (
              <div className="mt-8 max-w-3xl">
                <MissionProgress
                  totalRaised={metrics.totalRaised}
                  goal={metrics.fundraisingGoal}
                  breakdown={allocationBreakdown}
                />
              </div>
            )}
            <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {supportStats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-line bg-white p-5 text-center">
                  <dd className="font-display text-3xl text-navy sm:text-4xl">{stat.value}</dd>
                  <dt className="label-caps mt-1 text-xs text-steel">{stat.label}</dt>
                </div>
              ))}
            </dl>
            <p className="label-caps mt-6 text-xs text-steel">Fundraising totals verified {lastUpdated}</p>
          </RevealOnScroll>
        </Container>
      </section>

      {/* Who we fund */}
      <section id="beneficiaries" className="scroll-mt-28 border-y border-line bg-paper py-16 sm:py-20">
        <Container>
          <RevealOnScroll>
            <SectionHeading
              eyebrow="Who we fund"
              title="The organizations doing the work"
              description={`${SITE_NAME} doesn't run programs of its own. Every campaign raises money for these verified nonprofits, chosen for the impact they already have with veterans, first responders, and their families.`}
            />
          </RevealOnScroll>
          <RevealGrid>
            <div className="mt-8 flex flex-col gap-6">
              {beneficiaries.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} allocatedAmount={allocationByOrg.get(partner.name)} />
              ))}
            </div>
          </RevealGrid>
          <p className="mt-8 max-w-2xl text-sm text-copy">
            Donations are made directly through each independent nonprofit organization&apos;s authorized donation
            platform. {SITE_NAME} does not receive, process, or take possession of charitable contributions and does
            not issue tax receipts.
          </p>
          <CTAButton href={DONATE_LINK.href} className="mt-6">
            Donate
          </CTAButton>
        </Container>
      </section>

      {/* The fundraisers — the Mobilization campaigns that feed this total. */}
      <section className="py-16 sm:py-20">
        <Container>
          <RevealOnScroll>
            <SectionHeading eyebrow="The fundraisers" title="Campaigns raising for the mission" />
          </RevealOnScroll>
          <RevealGrid>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fundraisers.map((c) => (
                <li key={c.id} className="flex flex-col rounded-xl border border-line bg-white p-6">
                  <span className="label-caps text-xs text-olive">{c.type}</span>
                  <span className="mt-2 font-display text-2xl uppercase leading-none text-navy">{c.name}</span>
                  {c.url && (
                    <a href={c.url} className="mt-4 font-bold text-navy hover:text-help hover:underline">
                      See the campaign →
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </RevealGrid>
          <p className="mt-6">
            <Link href="/campaigns" className="font-bold text-navy hover:text-help hover:underline">
              All campaigns and ways to get involved →
            </Link>
          </p>
        </Container>
      </section>

      {/* Who it reaches + how funds move */}
      <section className="border-t border-line py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-line p-6">
              <Users className="h-6 w-6 text-impact" aria-hidden="true" />
              <h3 className="mt-4 font-display text-xl uppercase text-navy">Who It Reaches</h3>
              <p className="mt-2 text-sm leading-relaxed text-copy">
                Veterans, active military, law enforcement, fire, EMS, dispatch, corrections, caregivers, families, and
                the communities around them — wherever they are in the country.
              </p>
            </div>
            <div className="rounded-xl border border-line p-6">
              <Handshake className="h-6 w-6 text-impact" aria-hidden="true" />
              <h3 className="mt-4 font-display text-xl uppercase text-navy">How Funds Move</h3>
              <p className="mt-2 text-sm leading-relaxed text-copy">
                Gifts go straight from you to each organization through its own platform. We verify each one with the
                organization before it counts toward the total.
              </p>
              <CTAButton href="/transparency" variant="ghost" className="mt-3 px-0">
                Read the transparency page &rarr;
              </CTAButton>
            </div>
          </div>
        </Container>
      </section>

      <CTASection
        title="Give, or get help"
        buttons={[
          { label: "Donate", href: DONATE_LINK.href },
          { label: "Get Help Now", href: "/crisis", variant: "secondary" },
        ]}
      />

      <PillarNextSteps current="impact" />
    </>
  );
}
