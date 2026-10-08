import Image from "next/image";
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
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
            <aside className="lg:sticky lg:top-28 lg:col-span-5">
              <div className="relative min-h-[430px] overflow-hidden rounded-sm lg:min-h-[600px]">
                <Image src="/journal/building-the-bike/loaner-bike-blue-trail.jpg" alt="Training ride during the Tri For The 22 campaign" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-off-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">The mission in one line</p>
                  <p className="mt-2 font-display text-3xl font-bold uppercase leading-tight">Turn endurance into attention. Turn attention into support.</p>
                </div>
              </div>
            </aside>
          <div className="space-y-6 lg:col-span-7">
            {MISSION_SECTIONS.map((section) => (
              <FocusScrollSection key={section.id}>
                <div id={section.id} className="border-t border-ink/10 py-7 first:border-t-4 first:border-bronze first:pt-7">
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
