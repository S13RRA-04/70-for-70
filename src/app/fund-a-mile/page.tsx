import { getMilesWithDonations } from "@/lib/data/miles";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { MileGrid } from "@/components/miles/mile-grid";
import { MobileActionBar } from "@/components/shared/mobile-action-bar";
import { CAMPAIGN_URL, DONATE_LINK } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Fund a Mile",
  description: "70 numbered miles, $1,000 each. Fund a full mile or contribute alongside other supporters.",
  canonical: `${CAMPAIGN_URL}/fund-a-mile`,
});

export default async function FundAMilePage() {
  const miles = await getMilesWithDonations();

  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Fund a Mile"
            title="70 Miles. $1,000 Each."
            description="Every mile of the race maps to $1,000 of the fundraising goal. Fund a mile outright, or contribute toward one alongside other supporters — no single mile requires one donor to cover the full amount."
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <MileGrid miles={miles} />
        </Container>
      </section>

      <div className="h-16 sm:hidden" aria-hidden="true" />
      <MobileActionBar
        secondary={{ label: "Partners", href: "/partners" }}
        primary={{ label: DONATE_LINK.label, href: DONATE_LINK.href }}
      />
    </>
  );
}
