import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { PRIVACY_LAST_UPDATED, PRIVACY_SECTIONS } from "@/lib/content/privacy";
import { CONTACT_EMAIL } from "@/lib/constants";
import { formatDateLong } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How the 70 for 70 campaign website collects, uses, and shares information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Legal" title="Privacy Policy" />
          <p className="mt-3 text-sm text-charcoal-light">
            Last updated {formatDateLong(PRIVACY_LAST_UPDATED)}
          </p>
          <p className="mt-4 max-w-2xl rounded-sm border border-bronze/30 bg-bronze/10 px-4 py-3 text-sm text-ink">
            This policy is a working draft describing what the site actually does today, and is
            pending final review by qualified legal counsel before launch.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="space-y-12">
            {PRIVACY_SECTIONS.map((section) => (
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
                    Questions about this policy can be sent to{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-bronze hover:underline">
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </>
                ) : (
                  <>
                    Questions about this policy can be sent using our{" "}
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
