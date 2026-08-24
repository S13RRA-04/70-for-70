import { getMissionPartners } from "@/lib/data/mission-partners";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { MissionPartnerCard } from "@/components/partners/mission-partner-card";
import { EmptyState } from "@/components/shared/empty-state";
import { CAMPAIGN_NAME, CAMPAIGN_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Campaign Supporters",
  description: "Brands and organizations supporting Tri For The 22 through gear, resources, and outreach.",
  canonical: `${CAMPAIGN_URL}/campaign-supporters`,
});

export default async function CampaignSupportersPage() {
  const supporters = await getMissionPartners();

  return (
    <>
      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          eyebrow="Behind the Mission"
          title="Campaign Supporters"
          description={`Organizations supporting ${CAMPAIGN_NAME} through gear, resources, and outreach — distinct from the nonprofit beneficiaries the campaign raises funds for.`}
        />
      </CampaignPageHero>

      <section className="py-16 sm:py-20">
        <Container>
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
