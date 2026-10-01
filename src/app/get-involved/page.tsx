import { ExternalLink, Waves, HandHelping, Handshake, HandCoins, Share2, type LucideIcon } from "lucide-react";
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
import { TOTAL_OUT_OF_POCKET } from "@/lib/content/out-of-pocket-expenses";
import { formatCurrency } from "@/lib/utils";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, CAMPAIGN_HOME_CRUMB, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "Get Involved",
  description:
    "Join the Tri For The 22 Triathlon Team, support the campaign, become a partner, or help spread the word — and find race weekend lodging in Chattanooga.",
  canonical: `${CAMPAIGN_URL}/get-involved`,
});

const GET_INVOLVED_CRUMB = { name: "Get Involved", url: `${CAMPAIGN_URL}/get-involved` };
const BREADCRUMB_JSON_LD = breadcrumbJsonLd([CAMPAIGN_HOME_CRUMB, GET_INVOLVED_CRUMB]);

interface HelpPathway {
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  icon: LucideIcon;
}

/**
 * The five primary "do something" pathways — deliberately equal weight
 * (same card treatment, same row), matching AGENTS.md's Get Involved brief
 * exactly: Race With Us, Volunteer, Partner, Donate, Share. "Share the
 * Mission" isn't a plain link like the other four — it renders ShareButtons
 * directly in its card (same technique the homepage's "Choose Your Role"
 * section uses) — so it's handled separately in the JSX below, not in this
 * array.
 */
const HELP_PATHWAYS: HelpPathway[] = [
  {
    title: "Race With Us",
    description: "Train, race, and fundraise under the Tri For The 22 banner.",
    ctaLabel: "Apply as a Triathlete →",
    href: "/get-involved/triathlon-team",
    icon: Waves,
  },
  {
    title: "Volunteer",
    description: "Help on the ground race weekend in Chattanooga, or spread the word from anywhere.",
    ctaLabel: "See Volunteer Roles →",
    href: "#roles",
    icon: HandHelping,
  },
  {
    title: "Partner",
    description: "Provide financial, in-kind, promotional, or organizational support.",
    ctaLabel: "Become a Partner →",
    href: "/become-a-partner",
    icon: Handshake,
  },
  {
    title: "Donate",
    description: "Fund the mission directly — every dollar moves the campaign toward its goal.",
    ctaLabel: "Support the Mission →",
    href: DONATE_LINK.href,
    icon: HandCoins,
  },
];

export default async function GetInvolvedPage() {
  const campaign = await getCampaign();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          eyebrow="Join The Team"
          title="Get Involved"
          description={`${CAMPAIGN_NAME} is more than one race — it takes people on the ground and online to pull it off. Here's how to be part of it.`}
        />
      </CampaignPageHero>

      {/* Choose how to help — five equal-weight pathways, none singled out in its own oversized band. */}
      <section className="border-b border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container>
          <SectionHeading eyebrow="Ways To Help" title="Choose How You Want to Help" tone="dark" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {HELP_PATHWAYS.map((pathway) => (
              <div
                key={pathway.title}
                className="flex flex-col rounded-sm border border-off-white/15 bg-off-white/5 p-6"
              >
                <pathway.icon size={26} className="text-bronze-light" aria-hidden />
                <h3 className="mt-4 font-display text-lg font-semibold uppercase tracking-wide">
                  {pathway.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-off-white/75">{pathway.description}</p>
                <Link
                  href={pathway.href}
                  className="mt-5 text-sm font-semibold uppercase tracking-wide text-bronze-light hover:text-off-white"
                >
                  {pathway.ctaLabel}
                </Link>
              </div>
            ))}

            <div className="flex flex-col rounded-sm border border-off-white/15 bg-off-white/5 p-6">
              <Share2 size={26} className="text-bronze-light" aria-hidden />
              <h3 className="mt-4 font-display text-lg font-semibold uppercase tracking-wide">Share the Mission</h3>
              <p className="mt-2 flex-1 text-sm text-off-white/75">
                Help carry the mission further — share it with someone who&apos;d want to be part of it.
              </p>
              <div className="mt-5">
                <ShareButtons
                  url={CAMPAIGN_URL}
                  title={`I'm helping move ${CAMPAIGN_NAME} closer to its ${formatCurrency(campaign.fundraising_goal)} goal for veterans.`}
                />
              </div>
            </div>
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

      <section className="border-t border-ink/10 py-10 sm:py-12">
        <Container className="max-w-2xl">
          <div className="rounded-sm border border-ink/10 bg-sand-light p-6 text-center sm:p-8">
            <p className="font-display text-2xl font-bold tabular-nums text-ink">
              Personally invested in the mission: {formatCurrency(TOTAL_OUT_OF_POCKET, { cents: true })}
            </p>
            <p className="mt-2 text-sm text-charcoal-light">
              Campaign expenses, donated equipment, and financial activity are publicly documented.
            </p>
            <Link
              href="/financial-transparency"
              className="mt-4 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
            >
              View Financial Transparency &rarr;
            </Link>
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
            <CTAButton href={DONATE_LINK.href} magnetic>{DONATE_LINK.label}</CTAButton>
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
