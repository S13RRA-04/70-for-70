import Link from "next/link";
import { getJournalEntries, groupByMonth } from "@/lib/data/journal";
import { Container } from "@/components/shared/container";
import { RevealGrid, RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { CTAButton } from "@/components/shared/cta-button";
import { JournalCard } from "@/components/journal/journal-card";
import { JournalFilterRow, type JournalCategoryFilter } from "@/components/journal/journal-filter-row";
import { BikeBuildIndexCard } from "@/components/journal/bike-build/bike-build-index-card";
import { JournalStatusStrip } from "@/components/journal/journal-status-strip";
import { RoadSoFar } from "@/components/journal/road-so-far";
import { CurrentTrainingSummary } from "@/components/training/current-training-summary";
import { MissionProgress } from "@/components/campaign/mission-progress";
import { FundraisingImpactStrip } from "@/components/campaign/fundraising-impact-strip";
import { CampaignPhaseBanner } from "@/components/campaign/campaign-phase-banner";
import { EmptyState } from "@/components/shared/empty-state";
import { EmailSignupForm } from "@/components/forms/email-signup-form";
import { getBikeBuildLastUpdated } from "@/lib/content/building-the-bike";
import { getJournalMilestonesWithStatus } from "@/lib/data/journal-milestones";
import { getLatestPerformanceSnapshot } from "@/lib/data/performance-snapshots";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { getCampaignPhase } from "@/lib/campaign-phase";
import { DONATE_LINK, TRI_JOURNAL_URL, TRI_JOURNAL_PATH, TRI_PAGE_PATH, TRI_PAGE_URL, SITE_URL, CAMPAIGN_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";
import type { JournalEntryRow, JournalPrimaryCategory } from "@/types/database";

/** Home › Campaigns › Tri For The 22 — the trail every Tri sub-page starts from. */
const TRI_CRUMBS = [
  { name: "Home", url: SITE_URL },
  { name: "Campaigns", url: `${SITE_URL}/campaigns` },
  { name: CAMPAIGN_NAME, url: TRI_PAGE_URL },
];

const JOURNAL_BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  ...TRI_CRUMBS,
  { name: "Journal", url: TRI_JOURNAL_URL },
]);

/** Filtering only earns its keep once there's enough volume to actually sort through — see AGENTS.md's Journal spec. */
const MIN_ENTRIES_FOR_FILTERS = 6;

/** Initial + per-click batch size for "Load More" — see the pagination block below for why this stays URL-driven. */
const PAGE_SIZE = 12;

export const metadata = pageMetadata({
  title: "Road to Chattanooga Journal",
  description:
    "Follow the road to IRONMAN 70.3 Chattanooga — training, setbacks, milestones, partners, and fundraising updates for the Tri For The 22 veteran and first responder campaign.",
  canonical: TRI_JOURNAL_URL,
});

const VALID_CATEGORIES: JournalPrimaryCategory[] = [
  "Training",
  "Campaign",
  "Mighty Oaks",
  "Support",
  "Race Prep",
  "Milestones",
  "22 For the 22",
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
  return `${TRI_JOURNAL_PATH}${qs ? `?${qs}` : ""}`;
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
    url: TRI_JOURNAL_URL,
    blogPost: entries.slice(0, PAGE_SIZE).map((entry) => ({
      "@type": "BlogPosting",
      headline: entry.title,
      url: `${TRI_JOURNAL_URL}/${entry.slug}`,
      ...(entry.published_at && { datePublished: entry.published_at }),
    })),
  };
}

