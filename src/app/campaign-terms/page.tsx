import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CAMPAIGN_TERMS_LAST_UPDATED, CAMPAIGN_TERMS_SECTIONS } from "@/lib/content/campaign-terms";
import { CAMPAIGN_NAME, CONTACT_EMAIL, SITE_URL } from "@/lib/constants";
import { formatDateLong } from "@/lib/utils";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Campaign Terms",
  description: `Campaign-specific terms for ${CAMPAIGN_NAME} — donations, merchandise, race participation, and trademark disclaimers.`,
  canonical: "/terms",
});

export default function CampaignTermsPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading as="h1" eyebrow="Legal" title="Campaign Terms" />
          <p className="mt-3 text-sm text-charcoal-light">
            Last updated {formatDateLong(CAMPAIGN_TERMS_LAST_UPDATED)}
          </p>
          <p className="mt-4 max-w-2xl text-sm text-charcoal-light">
            These terms cover the {CAMPAIGN_NAME} campaign specifically, and supplement — rather
            than replace — the{" "}
            <a href={`${SITE_URL}/terms`} className="text-bronze hover:underline">
              general site terms
            </a>{" "}
            and{" "}
            <a href={`${SITE_URL}/privacy`} className="text-bronze hover:underline">
              privacy policy
            </a>{" "}
            for For The 22.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="space-y-12">
            {CAMPAIGN_TERMS_SECTIONS.map((section) => (
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
                    <a href={`${SITE_URL}/contact`} className="text-bronze hover:underline">
                      contact form
                    </a>
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
