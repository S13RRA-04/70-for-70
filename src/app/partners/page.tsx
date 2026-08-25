import { getPartners } from "@/lib/data/partners";
import { getMissionPartners } from "@/lib/data/mission-partners";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { PartnerCard } from "@/components/partners/partner-card";
import { MissionPartnerCard } from "@/components/partners/mission-partner-card";
import { EmptyState } from "@/components/shared/empty-state";
import { CTAButton } from "@/components/shared/cta-button";
import { CAMPAIGN_NAME, CAMPAIGN_URL, PERSONAL_PROJECT_DISCLOSURE } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Partners",
  description:
    "Who Tri For The 22 raises funds for, and who supports the campaign — two distinct relationships, never mixed together.",
  canonical: `${CAMPAIGN_URL}/partners`,
});

/**
 * The canonical partners page — two clearly separated sections so
 * beneficiaries (confirmed charitable fundraising recipients) and
 * supporters (gear/resource partners, not fundraising recipients) are never
 * conflated. /beneficiaries, /campaign-supporters, and /sponsors all
 * redirect here to specific sections rather than duplicating content.
 */
export default async function PartnersPage() {
  const [partners, supporters] = await Promise.all([getPartners(), getMissionPartners()]);

  return (
    <>
      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          title="Partners"
          description={`${CAMPAIGN_NAME} works with two distinct kinds of partners: nonprofit beneficiaries the campaign raises funds for, and campaign supporters who help make the campaign possible. They're never the same relationship.`}
        />
        <p className="mt-3 max-w-2xl text-base text-off-white/75">{PERSONAL_PROJECT_DISCLOSURE}</p>
        <div className="mt-8">
          <CTAButton href="/donate" variant="secondary" tone="dark">
            Donate Directly
          </CTAButton>
        </div>
      </CampaignPageHero>

      <section id="beneficiaries" className="scroll-mt-20 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Who The Campaign Supports"
            title="Beneficiaries"
            description={`${CAMPAIGN_NAME} raises funds in support of the confirmed nonprofit organizations below. Charitable donations are made directly through each organization's own authorized donation platform.`}
          />
          <div className="mt-8 flex flex-col gap-6">
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

      <section id="supporters" className="scroll-mt-20 border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Who Supports The Campaign"
            title="Campaign Supporters"
            description={`Organizations supporting ${CAMPAIGN_NAME} through gear, resources, and outreach — distinct from the nonprofit beneficiaries above. Supporting the campaign is not the same as being a fundraising beneficiary.`}
          />
          <div className="mt-8">
            {supporters.length === 0 ? (
              <EmptyState
                title="Supporters will be listed here soon."
                description="Confirmed campaign supporters will appear on this page as relationships are finalized."
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {supporters.map((supporter) => (
                  <MissionPartnerCard key={supporter.id} partner={supporter} />
                ))}
              </div>
            )}
          </div>
          <p className="mt-10 max-w-2xl text-sm text-charcoal-light">
            Inclusion on this page reflects a confirmed support relationship. It does not mean an
            organization operates, endorses, or is responsible for this site&apos;s content, and
            does not imply endorsement by any employer, government agency, or other third party
            unless explicitly stated.
          </p>
        </Container>
      </section>
    </>
  );
}
