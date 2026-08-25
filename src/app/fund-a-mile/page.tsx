import { getMilesWithDonations } from "@/lib/data/miles";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { MileGrid } from "@/components/miles/mile-grid";
import { CAMPAIGN_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Fund a Mile",
  description: "70 numbered miles, $1,000 each. Fund a full mile or contribute alongside other supporters.",
  canonical: `${CAMPAIGN_URL}/fund-a-mile`,
});

export default async function FundAMilePage() {
  const miles = await getMilesWithDonations();
  const noneFundedYet = miles.every((m) => m.amount_funded === 0);

  return (
    <>
      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          eyebrow="Fund a Mile"
          title="70 Miles. $1,000 Each."
          description="Every mile of the race maps to $1,000 of the fundraising goal. Fund a mile outright, or contribute toward one alongside other supporters — no single mile requires one donor to cover the full amount."
        />
        {noneFundedYet && (
          <p className="mt-6 text-base font-medium text-bronze-light">
            Choose any mile to get the campaign moving.
          </p>
        )}
      </CampaignPageHero>

      <section className="py-16 sm:py-20">
        <Container>
          <MileGrid miles={miles} />
        </Container>
      </section>
    </>
  );
}
