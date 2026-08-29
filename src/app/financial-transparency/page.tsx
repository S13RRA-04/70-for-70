import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CAMPAIGN_NAME, MERCH_BENEFICIARIES } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Financial Transparency",
  description: `How donation links on this site work, and what ${CAMPAIGN_NAME} does and doesn't do with charitable giving.`,
  canonical: "/financial-transparency",
});

export default function FinancialTransparencyPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-2xl">
        <SectionHeading as="h1" eyebrow="Financial Transparency" title="How Donations Work" />

        <div className="mt-8 space-y-5 text-base leading-relaxed text-charcoal-light">
          <p>
            {CAMPAIGN_NAME} does not collect or process charitable donations. Donation links send
            visitors directly to the independent nonprofit organization selected by the donor.
          </p>
          <p>
            {CAMPAIGN_NAME} does not issue charitable receipts, control donated funds, or determine
            how a beneficiary organization uses donations received through its own platform.
          </p>
          <p>
            Merchandise is sold through Bonfire, an independent third-party store — 100% of net
            profit is paid by Bonfire directly to {MERCH_BENEFICIARIES[0]} or{" "}
            {MERCH_BENEFICIARIES[1]}, with the specific beneficiary noted on each item in the
            store. Sponsorship intake and athlete-support programs are not currently active.
          </p>
        </div>
      </Container>
    </section>
  );
}
