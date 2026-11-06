import Link from "next/link";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { CTAButton } from "@/components/shared/cta-button";
import { BrandColorBreakdown } from "@/components/about/mark-diagram";
import {
  FactsVerification,
  FounderBios,
  InterviewTopics,
  LogoDownloads,
  MediaAppearances,
  MediaContact,
  MediaKitDownload,
  PressPhotos,
  PressQuickLinks,
  PressSection,
  StoryAngles,
  mediaInquiryHref,
} from "@/components/press/press-kit";
import { getPartners } from "@/lib/data/partners";
import { getMissionMetrics } from "@/lib/data/mission-metrics";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { MEDIA_APPEARANCES, PRESS_PHOTOS } from "@/lib/content/press";
import {
  CAMPAIGN_STATUS_LABELS,
  CAMPAIGN_URL,
  CONTACT_EMAIL,
  LIVE_CAMPAIGN_URL,
  MOVEMENT_CAMPAIGNS,
  ORG_SUPPORTING_LINE,
  ORG_SUPPORTING_STATEMENT,
  ORG_TAGLINE,
  RACE_INFO,
  SITE_NAME,
  SITE_URL,
  isCurrentCampaign,
} from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";
import { formatCurrency, formatDateLong } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Newsroom & Media Resources",
  description: `Media kit, story ideas, verified facts, founder bio, press photos, coverage, and media contact for ${SITE_NAME}.`,
  canonical: "/press",
});

/** BreadcrumbList per credibility plan §25 — Home→page shape. */
const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: "Press & Media", url: `${SITE_URL}/press` },
]);

/** The site's working UI palette, not the mark's symbolic colors — what a reporter actually needs to quote/reproduce brand colors at a glance. */
const PRIMARY_PALETTE = [
  { name: "Navy", hex: "#121E3D" },
  { name: "Olive", hex: "#4B5521" },
  { name: "Awareness Blue", hex: "#0A6AA6" },
  { name: "Impact Green", hex: "#17734A" },
  { name: "Community Yellow", hex: "#F5D000" },
  { name: "Purpose Red", hex: "#C8162B" },
  { name: "Black", hex: "#111111" },
  { name: "Paper", hex: "#F4F2EC" },
] as const;

const LOGOS = [
  { src: "/logo.png", alt: "For The 22 logo mark", width: 140, height: 140, label: "Logo — light backgrounds (PNG)" },
  { src: "/logo-white.png", alt: "For The 22 logo mark", width: 140, height: 140, dark: true, label: "Logo — dark backgrounds (PNG)" },
] as const;

const linkClass = "text-bronze hover:underline";

