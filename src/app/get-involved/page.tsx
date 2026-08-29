import { ExternalLink } from "lucide-react";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { GetInvolvedForm } from "@/components/forms/get-involved-form";
import { CAMPAIGN_NAME, CAMPAIGN_URL, CHATTANOOGAN_HOTEL_BLOCK_URL, GET_INVOLVED_ROLES, RACE_INFO } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Get Involved",
  description:
    "Join the Tri For The 22 team — race crew, campaign tent, cheer squad, or social media — and find race weekend lodging in Chattanooga.",
  canonical: `${CAMPAIGN_URL}/get-involved`,
});

export default function GetInvolvedPage() {
  return (
    <>
      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          eyebrow="Join The Team"
          title="Get Involved"
          description={`${CAMPAIGN_NAME} is more than one race — it takes people on the ground and online to pull it off. Here's how to be part of it.`}
        />
      </CampaignPageHero>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Ways To Help"
            title="Roles"
            description="Pick what fits — race weekend on the ground in Chattanooga, or helping spread the word from anywhere."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {GET_INVOLVED_ROLES.map((role) => (
              <div key={role.id} className="rounded-sm border border-ink/10 bg-off-white p-6">
                <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
                  {role.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-light">{role.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading
            eyebrow="Race Weekend"
            title="Lodging in Chattanooga"
            description={`A room block is being arranged at The Chattanoogan for ${
              RACE_INFO.raceLocation ?? "race weekend"
            } for anyone traveling in to help or cheer.`}
          />
          <div className="mt-6">
            {CHATTANOOGAN_HOTEL_BLOCK_URL ? (
              <CTAButton href={CHATTANOOGAN_HOTEL_BLOCK_URL} external>
                Book Your Room
                <ExternalLink size={14} aria-hidden />
              </CTAButton>
            ) : (
              <p className="text-sm text-charcoal-light">
                The booking link isn&apos;t live yet — sign up below and we&apos;ll send it your way once
                it&apos;s ready.
              </p>
            )}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="Sign Up" title="Count Me In" />
          <div className="mt-8">
            <GetInvolvedForm />
          </div>
        </Container>
      </section>
    </>
  );
}
