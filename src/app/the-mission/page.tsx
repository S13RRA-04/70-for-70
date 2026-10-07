import Link from "next/link";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { CampaignByTheNumbers } from "@/components/campaign/campaign-by-the-numbers";
import { FocusScrollSection } from "@/components/shared/focus-scroll-section";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { MISSION_SECTIONS } from "@/lib/content/mission";
import { CAMPAIGN_URL, DONATE_LINK, MISSION_NAME, MISSION_ORIGIN_LINE } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, CAMPAIGN_HOME_CRUMB, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "The Mission",
  description:
    "Tri For The 22 pairs a 70.3-mile IRONMAN challenge with For The 22's broader $70,000 fundraising mission — a shared goal, not Tri's alone.",
  canonical: `${CAMPAIGN_URL}/the-mission`,
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([CAMPAIGN_HOME_CRUMB, { name: "The Mission", url: `${CAMPAIGN_URL}/the-mission` }]);

export default async function MissionPage() {
  const fundraisingStats = await getFundraisingImpactStats();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <CampaignPageHero>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">
              Current Campaign
            </p>
            <SectionHeading
              as="h1"
              tone="dark"
              className="mt-2"
              title={MISSION_NAME}
              description="Tri For The 22 pairs a 70.3-mile IRONMAN challenge with For The 22's broader $70,000 fundraising mission. The triathlon inspired the original target — roughly $1,000 for every mile. But the mission has grown beyond one athlete and one race."
            />
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-bronze-light">{MISSION_ORIGIN_LINE}</p>
          </div>
          <CampaignByTheNumbers goal={fundraisingStats.fundraisingGoal} beneficiaryCount={fundraisingStats.beneficiaryCount} />
        </div>
      </CampaignPageHero>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="space-y-14">
            {MISSION_SECTIONS.map((section) => (
              <FocusScrollSection key={section.id}>
                <div id={section.id}>
                  <h2 className="font-display text-2xl font-semibold uppercase tracking-tight text-ink sm:text-3xl">
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {section.body.map((paragraph, i) => (
                      <p key={i} className="text-base leading-relaxed text-charcoal-light">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {section.link && (
                    <Link
                      href={section.link.href}
                      className="mt-3 inline-block text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
                    >
                      {section.link.label} &rarr;
                    </Link>
                  )}
                </div>
              </FocusScrollSection>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title={`Help Fund ${MISSION_NAME}`}
        description="Support the shared $70,000 goal directly, or meet the beneficiary organizations it funds."
        buttons={[
          { label: DONATE_LINK.label, href: DONATE_LINK.href },
          { label: "Meet the Beneficiaries", href: "/beneficiaries", variant: "secondary" },
        ]}
      />
    </>
  );
}
