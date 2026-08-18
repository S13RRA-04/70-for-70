import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Countdown } from "@/components/shared/countdown";
import { CTASection } from "@/components/shared/cta-section";
import { TrainingSnapshot } from "@/components/training/training-snapshot";
import { EmptyState } from "@/components/shared/empty-state";
import { getTrainingSnapshot } from "@/lib/whoop/client";
import { RACE_INFO, RACE_LEGS, RACE_TOTAL_DISTANCE } from "@/lib/constants";

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
  const trainingSnapshot = await getTrainingSnapshot();

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
                <EmptyState
                  title="Milestones are on the way."
                  description="Key training milestones — first open-water swim, century ride, half-marathon time trial — will be logged here as they happen."
                  cta={{ label: "View Updates", href: "/updates" }}
                />
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
