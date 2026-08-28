import Link from "next/link";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { BuildTimeline } from "@/components/journal/bike-build/build-timeline";
import {
  GEAR_JOURNEY_INTRO,
  GEAR_JOURNEY_OPENING_POST,
  GEAR_JOURNEY_TIMELINE,
  getGearJourneyLastUpdated,
} from "@/lib/content/gear-journey";
import { formatDateLong } from "@/lib/utils";
import { CAMPAIGN_NAME, CAMPAIGN_URL, SITE_NAME, SITE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

const PAGE_TITLE = GEAR_JOURNEY_OPENING_POST.title;
const PAGE_DESCRIPTION =
  "What it actually costs — in money, favors, and awkward asks — for a brand-new triathlete to get equipped for an Ironman 70.3, told one piece of gear at a time.";
const CANONICAL_URL = `${CAMPAIGN_URL}/journal/gear-journey`;

export const metadata = pageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  canonical: CANONICAL_URL,
});

function buildJsonLd() {
  const lastUpdated = getGearJourneyLastUpdated();
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: CANONICAL_URL,
    mainEntityOfPage: CANONICAL_URL,
    datePublished: GEAR_JOURNEY_OPENING_POST.date,
    dateModified: lastUpdated,
    author: { "@type": "Organization", name: CAMPAIGN_NAME, url: CAMPAIGN_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

/**
 * The living "gear journey" feature — a standalone content page inside the
 * Journal section, not a Supabase journal_entries row. Same reasoning as
 * /journal/building-the-bike: this is one continuing story (the cost and
 * logistics of getting equipped, told through a long opening post plus
 * short updates over time) rather than a stream of independent posts, so it
 * lives as its own route with its own content module
 * (src/lib/content/gear-journey.ts).
 *
 * The bike itself has its own deep-dive at /journal/building-the-bike
 * (frame, groupset, fit, component-by-component) — the "Building the Bike"
 * section below links out to it instead of duplicating that content.
 *
 * Adding a new update is a content-file change — see the project README's
 * "Gear Journey Content" section before editing this page or
 * BuildTimeline.
 */
export default function GearJourneyPage() {
  const lastUpdated = getGearJourneyLastUpdated();

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c") }}
      />

      <CampaignPageHero>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">
          <Link href="/journal" className="hover:underline">
            Journal
          </Link>{" "}
          &middot; Ongoing Series
        </p>
        <SectionHeading
          as="h1"
          tone="dark"
          className="mt-2"
          title={PAGE_TITLE}
          description="What it actually costs — in money, favors, and awkward asks — to get a brand-new triathlete to the starting line."
        />

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-bronze px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-off-white">
            Ongoing Series
          </span>
          <p className="text-sm text-off-white/70">
            Last updated <time dateTime={lastUpdated}>{formatDateLong(lastUpdated)}</time>
          </p>
        </div>

        <p className="mt-6 max-w-2xl text-lg italic text-off-white/85">{GEAR_JOURNEY_INTRO}</p>
      </CampaignPageHero>

      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="space-y-10">
            {GEAR_JOURNEY_OPENING_POST.sections.map((section, i) => (
              <div key={section.heading ?? `intro-${i}`}>
                {section.heading && (
                  <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink sm:text-2xl">
                    {section.heading}
                  </h2>
                )}
                <div className={section.heading ? "mt-3 space-y-4" : "space-y-4"}>
                  {section.paragraphs.map((paragraph, j) => (
                    <p key={j} className="leading-relaxed text-charcoal-light">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.heading === "Building the Bike One Piece at a Time" && (
                  <p className="mt-4">
                    <Link
                      href="/journal/building-the-bike"
                      className="text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
                    >
                      Read the Full Bike-Build Story &rarr;
                    </Link>
                  </p>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Updates"
            title="The Shorter Updates"
            description="Shorter entries added as they happen — a component arriving, a sponsor saying yes, something expensive turning out not to fit."
          />
          <div className="mt-10">
            <BuildTimeline entries={GEAR_JOURNEY_TIMELINE} />
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Help Close the Gap"
        title="Companies and Individuals Willing to Help"
        description="Equipment, discounts, and in-kind support all move this campaign forward. If your company or shop wants to hear the mission behind Tri For The 22, reaching out costs nothing."
        buttons={[
          { label: "Support the Mission", href: "/donate" },
          { label: "Can You Help With Gear?", href: "/contact", variant: "secondary" },
        ]}
      />

      <Container className="max-w-3xl py-10">
        <Link href="/journal" className="text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light">
          &larr; Back to the Journal
        </Link>
      </Container>
    </article>
  );
}
