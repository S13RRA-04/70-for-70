import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { ORG_SUPPORTING_STATEMENT, ORG_TAGLINE, SITE_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Mission",
  description: ORG_SUPPORTING_STATEMENT,
  canonical: "/mission",
});

const WHO_WE_SERVE = [
  "Veterans",
  "Law enforcement officers",
  "Firefighters",
  "EMS personnel",
  "Dispatchers",
  "Corrections officers",
  "Families and caregivers",
] as const;

const RESOURCE_TYPES = [
  "Mental health counseling and therapy access",
  "Physical health, adaptive fitness, and medical support",
  "Emotional wellness, family, and relationship support",
  "Spiritual health and purpose-finding communities",
  "Career, financial, and legal assistance",
] as const;

const WHAT_WE_ARE_NOT = [
  "For The 22 is not a crisis-response provider. If you're in crisis, visit our Need Help Now page for immediate resources.",
  "For The 22 is not a medical provider and does not diagnose, treat, or offer clinical advice.",
  "For The 22 is not a government program and is not sponsored, endorsed, or operated by any employer or government entity.",
  "For The 22 is not the operator of the third-party programs, services, or organizations listed in the directory — it connects people to them, it doesn't run them.",
] as const;

export default function MissionPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading as="h1" eyebrow="Our Mission" title={ORG_TAGLINE} description={ORG_SUPPORTING_STATEMENT} />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
            Who We Serve
          </h2>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {WHO_WE_SERVE.map((group) => (
              <li key={group} className="text-base leading-relaxed text-charcoal-light">
                {group}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
            What We Connect People To
          </h2>
          <ul className="mt-5 space-y-2">
            {RESOURCE_TYPES.map((item) => (
              <li key={item} className="text-base leading-relaxed text-charcoal-light">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
            How the Directory Works
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-charcoal-light">
            <p>
              {SITE_NAME} maintains a searchable directory of established programs, services,
              and communities. Search or filter by what you need and who you are — veteran or
              first responder, family member or caregiver, and the kind of support you&apos;re
              looking for.
            </p>
            <p>
              Raising awareness of the challenges carried by those who serve supports this
              mission — it&apos;s part of why the directory exists, not a separate goal of its
              own.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
            How Resources Are Reviewed
          </h2>
          <p className="mt-5 text-base leading-relaxed text-charcoal-light">
            Every resource is reviewed before it&apos;s added to the directory. Submissions come
            from the community, and each one is checked for legitimacy and relevance before it
            goes live — see the Submit a Resource link on the Resources page.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
            What For The 22 Is Not
          </h2>
          <ul className="mt-5 space-y-3">
            {WHAT_WE_ARE_NOT.map((item) => (
              <li key={item} className="text-base leading-relaxed text-charcoal-light">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-anchor py-16 text-center sm:py-20">
        <Container>
          <p className="mx-auto max-w-xl text-lg text-off-white/80">
            Find a resource, or get help right now.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <CTAButton href="/resources" variant="secondary" tone="dark" size="lg">
              Find Resources
            </CTAButton>
            <CTAButton href="/crisis" variant="primary" size="lg">
              Need Help Now
            </CTAButton>
          </div>
        </Container>
      </section>
    </>
  );
}
