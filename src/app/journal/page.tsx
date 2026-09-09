import Link from "next/link";
import Image from "next/image";
import { getJournalEntries, groupByMonth } from "@/lib/data/journal";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { JournalCard } from "@/components/journal/journal-card";
import { JournalFilterRow, type JournalCategoryFilter } from "@/components/journal/journal-filter-row";
import { BikeBuildIndexCard } from "@/components/journal/bike-build/bike-build-index-card";
import { GearJourneyIndexCard } from "@/components/journal/gear-journey/gear-journey-index-card";
import { JournalStatusStrip } from "@/components/journal/journal-status-strip";
import { RoadSoFar } from "@/components/journal/road-so-far";
import { TrainingSnapshot } from "@/components/training/training-snapshot";
import { TrainingObjectivesChecklist } from "@/components/training/training-objectives-checklist";
import { PerformanceMetricsPanel } from "@/components/training/performance-metrics-panel";
import { FundraisingImpactStrip } from "@/components/campaign/fundraising-impact-strip";
import { CampaignPhaseBanner } from "@/components/campaign/campaign-phase-banner";
import { EmptyState } from "@/components/shared/empty-state";
import { EmailSignupForm } from "@/components/forms/email-signup-form";
import { getBikeBuildLastUpdated } from "@/lib/content/building-the-bike";
import { getGearJourneyLastUpdated } from "@/lib/content/gear-journey";
import { getJournalMilestonesWithStatus } from "@/lib/data/journal-milestones";
import { getTrainingSnapshot } from "@/lib/whoop/client";
import { getTrainingStats } from "@/lib/training-stats";
import { getTrainingObjectives } from "@/lib/data/training-objectives";
import { getLatestPerformanceSnapshot } from "@/lib/data/performance-snapshots";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { getCampaignPhase } from "@/lib/campaign-phase";
import { CAMPAIGN_URL, DONATE_LINK, STRAVA_PROFILE_URL } from "@/lib/constants";
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
  "Fundraising",
  "Mighty Oaks",
  "Sponsors",
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
    name: "Follow My Progress",
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

  const [allEntries, trainingSnapshot, trainingStats, trainingObjectives, performanceSnapshot, fundraisingStats] =
    await Promise.all([
      getJournalEntries(),
      getTrainingSnapshot(),
      getTrainingStats(),
      getTrainingObjectives(),
      getLatestPerformanceSnapshot(),
      getFundraisingImpactStats(),
    ]);

  const hasTrainingVolume =
    trainingStats.swimSessions !== null ||
    trainingStats.bikeMiles !== null ||
    trainingStats.runMiles !== null ||
    trainingStats.totalHours !== null ||
    trainingStats.weeksCompleted !== null ||
    trainingStats.weeksRemaining !== null;

  const entries: JournalEntryRow[] =
    activeCategory === "All"
      ? allEntries
      : activeCategory === "Bike Build"
        ? allEntries.filter((e) => e.tags?.includes("bike-build"))
        : allEntries.filter((e) => e.primary_category === activeCategory);

  const latestEntryId = allEntries[0]?.id ?? null;
  const featured = activeCategory === "All" ? (entries.find((e) => e.featured) ?? entries[0] ?? null) : null;
  const rest = featured ? entries.filter((e) => e.id !== featured.id) : entries;

  // URL-based cumulative pagination (?page=N) rather than a client fetch —
  // same pattern JournalFilterRow already uses for ?category=. Individual
  // entries stay fully discoverable regardless of index-page batching:
  // sitemap.ts lists every /journal/[slug] URL directly, so search engines
  // never depend on crawling this paginated index to find an entry.
  const visibleCount = page * PAGE_SIZE;
  const visibleRest = rest.slice(0, visibleCount);
  const hasMore = rest.length > visibleCount;
  const monthGroups = groupByMonth(visibleRest);

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

      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          eyebrow="The Journal"
          title="Road to Chattanooga"
          description="This isn't a workout log. It's the campaign's story — training, setbacks, milestones, partners, and fundraising — all on the way to IRONMAN 70.3 and the veterans and first responders it's for."
        />
        <JournalStatusStrip latestEntryPublishedAt={allEntries[0]?.published_at ?? null} />
      </CampaignPageHero>

      <section className="border-b border-ink/10 py-10">
        <Container className="space-y-4">
          <CampaignPhaseBanner phase={phase} />
          <BikeBuildIndexCard lastUpdated={getBikeBuildLastUpdated()} />
          <GearJourneyIndexCard lastUpdated={getGearJourneyLastUpdated()} />
        </Container>
      </section>

      <section className="border-b border-ink/10 py-12">
        <Container>
          <SectionHeading eyebrow="The Campaign" title="Road So Far" />
          <div className="mt-6">
            <RoadSoFar milestones={milestones} />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          {showFilters && <JournalFilterRow categories={filterOptions} />}

          {entries.length === 0 ? (
            <div className={showFilters ? "mt-8" : undefined}>
              <EmptyState
                title="New updates are on the way."
                description="Entries will start appearing here as training and fundraising milestones happen."
                cta={{ label: DONATE_LINK.label, href: DONATE_LINK.href }}
              />
            </div>
          ) : (
            <>
              {featured && (
                <div className={showFilters ? "mt-8" : undefined}>
                  <JournalCard entry={featured} featured isLatest={featured.id === latestEntryId} />
                </div>
              )}

              {monthGroups.map((group, i) => (
                <div key={group.label} className={i === 0 && !featured && !showFilters ? "" : "mt-10"}>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                    {group.label}
                  </h3>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {group.entries.map((entry) => (
                      <JournalCard key={entry.id} entry={entry} isLatest={entry.id === latestEntryId} />
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
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionHeading eyebrow="Recovery" title="Training Snapshot" />
            <a
              href={STRAVA_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
            >
              Follow on Strava &rarr;
            </a>
          </div>
          <div className="mt-6">
            <TrainingSnapshot snapshot={trainingSnapshot} maxWorkouts={3} />
          </div>

          <div className="mt-16">
            <SectionHeading eyebrow="The Road to Chattanooga" title="Performance Benchmarks" />
            <p className="mt-2 max-w-2xl text-sm text-charcoal-light">
              Phase 2 shifts the focus from simply covering the distance to covering it faster and
              more efficiently. Benchmarks now track economy, speed, durability, and race-specific
              execution against historical Chattanooga age-group performance.
            </p>
            <p className="mt-2 max-w-2xl text-sm text-charcoal-light">
              Milestones specific to this campaign&apos;s build toward 70.3 — not a record of
              lifetime athletic accomplishments. Nothing here is marked complete until it&apos;s
              actually done.
            </p>

            <div className="mt-8">
              <PerformanceMetricsPanel
                recordedOn={performanceSnapshot.recordedOn}
                rows={performanceSnapshot.rows}
              />
            </div>

            <div className="mt-10">
              <TrainingObjectivesChecklist objectives={trainingObjectives} />
            </div>
          </div>

          {hasTrainingVolume && (
            <div className="mt-16">
              <SectionHeading eyebrow="Behind the Race" title="Road to 70.3" />
              <div className="mt-6">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {trainingStats.swimSessions !== null && (
                    <div className="rounded-sm border border-ink/10 bg-off-white p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-ink">
                        {trainingStats.swimSessions}
                      </p>
                      <p className="text-xs text-charcoal-light">Swim Sessions</p>
                    </div>
                  )}
                  {trainingStats.bikeMiles !== null && (
                    <div className="rounded-sm border border-ink/10 bg-off-white p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-ink">
                        {trainingStats.bikeMiles}
                      </p>
                      <p className="text-xs text-charcoal-light">Miles Ridden</p>
                    </div>
                  )}
                  {trainingStats.runMiles !== null && (
                    <div className="rounded-sm border border-ink/10 bg-off-white p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-ink">
                        {trainingStats.runMiles}
                      </p>
                      <p className="text-xs text-charcoal-light">Miles Run</p>
                    </div>
                  )}
                  {trainingStats.totalHours !== null && (
                    <div className="rounded-sm border border-ink/10 bg-off-white p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-ink">
                        {trainingStats.totalHours}
                      </p>
                      <p className="text-xs text-charcoal-light">Total Training Hours</p>
                    </div>
                  )}
                  {trainingStats.weeksCompleted !== null && (
                    <div className="rounded-sm border border-ink/10 bg-off-white p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-ink">
                        {trainingStats.weeksCompleted}
                      </p>
                      <p className="text-xs text-charcoal-light">Weeks Completed</p>
                    </div>
                  )}
                  {trainingStats.weeksRemaining !== null && (
                    <div className="rounded-sm border border-bronze/40 bg-bronze/10 p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-ink">
                        {trainingStats.weeksRemaining}
                      </p>
                      <p className="text-xs text-bronze">Weeks to Race</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            Follow the Road to Chattanooga
          </p>
          <p className="mt-2 mb-6 text-sm text-charcoal-light">
            Get journal entries, milestones, race updates, and campaign news.
          </p>
          <EmailSignupForm />
        </Container>
      </section>

      <section className="border-t border-ink/10 py-16">
        <Container>
          <SectionHeading eyebrow="Campaign Impact" title="Where Things Stand" />
          <div className="mt-6">
            <FundraisingImpactStrip stats={fundraisingStats} />
          </div>
        </Container>
      </section>

      <div className="bg-off-white py-10">
        <Image
          src="/because-wordmark-black.png"
          alt="Because 22 ≠ 0"
          width={1600}
          height={300}
          className="mx-auto h-auto w-full max-w-xs px-4 sm:max-w-sm"
        />
      </div>

      <CTASection
        eyebrow="Why It Matters"
        title="The Miles Are the Vehicle. The Mission Is the Point."
        description="Training for 70.3 miles gives this campaign a finish line. Supporting veterans and first responders gives it a reason to exist."
        buttons={[
          { label: "Fund a Mile", href: "/fund-a-mile" },
          { label: "Get Involved", href: "/get-involved", variant: "secondary" },
        ]}
      />
      <div className="bg-ink pb-16 text-center">
        <Link
          href="/the-story"
          className="text-sm font-semibold uppercase tracking-wide text-bronze-light hover:text-bronze"
        >
          Read the Campaign Story &rarr;
        </Link>
      </div>
    </>
  );
}
