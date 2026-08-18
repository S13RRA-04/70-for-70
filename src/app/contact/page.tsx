import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { SponsorInquiryForm } from "@/components/forms/sponsor-inquiry-form";
import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "General contact for the 70 for 70 campaign — media, community partnerships, and other questions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-2xl">
        <SectionHeading
          eyebrow="Get in Touch"
          title="Contact"
          description={`For media, community partnerships, or general questions, use the form below or reach us directly at ${CONTACT_EMAIL}.`}
        />

        <p className="mt-6 rounded-sm border border-bronze/30 bg-bronze/10 px-4 py-3 text-sm text-ink">
          Looking to sponsor the campaign as a business? Use the dedicated{" "}
          <Link href="/sponsors/request" className="font-semibold text-bronze hover:underline">
            sponsorship request form
          </Link>{" "}
          instead — it routes proposals through the campaign&apos;s review process.
        </p>

        <div className="mt-10">
          <SponsorInquiryForm />
        </div>
      </Container>
    </section>
  );
}
