import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { SponsorshipRequestForm } from "@/components/forms/sponsorship-request-form";

export const metadata: Metadata = {
  title: "Request to Sponsor",
  description:
    "Submit a sponsorship request for 70 for 70. All sponsorship proposals are individually reviewed before acceptance.",
  alternates: { canonical: "/sponsors/request" },
};

export default async function SponsorshipRequestPage(props: PageProps<"/sponsors/request">) {
  const searchParams = await props.searchParams;
  const mileParam = Array.isArray(searchParams.mile) ? searchParams.mile[0] : searchParams.mile;
  const defaultMileNumber = mileParam ? Number.parseInt(mileParam, 10) : undefined;

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="For Businesses"
          title="Request to Sponsor"
          description="Interested in supporting 70 for 70 as a corporate or in-kind sponsor? Submit a sponsorship request below. All sponsorship proposals are individually reviewed before acceptance — this form does not commit you or the campaign to anything."
        />

        <div className="mt-10">
          <SponsorshipRequestForm
            defaultMileNumber={
              defaultMileNumber && Number.isFinite(defaultMileNumber) ? defaultMileNumber : undefined
            }
          />
        </div>
      </Container>
    </section>
  );
}
