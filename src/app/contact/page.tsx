import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { SponsorInquiryForm } from "@/components/forms/sponsor-inquiry-form";
import { CONTACT_EMAIL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description: "General contact for For The 22 — media and other questions.",
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
              ? `For media or general questions, use the form below or reach us directly at ${CONTACT_EMAIL}.`
              : "For media or general questions, use the form below."
          }
        />

        <div className="mt-10">
          <SponsorInquiryForm />
        </div>
      </Container>
    </section>
  );
}
