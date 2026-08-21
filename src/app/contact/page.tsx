import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { SponsorInquiryForm } from "@/components/forms/sponsor-inquiry-form";
import { CAMPAIGN_URL, CONTACT_EMAIL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description: "General contact for For The 22 — media, community partnerships, and other questions.",
  canonical: "/contact",
});

export default function ContactPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-2xl">
        <SectionHeading
          as="h1"
          eyebrow="Get in Touch"
          title="Contact"
          description={
            CONTACT_EMAIL
              ? `For media, community partnerships, or general questions, use the form below or reach us directly at ${CONTACT_EMAIL}.`
              : "For media, community partnerships, or general questions, use the form below."
          }
        />

        <p className="mt-6 rounded-sm border border-bronze/30 bg-bronze/10 px-4 py-3 text-sm text-ink">
          Looking to sponsor the campaign as a business? Use the dedicated{" "}
          <a
            href={`${CAMPAIGN_URL}/sponsors/request`}
            className="font-semibold text-bronze hover:underline"
          >
            sponsorship request form
          </a>{" "}
          instead — it routes proposals through the campaign&apos;s review process.
        </p>

        <div className="mt-10">
          <SponsorInquiryForm />
        </div>
      </Container>
    </section>
  );
}
