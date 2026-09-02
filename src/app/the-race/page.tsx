import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { RaceDashboard } from "@/components/campaign/race-dashboard";
import { RaceGoalPanel } from "@/components/campaign/race-goal-panel";
import { RaceBenchmarks } from "@/components/campaign/race-benchmarks";
import { RaceLogistics } from "@/components/campaign/race-logistics";
import { TrainingTimeline } from "@/components/campaign/training-timeline";
import { CampaignPhaseBanner } from "@/components/campaign/campaign-phase-banner";
import { BikeBuildTeaser } from "@/components/journal/bike-build/bike-build-teaser";
import { getBikeBuildTeaser } from "@/lib/content/building-the-bike";
import { getJournalEntries } from "@/lib/data/journal";
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
  title: "IRONMAN 70.3 Chattanooga Training",
  description:
    "Training toward IRONMAN 70.3 Chattanooga on May 16, 2027 — a 1.2-mile swim, 56-mile bike, and 13.1-mile run as the physical anchor of the Tri For The 22 veteran fundraiser.",
  canonical: `${CAMPAIGN_URL}/the-race`,
});

export default async function RacePage() {
  const entries = await getJournalEntries();
  // "Next three verified milestones" — the 3 most recent published
  // milestone entries (getJournalEntries() already sorts newest-first), not
  // fabricated upcoming goals.
  const milestoneEntries = entries
    .filter((e) => e.primary_category === "Milestones")
    .slice(0, 3);
  const phase = getCampaignPhase();
  const showRaceDayLive = phase !== "active" && isRaceDayModeEnabled();

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
          src="/campaign-logo-white.png"
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
            <SectionHeading eyebrow="The Goal" title="Podium, M35–39" />
            <p className="mt-2 max-w-2xl text-sm text-charcoal-light">
              Not just a finish — a placement goal, backed by what recent-year age-group podium finishers at this
              race have actually run.
            </p>
            <div className="mt-6">
              <RaceGoalPanel />
            </div>
          </div>

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

          <div className="mt-16">
            <SectionHeading eyebrow="Race Day" title="Course & Cutoffs" />
            <p className="mt-2 max-w-2xl text-sm text-charcoal-light">
              What race day actually looks like — course details, cutoff times, and the weekend schedule.
            </p>
            <div className="mt-6">
              <RaceLogistics />
            </div>
          </div>

          <div className="mt-16">
            <SectionHeading eyebrow="Training Arc" title="Base to Race" />
            <div className="mt-6">
              <TrainingTimeline currentIndex={getCurrentTrainingPhaseIndex()} />
            </div>
          </div>

          <div className="mt-16">
            <SectionHeading eyebrow="On the Bike" title="Building the Bike" />
            <p className="mt-2 max-w-2xl text-sm text-charcoal-light">
              Cycling is the newest discipline here, and it started without a bike at all. The full story of
              getting one — and getting it race-ready — lives in its own ongoing series on Follow My Progress.
            </p>
            <div className="mt-6">
              <BikeBuildTeaser teaser={getBikeBuildTeaser()} className="max-w-2xl" />
            </div>
          </div>

          <div className="mt-16">
            <SectionHeading eyebrow="Live" title="Follow the Training" />
            <p className="mt-2 max-w-2xl text-sm text-charcoal-light">
              Recovery, sleep, strain, and recent swim, bike, and run sessions are tracked in one place.
            </p>
            <div className="mt-6">
              <a
                href="/journal"
                className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
              >
                Follow My Progress &rarr;
              </a>
            </div>
          </div>

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
            : { label: "Follow My Progress", href: "/journal" },
        ]}
      />
    </>
  );
}
