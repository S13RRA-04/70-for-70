import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  ATHLETE_AGREEMENT_EFFECTIVE_DATE,
  ATHLETE_AGREEMENT_SECTIONS,
  ATHLETE_AGREEMENT_VERSION,
} from "@/lib/content/athlete-agreement";
import { CONTACT_EMAIL } from "@/lib/constants";
import { formatDateLong } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Athlete Participation & Affiliation Agreement",
  description:
    "The agreement governing athletes who formally affiliate with For The 22 — eligibility, program support, branding, fundraising, and conduct.",
  alternates: { canonical: "/athlete-agreement" },
};

export default function AthleteAgreementPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Legal"
            title="For The 22 Athlete Participation & Affiliation Agreement"
          />
          <p className="mt-3 text-sm text-charcoal-light">
            Athlete Agreement v{ATHLETE_AGREEMENT_VERSION} &middot; Effective{" "}
            {formatDateLong(ATHLETE_AGREEMENT_EFFECTIVE_DATE)}
          </p>
          <p className="mt-4 max-w-2xl rounded-sm border border-bronze/30 bg-bronze/10 px-4 py-3 text-sm text-ink">
            This page is a working draft of the agreement affiliated athletes will be asked to
            accept, pending final review by qualified legal counsel before it is required of any
            athlete. It is separate from, and in addition to, our general{" "}
            <Link href="/terms" className="text-bronze hover:underline">
              Site Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-bronze hover:underline">
              Privacy Policy
            </Link>
            , and applies only to individuals who formally affiliate with For The 22 as an
            athlete — not to general site visitors.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="space-y-12">
            {ATHLETE_AGREEMENT_SECTIONS.map((section) => (
              <div key={section.id} id={section.id}>
                <h2 className="font-display text-xl font-semibold uppercase tracking-tight text-ink sm:text-2xl">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph, i) => (
                    <p key={i} className="text-base leading-relaxed text-charcoal-light">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <div id="contact">
              <h2 className="font-display text-xl font-semibold uppercase tracking-tight text-ink sm:text-2xl">
                Contact
              </h2>
              <p className="mt-3 text-base leading-relaxed text-charcoal-light">
                {CONTACT_EMAIL ? (
                  <>
                    Questions about this Agreement can be sent to{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-bronze hover:underline">
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </>
                ) : (
                  <>
                    Questions about this Agreement can be sent using our{" "}
                    <Link href="/contact" className="text-bronze hover:underline">
                      contact form
                    </Link>
                    .
                  </>
                )}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
