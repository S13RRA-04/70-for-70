import Link from "next/link";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { CTAButton } from "@/components/shared/cta-button";
import { BrandColorBreakdown } from "@/components/about/mark-diagram";
import {
  FounderBios,
  InterviewTopics,
  LogoDownloads,
  MediaAppearances,
  MediaContact,
  PressJumpNav,
  PressPhotos,
  PressSection,
} from "@/components/press/press-kit";
import { getPartners } from "@/lib/data/partners";
import { getMissionMetrics } from "@/lib/data/mission-metrics";
import { MEDIA_APPEARANCES, PRESS_PHOTOS } from "@/lib/content/press";
import {
  CAMPAIGN_STATUS_LABELS,
  CAMPAIGN_URL,
  CONTACT_EMAIL,
  MOVEMENT_CAMPAIGNS,
  ORG_SUPPORTING_LINE,
  ORG_SUPPORTING_STATEMENT,
  ORG_TAGLINE,
  SITE_NAME,
  SITE_URL,
  isCurrentCampaign,
} from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "Press & Media",
  description: `Founder bio, press photos, interview topics, media coverage, key numbers, logos, and media contact for ${SITE_NAME}.`,
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
  { src: "/logo.png", alt: "For The 22 logo mark", width: 140, height: 140, label: "Download for light backgrounds" },
  { src: "/logo-white.png", alt: "For The 22 logo mark", width: 140, height: 140, dark: true, label: "Download for dark backgrounds" },
] as const;

export default async function PressPage() {
  const [metrics, beneficiaries] = await Promise.all([getMissionMetrics(), getPartners()]);
  const currentCampaigns = MOVEMENT_CAMPAIGNS.filter(isCurrentCampaign);

  const keyNumbers = [
    { label: "Resources Listed", value: metrics.resources === null ? null : String(metrics.resources) },
    { label: "Current Campaigns", value: metrics.activeCampaigns === null ? null : String(metrics.activeCampaigns) },
    { label: "Beneficiaries", value: metrics.beneficiaries === null ? null : String(metrics.beneficiaries) },
    { label: "Campaign Partners", value: metrics.campaignPartners === null ? null : String(metrics.campaignPartners) },
    { label: "Raised to Date", value: metrics.totalRaised === null ? null : `$${metrics.totalRaised.toLocaleString()}` },
  ].filter((stat): stat is { label: string; value: string } => stat.value !== null);

  const navItems = [
    { id: "at-a-glance", label: "At a glance" },
    { id: "bio", label: "Bio" },
    ...(PRESS_PHOTOS.length > 0 ? [{ id: "photos", label: "Photos" }] : []),
    { id: "topics", label: "Interview topics" },
    ...(MEDIA_APPEARANCES.length > 0 ? [{ id: "coverage", label: "Coverage" }] : []),
    { id: "logos", label: "Logos & colors" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <PageHero
        eyebrow="Press & media"
        title="Media kit"
        description="Everything you need to cover For The 22 or book Cody Hitson: a ready-to-read bio, press photos, interview topics, past coverage, logos, and a direct media contact."
      >
        <div className="flex flex-wrap items-center gap-3">
          <CTAButton href={CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : "/contact"} external={Boolean(CONTACT_EMAIL)}>
            Book an interview
          </CTAButton>
          <CTAButton href="#bio" variant="secondary">
            Get the bio
          </CTAButton>
        </div>
      </PageHero>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-16">
          <PressJumpNav items={navItems} />

          <PressSection id="at-a-glance" title="At a Glance">
            <p className="text-sm font-semibold uppercase tracking-wide text-bronze-text">{ORG_TAGLINE}</p>
            <p className="mt-3 text-base leading-relaxed text-charcoal-light">
              {ORG_SUPPORTING_STATEMENT}
            </p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-charcoal-light">
              {ORG_SUPPORTING_LINE}
            </p>

            {/* Key Numbers — every value from the same shared getters the rest
                of the site reads, never hand-entered. */}
            {keyNumbers.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {keyNumbers.map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse justify-end rounded-xl border border-line bg-white px-2 py-4 text-center">
                    <dt className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-charcoal-light">
                      {stat.label}
                    </dt>
                    <dd className="font-display text-2xl tabular-nums text-ink">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </PressSection>

          <PressSection
            id="bio"
            title="Founder Bio"
            description={
              <>
                Cody Hitson — Founder, For The 22. Approved for use as written; the full story is at{" "}
                <Link href="/about" className="text-bronze hover:underline">
                  forthe22.org/about
                </Link>
                .
              </>
            }
          >
            <FounderBios />
          </PressSection>

          {PRESS_PHOTOS.length > 0 && (
            <PressSection id="photos" title="Press Photos" description="Approved for editorial use with credit where noted.">
              <PressPhotos />
            </PressSection>
          )}

          <PressSection id="topics" title="Interview Topics" description="Subjects Cody speaks to on podcasts, radio, and panels.">
            <InterviewTopics />
          </PressSection>

          {/* Media Coverage — real earned coverage only; hidden entirely
              rather than showing an empty state or fabricated logos. */}
          {MEDIA_APPEARANCES.length > 0 && (
            <PressSection id="coverage" title="Media Coverage">
              <MediaAppearances />
            </PressSection>
          )}

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
              Covering the triathlon specifically? See the{" "}
              <a href={`${CAMPAIGN_URL}/press`} className="text-bronze hover:underline">
                Tri For The 22 media kit
              </a>{" "}
              for race facts, the campaign logo, and print materials.
            </p>
          </PressSection>

          {beneficiaries.length > 0 && (
            <PressSection
              id="beneficiaries"
              title="Current Beneficiaries"
              description={`Every ${SITE_NAME} campaign supports verified nonprofit organizations serving veterans, first responders, and their families.`}
            >
              <ul className="flex flex-wrap gap-2">
                {beneficiaries.map((partner) => (
                  <li
                    key={partner.id}
                    className="rounded-full border border-ink/15 bg-sand-light/60 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-ink"
                  >
                    {partner.name}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-charcoal-light">
                Profiles at{" "}
                <a href={`${CAMPAIGN_URL}/beneficiaries`} className="text-bronze hover:underline">
                  tri.forthe22.org/beneficiaries
                </a>
                .
              </p>
            </PressSection>
          )}

          <PressSection id="logos" title="Logos & Colors" description="The For The 22 mark, for light and dark backgrounds.">
            <LogoDownloads assets={LOGOS} />

            <h3 className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-light">
              Primary palette
            </h3>
            <div id="brand-colors" className="mt-3 flex scroll-mt-28 flex-wrap gap-4">
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
                <Link href="/about#the-mark" className="text-bronze hover:underline">
                  The Mark
                </Link>{" "}
                on the About page for what the ring, star, and &quot;22&quot; represent.
              </p>
              <div className="mt-4">
                <BrandColorBreakdown />
              </div>
            </details>
          </PressSection>

          <PressSection id="contact" title="Media Contact">
            <MediaContact email={CONTACT_EMAIL} fallbackHref="/contact" />
            <CTAButton href="/network" variant="secondary" className="mt-6">
              Explore the Network
            </CTAButton>
          </PressSection>
        </Container>
      </section>
    </>
  );
}
