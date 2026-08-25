import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { RaceDashboard } from "@/components/campaign/race-dashboard";
import { TrainingTimeline } from "@/components/campaign/training-timeline";
import { CampaignPhaseBanner } from "@/components/campaign/campaign-phase-banner";
import { TrainingSnapshot } from "@/components/training/training-snapshot";
import { TrainingObjectivesChecklist } from "@/components/training/training-objectives-checklist";
import { getTrainingStats, getRecentDisciplineWorkouts } from "@/lib/training-stats";
import { getJournalEntries } from "@/lib/data/journal";
import { getTrainingObjectives } from "@/lib/data/training-objectives";
import { getTrainingSnapshot } from "@/lib/whoop/client";
import { formatDateLong } from "@/lib/utils";
import { getCampaignPhase } from "@/lib/campaign-phase";
import { CAMPAIGN_URL, RACE_INFO } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { isRaceDayModeEnabled } from "@/lib/race-day-mode";

function getCurrentTrainingPhaseIndex(): number | undefined {
  const { trainingStartDate, raceDate } = RACE_INFO;
  if (!trainingStartDate || !raceDate) return undefined;

  const start = new Date(trainingStartDate).getTime();
  const end = new Date(raceDate).getTime();
  const now = Date.now();
  if (now <= start) return 0;
  if (now >= end) return 4;

  const fraction = (now - start) / (end - start);
  return Math.min(4, Math.floor(fraction * 5));
}

export const metadata = pageMetadata({
  title: "The Race",
  description: "A 70.3-mile triathlon: 1.2-mile swim, 56-mile bike, 13.1-mile run.",
  canonical: `${CAMPAIGN_URL}/the-race`,
});

export default async function RacePage() {
  const [entries, trainingStats, trainingObjectives, trainingSnapshot] = await Promise.all([
    getJournalEntries(),
    getTrainingStats(),
    getTrainingObjectives(),
    getTrainingSnapshot(),
  ]);
  // "Next three verified milestones" — the 3 most recent published
  // milestone entries (getJournalEntries() already sorts newest-first), not
  // fabricated upcoming goals.
  const milestoneEntries = entries
    .filter((e) => e.primary_category === "Milestones")
    .slice(0, 3);
  const recentDisciplineWorkouts = trainingSnapshot ? getRecentDisciplineWorkouts(trainingSnapshot.recentWorkouts) : [];
  const phase = getCampaignPhase();
  const showRaceDayLive = phase !== "active" && isRaceDayModeEnabled();

  const hasTrainingVolume =
    trainingStats.swimSessions !== null ||
    trainingStats.bikeMiles !== null ||
    trainingStats.runMiles !== null ||
    trainingStats.totalHours !== null ||
    trainingStats.weeksCompleted !== null ||
    trainingStats.weeksRemaining !== null;

  return (
    <>
      <CampaignPageHero containerClassName="flex flex-col-reverse items-center gap-10 sm:flex-row sm:justify-between">
        <div className="flex-1">
          <SectionHeading
            as="h1"
            tone="dark"
            eyebrow="The Race"
            title="70.3-Mile Triathlon"
            description="A swim, bike, and run event completed as the physical anchor of the Tri For The 22 campaign. IRONMAN 70.3 Chattanooga — May 16, 2027, in Chattanooga, Tennessee."
          />
          {RACE_INFO.registrationUrl && (
            <a
              href={RACE_INFO.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 rounded-sm bg-bronze px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
            >
              Register for the Race
              <ExternalLink size={14} aria-hidden />
            </a>
          )}
        </div>
        <Image
          src="/campaign-logo.png"
          alt="Tri For The 22 campaign logo mark"
          width={160}
          height={160}
          className="w-32 shrink-0 sm:w-40"
          priority
        />
      </CampaignPageHero>

      <section className="py-16 sm:py-20">
        <Container>
          <CampaignPhaseBanner phase={phase} />
          <RaceDashboard />

          <div className="mt-16">
            <SectionHeading eyebrow="Training Arc" title="Base to Race" />
            <div className="mt-6">
              <TrainingTimeline currentIndex={getCurrentTrainingPhaseIndex()} />
            </div>
          </div>

          <div className="mt-16">
            <SectionHeading eyebrow="Live" title="Latest Training" />
            <div className="mt-6">
              <TrainingSnapshot snapshot={trainingSnapshot} />
            </div>
          </div>

          {recentDisciplineWorkouts.length > 0 && (
            <div className="mt-16">
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
            <SectionHeading eyebrow="The Road to Chattanooga" title="Training Objectives" />
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

          {milestoneEntries.length > 0 && (
            <div className="mt-16 max-w-xl rounded-sm border border-ink/10 bg-off-white p-8">
              <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
                Training Milestones
              </h2>
              <div className="mt-4">
                <ul className="space-y-3">
                  {milestoneEntries.map((entry) => (
                    <li key={entry.id} className="border-t border-ink/10 pt-3 first:border-0 first:pt-0">
                      <a
                        href={`/journal/${entry.slug}`}
                        className="text-sm font-medium text-ink hover:text-bronze"
                      >
                        {entry.title}
                      </a>
                      {entry.published_at && (
                        <p className="text-xs text-charcoal-light">
                          {formatDateLong(entry.published_at)}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-charcoal-light">{entry.summary}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Container>
      </section>

      <CTASection
        title={showRaceDayLive ? "Follow Race Day" : "Follow the Training"}
        description={
          showRaceDayLive
            ? "Live race-day status and fundraising progress, updated as the race happens."
            : "Race prep, training milestones, and fundraising updates are posted as the campaign progresses."
        }
        buttons={[
          showRaceDayLive
            ? { label: "Race Day Live", href: "/live" }
            : { label: "View the Journal", href: "/journal" },
        ]}
      />
    </>
  );
}
