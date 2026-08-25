import { Brain, Activity, Users, Compass, Scale, Ban } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { ORG_SUPPORTING_STATEMENT, ORG_TAGLINE, SITE_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Mission",
  description: ORG_SUPPORTING_STATEMENT,
  canonical: "/mission",
});

const WHO_WE_SERVE = [
  "Veterans",
  "Law Enforcement",
  "Fire",
  "EMS",
  "Dispatch",
  "Corrections",
  "Families & Caregivers",
] as const;

const RESOURCE_AREAS = [
  {
    icon: Brain,
    title: "Mental Health",
    description: "Counseling, therapy access, and peer support.",
  },
  {
    icon: Activity,
    title: "Physical Health",
    description: "Adaptive fitness, recovery, and medical support.",
  },
  {
    icon: Users,
    title: "Emotional Wellness",
    description: "Family, relationship, and community connection.",
  },
  {
    icon: Compass,
    title: "Spiritual Health & Purpose",
    description: "Faith-based support and purpose-finding communities.",
  },
  {
    icon: Scale,
    title: "Career, Financial & Legal",
    description: "Career transition, financial, and legal assistance.",
  },
] as const;

const HOW_IT_WORKS = [
  {
    number: "01",
    title: "Search & Filter",
    body: "Search the directory by what you need and who you are — veteran or first responder, family member or caregiver.",
  },
  {
    number: "02",
    title: "Every Resource Is Reviewed",
    body: "Submissions come from the community and are checked for legitimacy and relevance before going live.",
  },
] as const;

const WHAT_WE_ARE_NOT = [
  {
    title: "Not a Crisis-Response Provider",
    body: "If you're in crisis, visit our Need Help Now page for immediate resources.",
  },
  {
    title: "Not a Medical Provider",
    body: "We do not diagnose, treat, or offer clinical advice.",
  },
  {
    title: "Not a Government Program",
    body: "Not sponsored, endorsed, or operated by any employer or government entity.",
  },
  {
    title: "Not the Operator of Listed Programs",
    body: "We connect people to third-party programs and services — we don't run them.",
  },
] as const;

export default function MissionPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading as="h1" eyebrow="Our Mission" title={ORG_TAGLINE} description={ORG_SUPPORTING_STATEMENT} />
        </Container>
      </section>

      {/* Who We Serve — chip row, not a bullet list */}
      <section className="bg-off-white py-16 sm:py-20">
        <Container className="max-w-[1400px]">
          <SectionHeading eyebrow="Built For" title="Who We Serve" />
          <ul className="mt-8 flex flex-wrap gap-3">
            {WHO_WE_SERVE.map((group) => (
              <li
                key={group}
                className="border border-ink/10 bg-sand-light/60 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-ink"
              >
                {group}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* What We Connect People To — icon-card grid */}
      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-[1400px]">
          <SectionHeading eyebrow="How We Help" title="What We Connect People To" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {RESOURCE_AREAS.map((area) => (
              <div key={area.title} className="flex flex-col border border-ink/10 bg-off-white p-6">
                <area.icon className="h-6 w-6 text-bronze" aria-hidden="true" />
                <h3 className="mt-4 font-display text-base font-bold uppercase tracking-tight text-ink">
                  {area.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-light">{area.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How the directory works — numbered process row */}
      <section className="border-t border-ink/10 bg-off-white py-16 sm:py-20">
        <Container className="max-w-[1400px]">
          <SectionHeading eyebrow="The Process" title="How the Directory Works" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.number} className="border border-ink/10 bg-sand-light/40 p-8">
                <span className="font-display text-3xl font-bold text-bronze/40">{step.number}</span>
                <h3 className="mt-3 font-display text-xl font-semibold uppercase tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-charcoal-light">{step.body}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-charcoal-light">
            Raising awareness of the challenges carried by those who serve supports this mission —
            it&apos;s part of why the directory exists at {SITE_NAME}, not a separate goal of its own.
          </p>
        </Container>
      </section>

      {/* What For The 22 is not — dark full-bleed contrast block */}
      <section className="bg-ink py-16 text-off-white sm:py-20">
        <Container className="max-w-[1400px]">
          <SectionHeading tone="dark" eyebrow="For Clarity" title="What For The 22 Is Not" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {WHAT_WE_ARE_NOT.map((item) => (
              <div key={item.title} className="flex gap-4 border border-off-white/15 p-6">
                <Ban className="h-5 w-5 shrink-0 text-off-white/40" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-base font-bold uppercase tracking-tight text-off-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-off-white/70">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Find a Resource, or Get Help Right Now"
        buttons={[
          { label: "Find Resources", href: "/resources" },
          { label: "Need Help Now", href: "/crisis", variant: "secondary" },
        ]}
      />
    </>
  );
}
