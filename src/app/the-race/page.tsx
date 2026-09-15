import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { StravaFollowBadge } from "@/components/shared/strava-follow-badge";
import { RaceHero } from "@/components/campaign/race-hero";
import { DistanceStrip } from "@/components/campaign/distance-strip";
import { PerformanceProgression } from "@/components/campaign/performance-progression";
import { RaceGoalPanel } from "@/components/campaign/race-goal-panel";
import { RaceBenchmarks } from "@/components/campaign/race-benchmarks";
import { RaceLogistics } from "@/components/campaign/race-logistics";
import { ChattanoogaBikeBuild } from "@/components/campaign/chattanooga-bike-build";
import { TrainingTimeline } from "@/components/campaign/training-timeline";
import { CampaignPhaseBanner } from "@/components/campaign/campaign-phase-banner";
import { MissionFinale } from "@/components/campaign/mission-finale";
import { BikeBuildTeaser } from "@/components/journal/bike-build/bike-build-teaser";
import { TrainingSnapshot } from "@/components/training/training-snapshot";
import { PerformanceMetricsPanel } from "@/components/training/performance-metrics-panel";
import { TrainingObjectivesChecklist } from "@/components/training/training-objectives-checklist";
import { PerformanceTrendChart } from "@/components/training/performance-trend-chart";
import { getBikeBuildTeaser } from "@/lib/content/building-the-bike";
import { getJournalEntries } from "@/lib/data/journal";
import { getTrainingSnapshot } from "@/lib/whoop/client";
import { getTrainingObjectives } from "@/lib/data/training-objectives";
import { getLatestPerformanceSnapshot, getPerformanceMetricHistory } from "@/lib/data/performance-snapshots";
import { getCampaign } from "@/lib/data/campaign";
import { getTrainingStats } from "@/lib/training-stats";
import { formatDateLong } from "@/lib/utils";
import { getCampaignPhase, getCurrentTrainingPhaseIndex } from "@/lib/campaign-phase";
import { CAMPAIGN_URL, RACE_INFO } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { isRaceDayModeEnabled } from "@/lib/race-day-mode";

export const metadata = pageMetadata({
  title: "IRONMAN 70.3 Chattanooga Training",
  description:
    "Training toward IRONMAN 70.3 Chattanooga on May 16, 2027 — a 1.2-mile swim, 56-mile bike, and 13.1-mile run as the physical anchor of the Tri For The 22 veteran fundraiser.",
  canonical: `${CAMPAIGN_URL}/the-race`,
});

/** The 4 trend metrics shown in "The Work Is Working" — one representative benchmark per discipline, plus the supporting VO2 Max indicator. */
const TREND_METRICS = [
  { key: "swim_pace_fastest", label: "Swim — Fastest 100 yd Pace" },
  { key: "bike_ftp_watts", label: "Bike — FTP" },
  { key: "run_avg_pace", label: "Run — Average Pace" },
  { key: "vo2max", label: "VO2 Max" },
];

