import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { RaceDashboard } from "@/components/campaign/race-dashboard";
import { TrainingTimeline } from "@/components/campaign/training-timeline";
import { CampaignPhaseBanner } from "@/components/campaign/campaign-phase-banner";
import { MobileActionBar } from "@/components/shared/mobile-action-bar";
import { getTrainingStats } from "@/lib/training-stats";
import { getPosts } from "@/lib/data/posts";
import { formatDateLong } from "@/lib/utils";
import { getCampaignPhase } from "@/lib/campaign-phase";
import { CAMPAIGN_URL, DONATE_LINK, RACE_INFO } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

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
  const [posts, trainingStats] = await Promise.all([getPosts(), getTrainingStats()]);
  const milestonePosts = posts.filter((p) => p.category === "Milestones");
  const phase = getCampaignPhase();

  const hasTrainingVolume =
    trainingStats.swimSessions !== null ||
    trainingStats.bikeMiles !== null ||
    trainingStats.runMiles !== null ||
    trainingStats.totalHours !== null ||
    trainingStats.weeksCompleted !== null ||
    trainingStats.weeksRemaining !== null;

  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="flex flex-col-reverse items-center gap-10 sm:flex-row sm:justify-between">
          <SectionHeading
            as="h1"
            className="flex-1"
            eyebrow="The Race"
            title="70.3-Mile Triathlon"
            description="A swim, bike, and run event completed as the physical anchor of the Tri For The 22 campaign. Targeting IRONMAN 70.3 Chattanooga in May 2027 — exact race date to be confirmed."
          />
          <Image
            src="/campaign-logo.png"
            alt="Tri For The 22 campaign logo mark"
            width={160}
            height={160}
            className="w-32 shrink-0 sm:w-40"
            priority
          />
        </Container>
      </section>

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

          {milestonePosts.length > 0 && (
            <div className="mt-16 max-w-xl rounded-sm border border-ink/10 bg-off-white p-8">
              <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
                Training Milestones
              </h2>
              <div className="mt-4">
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
              </div>
            </div>
          )}
        </Container>
      </section>

      <CTASection
        title={phase === "active" ? "Follow the Training" : "Follow Race Day"}
        description={
          phase === "active"
            ? "Race prep, training milestones, and fundraising updates are posted as the campaign progresses."
            : "Live race-day status and fundraising progress, updated as the race happens."
        }
        buttons={[
          phase === "active"
            ? { label: "View Updates", href: "/updates" }
            : { label: "Race Day Live", href: "/live" },
        ]}
      />

      <div className="h-16 sm:hidden" aria-hidden="true" />
      <MobileActionBar
        secondary={{ label: "Fund a Mile", href: "/fund-a-mile" }}
        primary={{ label: DONATE_LINK.label, href: DONATE_LINK.href }}
      />
    </>
  );
}
