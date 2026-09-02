import { ShieldCheck } from "lucide-react";
import { getPartners } from "@/lib/data/partners";
import { getCampaign } from "@/lib/data/campaign";
import { getAllocationBreakdown } from "@/lib/data/allocation";
import { getPublicSupporterWall } from "@/lib/donor-tiers";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { PartnerCard } from "@/components/partners/partner-card";
import { CampaignAllocation } from "@/components/campaign/campaign-allocation";
import { GivingLevels } from "@/components/campaign/giving-levels";
import { CAMPAIGN_NAME, CAMPAIGN_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Support Tri For The 22",
  description:
    "Support Tri For The 22 through an authorized partner donation platform — funding veteran-focused nonprofit organizations.",
  canonical: `${CAMPAIGN_URL}/donate`,
});

export default async function DonatePage() {
  const [partners, campaign, supporters] = await Promise.all([
    getPartners(),
    getCampaign(),
    getPublicSupporterWall(),
  ]);
  const allocationBreakdown = await getAllocationBreakdown(campaign);

  return (
    <>
      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          title="Choose a Beneficiary"
          description="Your gift will be processed on that organization's authorized donation platform."
        />
      </CampaignPageHero>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            title="Giving Levels"
            description="Cumulative giving across both organizations, tracked by donor once a gift is verified. What each level provides is something I can offer directly — recognition, not goods or services — since the campaign never receives or processes your donation itself."
          />
          <div className="mt-8">
            <GivingLevels supporters={supporters} />
          </div>
        </Container>
      </section>

      <section className="border-t border-ink/10 py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-6">
            {partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-sand-light py-10 sm:py-12">
        <Container className="max-w-3xl">
          <details className="group rounded-sm border border-ink/10 bg-off-white p-5">
            <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-ink marker:content-none">
              <span className="inline-flex items-center gap-2">
                <span aria-hidden="true" className="transition-transform group-open:rotate-90">
                  &rarr;
                </span>
                How Donations Are Verified
              </span>
            </summary>

            <div className="mt-4 space-y-4">
              <div className="space-y-3">
                {partners.map((partner) => (
                  <div key={partner.id} className="rounded-sm border border-ink/10 bg-off-white p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
                        {partner.name}
                      </p>
                      {partner.nonprofit_status_verified && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-olive/30 bg-olive/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-olive">
                          <ShieldCheck size={13} aria-hidden />
                          Verified 501(c)(3){partner.ein ? ` · EIN ${partner.ein}` : ""}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm text-charcoal-light">
                      Donation processed by <span className="text-ink">{partner.name}</span> —
                      through its own, separately operated donation platform
                      {partner.donation_url ? "." : " (link coming once approved)."}
                    </p>
                    {partner.donation_url && partner.requires_donation_note && (
                      <p className="mt-1 text-sm text-charcoal-light">
                        Add the tracking note shown on their card so we can verify and credit
                        your gift — their platform has no way to attribute it to this campaign
                        on its own.
                      </p>
                    )}
                    {partner.donation_url && !partner.requires_donation_note && (
                      <p className="mt-1 text-sm text-charcoal-light">
                        This link goes to a fundraiser page dedicated to this campaign, so your
                        gift is already attributed — no tracking note needed.
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <p className="max-w-2xl text-sm text-charcoal-light">
                Once we can confirm your gift with the beneficiary organization, it&apos;s
                reflected in the campaign total here on the site — not automatically at the
                moment of giving. If you&apos;d rather not use a partner&apos;s note field, you
                can also let us know by emailing the campaign.
              </p>

              <p className="max-w-2xl text-sm font-medium text-charcoal-light">
                Donations are made directly through each independent nonprofit organization&apos;s
                authorized donation platform. {CAMPAIGN_NAME} does not receive, process, or take
                possession of charitable contributions and does not issue tax receipts.
              </p>

              {allocationBreakdown && <CampaignAllocation breakdown={allocationBreakdown} />}
            </div>
          </details>
        </Container>
      </section>
    </>
  );
}
