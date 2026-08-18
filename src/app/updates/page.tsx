import type { Metadata } from "next";
import { getPosts } from "@/lib/data/posts";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { UpdateCard } from "@/components/updates/update-card";

export const metadata: Metadata = {
  title: "Updates",
  description: "Training, fundraising, and race prep updates from the 70 for 70 campaign.",
  alternates: { canonical: "/updates" },
};

export default async function UpdatesPage() {
  const posts = await getPosts();

  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Follow Along"
            title="Training &amp; Campaign Updates"
            description="Training progress, fundraising milestones, and race prep — as it happens."
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          {posts.length === 0 ? (
            <p className="text-sm text-charcoal-light">No updates published yet.</p>
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
