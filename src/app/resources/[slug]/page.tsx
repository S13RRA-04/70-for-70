import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { BackToResults } from "@/components/resources/back-to-results";
import { DirectoryCard } from "@/components/resources/directory-card";
import { ResourceFeedbackForm } from "@/components/resources/resource-support-forms";
import { US_STATES_GRID, type USStateGridEntry } from "@/lib/content/us-states";
import type { Resource } from "@/lib/content/resources";
import { getPublishedDirectory } from "@/lib/data/resource-directory";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { formatDateLong } from "@/lib/utils";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";
import { audienceText, NEED_BY_ID, type DirectoryResource } from "@/lib/resources/directory";

function getStateBySlug(slug: string) {
  return US_STATES_GRID.find((s) => s.code.toLowerCase() === slug.toLowerCase());
}

/**
 * One dynamic segment serves two pages — a state directory view and a
 * single resource's detail page — because Next can't have both
 * /resources/[state] and /resources/[slug] as siblings. State codes (2
 * letters) and resource slugs don't collide, so the lookup tries state first.
 * Only published listings resolve; anything else 404s.
 */
export async function generateStaticParams() {
  const { items } = await getPublishedDirectory();
  return [...US_STATES_GRID.map((s) => ({ slug: s.code.toLowerCase() })), ...items.map((item) => ({ slug: item.id }))];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const state = getStateBySlug(slug);
  if (state) {
    return pageMetadata({
      title: `Resources in ${state.name}`,
      description: `Veteran and first responder resources local to ${state.name}, plus nationwide programs available to every state, curated by ${SITE_NAME}.`,
      canonical: `${SITE_URL}/resources/${slug}`,
    });
  }

  const { items } = await getPublishedDirectory();
  const item = items.find((r) => r.id === slug);
  if (!item) return {};
  return pageMetadata({ title: item.name, description: item.summary, canonical: `${SITE_URL}/resources/${slug}` });
}

export default async function ResourcesSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const directory = await getPublishedDirectory();
  const state = getStateBySlug(slug);
  if (state) return <StateResourcesView state={state} items={directory.items} />;

  const index = directory.items.findIndex((r) => r.id === slug);
  if (index < 0) notFound();
  return <ResourceDetailView resource={directory.resources[index]} item={directory.items[index]} items={directory.items} />;
}

function StateResourcesView({ state, items }: { state: USStateGridEntry; items: DirectoryResource[] }) {
  const local = items.filter((item) => item.state === state.name);
  const nationwide = items.filter((item) => !item.state);

  return (
    <>
      <PageHero
        pillar="connection"
        eyebrow="Resources by state"
        title={`Resources in ${state.name}`}
        description={
          local.length > 0
            ? `${local.length} program${local.length === 1 ? "" : "s"} local to ${state.name}, plus every nationwide program available here too.`
            : `We haven't reviewed programs specific to ${state.name} yet. Every nationwide program below is still available to you.`
        }
      >
        <Link href={`/resources?state=${encodeURIComponent(state.name)}`} className="font-bold text-help underline underline-offset-2 hover:text-help-dark">
          Search &amp; filter these programs &rarr;
        </Link>
      </PageHero>

      {local.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Local" title={`${state.name} programs`} />
            <ul className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-4">
              {local.map((item) => <DirectoryCard key={item.id} resource={item} />)}
            </ul>
          </Container>
        </section>
      )}

      <section className={`py-16 sm:py-20 ${local.length > 0 ? "border-t border-line bg-white" : ""}`}>
        <Container>
          <SectionHeading
            eyebrow="Nationwide"
            title="Available in every state"
            description={`These programs aren't specific to ${state.name}, but every one of them is open to people here.`}
          />
          <ul className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-4">
            {nationwide.map((item) => <DirectoryCard key={item.id} resource={item} />)}
          </ul>
        </Container>
      </section>

      <CTASection
        eyebrow="Know a good one?"
        title={`Submit a ${state.name} resource`}
        description="Suggest a nonprofit, government or official veteran or first-responder program. Every submission is reviewed before it's added."
        buttons={
          CONTACT_EMAIL
            ? [{ label: "Submit a Resource", href: `mailto:${CONTACT_EMAIL}?subject=Resource%20Submission%20-%20${encodeURIComponent(state.name)}` }]
            : [{ label: "Contact Us", href: "/contact" }]
        }
      />
    </>
  );
}

