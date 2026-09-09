import Link from "next/link";
import { getJournalEntries, groupByMonth } from "@/lib/data/journal";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { CTAButton } from "@/components/shared/cta-button";
import { JournalCard } from "@/components/journal/journal-card";
import { JournalFilterRow, type JournalCategoryFilter } from "@/components/journal/journal-filter-row";
import { BikeBuildIndexCard } from "@/components/journal/bike-build/bike-build-index-card";
import { GearJourneyIndexCard } from "@/components/journal/gear-journey/gear-journey-index-card";
import { JournalStatusStrip } from "@/components/journal/journal-status-strip";
import { RoadSoFar } from "@/components/journal/road-so-far";
import { CurrentTrainingSummary } from "@/components/training/current-training-summary";
import { FundraisingImpactStrip } from "@/components/campaign/fundraising-impact-strip";
import { CampaignPhaseBanner } from "@/components/campaign/campaign-phase-banner";
import { EmptyState } from "@/components/shared/empty-state";
import { EmailSignupForm } from "@/components/forms/email-signup-form";
import { getBikeBuildLastUpdated } from "@/lib/content/building-the-bike";
import { getGearJourneyLastUpdated } from "@/lib/content/gear-journey";
import { getJournalMilestonesWithStatus } from "@/lib/data/journal-milestones";
import { getLatestPerformanceSnapshot } from "@/lib/data/performance-snapshots";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { getCampaignPhase } from "@/lib/campaign-phase";
import { CAMPAIGN_URL, DONATE_LINK } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import type { JournalEntryRow, JournalPrimaryCategory } from "@/types/database";

/** Filtering only earns its keep once there's enough volume to actually sort through — see AGENTS.md's Journal spec. */
const MIN_ENTRIES_FOR_FILTERS = 6;

/** Initial + per-click batch size for "Load More" — see the pagination block below for why this stays URL-driven. */
const PAGE_SIZE = 12;

export const metadata = pageMetadata({
  title: "Road to Chattanooga Journal",
  description:
    "Follow the road to IRONMAN 70.3 Chattanooga — training, setbacks, milestones, partners, and fundraising updates for the Tri For The 22 veteran and first responder campaign.",
  canonical: `${CAMPAIGN_URL}/journal`,
});

const VALID_CATEGORIES: JournalPrimaryCategory[] = [
  "Training",
  "Campaign",
  "Mighty Oaks",
  "Support",
  "Race Prep",
  "Milestones",
];

/** "Bike Build" is a UI-only pseudo-category layered on top of the real DB enum — see JournalFilterRow's doc comment. */
const ALL_FILTERABLE: JournalCategoryFilter[] = [...VALID_CATEGORIES, "Bike Build"];

/** JournalCategoryFilter plus the implicit "show everything" state — JournalFilterRow renders "All" itself rather than taking it as a category to filter by. */
type ActiveCategory = JournalCategoryFilter | "All";

function buildJournalHref(params: { category: ActiveCategory; page: number }): string {
  const sp = new URLSearchParams();
  if (params.category !== "All") sp.set("category", params.category);
  if (params.page > 1) sp.set("page", String(params.page));
  const qs = sp.toString();
  return `/journal${qs ? `?${qs}` : ""}`;
}

/**
 * Minimal Blog/CollectionPage structured data for the index itself — mirrors
 * the same "only real fields" discipline as entryJsonLd in [slug]/page.tsx.
 * Capped to the first page's worth of entries; not meant to enumerate the
 * whole archive (that's what sitemap.ts already does for indexing).
 */
function journalCollectionJsonLd(entries: JournalEntryRow[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Road to Chattanooga Journal",
    url: `${CAMPAIGN_URL}/journal`,
    blogPost: entries.slice(0, PAGE_SIZE).map((entry) => ({
      "@type": "BlogPosting",
      headline: entry.title,
      url: `${CAMPAIGN_URL}/journal/${entry.slug}`,
      ...(entry.published_at && { datePublished: entry.published_at }),
    })),
  };
}