export default async function PressPage() {
  const [metrics, fundraising, beneficiaries] = await Promise.all([
    getMissionMetrics(),
    getFundraisingImpactStats(),
    getPartners(),
  ]);
  const currentCampaigns = MOVEMENT_CAMPAIGNS.filter(isCurrentCampaign);
  const contactHref = mediaInquiryHref(CONTACT_EMAIL, "/contact");
  const verifiedOn = formatDateLong(fundraising.updatedAt);

  const verificationRows = [
    metrics.resources !== null && {
      claim: `${metrics.resources.toLocaleString()} resource listings`,
      evidence: (
        <>
          Vetted programs and services in the{" "}
          <Link href="/resources" className={linkClass}>
            public directory
          </Link>
          , reviewed under published{" "}
          <Link href="/standards" className={linkClass}>
            resource standards
          </Link>
          . These are listings — not a count of people helped.
        </>
      ),
    },
    {
      claim: `${formatCurrency(fundraising.amountRaised, { cents: true })} raised`,
      evidence: (
        <>
          Verified donations as of {verifiedOn}, toward a {formatCurrency(fundraising.fundraisingGoal)} goal
          {fundraising.beneficiaryTotals.length > 0 && (
            <>
              :{" "}
              {fundraising.beneficiaryTotals
                .map((row) => `${formatCurrency(row.amount, { cents: true })} to ${row.organization}`)
                .join("; ")}
            </>
          )}
          . Donors give directly to each beneficiary; see{" "}
          <Link href="/transparency" className={linkClass}>
            Transparency
          </Link>
          .
        </>
      ),
    },
    {
      claim: `${fundraising.partnerCount} campaign partners`,
      evidence: (
        <>
          Businesses and organizations backing one or more campaigns, listed on the{" "}
          <Link href="/network" className={linkClass}>
            partner network
          </Link>
          . Partners support the campaigns; they are not the beneficiaries.
        </>
      ),
    },
    beneficiaries.length > 0 && {
      claim: beneficiaries.map((partner) => partner.name).join(" and "),
      evidence: (
        <>
          The confirmed beneficiary nonprofits every campaign supports. Profiles at{" "}
          <a href={`${CAMPAIGN_URL}/beneficiaries`} className={linkClass}>
            tri.forthe22.org/beneficiaries
          </a>
          ; verification status on{" "}
          <Link href="/transparency" className={linkClass}>
            Transparency
          </Link>
          .
        </>
      ),
    },
    {
      claim: "Whiskey Myers and Muscadine Bloodline",
      evidence: (
        <>
          Donated items for the online silent auction — a signed guitar plus concert tickets from Whiskey
          Myers, and a Gibson guitar (donated through Gibson Gives) signed by members of Muscadine
          Bloodline. Not an endorsement or partnership. Items listed at{" "}
          <a href={`${LIVE_CAMPAIGN_URL}/auction`} className={linkClass}>
            the auction page
          </a>
          .
        </>
      ),
    },
    RACE_INFO.raceDate && {
      claim: `IRONMAN 70.3 Chattanooga, ${formatDateLong(RACE_INFO.raceDate)}`,
      evidence: (
        <>
          Cody&apos;s participation is his own; {SITE_NAME} is not affiliated with or endorsed by
          IRONMAN.{" "}
          {RACE_INFO.courseInfoUrl && (
            <a href={RACE_INFO.courseInfoUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              Official race information
            </a>
          )}
          .
        </>
      ),
    },
    {
      claim: "Organizational status",
      evidence: (
        <>
          {SITE_NAME} is an independent initiative, not a registered nonprofit, and does not receive charitable
          contributions — see{" "}
          <Link href="/transparency" className={linkClass}>
            Transparency
          </Link>
          .
        </>
      ),
    },
  ].filter((row): row is { claim: string; evidence: React.ReactElement } => Boolean(row));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <PageHero
        eyebrow="Newsroom & media resources"
        title={SITE_NAME}
        description={
          <>
            <span className="block font-semibold text-navy">{ORG_TAGLINE}</span>
            <span className="mt-2 block">
              An independent, veteran-founded initiative connecting veterans, first responders, and
              families with trusted resources — and mobilizing communities through endurance athletics,
              music, and fundraising.
            </span>
          </>
        }
      >
        <PressQuickLinks contactHref={contactHref} />
        <p className="mt-5 text-sm text-charcoal-light">
          For interviews, photography, background, and verification:{" "}
          <a href={contactHref} className="font-semibold text-navy hover:underline">
            {CONTACT_EMAIL ?? "contact form"}
          </a>
        </p>
      </PageHero>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-16">
          {MEDIA_APPEARANCES.length > 0 && (
            <PressSection id="coverage" title="Media Coverage" description="Newest first.">
              <MediaAppearances />
            </PressSection>
          )}

          <PressSection
            id="story-ideas"
            title="Story Ideas"
            description="Three angles for regional reporters, each with links to verify the facts."
          >
            <StoryAngles />
          </PressSection>

          <PressSection
            id="facts"
            title="Facts & Verification"
            description={`Every figure below updates from the same data as the rest of the site. Fundraising verified as of ${verifiedOn}.`}
          >
            <FactsVerification rows={verificationRows} />
          </PressSection>

          <PressSection id="media-kit" title="Media Kit">
            <MediaKitDownload factSheetHref="/press/fact-sheet" />

            <h3 id="bio" className="mt-10 scroll-mt-28 font-display text-xl uppercase text-ink">
              Founder Bio
            </h3>
            <p className="mt-1 text-sm text-charcoal-light">
              Cody Hitson — Founder, {SITE_NAME}. Approved for use as written; the full story is at{" "}
              <Link href="/about" className={linkClass}>
                forthe22.org/about
              </Link>
              .
            </p>
            <div className="mt-4">
              <FounderBios />
            </div>

            {PRESS_PHOTOS.length > 0 && (
              <>
                <h3 id="photos" className="mt-10 scroll-mt-28 font-display text-xl uppercase text-ink">
                  Editorial Photos
                </h3>
                <div className="mt-4">
                  <PressPhotos />
                </div>
              </>
            )}

            <h3 id="logos" className="mt-10 scroll-mt-28 font-display text-xl uppercase text-ink">
              Logos
            </h3>
            <p className="mt-1 text-sm text-charcoal-light">
              The official {SITE_NAME} mark, as transparent PNGs. Brand colors are{" "}
              <a href="#brand" className={linkClass}>
                at the bottom of this page
              </a>
              .
            </p>
            <div className="mt-4">
              <LogoDownloads assets={LOGOS} />
            </div>

            <h3 id="topics" className="mt-10 scroll-mt-28 font-display text-xl uppercase text-ink">
              Interview Topics
            </h3>
            <div className="mt-4">
              <InterviewTopics />
            </div>
          </PressSection>

          <PressSection id="campaigns" title="Current Campaigns">
            <ul className="grid gap-4 sm:grid-cols-2">
              {currentCampaigns.map((campaign) => {
                const isSameSite = "url" in campaign && campaign.url.startsWith("/");
                const statusLine = [
                  CAMPAIGN_STATUS_LABELS[campaign.status],
                  campaign.type,
                  campaign.location,
                ]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <li key={campaign.name} className="rounded-xl border border-line bg-white p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-bronze">
                      {statusLine}
                    </p>
                    <p className="mt-1 font-display text-xl uppercase text-ink">
                      {campaign.name}
                    </p>
                    {"description" in campaign && (
                      <p className="mt-2 text-sm leading-relaxed text-charcoal-light">
                        {campaign.description}
                      </p>
                    )}
                    {"url" in campaign &&
                      (isSameSite ? (
                        <Link
                          href={campaign.url}
                          className="mt-3 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
                        >
                          {campaign.name} &rarr;
                        </Link>
                      ) : (
                        <a
                          href={campaign.url}
                          className="mt-3 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
                        >
                          {campaign.name} &rarr;
                        </a>
                      ))}
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-sm text-charcoal-light">
              Covering the triathlon specifically? The{" "}
              <a href={`${CAMPAIGN_URL}/press`} className={linkClass}>
                Tri For The 22 media kit
              </a>{" "}
              has race facts, the campaign logo, and print materials.
            </p>
          </PressSection>

          <PressSection id="contact" title="Media Contact">
            <MediaContact email={CONTACT_EMAIL} fallbackHref="/contact" />
          </PressSection>

          <PressSection
            id="brand"
            title="Brand Reference"
            description="For designers reproducing the mark. Reporters can skip this."
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-charcoal-light">
              {ORG_SUPPORTING_LINE}
            </p>
            <p className="mt-2 text-sm text-charcoal-light">{ORG_SUPPORTING_STATEMENT}</p>
            <h3 id="brand-colors" className="mt-6 scroll-mt-28 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-light">
              Primary palette
            </h3>
            <div className="mt-3 flex flex-wrap gap-4">
              {PRIMARY_PALETTE.map((swatch) => (
                <div key={swatch.name} className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0 rounded-full border border-ink/10"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <p className="text-xs text-charcoal-light">
                    <span className="font-medium text-ink">{swatch.name}</span> — {swatch.hex}
                  </p>
                </div>
              ))}
            </div>

            <details className="mt-6">
              <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark">
                Full Mark Color Breakdown
              </summary>
              <p className="mt-3 text-sm text-charcoal-light">
                Every color in the mark is assigned, not decorative — the outer ring to a branch of
                the Armed Forces, the inner ring to a sector of first-responder service. See{" "}
                <Link href="/about#the-mark" className={linkClass}>
                  The Mark
                </Link>{" "}
                on the About page for what the ring, star, and &quot;22&quot; represent.
              </p>
              <div className="mt-4">
                <BrandColorBreakdown />
              </div>
            </details>

            <CTAButton href="/network" variant="secondary" className="mt-8">
              Explore the Network
            </CTAButton>
          </PressSection>
        </Container>
      </section>
    </>
  );
}
