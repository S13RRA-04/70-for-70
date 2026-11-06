import Image from "next/image";
import { Download } from "lucide-react";
import { getPartners } from "@/lib/data/partners";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { CampaignByTheNumbers } from "@/components/campaign/campaign-by-the-numbers";
import {
  FounderBios,
  InterviewTopics,
  formatPressDate,
  LogoDownloads,
  MediaAppearances,
  MediaContact,
  MediaKitDownload,
  PressJumpNav,
  PressPhotos,
  PressSection,
  QuickFacts,
} from "@/components/press/press-kit";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { CAMPAIGN_MATERIALS, PRESS_RELEASES } from "@/lib/content/campaign-press";
import { MEDIA_APPEARANCES, PRESS_PHOTOS } from "@/lib/content/press";
import { CAMPAIGN_NAME, CONTACT_EMAIL, RACE_INFO, SITE_URL, SITE_TAGLINE } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { formatCurrency, formatDateLong } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Press & Media",
  description: `Race facts, athlete bio, press photos, media coverage, logos, and print materials for ${CAMPAIGN_NAME}.`,
  canonical: "/press",
});

const LOGOS = [
  { src: "/campaign-logo.png", alt: `${CAMPAIGN_NAME} campaign logo mark`, width: 140, height: 140, label: "Logo — light backgrounds" },
  { src: "/campaign-logo-white.png", alt: `${CAMPAIGN_NAME} campaign logo mark`, width: 140, height: 140, dark: true, label: "Logo — dark backgrounds" },
  { src: "/campaign-wordmark-black.png", alt: `${CAMPAIGN_NAME} wordmark`, width: 140, height: 157, label: "Wordmark — light backgrounds" },
  { src: "/campaign-wordmark-white.png", alt: `${CAMPAIGN_NAME} wordmark`, width: 140, height: 154, dark: true, label: "Wordmark — dark backgrounds" },
] as const;

