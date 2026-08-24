import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CAMPAIGN_PRIVACY_LAST_UPDATED, CAMPAIGN_PRIVACY_SECTIONS } from "@/lib/content/campaign-privacy";
import { CAMPAIGN_NAME, CONTACT_EMAIL, SITE_URL } from "@/lib/constants";
import { formatDateLong } from "@/lib/utils";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Campaign Privacy Notice",
  description: `Campaign-specific data practices for ${CAMPAIGN_NAME} — WHOOP training data, donation routing, and sponsorship intake.`,
  canonical: "/privacy",
});

export default function CampaignPrivacyPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading as="h1" eyebrow="Legal" title="Campaign Privacy Notice" />
          <p className="mt-3 text-sm text-charcoal-light">
            Last updated {formatDateLong(CAMPAIGN_PRIVACY_LAST_UPDATED)}
          </p>
          <p className="mt-4 max-w-2xl text-sm text-charcoal-light">
            This notice covers the {CAMPAIGN_NAME} campaign specifically, and supplements —
            rather than replaces — the{" "}
            <a href={`${SITE_URL}/privacy`} className="text-bronze hover:underline">
              general privacy policy
            </a>{" "}
            for For The 22.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="space-y-12">
            {CAMPAIGN_PRIVACY_SECTIONS.map((section) => (
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
                    Questions about this notice can be sent to{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-bronze hover:underline">
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </>
                ) : (
                  <>
                    Questions about this notice can be sent using our{" "}
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
