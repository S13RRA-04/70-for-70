import Link from "next/link";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { TERMS_LAST_UPDATED, TERMS_SECTIONS } from "@/lib/content/terms";
import { CONTACT_EMAIL } from "@/lib/constants";
import { formatDateLong } from "@/lib/utils";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Site Terms",
  description: "Terms of use, charitable giving disclosure, and trademark disclaimer for For The 22.",
  canonical: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Site terms"
        description={
          <p>
            See also our{" "}
            <Link href="/privacy" className="font-bold text-navy underline underline-offset-2 hover:text-help">
              privacy policy
            </Link>
            .
          </p>
        }
      >
        <p className="label-caps text-steel">Last updated {formatDateLong(TERMS_LAST_UPDATED)}</p>
      </PageHero>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="space-y-12">
            {TERMS_SECTIONS.map((section) => (
              <div key={section.id} id={section.id}>
                <h2 className="font-display text-2xl uppercase text-ink sm:text-3xl">
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
              <h2 className="font-display text-2xl uppercase text-ink sm:text-3xl">
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