/** "https://www.example.org/give" → "example.org"; falls back to the raw value for anything URL() rejects. */
function displayHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default async function CampaignPressPage() {
  const [partners, fundraisingStats] = await Promise.all([getPartners(), getFundraisingImpactStats()]);

  const quickFacts = [
    { label: "Athlete", value: "Cody Hitson — Navy veteran, founder of For The 22" },
    { label: "Event", value: "IRONMAN 70.3 Chattanooga" },
    RACE_INFO.raceDate && { label: "Race date", value: formatDateLong(RACE_INFO.raceDate) },
    RACE_INFO.raceLocation && { label: "Location", value: RACE_INFO.raceLocation },
    { label: "Distance", value: "70.3 miles — 1.2-mile swim, 56-mile bike, 13.1-mile run" },
    RACE_INFO.athleteGoalTime && { label: "Race goal", value: RACE_INFO.athleteGoalTime },
    { label: "Fundraising goal", value: formatCurrency(fundraisingStats.fundraisingGoal) },
    {
      label: "Raised so far",
      value: `${formatCurrency(fundraisingStats.amountRaised, { cents: true })} (verified as of ${formatDateLong(fundraisingStats.updatedAt)})`,
    },
    partners.length > 0 && { label: "Beneficiaries", value: partners.map((partner) => partner.name).join(" · ") },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

  const navItems = [
    { id: "facts", label: "Race facts" },
    { id: "bio", label: "Athlete bio" },
    ...(PRESS_PHOTOS.length > 0 ? [{ id: "photos", label: "Photos" }] : []),
    ...(MEDIA_APPEARANCES.length > 0 ? [{ id: "coverage", label: "Coverage" }] : []),
    { id: "logos", label: "Logos" },
    ...(CAMPAIGN_MATERIALS.length > 0 ? [{ id: "materials", label: "Print materials" }] : []),
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow={`${CAMPAIGN_NAME} · Press & Media`}
            title="Media Kit"
            description="Race facts, a ready-to-read athlete bio, press photos, logos, and print materials for covering the campaign — plus a direct line to book an interview."
          />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CTAButton href={CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : `${SITE_URL}/contact`} external>
              Book an interview
            </CTAButton>
            <CTAButton href="#bio" variant="secondary">
              Get the bio
            </CTAButton>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-16">
          <PressJumpNav items={navItems} />

          <PressSection id="facts" title="Race Facts">
            <p className="mb-6 text-base leading-relaxed text-charcoal-light">
              {CAMPAIGN_NAME} is Cody Hitson&apos;s current endurance campaign: training for and
              completing a 70.3-mile triathlon while encouraging the public to donate directly
              to the campaign&apos;s confirmed beneficiary organizations. {SITE_TAGLINE}
            </p>
            <CampaignByTheNumbers goal={fundraisingStats.fundraisingGoal} beneficiaryCount={fundraisingStats.beneficiaryCount} />
            <div className="mt-6">
              <QuickFacts facts={quickFacts} />
            </div>
          </PressSection>

          <MediaKitDownload factSheetHref={`${SITE_URL}/press/fact-sheet`} />

          <PressSection
            id="bio"
            title="Athlete Bio"
            description={
              <>
                Approved for use as written. Training story and race details:{" "}
                <a href="/the-story" className="text-bronze hover:underline">
                  The Story
                </a>
                ; service history:{" "}
                <a href={`${SITE_URL}/about`} className="text-bronze hover:underline">
                  About
                </a>
                .
              </>
            }
          >
            <FounderBios />
            <h3 className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-light">
              Interview topics
            </h3>
            <div className="mt-3">
              <InterviewTopics />
            </div>
          </PressSection>

          {PRESS_PHOTOS.length > 0 && (
            <PressSection id="photos" title="Press Photos" description="Approved for editorial use with credit where noted.">
              <PressPhotos />
            </PressSection>
          )}

          {MEDIA_APPEARANCES.length > 0 && (
            <PressSection id="coverage" title="Media Coverage">
              <MediaAppearances />
            </PressSection>
          )}

          {PRESS_RELEASES.length > 0 && (
            <PressSection id="releases" title="Press Releases">
              <ul className="space-y-2">
                {PRESS_RELEASES.map((release) => (
                  <li key={release.url} className="text-base text-charcoal-light">
                    <a href={release.url} className="text-bronze hover:underline">
                      {release.title}
                    </a>
                    {" — "}
                    {formatPressDate(release.date)}
                  </li>
                ))}
              </ul>
            </PressSection>
          )}

          <PressSection id="logos" title="Logos" description="The campaign mark with the ring icon, and the type-only wordmark.">
            <LogoDownloads assets={LOGOS} />
          </PressSection>

          {partners.length > 0 && (
            <PressSection id="beneficiaries" title="Beneficiary Organizations">
              <ul className="grid gap-3 sm:grid-cols-2">
                {partners.map((partner) => (
                  <li key={partner.id} className="rounded-xl border border-line bg-white p-4">
                    <p className="font-display text-lg uppercase text-ink">{partner.name}</p>
                    {partner.website_url && (
                      <a
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex text-sm font-semibold text-bronze hover:underline"
                      >
                        {displayHost(partner.website_url)} &rarr;
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </PressSection>
          )}

          {CAMPAIGN_MATERIALS.length > 0 && (
            <PressSection
              id="materials"
              title="Print Materials"
              description="Print-ready flier, poster, rack card, trifold, and QR reference cards for tabling, sponsors, and community outreach."
            >
              <div className="grid gap-6 sm:grid-cols-2">
                {CAMPAIGN_MATERIALS.map((material) => (
                  <div key={material.label} className="rounded-xl border border-line bg-white p-6">
                    <h3 className="font-display text-lg uppercase text-ink">
                      {material.label}
                    </h3>
                    <p className="mt-1 text-sm text-charcoal-light">{material.description}</p>
                    <div className="mt-4 flex flex-wrap gap-4">
                      {material.files.map((file) => (
                        <div key={file.src} className="flex flex-col items-start gap-2">
                          <div className="relative h-36 w-28 overflow-hidden rounded-sm border border-ink/10 bg-sand-light">
                            <Image src={file.src} alt={file.alt} fill sizes="112px" className="object-cover" />
                          </div>
                          <a
                            href={file.src}
                            download
                            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-bronze hover:underline"
                          >
                            <Download size={12} aria-hidden />
                            Download{file.side ? ` (${file.side})` : ""}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </PressSection>
          )}

          <PressSection id="contact" title="Media Contact">
            <MediaContact email={CONTACT_EMAIL} fallbackHref={`${SITE_URL}/contact`} />
          </PressSection>
        </Container>
      </section>
    </>
  );
}
