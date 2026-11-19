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
import { getVoiceGallery } from "@/lib/data/voices";
import { getCurrentEventConfig } from "@/lib/data/event-config";
import { getEventRegistrationStats } from "@/lib/data/event-registration-stats";
import { COMPLETED_RUCK_MISSIONS } from "@/lib/content/ruck-missions";
import { DONATE_LINK, EVENT22_CAMPAIGN_PATH, MISSION_NAME, MOVEMENT_CAMPAIGNS, RUCK_CAMPAIGN_PATH, SITE_NAME, SITE_URL, isCurrentCampaign } from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "Impact",
  description: `The fundraising behind ${MISSION_NAME} and the organizations it funds — Mighty Oaks Foundation and Veterans and Athletes United — plus the mission work beyond the money, with every number verified and published.`,
  canonical: "/impact",
});

/** BreadcrumbList per credibility plan §25 — Home→page shape. */
const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: "Impact", url: `${SITE_URL}/impact` },
]);

/**
 * The Impact pillar's hub, in two deliberately separate parts:
 *
 *  1. The fundraising — the shared verified total, the beneficiary
 *     organizations (#beneficiaries — the old Tri /beneficiaries URL
 *     redirects here), the campaigns raising for them, and how funds move.
 *  2. Mission impact (#mission-impact) — non-financial outcomes: Voices
 *     messages published, miles rucked for awareness, 22 For the 22
 *     participants, verified support resources. Each figure comes from an
 *     existing source of truth and is hidden when zero/unmeasured, never
 *     shown as a guess. Dollars never appear in this half.
 */
export default async function ImpactPage() {
  const [metrics, campaign, beneficiaries, voices, currentEvent] = await Promise.all([
    getMissionMetrics(),
    getCampaign(),
    getPartners(),
    // Published, permission-cleared Voices messages only — the same source as /voices.
    getVoiceGallery(),
    getCurrentEventConfig(),
  ]);
  const event22Stats = currentEvent ? await getEventRegistrationStats(currentEvent.id) : null;
  const ruckMiles = COMPLETED_RUCK_MISSIONS.reduce((sum, mission) => sum + mission.distanceMiles, 0);
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

  // Non-financial outcomes. Zero/unknown values are hidden rather than shown.
  const ruckCount = COMPLETED_RUCK_MISSIONS.length;
  const missionStats = [
    { label: "Voices Added", detail: "Published messages of hope from public figures", value: voices.length, href: "/voices" },
    {
      label: "Miles Rucked for Awareness",
      detail: `${ruckCount} completed Ruck For The 22 mission${ruckCount === 1 ? "" : "s"}`,
      value: ruckMiles,
      href: RUCK_CAMPAIGN_PATH,
    },
    {
      label: "22 For the 22 Participants",
      detail: "People registered to move 22 for the 22",
      value: event22Stats?.total_participants ?? 0,
      href: EVENT22_CAMPAIGN_PATH,
    },
    { label: "Verified Support Resources", detail: "Programs in the free resource directory", value: metrics.resources ?? 0, href: "/resources" },
  ].filter((stat) => stat.value > 0);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <PageHero
        pillar="impact"
        title="Where the mission lands"
        description={`Every ${SITE_NAME} campaign raises money for the same organizations, toward one shared goal. Here's what's been raised, who it funds, and how it gets there — and the mission work that isn't measured in dollars.`}
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
          {missionStats.length > 0 && (
            <CTAButton href="#mission-impact" variant="ghost" size="lg">
              Mission impact
            </CTAButton>
          )}
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

      {/* Mission impact — everything that isn't money. */}
      {missionStats.length > 0 && (
        <section id="mission-impact" className="scroll-mt-28 bg-navy py-16 text-white sm:py-20">
          <Container>
            <RevealOnScroll>
              <SectionHeading
                tone="dark"
                eyebrow="Beyond the fundraising"
                title="Mission impact"
                description="Awareness, connection, and community — the work that doesn't show up in a fundraising total."
              />
            </RevealOnScroll>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {missionStats.map((stat) => (
                <div
                  key={stat.label}
                  className="relative flex flex-col rounded-xl border border-white/15 bg-white/5 p-6 transition-colors has-[a:hover]:border-white/40 has-[a:focus-visible]:border-gold"
                >
                  <dt className="order-2 mt-3">
                    <Link
                      href={stat.href}
                      className="label-caps text-xs text-gold after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none"
                    >
                      {stat.label}
                    </Link>
                    <span className="mt-2 block text-sm leading-snug text-white/70">{stat.detail}</span>
                  </dt>
                  <dd className="order-1 font-display text-5xl leading-none">{formatNumber(stat.value)}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      )}

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