export default async function JournalPage(props: PageProps<"/campaigns/tri/journal">) {
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
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(journalCollectionJsonLd(allEntries))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(JOURNAL_BREADCRUMB_JSON_LD)} />

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
            <CTAButton href={`${TRI_JOURNAL_PATH}/${latestEntry.slug}`} tone="dark">
              Latest Entry
            </CTAButton>
          )}
          <CTAButton href={TRI_PAGE_PATH} variant="secondary" tone="dark">
            Training Dashboard
          </CTAButton>
        </div>
        <CampaignPhaseBanner phase={phase} tone="dark" />
      </CampaignPageHero>

      {/* 2. Featured / latest entry, paired with a compact live For The 22 Mission Status panel — makes use of the widened container instead of a single narrow column. */}
      {featuredEntry && (
        <section className="py-14 sm:py-16">
          <Container>
            <RevealOnScroll className="grid gap-8 lg:grid-cols-[1.65fr_1fr] lg:items-start">
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-bronze">Latest</p>
                <JournalCard entry={featuredEntry} featured readMoreLabel="Read the Journal Entry →" />
              </div>

              <div className="rounded-sm border border-ink/10 bg-sand-light p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal-light">
                  For The 22 Mission Status
                </p>
                <div className="mt-4">
                  <MissionProgress
                    totalRaised={fundraisingStats.amountRaised}
                    goal={fundraisingStats.fundraisingGoal}
                  />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-line bg-white px-4 py-3">
                    <p className="font-display text-2xl tabular-nums text-ink">
                      {fundraisingStats.milesFunded}/{fundraisingStats.milesTotal}
                    </p>
                    <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-light">
                      Miles Funded
                    </p>
                  </div>
                  <div className="rounded-xl border border-line bg-white px-4 py-3">
                    <p className="font-display text-2xl tabular-nums text-ink">
                      {fundraisingStats.supporterCount}
                    </p>
                    <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-light">
                      Supporters
                    </p>
                  </div>
                </div>
                <Link
                  href={TRI_PAGE_PATH}
                  className="mt-6 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
                >
                  Back to Tri For The 22 &rarr;
                </Link>
              </div>
            </RevealOnScroll>
          </Container>
        </section>
      )}

      {/* 3. Ongoing stories — the Bike Build as a narrative series, not a sponsor ad. */}
      <section className="border-t border-ink/10 bg-sand-light py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow="The Campaign" title="Ongoing Stories" />
          <RevealGrid>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <BikeBuildIndexCard lastUpdated={getBikeBuildLastUpdated()} />
            </div>
          </RevealGrid>
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
                  <div
                    key={group.label}
                    className={
                      i === 0 && !showFilters ? "" : "mt-10 border-t border-ink/10 pt-10"
                    }
                  >
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-light">
                      {group.label}
                    </h3>
                    <RevealGrid>
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        {group.entries.map((entry) => (
                          <JournalCard key={entry.id} entry={entry} isLatest={entry.id === latestEntry?.id} />
                        ))}
                      </div>
                    </RevealGrid>
                  </div>
                ))}

                {hasMore && (
                  <div className="mt-10 text-center">
                    <Link
                      href={buildJournalHref({ category: activeCategory, page: page + 1 })}
                      scroll={false}
                      className="action-control inline-flex items-center justify-center font-bold gap-1.5 border-2 border-navy px-6 py-3 text-[15px] text-navy transition-all duration-150 hover:bg-white active:scale-[0.97]"
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
          <RevealOnScroll>
            <SectionHeading eyebrow="The Campaign" title="Road to Chattanooga" />
            <div className="mt-6">
              <RoadSoFar milestones={milestones} />
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* 6. Current training — four summary metrics. */}
      <section className="py-14 sm:py-16">
        <Container>
          <RevealOnScroll>
            <SectionHeading eyebrow="Behind the Miles" title="Current Training" />
            <div className="mt-6">
              <CurrentTrainingSummary rows={performanceSnapshot.rows} />
            </div>
            <Link
              href={TRI_PAGE_PATH}
              className="mt-6 inline-block text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
            >
              Back to Tri For The 22 &rarr;
            </Link>

          </RevealOnScroll>
        </Container>
      </section>

      {/* 7. Campaign impact / mission. */}
      <section className="border-t border-ink/10 bg-sand-light py-14 sm:py-16">
        <Container>
          <RevealOnScroll>
            <SectionHeading eyebrow="Campaign Impact" title="The Mission Behind the Miles" />
            <div className="mt-6 max-w-2xl">
              <FundraisingImpactStrip stats={fundraisingStats} />
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      <CTASection
        title="The Miles Are the Vehicle. The Mission Is the Point."
        description="70.3 miles gives the campaign a finish line. Supporting veterans and first responders gives it a reason to exist."
        buttons={[
          { label: "Donate", href: DONATE_LINK.href },
          { label: "Get Help Now", href: "/crisis", variant: "secondary" },
        ]}
      />

      {/* 8. Email signup. */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal-light">
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
