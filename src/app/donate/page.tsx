import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { getPartners } from "@/lib/data/partners";
import { getCampaign } from "@/lib/data/campaign";
import { getAllocationBreakdown } from "@/lib/data/allocation";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { PartnerCard } from "@/components/partners/partner-card";
import { CampaignAllocation } from "@/components/campaign/campaign-allocation";
import { CAMPAIGN_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Donate",
  description: "Support Tri For The 22 through an authorized partner donation platform.",
  alternates: { canonical: `${CAMPAIGN_URL}/donate` },
};

export default async function DonatePage(props: PageProps<"/donate">) {
  const searchParams = await props.searchParams;
  const mileParam = Array.isArray(searchParams.mile) ? searchParams.mile[0] : searchParams.mile;
  const mileNumber = mileParam ? Number.parseInt(mileParam, 10) : null;

  const [partners, campaign] = await Promise.all([getPartners(), getCampaign()]);
  const allocationBreakdown = await getAllocationBreakdown(campaign);

  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Support the Mission"
            title="Where Would You Like Your Donation to Go?"
            description="For The 22 does not process donations directly. Choose a beneficiary organization below to give through its authorized donation platform."
          />

          {mileNumber && Number.isFinite(mileNumber) && (
            <p className="mt-6 inline-block rounded-sm border border-bronze/40 bg-bronze/10 px-4 py-2 text-sm font-medium text-ink">
              You&apos;re helping fund Mile {mileNumber}. Mention it in your donation note if the
              platform supports one, so it can be recorded against that mile.
            </p>
          )}

          <p className="mt-6 max-w-2xl text-sm text-charcoal-light">
            After you give, let us know using the note field on the partner&apos;s donation form
            (or by emailing the campaign) so your gift can be verified and credited toward a
            specific mile here on the site. Mile totals update once a donation is confirmed with
            the beneficiary organization — not automatically at the moment of giving.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Where It Goes" title="Your Donation Goes to the Mission" />

          <div className="mt-8 space-y-4">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="rounded-sm border border-ink/10 bg-off-white p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-base font-semibold uppercase tracking-wide text-ink">
                    {partner.name}
                  </p>
                  {partner.nonprofit_status_verified && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-olive/30 bg-olive/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-olive">
                      <ShieldCheck size={13} aria-hidden />
                      Verified 501(c)(3){partner.ein ? ` · EIN ${partner.ein}` : ""}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-charcoal-light">
                  Donation processed by <span className="text-ink">{partner.name}</span> —
                  through its own, separately operated donation platform
                  {partner.donation_url ? "." : " (link coming once approved)."}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-2xl text-sm font-medium text-charcoal-light">
            For The 22 does not take possession of charitable donations. Donations are directed
            through each nonprofit organization&apos;s authorized donation platform, and For The
            22 does not independently process charitable contributions unless explicitly stated.
          </p>

          {allocationBreakdown && (
            <div className="mt-6">
              <CampaignAllocation breakdown={allocationBreakdown} />
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
