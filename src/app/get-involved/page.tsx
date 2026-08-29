import { ExternalLink } from "lucide-react";
import { getCampaign } from "@/lib/data/campaign";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { GetInvolvedForm } from "@/components/forms/get-involved-form";
import { CampaignProgress } from "@/components/campaign/campaign-progress";
import { ShareButtons } from "@/components/shared/share-buttons";
import { EmailSignupForm } from "@/components/forms/email-signup-form";
import {
  CAMPAIGN_NAME,
  CAMPAIGN_URL,
  CHATTANOOGAN_HOTEL_BLOCK_URL,
  DONATE_LINK,
  GET_INVOLVED_ROLES,
  RACE_INFO,
} from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Get Involved",
  description:
    "Join the Tri For The 22 team — race crew, campaign tent, cheer squad, or social media — and find race weekend lodging in Chattanooga.",
  canonical: `${CAMPAIGN_URL}/get-involved`,
});

export default async function GetInvolvedPage() {
  const campaign = await getCampaign();

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

      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="Support the Mission" title="Every Dollar Counts" />
          <div className="mt-8">
            <CampaignProgress totalRaised={campaign.amount_raised} goal={campaign.fundraising_goal} showStats={false} />
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <CTAButton href={DONATE_LINK.href}>{DONATE_LINK.label}</CTAButton>
          </div>

          <div className="mt-10 flex flex-col gap-6 border-t border-ink/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                Get Campaign Updates
              </p>
              <div className="mt-3">
                <EmailSignupForm />
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                Share {CAMPAIGN_NAME}
              </p>
              <ShareButtons
                url={CAMPAIGN_URL}
                title={`I'm helping move ${CAMPAIGN_NAME} closer to its ${formatCurrency(campaign.fundraising_goal)} goal for veterans.`}
              />
            </div>
          </div>

          {RACE_INFO.registrationUrl && (
            <a
              href={RACE_INFO.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-charcoal-light hover:text-ink"
            >
              Register for the Race
              <ExternalLink size={13} aria-hidden />
            </a>
          )}
        </Container>
      </section>
    </>
  );
}
