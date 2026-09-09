import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { TriathlonTeamApplicationForm } from "@/components/forms/triathlon-team-application-form";
import { CAMPAIGN_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Join the Triathlon Team",
  description:
    "Apply to race and fundraise under the Tri For The 22 banner — sprint to full-distance IRONMAN, first-timers welcome.",
  canonical: `${CAMPAIGN_URL}/get-involved/triathlon-team`,
});

export default function TriathlonTeamPage() {
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

          <div className="mt-12">
            <TriathlonTeamApplicationForm />
          </div>
        </Container>
      </section>
    </>
  );
}
