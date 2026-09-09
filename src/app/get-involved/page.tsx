import { ExternalLink, Waves, Bike, Footprints } from "lucide-react";
import Link from "next/link";
import { getCampaign } from "@/lib/data/campaign";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { GetInvolvedForm } from "@/components/forms/get-involved-form";
import { RoleDetailDialog } from "@/components/get-involved/role-detail-dialog";
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
    "Join the Tri For The 22 Triathlon Team, support the campaign, become a partner, or help spread the word — and find race weekend lodging in Chattanooga.",
  canonical: `${CAMPAIGN_URL}/get-involved`,
});

interface HelpPathway {
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
}

const HELP_PATHWAYS: HelpPathway[] = [
  {
    title: "Join the Triathlon Team",
    description: "Train, race, and fundraise under the Tri For The 22 banner.",
    ctaLabel: "Apply as a Triathlete →",
    href: "/get-involved/triathlon-team",
  },
  {
    title: "Join the 22-Hour Challenge",
    description: "Run. Ruck. Ride. Walk. Row. Swim. Move for 22 hours in support of the mission — free to join.",
    ctaLabel: "Register Free →",
    href: "/22forthe22",
  },
  {
    title: "Support the Campaign",
    description: "Donate or help fund the mission.",
    ctaLabel: "Support the Mission →",
    href: DONATE_LINK.href,
  },
  {
    title: "Become a Partner",
    description: "Provide financial, in-kind, promotional, or organizational support.",
    ctaLabel: "Partner With Us →",
    href: "/sponsors",
  },
  {
    title: "Help Spread the Word",
    description: "Help expand the reach of Tri For The 22.",
    ctaLabel: "Get Involved →",
    href: "#roles",
  },
];

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

      {/* 1. Join the Triathlon Team — the most prominent, direct extension of the campaign concept. */}
      <section className="border-b border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bronze-light">
            Race For The Mission
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold uppercase tracking-tight sm:text-4xl">
            Join the Triathlon Team
          </h2>
          <p className="mt-3 max-w-xl text-base text-off-white/75">
            Race for the mission. Raise funds. Represent Tri For The 22.
          </p>

          <div className="mt-6 flex items-center gap-4 text-bronze-light">
            <Waves size={22} aria-hidden />
            <Bike size={22} aria-hidden />
            <Footprints size={22} aria-hidden />
          </div>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-off-white/80">
            Tri For The 22 is building a team of triathletes who want to race in support of
            veterans and first responders while raising awareness and funds through their own
            training and events.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-off-white/80">
            Whether you&apos;re preparing for your first sprint triathlon or your next IRONMAN,
            you can use your race to help carry the mission forward.
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-off-white/60">
            Sprint. Olympic. 70.3. IRONMAN.
          </p>

          <CTAButton href="/get-involved/triathlon-team" tone="dark" size="lg" className="mt-8">
            Apply to Join the Triathlon Team
          </CTAButton>

          <p className="mt-4 max-w-xl text-xs text-off-white/50">
            Race expenses are on the athlete — Tri For The 22 cannot supply team members with
            funds or gear.
          </p>
        </Container>
      </section>

      {/* 11. Choose how to help — the four pathways, Triathlon Team first. */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Ways To Help" title="Choose How You Want to Help" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HELP_PATHWAYS.map((pathway) => (
              <div key={pathway.title} className="flex flex-col rounded-sm border border-ink/10 bg-off-white p-6">
                <h3 className="font-display text-base font-semibold uppercase tracking-wide text-ink">
                  {pathway.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-charcoal-light">{pathway.description}</p>
                <Link
                  href={pathway.href}
                  className="mt-4 text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
                >
                  {pathway.ctaLabel}
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="roles" className="border-t border-ink/10 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Help Spread the Word"
            title="Volunteer Roles"
            description="Pick what fits — race weekend on the ground in Chattanooga, or helping spread the word from anywhere."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {GET_INVOLVED_ROLES.map((role) => (
              <RoleDetailDialog key={role.id} role={role} />
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