/** Related: shares the primary need and at least one audience; nationwide and higher-ranked first. */
function relatedPrograms(item: DirectoryResource, items: DirectoryResource[], limit = 3): DirectoryResource[] {
  return items
    .filter((other) => other.id !== item.id && other.needs[0] === item.needs[0])
    .filter((other) => !item.audiences.length || other.audiences.some((a) => item.audiences.includes(a)))
    .filter((other) => !other.state || other.state === item.state)
    .slice(0, limit);
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Only facts the provider has published. Unknown (undefined) values are omitted, never rendered as "unknown". */
function accessNotes(resource: Resource): string[] {
  const notes: [boolean | undefined, string, string][] = [
    [resource.selfReferral, "You can reach out yourself — no referral needed.", "A referral is needed to start."],
    [resource.virtualAvailable, "Available online or by phone.", ""],
    [resource.inPersonAvailable, "Offers in-person support.", ""],
    [resource.anonymousInitialContact, "You can make first contact without giving your name.", ""],
    [resource.employerInvolvementRequired, "Your employer has to be involved.", "Your employer doesn't need to be involved."],
    [resource.insuranceRequired, "Insurance is required.", "No insurance required."],
    [resource.applicationRequired, "There's an application.", ""],
    [resource.documentationRequired, "You may need to show service or eligibility documents.", ""],
  ];
  return notes.flatMap(([value, yes, no]) => (value === true ? [yes] : value === false && no ? [no] : []));
}

function ResourceDetailView({ resource, item, items }: { resource: Resource; item: DirectoryResource; items: DirectoryResource[] }) {
  const canonicalUrl = `${SITE_URL}/resources/${item.id}`;
  const related = relatedPrograms(item, items);
  const needLabel = NEED_BY_ID[item.needs[0]].label;
  const notes = accessNotes(resource);
  const tel = resource.phone?.replace(/[^\d+]/g, "");
  const sms = resource.text?.replace(/[^\d+]/g, "");

  const steps: { title: string; body?: string }[] = [];
  if (resource.phone) steps.push({ title: `Call ${resource.phone}`, body: resource.hours });
  if (resource.text) steps.push({ title: `${steps.length ? "Or text" : "Text"} ${resource.text}`, body: steps.length ? "Good if talking out loud isn't possible right now." : resource.hours });
  steps.push({
    title: steps.length ? "Or start on their website" : resource.applicationRequired ? "Apply on their website" : "Start on their website",
    body: `Program details${resource.applicationRequired ? ", the application" : ""} and contact options are on ${hostname(resource.url)}.`,
  });

  const facts: [string, string | undefined][] = [
    ["Who it's for", audienceText(item.audiences) || resource.audienceTags.join(", ") || undefined],
    ["Eligibility", resource.eligibility],
    ["Cost", item.costLabel],
    ["Where", item.coverageLabel],
    ["Hours", resource.hours],
    ["Availability", resource.availability],
    ["Organization", item.orgType],
  ];

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Find Support", url: `${SITE_URL}/resources` },
    { name: resource.name, url: canonicalUrl },
  ]);
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: resource.name,
    description: resource.description,
    url: resource.url,
    areaServed: item.coverageLabel,
    serviceType: item.needs.map((id) => NEED_BY_ID[id].label).join(", "),
  };

  const btn = "inline-flex min-h-11 items-center justify-center rounded-[4px] border-[1.5px] px-[18px] text-sm font-bold";

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(breadcrumbs)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(serviceJsonLd)} />

      <Container className="flex flex-col gap-6 pb-14 pt-7">
        <BackToResults />

        <div className="flex flex-wrap items-start gap-8">
          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-impact">{needLabel}</span>
                {item.orgType && <span className="rounded-[3px] bg-[#eef0f4] px-2 py-0.5 text-xs font-semibold text-steel">{item.orgType}</span>}
              </div>
              <h1 className="font-display text-[clamp(36px,5vw,56px)] uppercase leading-[1.05] text-navy">{resource.name}</h1>
              <p className="max-w-[720px] text-lg">{resource.description}</p>
            </div>

            <section aria-labelledby="start-h" className="flex flex-col gap-4 rounded-lg border border-line bg-white p-6">
              <h2 id="start-h" className="font-display text-2xl uppercase text-navy">How to get started</h2>
              <ol className="flex flex-col gap-3.5">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex items-start gap-3.5">
                    <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy font-bold text-white">{i + 1}</span>
                    <div>
                      <strong className="block text-navy">{step.title}</strong>
                      {step.body && <span className="text-[15px]">{step.body}</span>}
                    </div>
                  </li>
                ))}
              </ol>
              <div className="flex flex-wrap gap-2.5">
                {tel && (
                  <a href={`tel:${tel}`} className={`${btn} ${resource.crisisResource ? "border-purpose bg-purpose" : "border-navy bg-navy"} text-white`}>
                    Call {resource.phone}
                  </a>
                )}
                {sms && <a href={`sms:${sms}`} className={`${btn} border-navy bg-white text-navy hover:bg-paper`}>Text {resource.text}</a>}
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics-event="resource_outbound_click"
                  aria-label={`Visit ${resource.name} website (opens in a new tab)`}
                  className={`${btn} ${tel ? "border-navy bg-white text-navy hover:bg-paper" : "border-navy bg-navy text-white hover:bg-navy-hover"}`}
                >
                  Visit site <span aria-hidden="true">&nbsp;↗</span>
                </a>
              </div>
            </section>

            {notes.length > 0 && (
              <section aria-labelledby="expect-h" className="flex flex-col gap-2.5">
                <h2 id="expect-h" className="font-display text-2xl uppercase text-navy">Good to know</h2>
                <ul className="flex max-w-[720px] list-disc flex-col gap-1 pl-5 text-base">
                  {notes.map((note) => <li key={note}>{note}</li>)}
                </ul>
              </section>
            )}
          </div>

          <aside aria-label="Program facts" className="flex flex-[1_1_300px] flex-col gap-4 md:max-w-[380px]">
            <div className="rounded-lg border border-line bg-white p-6">
              <dl className="flex flex-col gap-3.5 text-[15px]">
                {facts.map(([label, value]) =>
                  value ? (
                    <div key={label}>
                      <dt className="text-xs font-bold uppercase tracking-[0.1em] text-navy">{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ) : null,
                )}
              </dl>
            </div>
            <div className="flex flex-col gap-1 px-1 text-sm">
              <span>
                Reviewed by {SITE_NAME}
                {resource.verifiedDate && (
                  <>
                    {" "}on <time dateTime={resource.verifiedDate}>{formatDateLong(resource.verifiedDate.length === 10 ? `${resource.verifiedDate}T12:00:00Z` : resource.verifiedDate)}</time>
                  </>
                )}
                .{" "}
                <Link href="/standards" className="text-help underline underline-offset-2 hover:text-help-dark">How we review</Link>
              </span>
              <a href="#report" className="text-help underline underline-offset-2 hover:text-help-dark">Report outdated info</a>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-h" className="flex flex-col gap-3.5 pt-4">
            <h2 id="related-h" className="font-display text-2xl uppercase text-navy">Related programs</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-4">
              {related.map((other) => (
                <Link
                  key={other.id}
                  href={`/resources/${other.id}`}
                  className="flex flex-col gap-2 rounded-lg border border-line bg-white p-5 text-copy hover:border-navy"
                >
                  <strong className="text-[17px] text-navy">{other.name}</strong>
                  <span>{other.summary}</span>
                  <span className="text-[13px] text-muted">{[other.costLabel, other.coverageLabel].filter(Boolean).join(" · ")}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section id="report" aria-labelledby="report-h" className="mt-6 scroll-mt-24 rounded-xl border border-line bg-white p-6 sm:p-8">
          <h2 id="report-h" className="font-display text-2xl uppercase text-navy">Report outdated info or share feedback</h2>
          <p className="mt-2 max-w-2xl text-copy">Tell us if something here has changed, or whether this program was useful. Individual responses are never displayed publicly.</p>
          <div className="mt-6"><ResourceFeedbackForm defaultResourceName={resource.name} /></div>
        </section>
      </Container>
    </article>
  );
}
