import Link from "next/link";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { BuildStatusPanel } from "@/components/journal/bike-build/build-status-panel";
import { BuildTimelineNodes } from "@/components/journal/bike-build/build-timeline-nodes";
import { BuildBeforeAfter } from "@/components/journal/bike-build/build-before-after";
import { ComponentStatusBoard } from "@/components/journal/bike-build/component-status-board";
import { ContributorsSection } from "@/components/journal/bike-build/contributors-section";
import { PhotoRoadmap } from "@/components/journal/bike-build/photo-roadmap";
import {
  BIKE_BUILD_BEFORE_AFTER,
  BIKE_BUILD_COMPONENT_STATUS,
  BIKE_BUILD_CONFIRMED_CONTRIBUTORS,
  BIKE_BUILD_CONVERSATIONS_IN_PROGRESS,
  BIKE_BUILD_HERO_PHOTO,
  BIKE_BUILD_INTRO,
  BIKE_BUILD_PHOTO_ROADMAP,
  BIKE_BUILD_STATUS_SUMMARY,
  BIKE_BUILD_TIMELINE,
  getBikeBuildLastUpdated,
  getBikeBuildStatusOverview,
  getBikeBuildTimelineNodes,
} from "@/lib/content/building-the-bike";
import { getMissionPartners } from "@/lib/data/mission-partners";
import { findProvidingPartner } from "@/lib/partner-matching";
import { formatDateLong } from "@/lib/utils";
import { CAMPAIGN_NAME, CAMPAIGN_URL, RACE_INFO, SITE_NAME, SITE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, CAMPAIGN_HOME_CRUMB, FOUNDER_PERSON_JSON_LD, jsonLdScriptProps } from "@/lib/json-ld";

const PAGE_TITLE = "Building the Bike: The Long Road to the Starting Line";
const PAGE_DESCRIPTION =
  "Follow the continuing effort to turn a donated 2012 Stradalli frame into the race-ready bicycle that will carry Tri For The 22 through the 2027 IRONMAN 70.3 Chattanooga campaign.";
const CANONICAL_URL = `${CAMPAIGN_URL}/journal/building-the-bike`;

export const metadata = pageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  canonical: CANONICAL_URL,
  image: BIKE_BUILD_HERO_PHOTO.src,
  type: "article",
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
    author: FOUNDER_PERSON_JSON_LD,
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

