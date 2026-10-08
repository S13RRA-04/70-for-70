import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { CTASection } from "@/components/shared/cta-section";
import { MissionProgress } from "@/components/campaign/mission-progress";
import { getMissionMetrics } from "@/lib/data/mission-metrics";
import { getAllocationBreakdown } from "@/lib/data/allocation";
import { getCampaign } from "@/lib/data/campaign";
import { getPartners } from "@/lib/data/partners";
import { MISSION_70K_INTRO } from "@/lib/content/mission-70k";
import {
  CAMPAIGN_STATUS_LABELS,
  CAMPAIGN_URL,
  DONATE_LINK,
  FUNDRAISING_GOAL,
  MISSION_NAME,
  MISSION_ORIGIN_LINE,
  MISSION_SUPPORTING_LINE,
  MOVEMENT_CAMPAIGNS,
  SITE_URL,
  isCurrentCampaign,
} from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";
import { formatCurrency } from "@/lib/utils";

// generateMetadata so the fundraising-goal figure below reads the live
// Supabase-driven value (via getMissionMetrics -> getFundraisingImpactStats)
// instead of a separately hand-typed dollar figure that can't track it.
export async function generateMetadata(): Promise<Metadata> {
  const metrics = await getMissionMetrics();
  const goal = metrics.fundraisingGoal ?? FUNDRAISING_GOAL;
  return pageMetadata({
    title: `${MISSION_NAME} — ${MISSION_SUPPORTING_LINE}`,
    description: `${MISSION_SUPPORTING_LINE} Current For The 22 campaigns contribute toward one shared ${formatCurrency(goal)} fundraising goal supporting verified veteran-focused nonprofit organizations.`,
    canonical: "/70k",
  });
}

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: MISSION_NAME, url: `${SITE_URL}/70k` },
]);

export default async function Mission70kPage() {
  const [metrics, campaign, beneficiaries] = await Promise.all([
    getMissionMetrics(),
    getCampaign(),
    getPartners(),
  ]);
  const allocationBreakdown = await getAllocationBreakdown(campaign);
  const participatingCampaigns = MOVEMENT_CAMPAIGNS.filter(isCurrentCampaign);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <section className="overflow-hidden border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
          <SectionHeading as="h1" eyebrow={MISSION_NAME} title={MISSION_SUPPORTING_LINE} />
          <p className="mt-3 text-base font-semibold uppercase tracking-wide text-bronze-text">{MISSION_ORIGIN_LINE}</p>
          <div className="mt-6 space-y-4">
            {MISSION_70K_INTRO.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-charcoal-light">{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <CTAButton href={`${CAMPAIGN_URL}${DONATE_LINK.href}`} external>{DONATE_LINK.label}</CTAButton>
            <CTAButton href="/campaigns" variant="secondary">Explore the Campaigns</CTAButton>
          </div>
          </div>
          <div className="relative min-h-[340px] overflow-hidden rounded-sm lg:col-span-5 lg:min-h-[500px] lg:translate-x-8">
            <Image src="/journal/building-the-bike/frame-overhead.jpg" alt="The Tri For The 22 bike frame prepared for the campaign" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-7 pt-24 text-off-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">The original equation</p>
              <p className="mt-2 font-display text-3xl font-bold uppercase">70.3 miles.<br />{formatCurrency(metrics.fundraisingGoal ?? FUNDRAISING_GOAL)} goal.</p>
            </div>
          </div>
          </div>
        </Container>
      </section>

      {metrics.totalRaised !== null && metrics.fundraisingGoal !== null && (
        <section className="relative z-10 border-b border-ink/10 pb-16 sm:pb-20">
          <Container>
            <div className="-mt-8 border-t-4 border-bronze bg-off-white p-6 shadow-[0_18px_60px_rgba(18,23,28,0.1)] sm:-mt-10 sm:p-9">
            <MissionProgress
              totalRaised={metrics.totalRaised}
              goal={metrics.fundraisingGoal}
              breakdown={allocationBreakdown}
            />
            </div>
          </Container>
        </section>
      )}

      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Participating Campaigns"
            title="Multiple Campaigns. One Mission."
            description="These are the current campaign vehicles contributing toward the shared goal."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {participatingCampaigns.map((item) => (
              <div key={item.id} className="rounded-sm border border-ink/10 bg-off-white p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
                  {CAMPAIGN_STATUS_LABELS[item.status]} · {item.type}
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold uppercase tracking-tight text-ink">{item.name}</h2>
                {item.description && <p className="mt-3 text-sm leading-relaxed text-charcoal-light">{item.description}</p>}
                {item.url && <CTAButton href={item.url} external={!item.url.startsWith("/")} variant="ghost" className="mt-4 px-0">Explore &rarr;</CTAButton>}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:col-span-5">
            <SectionHeading
            eyebrow="How Funds Flow"
            title="Direct, Attributed Support"
            description="For The 22 does not represent itself as the charitable recipient. Donations are processed through approved beneficiary destinations and reconciled into the shared campaign total."
            />
            <CTAButton href={`${CAMPAIGN_URL}/beneficiaries`} external variant="secondary" className="mt-6">Meet the Beneficiaries</CTAButton>
          </div>
          <ul className="space-y-4 lg:col-span-7">
            {beneficiaries.map((beneficiary) => (
              <li key={beneficiary.id} className="border border-ink/10 border-l-4 border-l-bronze bg-sand-light/50 p-6 text-sm text-charcoal-light">
                <span className="font-semibold text-ink">{beneficiary.name}</span>
                {beneficiary.nonprofit_status_verified ? " · Verified 501(c)(3) beneficiary" : ""}
              </li>
            ))}
          </ul>
          </div>
        </Container>
      </section>

      <CTASection
        title="One Goal. Multiple Campaigns. One Mission."
        buttons={[
          { label: DONATE_LINK.label, href: `${CAMPAIGN_URL}${DONATE_LINK.href}` },
          { label: "See Mission Impact", href: "/impact", variant: "secondary" },
        ]}
      />
    </>
  );
}
