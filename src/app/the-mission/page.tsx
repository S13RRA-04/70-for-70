import Link from "next/link";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { CampaignByTheNumbers } from "@/components/campaign/campaign-by-the-numbers";
import { FocusScrollSection } from "@/components/shared/focus-scroll-section";
import { MISSION_SECTIONS } from "@/lib/content/mission";
import { CAMPAIGN_URL, DONATE_LINK, SITE_NAME_QUOTED, SITE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "The Mission",
  description:
    "Why Tri For The 22 exists: 70 miles, $70,000, and a mission to support veteran-focused nonprofit organizations.",
  canonical: `${CAMPAIGN_URL}/the-mission`,
});

export default function MissionPage() {
  return (
    <>
      <CampaignPageHero>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">
          {SITE_NAME_QUOTED} &middot; Current Campaign
        </p>
        <SectionHeading
          as="h1"
          tone="dark"
          className="mt-2"
          title="70.3 Miles. $70,000. One Mission."
          description="Tri For The 22 pairs a 70.3-mile triathlon with a $70,000 fundraising goal in support of veteran-focused nonprofit organizations."
        />
        <div className="mt-10">
          <CampaignByTheNumbers />
        </div>
      </CampaignPageHero>

      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <FocusScrollSection>
            <SectionHeading
              eyebrow="The Parent Initiative"
              title={`A ${SITE_NAME_QUOTED} Campaign`}
              description={`Tri For The 22 is an athletic fundraising campaign of ${SITE_NAME_QUOTED}, an initiative connecting veterans and first responders with resources supporting mental, physical, emotional and spiritual health.`}
            />
            <a
              href={SITE_URL}
              className="mt-5 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
            >
              Visit {SITE_NAME_QUOTED} &rarr;
            </a>
          </FocusScrollSection>
        </Container>
      </section>

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
                      className="mt-3 inline-block text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
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
        title="Help Fund the Mission"
        description="Support the $70,000 goal directly, or meet the beneficiary organizations it funds."
        buttons={[
          { label: DONATE_LINK.label, href: DONATE_LINK.href },
          { label: "Meet the Beneficiaries", href: "/beneficiaries", variant: "secondary" },
        ]}
      />
    </>
  );
}
