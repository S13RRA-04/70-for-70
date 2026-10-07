import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  Globe2,
  ListChecks,
  MapPin,
  SearchCheck,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { RESOURCES } from "@/lib/content/resources";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "How Resources Are Reviewed",
  description: `What ${SITE_NAME} checks before a program appears in the resource directory — and what "reviewed" does and does not mean.`,
  canonical: "/standards",
});

/** BreadcrumbList per credibility plan §25 — Home→page shape. */
const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: "How Resources Are Reviewed", url: `${SITE_URL}/standards` },
]);

/**
 * The actual review checks — each maps to a field the Resource interface
 * already stores (see src/lib/content/resources.ts): legitimacy, audience,
 * service type, geographicScope, eligibility, verified organizational info,
 * mission fit. Copy per the credibility plan's /standards spec; explicitly
 * NOT accreditation, certification, or clinical review (see WHAT_REVIEWED_MEANS).
 */
const REVIEW_CHECKS = [
  {
    icon: SearchCheck,
    title: "Legitimacy",
    body: "Does the organization or program appear to be real and operational — an established entity with a working presence, not a placeholder or dead link.",
  },
  {
    icon: Users,
    title: "Who It Serves",
    body: "Which population the program actually serves — veterans, first responders, families, caregivers — stated by the organization itself, not assumed.",
  },
  {
    icon: ListChecks,
    title: "Service Type",
    body: "What the program provides — counseling, peer support, adaptive sport, grants, career help — and whether it fits the directory's categories.",
  },
  {
    icon: Globe2,
    title: "Geographic Availability",
    body: "Whether the program is nationwide or limited to specific states, so visitors aren't pointed at something unavailable where they live.",
  },
  {
    icon: MapPin,
    title: "Eligibility",
    body: "Any eligibility criteria the organization publishes — who qualifies, when, and how to apply. Where the org doesn't state criteria, we don't invent them.",
  },
  {
    icon: Building2,
    title: "Public Organizational Information",
    body: "Publicly available information about the organization — what it does, how it describes its own work, and whether that information is consistent.",
  },
  {
    icon: ShieldCheck,
    title: "Mission Alignment",
    body: "Whether the services are relevant to the {site} mission: supporting the mental, physical, emotional, and spiritual health of those who serve.",
  },
].map((check) => ({
  ...check,
  body: check.body.replace("{site}", SITE_NAME),
}));

const WHAT_REVIEWED_MEANS = [
  "Reviewed does not mean guaranteed or endorsed. It means we have made a reasonable effort to verify that the resource exists, serves the stated population, and provides services relevant to the For The 22 mission.",
];

const WHAT_CHANGES = [
  "Program details can change. Visitors should confirm eligibility, availability, cost, and services directly with the organization.",
];

const EXCLUSIONS = [
  "Misleading claims or an identity that cannot be reasonably verified",
  "Predatory financial practices, unsafe services, or deceptive marketing",
  "Persistent, credible complaints that are not addressed",
  "Pay-to-play referral arrangements or pressure to purchase placement",
];

export default function StandardsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      {/* Hero */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading
            as="h1"
            eyebrow="Standards"
            title="How Resources Are Reviewed"
            description={`${SITE_NAME} lists ${RESOURCES.length} programs and services. Every one goes through the same review before it appears — here is exactly what that involves, and what it does not mean.`}
          />
        </Container>
      </section>

      <section className="border-y border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Independence" title="What We Exclude" description="A listing must remain useful to the person seeking help, not merely useful to the provider." />
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {EXCLUSIONS.map((item) => <li key={item} className="border border-ink/10 bg-off-white p-4 text-sm leading-relaxed text-charcoal-light">{item}</li>)}
          </ul>
          <div className="mt-8 space-y-4 text-sm leading-relaxed text-charcoal-light">
            <p><strong className="text-ink">Commercial providers:</strong> Paid providers may be listed when their commercial status and costs are clear and they independently meet the same relevance and transparency standards.</p>
            <p><strong className="text-ink">No purchased placement:</strong> Organizations cannot buy preferential placement. Sponsorship is disclosed separately and never changes navigator ranking.</p>
            <p><strong className="text-ink">Review cycle:</strong> Records are targeted for re-check every 6–12 months, and sooner when a visitor reports a broken link, material change, or concern.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact?topic=resource-update" className="rounded-sm bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-wide text-off-white">Report inaccurate information</Link>
            <Link href="/contact?topic=resource-concern" className="rounded-sm border border-ink/20 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink">Report a concern</Link>
          </div>
        </Container>
      </section>

      {/* What we check */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="The Review" title="What We Check" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEW_CHECKS.map((check) => (
              <div key={check.title} className="flex flex-col border border-ink/10 bg-off-white p-6">
                <check.icon className="h-6 w-6 text-bronze" aria-hidden="true" />
                <h3 className="mt-4 font-display text-base font-bold uppercase tracking-tight text-ink">
                  {check.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-light">{check.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* What reviewed means — the two disclaimers, given prominence */}
      <section className="border-y border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading
            tone="dark"
            eyebrow="For Clarity"
            title="What “Reviewed” Means"
          />
          <div className="mt-6 space-y-4 text-base leading-relaxed text-off-white/80">
            {WHAT_REVIEWED_MEANS.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-6 flex gap-4 border border-off-white/15 p-5">
            <BadgeCheck className="h-5 w-5 shrink-0 text-bronze-light" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-off-white/70">
              {WHAT_CHANGES[0]}
            </p>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-off-white/60">
            For immediate support needs, see{" "}
            <Link href="/crisis" className="font-semibold text-bronze-light hover:underline">
              Need Help Now
            </Link>{" "}
            — the directory is not a crisis service.
          </p>
        </Container>
      </section>

      {/* How a resource gets listed */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading
            eyebrow="The Process"
            title="How a Resource Gets Listed"
            description="Submissions come from the community — program staff, nonprofit leaders, and visitors who found something worth sharing. Nothing is listed automatically."
          />
          <ol className="mt-8 space-y-6">
            {[
              {
                step: "01",
                title: "Submission",
                body: "Someone recommends a program through the contact form, describing what it is and who it serves.",
              },
              {
                step: "02",
                title: "Review",
                body: "The submission is checked against the criteria above — legitimacy, audience, service type, availability, and mission fit.",
              },
              {
                step: "03",
                title: "Listing",
                body: "Approved programs are added with a factual description, cost framing, and geographic scope — and re-checked when details change.",
              },
            ].map((item) => (
              <li key={item.step} className="flex gap-5 border border-ink/10 bg-sand-light/40 p-6">
                <span className="font-display text-2xl font-bold text-bronze/40">{item.step}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold uppercase tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-charcoal-light">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm leading-relaxed text-charcoal-light">
            Know a program that belongs here?{" "}
            <Link href="/contact" className="font-semibold text-bronze hover:text-bronze-dark">
              Send it our way &rarr;
            </Link>
          </p>
        </Container>
      </section>

      <CTASection
        title="Find, or Improve, the Directory"
        buttons={[
          { label: "Explore Resources", href: "/resources" },
          { label: "Recommend a Program", href: "/contact", variant: "secondary" },
        ]}
      />
    </>
  );
}
