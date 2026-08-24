import { getPartners } from "@/lib/data/partners";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { PartnerCard } from "@/components/partners/partner-card";
import { CTAButton } from "@/components/shared/cta-button";
import { CAMPAIGN_NAME, CAMPAIGN_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Beneficiaries",
  description:
    "The confirmed nonprofit beneficiary organizations Tri For The 22 raises funds for.",
  canonical: `${CAMPAIGN_URL}/beneficiaries`,
});

/**
 * The centralized beneficiary list — sourced from getPartners(), the same
 * data source used on the homepage, /donate, /press, and Terms, so the
 * confirmed beneficiary list is identical everywhere it appears. Only
 * confirmed fundraising beneficiaries are shown here — commercial
 * supporters and general community/resource partners are not fundraising
 * beneficiaries and are not described as such.
 */
export default async function BeneficiariesPage() {
  const partners = await getPartners();

  return (
    <>
      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          title="Beneficiaries"
          description={`${CAMPAIGN_NAME} raises funds in support of the confirmed nonprofit organizations below. Charitable donations are made directly through each organization's own authorized donation platform.`}
        />
        <div className="mt-8">
          <CTAButton href="/donate" variant="secondary" tone="dark">
            Donate Directly
          </CTAButton>
        </div>
      </CampaignPageHero>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-6">
            {partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>

          <p className="mt-10 max-w-2xl text-sm text-charcoal-light">
            Donations are made directly through each independent nonprofit organization&apos;s
            authorized donation platform. For The 22 does not receive, process, or take
            possession of charitable contributions and does not issue tax receipts.
          </p>
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-sand-light py-10 sm:py-12">
        <Container className="max-w-3xl">
          <p className="text-sm text-charcoal-light">
            Inclusion on this page reflects a confirmed beneficiary relationship. Being named as
            a beneficiary does not mean an organization operates, endorses, or is responsible
            for this site&apos;s content, and participation does not imply endorsement by any
            employer, government agency, or other third party unless explicitly stated.
          </p>
        </Container>
      </section>
    </>
  );
}
