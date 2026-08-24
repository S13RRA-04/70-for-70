import { getJournalEntries, getJournalEntriesByCategory } from "@/lib/data/journal";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { JournalCard } from "@/components/journal/journal-card";
import { JournalFilterRow } from "@/components/journal/journal-filter-row";
import { EmptyState } from "@/components/shared/empty-state";
import { EmailSignupForm } from "@/components/forms/email-signup-form";
import { TrainingSnapshot } from "@/components/training/training-snapshot";
import { TrainingObjectivesChecklist } from "@/components/training/training-objectives-checklist";
import { getTrainingSnapshot } from "@/lib/whoop/client";
import { getTrainingObjectives } from "@/lib/data/training-objectives";
import { CAMPAIGN_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import type { JournalPrimaryCategory } from "@/types/database";

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

  const [allEntries, trainingSnapshot, trainingObjectives] = await Promise.all([
    getJournalEntries(),
    getTrainingSnapshot(),
    getTrainingObjectives(),
  ]);

  const entries =
    activeCategory === "All" ? allEntries : await getJournalEntriesByCategory(activeCategory);

  const featured = activeCategory === "All" ? (entries.find((e) => e.featured) ?? entries[0] ?? null) : null;
  const rest = featured ? entries.filter((e) => e.id !== featured.id) : entries;

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

      {trainingSnapshot && (
        <section className="border-b border-ink/10 py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Live" title="Latest Training" />
            <div className="mt-6">
              <TrainingSnapshot snapshot={trainingSnapshot} />
            </div>
          </Container>
        </section>
      )}

      {trainingObjectives.length > 0 && (
        <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="The Road to Chattanooga" title="Training Objectives" />
            <div className="mt-6">
              <TrainingObjectivesChecklist objectives={trainingObjectives} />
            </div>
          </Container>
        </section>
      )}

      <section className="py-16 sm:py-20">
        <Container>
          <JournalFilterRow />

          {entries.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title="Journal entries are on the way."
                description="Entries will start appearing here as training and fundraising milestones happen."
                cta={{ label: "Fund a Mile", href: "/fund-a-mile" }}
              />
            </div>
          ) : (
            <>
              {featured && (
                <div className="mt-8">
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
    </>
  );
}
