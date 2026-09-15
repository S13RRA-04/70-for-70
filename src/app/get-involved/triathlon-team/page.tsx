import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { TriathlonTeamApplicationForm } from "@/components/forms/triathlon-team-application-form";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { CTAButton } from "@/components/shared/cta-button";
import { getMissionPartners } from "@/lib/data/mission-partners";
import { CAMPAIGN_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Join the Triathlon Team",
  description:
    "Apply to race and fundraise under the Tri For The 22 banner — sprint to full-distance IRONMAN, first-timers welcome.",
  canonical: `${CAMPAIGN_URL}/get-involved/triathlon-team`,
});

export default async function TriathlonTeamPage() {
  const partners = await getMissionPartners();
  const teamBenefitPartner = partners.find((p) => p.partner_type === "team-benefit-partner");

  return (
    <>
      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          eyebrow="Race For The Mission"
          title="Join the Triathlon Team"
          description="Race for something bigger than the finish line."
        />
      </CampaignPageHero>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <p className="text-base leading-relaxed text-charcoal-light">
            Tri For The 22 is building a team of triathletes willing to use their training,
            racing, and fundraising to support veterans and first responders.
          </p>
          <p className="mt-4 text-base leading-relaxed text-charcoal-light">
            You do not need to be an elite athlete. You do need to be willing to represent the
            mission well, train responsibly, and make a genuine effort to raise awareness and
            support.
          </p>

          <div className="mt-8 rounded-sm border border-bronze/30 bg-bronze/10 p-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-bronze">
              Important
            </p>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-light">
              Race expenses are on the athlete. Tri For The 22 cannot supply team members with
              funds or gear — registration, travel, lodging, equipment, and other costs are your
              own responsibility unless something is specifically approved in writing.
            </p>
          </div>

          {teamBenefitPartner && (
            <div id="team-equipment-benefits" className="mt-12 scroll-mt-24">
              <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
                Team Equipment Benefits
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-light">
                Tri For The 22 works with select campaign partners to make training and race
                equipment more accessible to participating athletes. Benefits vary by partner and
                do not guarantee free equipment.
              </p>

              <div className="mt-6 flex flex-col gap-5 rounded-sm border border-ink/10 bg-off-white p-6 sm:flex-row sm:items-start">
                <PartnerLogo
                  name={teamBenefitPartner.name}
                  logoUrl={teamBenefitPartner.logo_url}
                  logoLightUrl={teamBenefitPartner.logo_light_url}
                  logoDarkUrl={teamBenefitPartner.logo_dark_url}
                  background={teamBenefitPartner.logo_background}
                  className="h-20 w-full shrink-0 sm:w-44"
                />
                <div className="flex-1">
                  <p className="font-display text-base font-bold uppercase tracking-wide text-ink">
                    {teamBenefitPartner.name}{" "}
                    <span className="text-bronze">— {teamBenefitPartner.relationship_label}</span>
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-light">
                    Approved Tri For The 22 team members may receive access to special XTERRA
                    team pricing on wetsuits, swim apparel and accessories through the XTERRA
                    Clubs, Teams &amp; Coaches Program.
                  </p>
                  <CTAButton href="/contact?item=XTERRA%20Team%20Access" className="mt-5">
                    Request Team Access
                  </CTAButton>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12">
            <TriathlonTeamApplicationForm />
          </div>
        </Container>
      </section>
    </>
  );
}
