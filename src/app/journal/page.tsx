import { getJournalEntries, getJournalEntriesByCategory } from "@/lib/data/journal";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { JournalCard } from "@/components/journal/journal-card";
import { JournalFilterRow } from "@/components/journal/journal-filter-row";
import { BikeBuildIndexCard } from "@/components/journal/bike-build/bike-build-index-card";
import { GearJourneyIndexCard } from "@/components/journal/gear-journey/gear-journey-index-card";
import { TrainingSnapshot } from "@/components/training/training-snapshot";
import { StravaSnapshot } from "@/components/training/strava-snapshot";
import { TrainingObjectivesChecklist } from "@/components/training/training-objectives-checklist";
import { CampaignPhaseBanner } from "@/components/campaign/campaign-phase-banner";
import { EmptyState } from "@/components/shared/empty-state";
import { EmailSignupForm } from "@/components/forms/email-signup-form";
import { getBikeBuildLastUpdated } from "@/lib/content/building-the-bike";
import { getGearJourneyLastUpdated } from "@/lib/content/gear-journey";
import { getTrainingSnapshot } from "@/lib/whoop/client";
import { getStravaTrainingSnapshot } from "@/lib/strava/client";
import { getRecentDisciplineWorkouts, getTrainingStats } from "@/lib/training-stats";
import { getTrainingObjectives } from "@/lib/data/training-objectives";
import { formatDateLong } from "@/lib/utils";
import { getCampaignPhase } from "@/lib/campaign-phase";
import { CAMPAIGN_URL, DONATE_LINK, STRAVA_PROFILE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import type { JournalPrimaryCategory } from "@/types/database";

/** Filtering only earns its keep once there's enough volume to actually sort through — see AGENTS.md's Journal spec. */
const MIN_ENTRIES_FOR_FILTERS = 6;

export const metadata = pageMetadata({
  title: "Follow My Progress",
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

  const [allEntries, trainingSnapshot, stravaSnapshot, trainingStats, trainingObjectives] = await Promise.all([
    getJournalEntries(),
    getTrainingSnapshot(),
    getStravaTrainingSnapshot(),
    getTrainingStats(),
    getTrainingObjectives(),
  ]);
  const recentDisciplineWorkouts = trainingSnapshot ? getRecentDisciplineWorkouts(trainingSnapshot.recentWorkouts) : [];

  const hasTrainingVolume =
    trainingStats.swimSessions !== null ||
    trainingStats.bikeMiles !== null ||
    trainingStats.runMiles !== null ||
    trainingStats.totalHours !== null ||
    trainingStats.weeksCompleted !== null ||
    trainingStats.weeksRemaining !== null;

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
  const phase = getCampaignPhase();

  return (
    <>
      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          eyebrow="Road to Chattanooga"
          title="Follow My Progress"
          description="Training, setbacks, milestones, partners, fundraising, and everything along the road to 70.3."
        />
      </CampaignPageHero>

      <section className="border-b border-ink/10 py-10">
        <Container className="space-y-4">
          <CampaignPhaseBanner phase={phase} />
          <BikeBuildIndexCard lastUpdated={getBikeBuildLastUpdated()} />
          <GearJourneyIndexCard lastUpdated={getGearJourneyLastUpdated()} />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          {showFilters && <JournalFilterRow categories={categoriesWithEntries} />}

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

      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Live" title="Latest Training" />
          <div className="mt-6">
            <TrainingSnapshot snapshot={trainingSnapshot} />
          </div>

          <div className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionHeading eyebrow="Live" title="Strava" />
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
              <StravaSnapshot snapshot={stravaSnapshot} />
            </div>
          </div>

          {recentDisciplineWorkouts.length > 0 && (
            <div className="mt-10">
              <SectionHeading eyebrow="By Discipline" title="Recent Swim, Bike &amp; Run" />
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {recentDisciplineWorkouts.map(({ discipline, workout }) => (
                  <div key={workout.id} className="rounded-sm border border-ink/10 bg-off-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
                      {discipline === "swim" && "Swim"}
                      {discipline === "bike" && "Bike"}
                      {discipline === "run" && "Run"}
                    </p>
                    <p className="mt-1 text-sm text-charcoal-light">{formatDateLong(workout.start)}</p>
                    {workout.strain !== null && (
                      <p className="mt-1 text-sm font-medium text-ink">Strain {workout.strain.toFixed(1)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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
            <div className="mt-6">
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
    </>
  );
}
