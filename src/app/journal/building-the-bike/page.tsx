import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { BuildStatusPanel } from "@/components/journal/bike-build/build-status-panel";
import { BuildTimeline } from "@/components/journal/bike-build/build-timeline";
import { ComponentStatusBoard } from "@/components/journal/bike-build/component-status-board";
import { ContributorsSection } from "@/components/journal/bike-build/contributors-section";
import { PhotoRoadmap } from "@/components/journal/bike-build/photo-roadmap";
import {
  BIKE_BUILD_COMPONENT_STATUS,
  BIKE_BUILD_CONFIRMED_CONTRIBUTORS,
  BIKE_BUILD_CONVERSATIONS_IN_PROGRESS,
  BIKE_BUILD_HERO_PHOTO,
  BIKE_BUILD_INTRO,
  BIKE_BUILD_PHOTO_ROADMAP,
  BIKE_BUILD_STATUS_SUMMARY,
  BIKE_BUILD_TIMELINE,
  getBikeBuildLastUpdated,
} from "@/lib/content/building-the-bike";
import { formatDateLong } from "@/lib/utils";
import { CAMPAIGN_NAME, CAMPAIGN_URL, RACE_INFO, SITE_NAME, SITE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

const PAGE_TITLE = "Building the Bike: The Long Road to the Starting Line";
const PAGE_DESCRIPTION =
  "Follow the continuing effort to turn a donated 2012 Stradalli frame into the race-ready bicycle that will carry Tri For The 22 through the 2027 IRONMAN 70.3 Chattanooga campaign.";
const CANONICAL_URL = `${CAMPAIGN_URL}/journal/building-the-bike`;

export const metadata = pageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  canonical: CANONICAL_URL,
  image: BIKE_BUILD_HERO_PHOTO.src,
});

