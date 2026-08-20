import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { RaceDashboard } from "@/components/campaign/race-dashboard";
import { getTrainingStats } from "@/lib/training-stats";
import { getPosts } from "@/lib/data/posts";
import { formatDateLong } from "@/lib/utils";
import { CAMPAIGN_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "The Race",
  description: "A 70.3-mile triathlon: 1.2-mile swim, 56-mile bike, 13.1-mile run.",
  alternates: { canonical: `${CAMPAIGN_URL}/the-race` },
};

export default async function RacePage() {
  const [posts, trainingStats] = await Promise.all([getPosts(), getTrainingStats()]);
  const milestonePosts = posts.filter((p) => p.category === "Milestones");

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
          <RaceDashboard />

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
        title="Follow the Training"
        description="Race prep, training milestones, and fundraising updates are posted as the campaign progresses."
        buttons={[{ label: "View Updates", href: "/updates" }]}
      />
    </>
  );
}
