import { getJournalEntries, getJournalEntriesByCategory } from "@/lib/data/journal";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { JournalCard } from "@/components/journal/journal-card";
import { JournalFilterRow } from "@/components/journal/journal-filter-row";
import { BikeBuildIndexCard } from "@/components/journal/bike-build/bike-build-index-card";
import { EmptyState } from "@/components/shared/empty-state";
import { EmailSignupForm } from "@/components/forms/email-signup-form";
import { getBikeBuildLastUpdated } from "@/lib/content/building-the-bike";
import { getTrainingSnapshot } from "@/lib/whoop/client";
import { getRecentDisciplineWorkouts } from "@/lib/training-stats";
import { formatDateLong } from "@/lib/utils";
import { CAMPAIGN_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import type { JournalPrimaryCategory } from "@/types/database";

/** Filtering only earns its keep once there's enough volume to actually sort through — see AGENTS.md's Journal spec. */
const MIN_ENTRIES_FOR_FILTERS = 6;

export const metadata = pageMetadata({
  title: "The Journal",
  description: "Training, setbacks, milestones, partners, fundraising, and everything along the road to 70.3.",
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

export default async function JournalPage(props: PageProps<"/journal">) {
  const searchParams = await props.searchParams;
  const categoryParam = Array.isArray(searchParams.category) ? searchParams.category[0] : searchParams.category;
  const activeCategory =
    categoryParam && VALID_CATEGORIES.includes(categoryParam as JournalPrimaryCategory)
      ? (categoryParam as JournalPrimaryCategory)
      : "All";

  const [allEntries, trainingSnapshot] = await Promise.all([getJournalEntries(), getTrainingSnapshot()]);
  const recentDisciplineWorkouts = trainingSnapshot ? getRecentDisciplineWorkouts(trainingSnapshot.recentWorkouts) : [];

  const entries =
    activeCategory === "All" ? allEntries : await getJournalEntriesByCategory(activeCategory);

  const featured = activeCategory === "All" ? (entries.find((e) => e.featured) ?? entries[0] ?? null) : null;
  const rest = featured ? entries.filter((e) => e.id !== featured.id) : entries;

  // Only categories that actually have published entries — an empty
  // filter pill that returns nothing is worse than not showing it.
  const categoriesWithEntries = VALID_CATEGORIES.filter((category) =>
    allEntries.some((e) => e.primary_category === category),
  );
  const showFilters = allEntries.length >= MIN_ENTRIES_FOR_FILTERS && categoriesWithEntries.length > 1;

  return (
    <>
      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          eyebrow="Road to Chattanooga"
          title="The Journal"
          description="Training, setbacks, milestones, partners, fundraising, and everything along the road to 70.3."
        />
      </CampaignPageHero>

      <section className="border-b border-ink/10 py-10">
        <Container>
          <BikeBuildIndexCard lastUpdated={getBikeBuildLastUpdated()} />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          {showFilters && <JournalFilterRow categories={categoriesWithEntries} />}

          {entries.length === 0 ? (
            <div className={showFilters ? "mt-8" : undefined}>
              <EmptyState
                title="Journal entries are on the way."
                description="Entries will start appearing here as training and fundraising milestones happen."
                cta={{ label: "Fund a Mile", href: "/fund-a-mile" }}
              />
            </div>
          ) : (
            <>
              {featured && (
                <div className={showFilters ? "mt-8" : undefined}>
                  <JournalCard entry={featured} featured />
                </div>
              )}

              {rest.length > 0 && (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((entry) => (
                    <JournalCard key={entry.id} entry={entry} />
                  ))}
                </div>
              )}
            </>
          )}

          <div className="mt-12 border-t border-ink/10 pt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
              Get New Campaign Updates
            </p>
            <EmailSignupForm />
          </div>
        </Container>
      </section>

      {recentDisciplineWorkouts.length > 0 && (
        <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Snapshot" title="Latest Training" />
            <p className="mt-2 max-w-2xl text-sm text-charcoal-light">
              The full training dashboard lives on{" "}
              <a href="/the-race" className="text-bronze hover:underline">
                The Race
              </a>
              .
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {recentDisciplineWorkouts.map(({ discipline, workout }) => (
                <div key={workout.id} className="rounded-sm border border-ink/10 bg-off-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
                    {discipline === "swim" && "Swim"}
                    {discipline === "bike" && "Bike"}
                    {discipline === "run" && "Run"}
                  </p>
                  <p className="mt-1 text-sm text-charcoal-light">{formatDateLong(workout.start)}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
