import Link from "next/link";
import { getMissionPartners } from "@/lib/data/mission-partners";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { MissionPartnerCard } from "@/components/partners/mission-partner-card";
import { CurrentGearNeeds } from "@/components/sponsors/current-gear-needs";
import { EmptyState } from "@/components/shared/empty-state";
import { CAMPAIGN_NAME, CAMPAIGN_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Sponsors",
  description: "Organizations supporting Tri For The 22 through gear, resources, and outreach.",
  canonical: `${CAMPAIGN_URL}/sponsors`,
});

/**
 * Campaign sponsors — gear/resource partners (e.g. ISM Saddles, Zealios),
 * split out from the former /partners page so they get their own page
 * distinct from the nonprofit beneficiaries (see src/app/beneficiaries/page.tsx).
 * Distinct from the paid dollar-tier sponsorship program (SPONSORSHIP_LEVELS
 * in src/lib/constants.ts, request form at /sponsors/request), which remains
 * retired pending written federal ethics approval.
 */
export default async function SponsorsPage() {
  const sponsors = await getMissionPartners();

  return (
    <>
      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          title="Campaign Sponsors"
          description={`Organizations supporting ${CAMPAIGN_NAME} through gear, resources, and outreach — distinct from the nonprofit beneficiaries the campaign raises funds for. Supporting the campaign is not the same as being a fundraising beneficiary.`}
        />
      </CampaignPageHero>

      <section className="border-b border-ink/10 py-12">
        <Container>
          <CurrentGearNeeds />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          {sponsors.length === 0 ? (
            <EmptyState
              title="Sponsors will be listed here soon."
              description="Confirmed campaign sponsors will appear on this page as relationships are finalized."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sponsors.map((sponsor) => (
                <MissionPartnerCard key={sponsor.id} partner={sponsor} />
              ))}
            </div>
          )}
          <p className="mt-10 max-w-2xl text-sm text-charcoal-light">
            Inclusion on this page reflects a confirmed support relationship. It does not mean an
            organization operates, endorses, or is responsible for this site&apos;s content, and
            does not imply endorsement by any employer, government agency, or other third party
            unless explicitly stated.
          </p>
          <p className="mt-4 max-w-2xl text-sm text-charcoal-light">
            Looking for who the campaign raises money for, not who supports it?{" "}
            <Link href="/beneficiaries" className="font-semibold text-bronze hover:text-bronze-light">
              See Beneficiaries &rarr;
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
