import { ShieldCheck } from "lucide-react";
import { getPartners } from "@/lib/data/partners";
import { getCampaign } from "@/lib/data/campaign";
import { getAllocationBreakdown } from "@/lib/data/allocation";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { PartnerCard } from "@/components/partners/partner-card";
import { CampaignAllocation } from "@/components/campaign/campaign-allocation";
import { MileTrackingNote } from "@/components/shared/mile-tracking-note";
import { CAMPAIGN_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Donate",
  description: "Support Tri For The 22 through an authorized partner donation platform.",
  canonical: `${CAMPAIGN_URL}/donate`,
});

export default async function DonatePage(props: PageProps<"/donate">) {
  const searchParams = await props.searchParams;
  const mileParam = Array.isArray(searchParams.mile) ? searchParams.mile[0] : searchParams.mile;
  const mileNumber = mileParam ? Number.parseInt(mileParam, 10) : null;
  const hasMile = mileNumber !== null && Number.isFinite(mileNumber);

  const [partners, campaign] = await Promise.all([getPartners(), getCampaign()]);
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

        {hasMile && (
          <div className="mt-6 max-w-xl">
            <MileTrackingNote mileNumber={mileNumber} />
          </div>
        )}
      </CampaignPageHero>

      <section className="py-16 sm:py-20">
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
                How Mile Credit Works
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
                  </div>
                ))}
              </div>

              <p className="max-w-2xl text-sm text-charcoal-light">
                After you give, let us know using the note field on the partner&apos;s donation
                form (or by emailing the campaign) so your gift can be verified and credited
                toward a specific mile here on the site. Mile totals update once a donation is
                confirmed with the beneficiary organization — not automatically at the moment of
                giving.
              </p>

              <p className="max-w-2xl text-sm font-medium text-charcoal-light">
                Donations are made directly through each independent nonprofit organization&apos;s
                authorized donation platform. For The 22 does not receive, process, or take
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
