import type { Metadata } from "next";
import { getPosts } from "@/lib/data/posts";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { UpdateCard } from "@/components/updates/update-card";
import { EmptyState } from "@/components/shared/empty-state";
import { TrainingSnapshot } from "@/components/training/training-snapshot";
import { getTrainingSnapshot } from "@/lib/whoop/client";
import { CAMPAIGN_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Updates",
  description: "Training, fundraising, and race prep updates from the Tri For The 22 campaign.",
  alternates: { canonical: `${CAMPAIGN_URL}/updates` },
};

export default async function UpdatesPage() {
  const [posts, trainingSnapshot] = await Promise.all([getPosts(), getTrainingSnapshot()]);

  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Follow Along"
            title="Training &amp; Campaign Updates"
            description="Training progress, fundraising milestones, and race prep — as it happens."
          />
        </Container>
      </section>

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

      <section className="py-16 sm:py-20">
        <Container>
          {posts.length === 0 ? (
            <EmptyState
              title="Training updates are on the way."
              description="Posts will start appearing here as training and fundraising milestones happen."
              cta={{ label: "Fund a Mile", href: "/fund-a-mile" }}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <UpdateCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
