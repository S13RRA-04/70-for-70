import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { RevealGrid, RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { ResourceCard } from "@/components/resources/resource-card";
import { ResourceFeedbackForm } from "@/components/resources/resource-support-forms";
import { US_STATES_GRID, type USStateGridEntry } from "@/lib/content/us-states";
import { getResourcesForState, slugifyResourceName, NEED_CATEGORIES, type Resource } from "@/lib/content/resources";
import { getResources } from "@/lib/data/resources";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { formatDateLong } from "@/lib/utils";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

function getStateBySlug(slug: string) {
  return US_STATES_GRID.find((s) => s.code.toLowerCase() === slug.toLowerCase());
}

/**
 * One dynamic segment serves two very different pages — a state directory
 * view and a single resource's detail page — because Next can't have both
 * /resources/[state] and /resources/[slug] as siblings (two different
 * dynamic param names at the same path position is a build error). State
 * codes (2 letters) and resource slugs (derived from full names) don't
 * collide in practice, so the lookup below just tries state first.
 */
export async function generateStaticParams() {
  const resources = await getResources();
  return [
    ...US_STATES_GRID.map((s) => ({ slug: s.code.toLowerCase() })),
    ...resources.map((r) => ({ slug: slugifyResourceName(r.name) })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const state = getStateBySlug(slug);
  if (state) {
    return pageMetadata({
      title: `Resources in ${state.name}`,
      description: `Veteran and first responder resources local to ${state.name}, plus nationwide programs available to every state, curated by ${SITE_NAME}.`,
      canonical: `${SITE_URL}/resources/${slug}`,
    });
  }

  const resources = await getResources();
  const resource = resources.find((r) => slugifyResourceName(r.name) === slug);
  if (!resource) return {};

  return pageMetadata({
    title: resource.name,
    description: resource.description,
    canonical: `${SITE_URL}/resources/${slug}`,
  });
}

export default async function ResourcesSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const state = getStateBySlug(slug);
  if (state) return <StateResourcesView state={state} />;

  const resources = await getResources();
  const resource = resources.find((r) => slugifyResourceName(r.name) === slug);
  if (!resource) notFound();

  return <ResourceDetailView resource={resource} resources={resources} slug={slug} />;
}

function StateResourcesView({ state }: { state: USStateGridEntry }) {
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
            className="mt-6 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
          >
            Search &amp; Filter All Resources &rarr;
          </Link>
        </Container>
      </section>

      {local.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Local" title={`${state.name}-Specific Resources`} />
            <RevealGrid>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {local.map((resource) => (
                  <ResourceCard key={resource.name} resource={resource} />
                ))}
              </div>
            </RevealGrid>
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
          <RevealGrid>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {nationwide.map((resource) => (
                <ResourceCard key={resource.name} resource={resource} />
              ))}
            </div>
          </RevealGrid>
        </Container>
      </section>

      <CTASection
        eyebrow="Know a Good One?"
        title={`Submit a ${state.name} Resource`}
        description="If you know a program, grant, or community local to this state that belongs here, send it our way — every submission is reviewed before it's added. The directory is focused on nonprofit, government, and official veteran/first-responder programs, not commercial services or individually licensed professionals."
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

/** A compact fact row — omitted entirely when the value is undefined, never rendered as "Unknown"/"N/A". */
function Fact({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-light/70">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{value}</dd>
    </div>
  );
}

function yesNo(value: boolean | undefined): string | undefined {
  return value === undefined ? undefined : value ? "Yes" : "No";
}

/** Ranks other resources by how many need categories they share with this one — the closest thing to "similar" without a real recommendation model. Ties broken alphabetically for a stable order. */
function findSimilarResources(resource: Resource, resources: Resource[], limit = 4): Resource[] {
  return resources
    .filter((r) => r.name !== resource.name)
    .map((r) => ({ r, shared: r.needCategoryIds.filter((id) => resource.needCategoryIds.includes(id)).length }))
    .filter((entry) => entry.shared > 0)
    .sort((a, b) => b.shared - a.shared || a.r.name.localeCompare(b.r.name))
    .slice(0, limit)
    .map((entry) => entry.r);
}

function ResourceDetailView({
  resource,
  resources,
  slug,
}: {
  resource: Resource;
  resources: Resource[];
  slug: string;
}) {
  const canonicalUrl = `${SITE_URL}/resources/${slug}`;
  const categoryLabels = resource.needCategoryIds
    .map((id) => NEED_CATEGORIES.find((c) => c.id === id)?.label)
    .filter((label): label is string => Boolean(label));
  const similar = findSimilarResources(resource, resources);

  const breadcrumbJsonLdData = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Resources", url: `${SITE_URL}/resources` },
    { name: resource.name, url: canonicalUrl },
  ]);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: resource.name,
    description: resource.description,
    url: resource.url,
    areaServed: resource.geographicScope,
    ...(categoryLabels.length > 0 && { serviceType: categoryLabels.join(", ") }),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(breadcrumbJsonLdData)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(serviceJsonLd)} />

      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            <Link href="/resources" className="hover:text-ink hover:underline">
              Resources
            </Link>
            {categoryLabels[0] && ` / ${categoryLabels[0]}`}
          </p>

          <h1 className="mt-3 text-balance font-display text-3xl font-bold uppercase tracking-tight text-ink sm:text-4xl">
            {resource.name}
          </h1>

          {resource.verificationStatus && (
            <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-olive/30 bg-olive/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-olive">
              <ShieldCheck size={13} aria-hidden />
              {resource.verificationStatus.replaceAll("-", " ")}
            </p>
          )}

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-charcoal-light">{resource.description}</p>

          {resource.audienceTags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {resource.audienceTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-ink/15 bg-off-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-charcoal-light"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-event="resource_outbound_click"
              className="inline-flex items-center gap-1.5 rounded-sm bg-ink px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-ink/90"
            >
              Visit Official Website
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <RevealOnScroll>
            <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <Fact label="Cost" value={resource.cost} />
              <Fact label="Coverage" value={resource.geographicScope + (resource.state ? ` (${resource.state})` : "")} />
              <Fact label="Eligibility" value={resource.eligibility} />
              <Fact label="Availability" value={resource.availability} />
              <Fact label="Virtual Access" value={yesNo(resource.virtualAvailable)} />
              <Fact label="In-Person Access" value={yesNo(resource.inPersonAvailable)} />
              <Fact label="Self-Referral" value={yesNo(resource.selfReferral)} />
              <Fact label="Referral Required" value={yesNo(resource.referralRequired)} />
              <Fact label="Application Required" value={yesNo(resource.applicationRequired)} />
              <Fact label="Documentation Required" value={yesNo(resource.documentationRequired)} />
              <Fact label="Employer Involvement Required" value={yesNo(resource.employerInvolvementRequired)} />
              <Fact label="Anonymous Initial Contact" value={yesNo(resource.anonymousInitialContact)} />
              <Fact label="Insurance Required" value={yesNo(resource.insuranceRequired)} />
              <Fact label="Organization Type" value={resource.organizationType} />
              <Fact label="Last Verified" value={resource.verifiedDate ? formatDateLong(resource.verifiedDate) : undefined} />
            </dl>

            {(resource.whyIncluded || resource.faithAffiliationSource || resource.confidentialityPolicyUrl) && (
              <div className="mt-8 border-t border-ink/10 pt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">Source &amp; Notes</p>
                {resource.whyIncluded && <p className="mt-2 text-sm leading-relaxed text-charcoal-light">{resource.whyIncluded}</p>}
                {resource.faithAffiliationSource && (
                  <p className="mt-2 text-sm">
                    <a href={resource.faithAffiliationSource} target="_blank" rel="noopener noreferrer" className="font-semibold text-bronze hover:text-bronze-dark">
                      Faith-affiliation source &rarr;
                    </a>
                  </p>
                )}
                {resource.confidentialityPolicyUrl && (
                  <p className="mt-2 text-sm">
                    <a href={resource.confidentialityPolicyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-bronze hover:text-bronze-dark">
                      Confidentiality policy &rarr;
                    </a>
                  </p>
                )}
                {resource.verificationStatus && (
                  <p className="mt-2 text-xs text-charcoal-light">
                    <Link href="/standards" className="font-semibold text-bronze hover:text-bronze-dark">
                      How resources are reviewed &rarr;
                    </Link>
                  </p>
                )}
              </div>
            )}
          </RevealOnScroll>
        </Container>
      </section>

      {similar.length > 0 && (
        <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Keep Looking" title="Similar Resources" />
            <RevealGrid>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {similar.map((r) => (
                  <ResourceCard key={r.name} resource={r} />
                ))}
              </div>
            </RevealGrid>
          </Container>
        </section>
      )}

      <section className="border-t border-ink/10 py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading
            eyebrow="Help Us Improve"
            title="Report an Issue or Share Feedback"
            description="Tell us whether this listing was useful or whether you connected. Individual responses are never displayed publicly."
          />
          <div className="mt-8">
            <ResourceFeedbackForm defaultResourceName={resource.name} />
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Still Looking?"
        title="Search the Full Directory"
        buttons={[{ label: "Browse All Resources", href: "/resources" }]}
      />
    </article>
  );
}
