import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Countdown } from "@/components/shared/countdown";
import { CTASection } from "@/components/shared/cta-section";
import { TrainingSnapshot } from "@/components/training/training-snapshot";
import { EmptyState } from "@/components/shared/empty-state";
import { getTrainingSnapshot } from "@/lib/whoop/client";
import { getPosts } from "@/lib/data/posts";
import { formatDateLong, weeksBetween } from "@/lib/utils";
import {
  RACE_INFO,
  RACE_LEGS,
  RACE_TOTAL_DISTANCE,
  TRAINING_VOLUME,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "The Race",
  description: "An IRONMAN 70.3-distance triathlon: 1.2-mile swim, 56-mile bike, 13.1-mile run.",
  alternates: { canonical: "/the-race" },
};

const LEGS = [
  { label: "Swim", distance: RACE_LEGS.swim, unit: "miles" },
  { label: "Bike", distance: RACE_LEGS.bike, unit: "miles" },
  { label: "Run", distance: RACE_LEGS.run, unit: "miles" },
];

export default async function RacePage() {
  const [trainingSnapshot, posts] = await Promise.all([getTrainingSnapshot(), getPosts()]);
  const milestonePosts = posts.filter((p) => p.category === "Milestones");

  const weeksCompleted =
    RACE_INFO.trainingStartDate && new Date(RACE_INFO.trainingStartDate) <= new Date()
      ? weeksBetween(RACE_INFO.trainingStartDate, new Date().toISOString())
      : null;
  const weeksRemaining =
    RACE_INFO.raceDate && new Date(RACE_INFO.raceDate) >= new Date()
      ? weeksBetween(new Date().toISOString(), RACE_INFO.raceDate)
      : null;
  const hasTrainingVolume =
    TRAINING_VOLUME.swimMiles !== null ||
    TRAINING_VOLUME.bikeMiles !== null ||
    TRAINING_VOLUME.runMiles !== null ||
    TRAINING_VOLUME.totalHours !== null ||
    weeksCompleted !== null ||
    weeksRemaining !== null;

  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="The Race"
            title="IRONMAN 70.3"
            description="A 70.3-mile triathlon — swim, bike, and run — completed as the physical anchor of the 70 for 70 campaign."
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-4">
            {LEGS.map((leg) => (
              <div key={leg.label} className="rounded-sm border border-ink/10 bg-off-white p-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                  {leg.label}
                </p>
                <p className="mt-2 font-display text-3xl font-semibold text-ink">
                  {leg.distance}
                </p>
                <p className="text-xs text-charcoal-light">{leg.unit}</p>
              </div>
            ))}
            <div className="rounded-sm border border-bronze/40 bg-bronze/10 p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-bronze">Total</p>
              <p className="mt-2 font-display text-3xl font-semibold text-ink">
                {RACE_TOTAL_DISTANCE}
              </p>
              <p className="text-xs text-bronze">miles</p>
            </div>
          </div>

          <div className="mt-16">
            <SectionHeading eyebrow="Live" title="Latest Training" />
            <div className="mt-6">
              <TrainingSnapshot snapshot={trainingSnapshot} />
            </div>
          </div>

          <div className="mt-16">
            <SectionHeading eyebrow="Behind the Race" title="The Work" />
            <div className="mt-6">
              {hasTrainingVolume ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {TRAINING_VOLUME.swimMiles !== null && (
                    <div className="rounded-sm border border-ink/10 bg-off-white p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-ink">
                        {TRAINING_VOLUME.swimMiles}
                      </p>
                      <p className="text-xs text-charcoal-light">Swim Miles</p>
                    </div>
                  )}
                  {TRAINING_VOLUME.bikeMiles !== null && (
                    <div className="rounded-sm border border-ink/10 bg-off-white p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-ink">
                        {TRAINING_VOLUME.bikeMiles}
                      </p>
                      <p className="text-xs text-charcoal-light">Bike Miles</p>
                    </div>
                  )}
                  {TRAINING_VOLUME.runMiles !== null && (
                    <div className="rounded-sm border border-ink/10 bg-off-white p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-ink">
                        {TRAINING_VOLUME.runMiles}
                      </p>
                      <p className="text-xs text-charcoal-light">Run Miles</p>
                    </div>
                  )}
                  {TRAINING_VOLUME.totalHours !== null && (
                    <div className="rounded-sm border border-ink/10 bg-off-white p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-ink">
                        {TRAINING_VOLUME.totalHours}
                      </p>
                      <p className="text-xs text-charcoal-light">Training Hours</p>
                    </div>
                  )}
                  {weeksCompleted !== null && (
                    <div className="rounded-sm border border-ink/10 bg-off-white p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-ink">
                        {weeksCompleted}
                      </p>
                      <p className="text-xs text-charcoal-light">Weeks Completed</p>
                    </div>
                  )}
                  {weeksRemaining !== null && (
                    <div className="rounded-sm border border-bronze/40 bg-bronze/10 p-4 text-center">
                      <p className="font-display text-2xl font-semibold text-ink">
                        {weeksRemaining}
                      </p>
                      <p className="text-xs text-bronze">Weeks Remaining</p>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState
                  title="Training volume will be tracked here."
                  description="Swim, bike, and run mileage, training hours, and the weeks-to-race countdown will appear here once training logging begins."
                />
              )}
            </div>
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            <div className="rounded-sm border border-ink/10 bg-off-white p-8">
              <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
                Race Day Countdown
              </h2>
              <div className="mt-5">
                <Countdown targetIso={RACE_INFO.raceDate} />
              </div>

              {(RACE_INFO.raceLocation || RACE_INFO.athleteGoalTime || RACE_INFO.courseInfoUrl) && (
                <dl className="mt-8 space-y-4 text-sm">
                  {RACE_INFO.raceLocation && (
                    <div className="flex justify-between gap-4 border-t border-ink/10 pt-4">
                      <dt className="font-medium text-charcoal-light">Race Location</dt>
                      <dd className="text-right text-ink">{RACE_INFO.raceLocation}</dd>
                    </div>
                  )}
                  {RACE_INFO.athleteGoalTime && (
                    <div className="flex justify-between gap-4 border-t border-ink/10 pt-4">
                      <dt className="font-medium text-charcoal-light">Athlete Goal Time</dt>
                      <dd className="text-right text-ink">{RACE_INFO.athleteGoalTime}</dd>
                    </div>
                  )}
                  {RACE_INFO.courseInfoUrl && (
                    <div className="flex justify-between gap-4 border-t border-ink/10 pt-4">
                      <dt className="font-medium text-charcoal-light">Course Information</dt>
                      <dd className="text-right text-ink">
                        <a href={RACE_INFO.courseInfoUrl} className="text-bronze hover:underline">
                          View course details
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              )}
            </div>

            <div className="rounded-sm border border-ink/10 bg-off-white p-8">
              <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
                Training Milestones
              </h2>
              <div className="mt-4">
                {milestonePosts.length > 0 ? (
                  <ul className="space-y-3">
                    {milestonePosts.map((post) => (
                      <li key={post.id} className="border-t border-ink/10 pt-3 first:border-0 first:pt-0">
                        <a
                          href={`/updates/${post.slug}`}
                          className="text-sm font-medium text-ink hover:text-bronze"
                        >
                          {post.title}
                        </a>
                        {post.published_at && (
                          <p className="text-xs text-charcoal-light">
                            {formatDateLong(post.published_at)}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-charcoal-light">{post.summary}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    title="Milestones are on the way."
                    description="Key training milestones — first open-water swim, century ride, half-marathon time trial — will be logged here as they happen."
                    cta={{ label: "View Updates", href: "/updates" }}
                  />
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <CTASection
        title="Follow the Training"
        description="Race prep, training milestones, and fundraising updates are posted as the campaign progresses."
        buttons={[{ label: "View Updates", href: "/updates" }]}
      />
    </>
  );
}
