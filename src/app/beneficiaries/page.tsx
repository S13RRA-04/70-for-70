import Link from "next/link";
import { getPartners } from "@/lib/data/partners";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGrid } from "@/components/shared/reveal-on-scroll";
import { PartnerCard } from "@/components/partners/partner-card";
import { CTAButton } from "@/components/shared/cta-button";
import { CAMPAIGN_NAME, CAMPAIGN_URL, DONATE_LINK, PERSONAL_PROJECT_DISCLOSURE } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, CAMPAIGN_HOME_CRUMB, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "Beneficiaries",
  description: "The confirmed nonprofit organizations Tri For The 22 raises funds for.",
  canonical: `${CAMPAIGN_URL}/beneficiaries`,
});

const BENEFICIARIES_BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  CAMPAIGN_HOME_CRUMB,
  { name: "Beneficiaries", url: `${CAMPAIGN_URL}/beneficiaries` },
]);

/**
 * The nonprofit fundraising beneficiaries — split out from the former
 * /partners page so beneficiaries (confirmed charitable fundraising
 * recipients) and campaign sponsors (gear/resource partners, see
 * src/app/sponsors/page.tsx) each get their own page instead of two
 * sections on one. /partners redirects here.
 */
export default async function BeneficiariesPage() {
  const partners = await getPartners();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BENEFICIARIES_BREADCRUMB_JSON_LD)} />
      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          title="Beneficiaries"
          description={`${CAMPAIGN_NAME} raises funds in support of the confirmed nonprofit organizations below. Charitable donations are made directly through each organization's own authorized donation platform.`}
        />
        <p className="mt-3 max-w-2xl text-base text-off-white/75">{PERSONAL_PROJECT_DISCLOSURE}</p>
        <div className="mt-8">
          <CTAButton href={DONATE_LINK.href} variant="secondary" tone="dark">
            {DONATE_LINK.label}
          </CTAButton>
        </div>
      </CampaignPageHero>

      <section className="py-16 sm:py-20">
        <Container>
          <p className="max-w-2xl text-sm text-charcoal-light">
            Each organization below was chosen for the specific, confirmed impact it already has in the veteran
            and first-responder community — not added to pad a list.
          </p>
          <RevealGrid>
            <div className="mt-8 flex flex-col gap-6">
              {partners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </RevealGrid>
          <p className="mt-10 max-w-2xl text-sm text-charcoal-light">
            {CAMPAIGN_NAME} supports these organizations through fundraising, awareness, community outreach, and
            campaign partnerships.
          </p>
          <p className="mt-4 max-w-2xl text-sm text-charcoal-light">
            Donations are made directly through each independent nonprofit organization&apos;s
            authorized donation platform. {CAMPAIGN_NAME} does not receive, process, or take
            possession of charitable contributions and does not issue tax receipts.
          </p>
          <p className="mt-4 max-w-2xl text-sm text-charcoal-light">
            Looking for who supports the campaign itself, not who it raises funds for?{" "}
            <Link href="/sponsors" className="font-semibold text-bronze hover:text-bronze-dark">
              See Campaign Sponsors &rarr;
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