export default async function RacePage() {
  const [entries, trainingSnapshot, trainingObjectives, performanceSnapshot, trainingStats, campaign, trendHistories] =
    await Promise.all([
      getJournalEntries(),
      getTrainingSnapshot(),
      getTrainingObjectives(),
      getLatestPerformanceSnapshot(),
      getTrainingStats(),
      getCampaign(),
      Promise.all(TREND_METRICS.map((m) => getPerformanceMetricHistory(m.key))),
    ]);
  // "Next three verified milestones" — the 3 most recent published
  // milestone entries (getJournalEntries() already sorts newest-first), not
  // fabricated upcoming goals.
  const milestoneEntries = entries
    .filter((e) => e.primary_category === "Milestones")
    .slice(0, 3);
  const phase = getCampaignPhase();
  const showRaceDayLive = phase !== "active" && isRaceDayModeEnabled();

  const hasTrainingVolume =
    trainingStats.swimSessions !== null ||
    trainingStats.bikeMiles !== null ||
    trainingStats.runMiles !== null ||
    trainingStats.totalHours !== null ||
    trainingStats.weeksCompleted !== null ||
    trainingStats.weeksRemaining !== null;

  const raceDateLabel = RACE_INFO.raceDate
    ? new Date(RACE_INFO.raceDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
    : null;

  return (
    <>
      {/* STORY — cinematic hero, event identity */}
      <RaceHero />

      {/* DATA — at-a-glance race shape */}
      <DistanceStrip />

      <section className="py-16 sm:py-20">
        <Container>
          <CampaignPhaseBanner phase={phase} />

          {/* STORY — the competitive stakes */}
          <div className="mt-8">
            <SectionHeading eyebrow="The Goal" title="Podium, M35–39" />
            <p className="mt-2 max-w-2xl text-sm text-charcoal-light">
              Not just a finish — a placement goal, backed by what recent-year age-group podium finishers at this
              race have actually run.
            </p>
            <div className="mt-6">
              <PerformanceProgression />
            </div>
            <div className="mt-6">
              <RaceGoalPanel />
            </div>
          </div>

          {/* VISUAL — the course */}
          <div className="mt-16">
            <SectionHeading eyebrow="Race Day" title="The Course" />
            <p className="mt-2 max-w-2xl text-sm text-charcoal-light">
              What race day actually looks like — course details, cutoff times, and the weekend schedule.
            </p>
            <div className="mt-6">
              <RaceLogistics />
            </div>
          </div>

          {/* DATA (collapsible) — historical competition context */}
          <div className="mt-16">
            <SectionHeading eyebrow="The Competition" title="Times to Beat" />
            <p className="mt-2 max-w-2xl text-sm text-charcoal-light">
              M35–39 age-group results at IRONMAN 70.3 Chattanooga, 2022–2026 — the real numbers behind the goal
              above.
            </p>
            <div className="mt-6">
              <RaceBenchmarks />
            </div>
          </div>

          {/* PROGRESS + PHOTO — the current training story */}
          <div className="mt-16">
            <SectionHeading eyebrow="Chattanooga Bike Build" title="The Road to 56" />
            <p className="mt-2 max-w-2xl text-sm text-charcoal-light">
              The Chattanooga bike leg isn&apos;t simply a 56-mile endurance ride. The course includes roughly
              2,218 feet of elevation gain, with repeated rollers through much of the middle of the course. The
              objective in training is therefore not simply to increase average speed. It is to increase speed,
              climbing durability, and distance while keeping the physiological cost controlled enough to run a
              half marathon afterward.
            </p>
            <div className="mt-6">
              <ChattanoogaBikeBuild />
            </div>
          </div>

          {/* VISUAL — trend charts */}
          <div className="mt-16">
            <SectionHeading eyebrow="The Work Is Working" title="Performance Trends" />
            <p className="mt-2 max-w-2xl text-sm text-charcoal-light">
              Real recorded benchmarks over time — not a full TrainingPeaks dashboard, just enough to show the
              direction things are moving.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TREND_METRICS.map((m, i) => (
                <PerformanceTrendChart key={m.key} label={m.label} rows={trendHistories[i]} />
              ))}
            </div>
          </div>

          {/* PROGRESS — benchmark dashboard */}
          <div className="mt-16">
            <SectionHeading eyebrow="Milestones" title="Benchmarks" />
            <p className="mt-2 max-w-2xl text-sm text-charcoal-light">
              Milestones specific to this campaign&apos;s build toward 70.3 — not a record of lifetime athletic
              accomplishments. Nothing here is marked complete until it&apos;s actually done.
            </p>

            <div className="mt-8">
              <PerformanceMetricsPanel recordedOn={performanceSnapshot.recordedOn} rows={performanceSnapshot.rows} />
            </div>

            <div className="mt-10">
              <TrainingObjectivesChecklist objectives={trainingObjectives} />
            </div>
          </div>

          {/* DATA — compact live training status */}
          <div className="mt-16">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionHeading eyebrow="Recovery" title="Today's Training Status" />
              <StravaFollowBadge />
            </div>
            <div className="mt-6">
              <TrainingSnapshot snapshot={trainingSnapshot} compact />
            </div>
          </div>

          {/* PROGRESS — training arc */}
          <div className="mt-16">
            <SectionHeading eyebrow="Training Arc" title="Base to Race" />
            <div className="mt-6">
              <TrainingTimeline currentIndex={getCurrentTrainingPhaseIndex()} raceDateLabel={raceDateLabel} />
            </div>
          </div>

          <div className="mt-16">
            <SectionHeading eyebrow="On the Bike" title="Building the Bike" />
            <p className="mt-2 max-w-2xl text-sm text-charcoal-light">
              Cycling is the newest discipline here, and it started without a bike at all. The full story of
              getting one — and getting it race-ready — lives in its own ongoing series in the Journal.
            </p>
            <p className="mt-2 max-w-2xl text-sm text-charcoal-light">
              With outdoor riding now underway, the focus has shifted from simply building the race bike to
              building the engine required to ride Chattanooga&apos;s rolling 56-mile course and still have a
              half marathon left in the legs.
            </p>
            <div className="mt-6">
              <BikeBuildTeaser teaser={getBikeBuildTeaser()} className="max-w-2xl" />
            </div>
          </div>

          {hasTrainingVolume && (
            <div className="mt-16">
              <SectionHeading eyebrow="Behind the Race" title="Road to 70.3" />
              <div className="mt-6">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {trainingStats.swimSessions !== null && (
                    <div className="rounded-sm border border-ink/10 bg-off-white p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-ink">{trainingStats.swimSessions}</p>
                      <p className="text-xs text-charcoal-light">Swim Sessions</p>
                    </div>
                  )}
                  {trainingStats.bikeMiles !== null && (
                    <div className="rounded-sm border border-ink/10 bg-off-white p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-ink">{trainingStats.bikeMiles}</p>
                      <p className="text-xs text-charcoal-light">Miles Ridden</p>
                    </div>
                  )}
                  {trainingStats.runMiles !== null && (
                    <div className="rounded-sm border border-ink/10 bg-off-white p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-ink">{trainingStats.runMiles}</p>
                      <p className="text-xs text-charcoal-light">Miles Run</p>
                    </div>
                  )}
                  {trainingStats.totalHours !== null && (
                    <div className="rounded-sm border border-ink/10 bg-off-white p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-ink">{trainingStats.totalHours}</p>
                      <p className="text-xs text-charcoal-light">Total Training Hours</p>
                    </div>
                  )}
                  {trainingStats.weeksCompleted !== null && (
                    <div className="rounded-sm border border-ink/10 bg-off-white p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-ink">{trainingStats.weeksCompleted}</p>
                      <p className="text-xs text-charcoal-light">Weeks Completed</p>
                    </div>
                  )}
                  {trainingStats.weeksRemaining !== null && (
                    <div className="rounded-sm border border-bronze/40 bg-bronze/10 p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-ink">{trainingStats.weeksRemaining}</p>
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
            : { label: "Read the Journal", href: "/journal" },
          { label: "Join the Triathlon Team", href: "/get-involved/triathlon-team", variant: "secondary" },
        ]}
      />

      {/* MISSION — the finale, deliberately last */}
      <MissionFinale totalRaised={campaign.amount_raised} goal={campaign.fundraising_goal} />
    </>
  );
}