export default async function JournalPage(props: PageProps<"/journal">) {
  const searchParams = await props.searchParams;
  const categoryParam = Array.isArray(searchParams.category) ? searchParams.category[0] : searchParams.category;
  const activeCategory: ActiveCategory =
    categoryParam && ALL_FILTERABLE.includes(categoryParam as JournalCategoryFilter)
      ? (categoryParam as JournalCategoryFilter)
      : "All";

  const pageParam = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const page = Math.max(1, Number(pageParam) || 1);

  const [allEntries, performanceSnapshot, fundraisingStats] = await Promise.all([
    getJournalEntries(),
    getLatestPerformanceSnapshot(),
    getFundraisingImpactStats(),
  ]);

  // The dominant "Latest" card (section 2) is always the single newest
  // entry site-wide — a manually curated `featured` row wins if one
  // exists, otherwise the newest published entry. Unlike the old design,
  // this no longer depends on which category filter is active: it's a
  // fixed section above the filterable archive, not part of it.
  const latestEntry = allEntries[0] ?? null;
  const featuredEntry = allEntries.find((e) => e.featured) ?? latestEntry;

  const filteredEntries: JournalEntryRow[] =
    activeCategory === "All"
      ? allEntries
      : activeCategory === "Bike Build"
        ? allEntries.filter((e) => e.tags?.includes("bike-build"))
        : allEntries.filter((e) => e.primary_category === activeCategory);

  // The archive grid never repeats the entry already shown big in section
  // 2 — a no-op filter when a category is active and that entry doesn't
  // match it anyway.
  const archiveEntries = featuredEntry
    ? filteredEntries.filter((e) => e.id !== featuredEntry.id)
    : filteredEntries;

  // URL-based cumulative pagination (?page=N) rather than a client fetch —
  // same pattern JournalFilterRow already uses for ?category=. Individual
  // entries stay fully discoverable regardless of index-page batching:
  // sitemap.ts lists every /journal/[slug] URL directly, so search engines
  // never depend on crawling this paginated index to find an entry.
  const visibleCount = page * PAGE_SIZE;
  const visibleArchive = archiveEntries.slice(0, visibleCount);
  const hasMore = archiveEntries.length > visibleCount;
  const monthGroups = groupByMonth(visibleArchive);

  // Only categories that actually have published entries — an empty
  // filter pill that returns nothing is worse than not showing it.
  const categoriesWithEntries = VALID_CATEGORIES.filter((category) =>
    allEntries.some((e) => e.primary_category === category),
  );
  const filterOptions: JournalCategoryFilter[] = [...categoriesWithEntries, "Bike Build"];
  const showFilters = allEntries.length >= MIN_ENTRIES_FOR_FILTERS && categoriesWithEntries.length > 1;
  const phase = getCampaignPhase();
  const milestones = getJournalMilestonesWithStatus(allEntries);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(journalCollectionJsonLd(allEntries)).replace(/</g, "\\u003c"),
        }}
      />

      {/* 1. Hero — editorial and restrained: one status line, two CTAs, no stat-card grid. */}
      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          eyebrow="The Journal"
          title="Road to Chattanooga"
          description="Training. Setbacks. Progress. People stepping up. And the road toward 70.3 miles for veterans and first responders."
        />
        <JournalStatusStrip />
        <div className="mt-6 flex flex-wrap gap-3">
          {latestEntry && (
            <CTAButton href={`/journal/${latestEntry.slug}`} tone="dark">
              Latest Entry
            </CTAButton>
          )}
          <CTAButton href="/the-race" variant="secondary" tone="dark">
            Training Dashboard
          </CTAButton>
        </div>
        <CampaignPhaseBanner phase={phase} />
      </CampaignPageHero>

      {/* 2. Featured / latest entry — the dominant content item on the page. */}
      {featuredEntry && (
        <section className="py-14 sm:py-16">
          <Container>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-bronze">Latest</p>
            <JournalCard entry={featuredEntry} featured readMoreLabel="Read the Journal Entry →" />
          </Container>
        </section>
      )}

      {/* 3. Ongoing stories — Bike Build and Gear Journey as narrative series, not sponsor ads. */}
      <section className="border-t border-ink/10 bg-sand-light py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow="The Campaign" title="Ongoing Stories" />
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <BikeBuildIndexCard lastUpdated={getBikeBuildLastUpdated()} />
            <GearJourneyIndexCard lastUpdated={getGearJourneyLastUpdated()} />
          </div>
        </Container>
      </section>

      {/* 4. Journal archive — filterable, editorial cards, no performance data mixed in. */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="The Archive" title="From the Journal" />

          <div className="mt-8">
            {showFilters && <JournalFilterRow categories={filterOptions} />}

            {archiveEntries.length === 0 ? (
              <div className={showFilters ? "mt-8" : undefined}>
                <EmptyState
                  title="New updates are on the way."
                  description="Entries will start appearing here as training and campaign milestones happen."
                  cta={{ label: DONATE_LINK.label, href: DONATE_LINK.href }}
                />
              </div>
            ) : (
              <>
                {monthGroups.map((group, i) => (
                  <div key={group.label} className={i === 0 && !showFilters ? "" : "mt-10"}>
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                      {group.label}
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {group.entries.map((entry) => (
                        <JournalCard key={entry.id} entry={entry} isLatest={entry.id === latestEntry?.id} />
                      ))}
                    </div>
                  </div>
                ))}

                {hasMore && (
                  <div className="mt-10 text-center">
                    <Link
                      href={buildJournalHref({ category: activeCategory, page: page + 1 })}
                      scroll={false}
                      className="inline-flex rounded-sm border border-ink/15 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink hover:border-ink/30"
                    >
                      Load More
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </Container>
      </section>

      {/* 5. Road So Far — narrative timeline, moved below the archive. */}
      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="The Campaign" title="The Road So Far" />
          <div className="mt-6">
            <RoadSoFar milestones={milestones} />
          </div>
        </Container>
      </section>

      {/* 6. Current training — four summary metrics only; the full dashboard lives on /the-race. */}
      <section className="py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow="Behind the Miles" title="Current Training" />
          <div className="mt-6">
            <CurrentTrainingSummary rows={performanceSnapshot.rows} />
          </div>
          <Link
            href="/the-race"
            className="mt-6 inline-block text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
          >
            See Full Training Dashboard &rarr;
          </Link>

          <div className="mt-6 rounded-sm border border-bronze/30 bg-bronze/5 px-5 py-4">
            <p className="text-sm text-charcoal-light">
              Want to race for the mission?{" "}
              <Link href="/get-involved/triathlon-team" className="font-semibold text-bronze hover:text-bronze-light">
                Join the Triathlon Team &rarr;
              </Link>
            </p>
          </div>
        </Container>
      </section>

      {/* 7. Campaign impact / mission. */}
      <section className="border-t border-ink/10 bg-sand-light py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow="Campaign Impact" title="The Mission Behind the Miles" />
          <div className="mt-6 max-w-2xl">
            <FundraisingImpactStrip stats={fundraisingStats} />
          </div>
        </Container>
      </section>

      <CTASection
        title="The Miles Are the Vehicle. The Mission Is the Point."
        description="70.3 miles gives the campaign a finish line. Supporting veterans and first responders gives it a reason to exist."
        buttons={[
          { label: "Fund a Mile", href: "/fund-a-mile" },
          { label: "Get Involved", href: "/get-involved", variant: "secondary" },
        ]}
      />

      {/* 8. Email signup. */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            Follow the Road to Chattanooga
          </p>
          <p className="mt-2 mb-6 text-sm text-charcoal-light">
            Get new journal entries, campaign milestones, and major updates as the build continues.
          </p>
          <EmailSignupForm />
        </Container>
      </section>
    </>
  );
}
