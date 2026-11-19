import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { BackToResults } from "@/components/resources/back-to-results";
import { ResourceNavigator } from "@/components/resources/resource-navigator";
import { getPublishedDirectory } from "@/lib/data/resource-directory";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Help Me Figure It Out",
  description: "Answer a few private questions and get a short list of programs for veterans, first responders and their families.",
  canonical: "/resources/guide",
});

export default async function ResourceGuidePage() {
  const { resources } = await getPublishedDirectory();
  return (
    <>
      <PageHero
        pillar="connection"
        title="Help me figure it out"
        description="A few private, non-clinical questions. Your answers stay in this browser and are never submitted."
      />
      <section className="pb-16 pt-2">
        <Container className="flex flex-col gap-6">
          <BackToResults />
          <ResourceNavigator resources={resources} autoStart />
        </Container>
      </section>
    </>
  );
}
