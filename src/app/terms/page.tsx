import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { TERMS_LAST_UPDATED, TERMS_SECTIONS } from "@/lib/content/terms";
import { CONTACT_EMAIL } from "@/lib/constants";
import { formatDateLong } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Site Terms",
  description:
    "Terms of use, sponsorship disclosure, charitable giving disclosure, and trademark disclaimer for For The 22.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading as="h1" eyebrow="Legal" title="Site Terms" />
          <p className="mt-3 text-sm text-charcoal-light">
            Last updated {formatDateLong(TERMS_LAST_UPDATED)}
          </p>
          <p className="mt-4 max-w-2xl rounded-sm border border-bronze/30 bg-bronze/10 px-4 py-3 text-sm text-ink">
            This page is a working draft describing what the site actually does today, and is
            pending final review by qualified legal counsel before launch. See also our{" "}
            <Link href="/privacy" className="text-bronze hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="space-y-12">
            {TERMS_SECTIONS.map((section) => (
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
                    Questions about these terms can be sent to{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-bronze hover:underline">
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </>
                ) : (
                  <>
                    Questions about these terms can be sent using our{" "}
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
