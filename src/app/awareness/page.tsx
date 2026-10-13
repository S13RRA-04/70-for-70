import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { AwarenessDirectory } from "@/components/awareness/awareness-directory";
import { AWARENESS_CALENDAR } from "@/lib/content/awareness-calendar";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Awareness & Action Calendar",
  description:
    "Veteran, first-responder, military-family, mental-health, and remembrance observances throughout the year, curated by For The 22.",
  canonical: "/awareness",
});

/**
 * ORG-level only (forthe22.org) — see src/middleware.ts's ORG_PATH_PREFIXES.
 * Deliberately not wired into any campaign homepage (Tri/Ruck/22); this is
 * an org-wide initiative, same separation just enforced elsewhere this
 * session when 22-For-The-22 content was pulled out of Tri's surfaces.
 */
export default function AwarenessCalendarPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-12 sm:py-16">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Awareness & Action"
            title="The Awareness & Action Calendar"
            description={`A year of veteran, first-responder, military-family, mental-health, and remembrance observances — curated by ${SITE_NAME}, with the dates we actually build campaigns and storytelling around called out below.`}
          />
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <AwarenessDirectory entries={AWARENESS_CALENDAR} />
        </Container>
      </section>

      <CTASection
        eyebrow="Know a Date We Missed?"
        title="Suggest an Observance"
        description="If there's a veteran, first-responder, military-family, or remembrance date that belongs on this calendar, let us know."
        buttons={
          CONTACT_EMAIL
            ? [{ label: "Suggest an Observance", href: `mailto:${CONTACT_EMAIL}?subject=Awareness%20Calendar%20Suggestion` }]
            : [{ label: "Contact Us", href: "/contact" }]
        }
      />
    </>
  );
}
