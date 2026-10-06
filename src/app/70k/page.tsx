import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { CTASection } from "@/components/shared/cta-section";
import { RevealGrid } from "@/components/shared/reveal-on-scroll";
import { MissionProgress } from "@/components/campaign/mission-progress";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { getAllocationBreakdown } from "@/lib/data/allocation";
import { getCampaign } from "@/lib/data/campaign";
import { MISSION_70K_INTRO, CONTRIBUTION_MECHANISMS } from "@/lib/content/mission-70k";
import {
  CAMPAIGN_URL,
  CURRENT_CAMPAIGN,
  DONATE_LINK,
  MISSION_NAME,
  MISSION_ORIGIN_LINE,
  MISSION_SUPPORTING_LINE,
  SITE_URL,
} from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: `${MISSION_NAME} — ${MISSION_SUPPORTING_LINE}`,
  description: `${MISSION_SUPPORTING_LINE} Tri For The 22, Ruck For The 22, For The 22: Live, 22 For the 22, auctions, merchandise, sponsorships, and direct giving all contribute toward a shared $70,000 fundraising goal supporting veteran-focused nonprofit organizations.`,
  canonical: "/70k",
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: MISSION_NAME, url: `${SITE_URL}/70k` },
]);

/**
 * The authoritative page for The $70K Mission (see MISSION_NAME in
 * src/lib/constants.ts) — org-site route, not campaign-specific. Reads the
 * same canonical public.campaign totals every other money-displaying page
 * reads (getFundraisingImpactStats()), never a separate/hardcoded figure.
 */
export default async function Mission70kPage() {
  const [fundraisingStats, campaign] = await Promise.all([getFundraisingImpactStats(), getCampaign()]);
  const allocationBreakdown = await getAllocationBreakdown(campaign);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading as="h1" eyebrow={MISSION_NAME} title={MISSION_SUPPORTING_LINE} />
          <p className="mt-3 text-base font-semibold uppercase tracking-wide text-bronze-text">{MISSION_ORIGIN_LINE}</p>
          <div className="mt-6 space-y-4">
            {MISSION_70K_INTRO.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-charcoal-light">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CTAButton href={`${CAMPAIGN_URL}/donate`} external magnetic>
              Support {MISSION_NAME}
            </CTAButton>
            <CTAButton href="/campaigns" variant="secondary">
              Explore the Campaigns
            </CTAButton>
          </div>
        </Container>
      </section>

      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container className="max-w-2xl">
          <MissionProgress
            totalRaised={fundraisingStats.amountRaised}
            goal={fundraisingStats.fundraisingGoal}
            breakdown={allocationBreakdown}
          />
        </Container>
      </section>

      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="How the Mission Grows"
            title="Every Campaign Moves the Mission Forward"
            description="Tri For The 22 inspired the number. These are the campaigns and mechanisms currently contributing toward it."
          />
          <RevealGrid>
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
          </RevealGrid>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading
            eyebrow="Who It Supports"
            title="Supported Organizations"
            description={`${MISSION_NAME} supports veteran-serving organizations including ${CURRENT_CAMPAIGN.beneficiaries.join(" and ")}.`}
          />
          <p className="mt-4 text-sm text-charcoal-light">
            For The 22 does not operate these programs directly — it raises awareness and direct support for
            organizations already doing the work.
          </p>
          <CTAButton href={`${CAMPAIGN_URL}/beneficiaries`} external variant="secondary" className="mt-6">
            Meet the Beneficiaries
          </CTAButton>
        </Container>
      </section>

      <CTASection
        title="One Goal. Multiple Campaigns. One Mission."
        description="70.3 miles inspired the number. A community will reach it."
        buttons={[
          { label: DONATE_LINK.label, href: `${CAMPAIGN_URL}${DONATE_LINK.href}` },
          { label: "Explore the Campaigns", href: "/campaigns", variant: "secondary" },
        ]}
      />
    </>
  );
}