const BIKE_BUILD_BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  CAMPAIGN_HOME_CRUMB,
  { name: "Journal", url: `${CAMPAIGN_URL}/journal` },
  { name: "Building the Bike", url: CANONICAL_URL },
]);

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
export default async function BuildingTheBikePage() {
  const lastUpdated = getBikeBuildLastUpdated();
  const timelineNodes = getBikeBuildTimelineNodes();
  const statusOverview = getBikeBuildStatusOverview();
  const buildPercent = Math.round((statusOverview.confirmedCount / statusOverview.totalCount) * 100);
  const partners = await getMissionPartners();

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(buildJsonLd())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BIKE_BUILD_BREADCRUMB_JSON_LD)} />

      <CampaignPageHero>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">
          <Link href="/journal" className="hover:underline">
            The Journal
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
          <span className="rounded-full bg-bronze px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-ink">
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
        <Container className="max-w-4xl">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-bronze">Then and Now</p>
          <div className="mt-4">
            <BuildBeforeAfter before={BIKE_BUILD_BEFORE_AFTER.before} after={BIKE_BUILD_BEFORE_AFTER.after} />
          </div>
        </Container>
      </section>

      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Where Things Stand"
            title="Current Status"
            description="A snapshot, not a finish line. Nothing below is marked done until it actually is — see the full timeline and component board further down for the details behind each line."
          />
          <div className="mt-8 flex flex-wrap items-baseline gap-3">
            <p className="font-display text-5xl font-bold tabular-nums text-ink sm:text-6xl">{buildPercent}%</p>
            <p className="text-sm font-semibold uppercase tracking-widest text-charcoal-light">
              Build Status — {statusOverview.confirmedCount} of {statusOverview.totalCount} components confirmed
            </p>
          </div>
          <div className="mt-8">
            <BuildStatusPanel items={BIKE_BUILD_STATUS_SUMMARY} />
          </div>
        </Container>
      </section>

      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="The Living Timeline"
            title="How We Got Here"
            description="One node per date something happened, from the first search for a bike to the newest development. Hover a node for a quick synopsis; click it to open the full update — body, photos, and all."
          />
          <div className="mt-10">
            <BuildTimelineNodes nodes={timelineNodes} />
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
            <ComponentStatusBoard
              rows={BIKE_BUILD_COMPONENT_STATUS}
              rowExtra={(row) => {
                const provider = findProvidingPartner(row, partners);
                if (!provider) return null;
                return (
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-bronze">
                    &mdash; {provider.name} &#10003;
                  </span>
                );
              }}
            />
          </div>
        </Container>
      </section>

      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Coming Soon"
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

      <section className="border-b border-ink/10 bg-ink py-20 text-off-white sm:py-28">
        <Container className="max-w-3xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-bronze-light">
            Why It Matters
          </p>
          <h2 className="mt-3 text-center text-balance font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
            More Than a Bike
          </h2>

          <div className="mx-auto mt-10 max-w-2xl space-y-5 text-lg leading-relaxed text-off-white/85">
            <p>I got this bike as a collection of parts.</p>
            <p>
              Over the course of months, I worked with different groups and organizations — brainstorming ideas,
              chasing down support, sourcing components one at a time. The pile of parts kept growing. A crankset
              here. A saddle there. A stand to work on it. With each new part, a little more got added to the bike.
            </p>
            <p>Now, nearly at the finish of the build, it&apos;s become something more than a bike.</p>
            <p>
              It represents rebuilding ourselves into something capable of carrying us through the challenges of
              life. We can&apos;t do that if we&apos;re missing pieces of ourselves.
            </p>
            <p>
              Sometimes that means getting new parts for ourselves — techniques to cope with stress, outlets that
              keep our minds and bodies strong. Sometimes it means repairing and refining what&apos;s already there.
            </p>
            <p>
              Either way, the goal is the same: putting something together that&apos;s more powerful and more
              meaningful than just the sum of its parts.
            </p>
          </div>

          <blockquote className="mx-auto mt-10 max-w-xl border-l-2 border-bronze pl-5 text-lg italic text-off-white/90">
            Progress rarely arrives fully assembled. Sometimes it appears as a bare frame, a box of parts, a few
            people willing to help, and the decision to keep moving.
          </blockquote>

          <div className="mx-auto mt-10 max-w-2xl border-t border-off-white/15 pt-8 text-sm leading-relaxed text-off-white/70">
            <p>
              {CAMPAIGN_NAME} connects veterans and first responders with resources that can help them confront
              mental and physical barriers, while raising public awareness and funds for charitable organizations
              serving those communities. &ldquo;22&rdquo; has become a widely recognized symbol of veteran suicide
              awareness — historically significant, but not the current national number. The VA&apos;s most recent
              data (2023) puts the daily average at 17.5 Veterans lost to suicide, and law enforcement faces a
              version of the same crisis, with far less complete reporting, roughly every 2 to 3 days.
            </p>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <li>
              <Link href="/the-mission" className="font-semibold text-bronze-light hover:text-off-white">
                The Campaign Mission &rarr;
              </Link>
            </li>
            <li>
              <Link href="/donate" className="font-semibold text-bronze-light hover:text-off-white">
                Donate &rarr;
              </Link>
            </li>
            <li>
              <Link href="/beneficiaries" className="font-semibold text-bronze-light hover:text-off-white">
                Beneficiary Organizations &rarr;
              </Link>
            </li>
            <li>
              <Link href="/journal" className="font-semibold text-bronze-light hover:text-off-white">
                The Journal &rarr;
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
        <Link href="/journal" className="text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark">
          &larr; Back to the Journal
        </Link>
      </Container>
    </article>
  );
}
