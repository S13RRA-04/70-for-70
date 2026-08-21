import Link from "next/link";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { MobileActionBar } from "@/components/shared/mobile-action-bar";
import { CampaignByTheNumbers } from "@/components/campaign/campaign-by-the-numbers";
import { MISSION_SECTIONS } from "@/lib/content/mission";
import {
  ATHLETIC_TEAM_NAME,
  CAMPAIGN_URL,
  DONATE_LINK,
  MOVEMENT_CAMPAIGNS,
  SITE_NAME,
} from "@/lib/constants";
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
          {ATHLETIC_TEAM_NAME} &middot; Current Campaign
        </p>
        <SectionHeading
          as="h1"
          tone="dark"
          className="mt-2"
          title="One Mile. One Thousand Dollars. One Mission."
          description="Tri For The 22 pairs a 70.3-mile triathlon with a $70,000 fundraising goal in support of veteran-focused nonprofit organizations."
        />
        <div className="mt-10">
          <CampaignByTheNumbers />
        </div>
      </CampaignPageHero>

      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="The Bigger Picture"
            title="About the Movement"
            description={`${SITE_NAME} exists to turn endurance into action for veterans and first responders. Individual campaigns operate under one naming convention: [Mission] For The 22.`}
          />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {MOVEMENT_CAMPAIGNS.map((campaign) => (
              <div
                key={campaign.name}
                className={`rounded-sm border p-4 text-center ${
                  campaign.status === "current"
                    ? "border-bronze/40 bg-bronze/10"
                    : "border-ink/10 bg-off-white"
                }`}
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-widest ${
                    campaign.status === "current" ? "text-bronze" : "text-charcoal-light/80"
                  }`}
                >
                  {campaign.status === "current" ? "Current Campaign" : "Future"}
                </p>
                <p className="mt-1 font-display text-base font-semibold uppercase tracking-wide text-ink">
                  {campaign.name}
                </p>
                <p className="mt-0.5 text-xs text-charcoal-light">{campaign.discipline}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="space-y-14">
            {MISSION_SECTIONS.map((section) => (
              <div key={section.id} id={section.id}>
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
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Help Fund the Mission"
        description="Fund a mile, support the mission directly, or bring your company on board as a sponsor."
        buttons={[
          { label: "Fund a Mile", href: "/fund-a-mile" },
          { label: "Meet the Partners", href: "/partners", variant: "secondary" },
        ]}
      />

      <div className="h-16 sm:hidden" aria-hidden="true" />
      <MobileActionBar
        secondary={{ label: "Fund a Mile", href: "/fund-a-mile" }}
        primary={{ label: DONATE_LINK.label, href: DONATE_LINK.href }}
      />
    </>
  );
}