function buildJsonLd() {
  const lastUpdated = getBikeBuildLastUpdated();
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: CANONICAL_URL,
    mainEntityOfPage: CANONICAL_URL,
    datePublished: BIKE_BUILD_TIMELINE[0].date,
    dateModified: lastUpdated,
    image: `${CAMPAIGN_URL}${BIKE_BUILD_HERO_PHOTO.src}`,
    author: { "@type": "Organization", name: CAMPAIGN_NAME, url: CAMPAIGN_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

/**
 * The living "bike-build adventure" feature — a standalone content page
 * inside the Journal section, not a Supabase journal_entries row. This
 * story needs a richer per-update shape (technical specs, photo galleries,
 * contributor credit, a component-status board, stable per-entry anchors)
 * than the single Markdown `body` field the Journal's CRUD schema gives a
 * normal post, and it's one continuing thread rather than a stream of
 * independent posts — so it lives as its own route with its own structured
 * content module (src/lib/content/building-the-bike.ts), the same pattern
 * already used for /the-story and /the-mission. Because this is a literal
 * static segment under /journal, Next's router resolves it here rather
 * than falling through to the dynamic /journal/[slug] route — see that
 * route's file for the Supabase-backed post system this page intentionally
 * sits outside of.
 *
 * Nothing on this page should ever claim the bike is complete, fitted, or
 * race-ready until BIKE_BUILD_STATUS_SUMMARY/BIKE_BUILD_COMPONENT_STATUS
 * actually say so — see the project README's "Bike Build Journal Content"
 * section before editing.
 */
export default function BuildingTheBikePage() {
  const lastUpdated = getBikeBuildLastUpdated();

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c") }}
      />

      <CampaignPageHero>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">
          <Link href="/journal" className="hover:underline">
            Follow My Progress
          </Link>{" "}
          &middot; Ongoing Series
        </p>
        <SectionHeading
          as="h1"
          tone="dark"
          className="mt-2"
          title={PAGE_TITLE}
          description="The continuing story of turning a donated frame into a race-ready machine."
        />

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-bronze px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-off-white">
            Build In Progress
          </span>
          <p className="text-sm text-off-white/70">
            Last updated <time dateTime={lastUpdated}>{formatDateLong(lastUpdated)}</time>
          </p>
        </div>

        <p className="mt-6 max-w-2xl text-lg italic text-off-white/85">{BIKE_BUILD_INTRO}</p>

        <p className="mt-4 max-w-2xl text-base text-off-white/75">
          Cycling is Cody&apos;s newest discipline — the one with the least history and the most unknowns. Whatever
          bike comes out of this process ultimately has to carry him through the 56-mile bike leg of his first
          IRONMAN 70.3{RACE_INFO.raceLocation ? `, in ${RACE_INFO.raceLocation}` : ""}. It is not there yet. This
          page tracks the honest, occasionally absurd process of getting it there.
        </p>
      </CampaignPageHero>

      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-sand-light sm:aspect-[16/9]">
            <Image
              src={BIKE_BUILD_HERO_PHOTO.src}
              alt={BIKE_BUILD_HERO_PHOTO.alt}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
          <p className="mt-3 text-sm text-charcoal-light">{BIKE_BUILD_HERO_PHOTO.caption}</p>
        </Container>
      </section>

      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Where Things Stand"
            title="Current Status"
            description="A snapshot, not a finish line. Nothing below is marked done until it actually is — see the full timeline and component board further down for the details behind each line."
          />
          <div className="mt-8">
            <BuildStatusPanel items={BIKE_BUILD_STATUS_SUMMARY} />
          </div>
        </Container>
      </section>

      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="The Living Timeline"
            title="How We Got Here"
            description="Every update, from the first search for a bike to the newest development below. Each entry has its own link — click a title's link icon to share that specific update."
          />
          <div className="mt-10">
            <BuildTimeline entries={BIKE_BUILD_TIMELINE} />
          </div>
        </Container>
      </section>

      <section id="component-status" className="scroll-mt-24 border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Part by Part"
            title="Component Status Board"
            description="What's confirmed, what's offered, what's still needed — updated as the build's status actually changes."
          />
          <div className="mt-8">
            <ComponentStatusBoard rows={BIKE_BUILD_COMPONENT_STATUS} />
          </div>
        </Container>
      </section>

      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Photography"
            title="What's Coming Into Focus"
            description="Only real campaign photographs appear on this page. These slots stay empty and clearly labeled until there's an actual photo to put in them."
          />
          <div className="mt-8">
            <PhotoRoadmap slots={BIKE_BUILD_PHOTO_ROADMAP} />
          </div>
        </Container>
      </section>

      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Gratitude"
            title="The People Helping Build the Bike"
            description="A frame doesn't become a bicycle alone. Text-only for now — logos may be added later, with permission, without changing this section's layout."
          />
          <div className="mt-8">
            <ContributorsSection
              confirmed={BIKE_BUILD_CONFIRMED_CONTRIBUTORS}
              inProgress={BIKE_BUILD_CONVERSATIONS_IN_PROGRESS}
            />
          </div>
        </Container>
      </section>

      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Why It Matters" title="More Than a Bike" />
          <div className="mt-4 space-y-4 text-base leading-relaxed text-charcoal-light">
            <p>
              For The 22 connects veterans and first responders with resources that can help them confront mental
              and physical barriers, while raising public awareness and funds for charitable organizations serving
              those communities. &ldquo;22&rdquo; has become a widely recognized symbol of veteran suicide
              awareness — not a precise, universal, or current statistic, but a reminder of the people still
              fighting and the responsibility to keep showing up for them.
            </p>
            <blockquote className="border-l-2 border-bronze pl-4 italic text-ink">
              Progress rarely arrives fully assembled. Sometimes it appears as a bare frame, a box of parts, a few
              people willing to help, and the decision to keep moving.
            </blockquote>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li>
              <Link href="/the-mission" className="font-semibold text-bronze hover:text-bronze-light">
                The Campaign Mission &rarr;
              </Link>
            </li>
            <li>
              <Link href="/donate" className="font-semibold text-bronze hover:text-bronze-light">
                Donate &rarr;
              </Link>
            </li>
            <li>
              <Link href="/beneficiaries" className="font-semibold text-bronze hover:text-bronze-light">
                Beneficiary Organizations &rarr;
              </Link>
            </li>
            <li>
              <Link href="/journal" className="font-semibold text-bronze hover:text-bronze-light">
                Follow My Progress &rarr;
              </Link>
            </li>
          </ul>
        </Container>
      </section>

      <CTASection
        eyebrow="Keep It Moving"
        title="Help Carry This Forward"
        description="The mission this bike is being built for still needs support of its own. The Stradalli build has now secured its Shimano 105 2×11 brifters, and the focus is shifting toward final fit, remaining consumables, aerobar compatibility, assembly, and testing."
        buttons={[
          { label: "Support the Mission", href: "/donate" },
          { label: "Can You Help Complete the Build?", href: "/contact", variant: "secondary" },
        ]}
      />

      <Container className="max-w-3xl py-10">
        <Link href="/journal" className="text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light">
          &larr; Back to Follow My Progress
        </Link>
      </Container>
    </article>
  );
}
