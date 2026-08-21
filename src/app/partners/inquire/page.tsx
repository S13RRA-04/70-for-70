import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { PartnerInquiryForm } from "@/components/forms/partner-inquiry-form";
import { CAMPAIGN_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Become a Partner",
  description:
    "Propose a beneficiary relationship, mission partnership, sponsorship, or community collaboration with For The 22.",
  canonical: `${CAMPAIGN_URL}/partners/inquire`,
});

export default function PartnerInquiryPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <SectionHeading
          as="h1"
          eyebrow="Become a Partner"
          title="Propose a Partnership"
          description="Whether through equipment, services, programming, financial support, or community collaboration, there are many ways to help For The 22 serve veterans and first responders. Submit an inquiry below — every proposal is reviewed before any relationship is accepted or recognized publicly."
        />

        <div className="mt-10">
          <PartnerInquiryForm />
        </div>
      </Container>
    </section>
  );
}
