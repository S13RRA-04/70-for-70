import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { ResourceCard } from "@/components/resources/resource-card";
import { US_STATES_GRID } from "@/lib/content/us-states";
import { getResourcesForState } from "@/lib/content/resources";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

function getStateBySlug(slug: string) {
  return US_STATES_GRID.find((s) => s.code.toLowerCase() === slug.toLowerCase());
}

export function generateStaticParams() {
  return US_STATES_GRID.map((s) => ({ state: s.code.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) return {};

  return pageMetadata({
    title: `Resources in ${state.name}`,
    description: `Veteran and first responder resources local to ${state.name}, plus nationwide programs available to every state, curated by ${SITE_NAME}.`,
    canonical: `${SITE_URL}/resources/${slug}`,
  });
}

export default async function StateResourcesPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) notFound();

  const { local, nationwide } = getResourcesForState(state.name);

  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Resources by State"
            title={`Resources in ${state.name}`}
            description={
              local.length > 0
                ? `${local.length} resource${local.length === 1 ? "" : "s"} local to ${state.name}, plus every nationwide program available here too.`
                : `No region-specific pass has been done for ${state.name} yet — every nationwide program below is still available to you.`
            }
          />
          <Link
            href={`/resources?state=${encodeURIComponent(state.name)}`}
            className="mt-6 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
          >
            Search &amp; Filter All Resources &rarr;
          </Link>
        </Container>
      </section>

      {local.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Local" title={`${state.name}-Specific Resources`} />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {local.map((resource) => (
                <ResourceCard key={resource.name} resource={resource} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className={`py-16 sm:py-20 ${local.length > 0 ? "border-t border-ink/10 bg-sand-light" : ""}`}>
        <Container>
          <SectionHeading
            eyebrow="Nationwide"
            title="Available in Every State"
            description={`These programs aren't specific to ${state.name}, but every one of them is open to residents here.`}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nationwide.map((resource) => (
              <ResourceCard key={resource.name} resource={resource} />
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Know a Good One?"
        title={`Submit a ${state.name} Resource`}
        description="If you know a program, grant, or community local to this state that belongs here, send it our way — every submission is reviewed before it's added."
        buttons={
          CONTACT_EMAIL
            ? [
                {
                  label: "Submit a Resource",
                  href: `mailto:${CONTACT_EMAIL}?subject=Resource%20Submission%20-%20${encodeURIComponent(state.name)}`,
                },
              ]
            : [{ label: "Contact Us", href: "/contact" }]
        }
      />
    </>
  );
}
