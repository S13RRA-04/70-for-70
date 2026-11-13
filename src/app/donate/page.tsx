import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { getPartners } from "@/lib/data/partners";
import { getCampaign } from "@/lib/data/campaign";
import { getAllocationBreakdown } from "@/lib/data/allocation";
import { getPublicSupporterWall } from "@/lib/donor-tiers";
import { getMilesFundedMetric } from "@/lib/miles-funded";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { PillarNextSteps } from "@/components/shared/pillar-next-steps";
import { CTAButton } from "@/components/shared/cta-button";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGrid, RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { PartnerCard } from "@/components/partners/partner-card";
import { MissionProgress } from "@/components/campaign/mission-progress";
import { CampaignAllocation } from "@/components/campaign/campaign-allocation";
import { GivingLevels } from "@/components/campaign/giving-levels";
import { DONATE_URL, MISSION_NAME, SITE_NAME, SITE_URL } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "Donate",
  description: `Give directly to Mighty Oaks Foundation and Veterans and Athletes United — the organizations ${MISSION_NAME} funds — through each one's own donation platform.`,
  canonical: "/donate",
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: "Donate", url: DONATE_URL },
]);

/**
 * The org's one donate page (Impact pillar) — every Donate CTA on every host
 * points here (DONATE_LINK / DONATE_URL). Formerly Tri For The 22's /donate;
 * gifts still go straight to each beneficiary's own platform.
 */
export default async function DonatePage() {
  const [partners, campaign, supporters] = await Promise.all([
    getPartners(),
    getCampaign(),
    getPublicSupporterWall(),
  ]);
  const allocationBreakdown = await getAllocationBreakdown(campaign);
  const miles = getMilesFundedMetric(campaign.amount_raised, campaign.fundraising_goal);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <PageHero
        pillar="impact"
        eyebrow="03 · Impact · Donate"
        title="Fund the mission"
        description={`Every gift goes straight to the organizations doing the work. ${SITE_NAME} never handles the money — you give through each nonprofit's own platform, and we count it toward ${MISSION_NAME}.`}
        aside={
          <div className="rounded-xl border border-line bg-white p-6">
            <MissionProgress
              totalRaised={campaign.amount_raised}
              goal={campaign.fundraising_goal}
              breakdown={allocationBreakdown}
            />
            <p className="label-caps mt-4 text-xs text-impact">
              {formatNumber(miles.milesFunded, 2)} of {miles.totalDistance} miles funded
            </p>
          </div>
        }
      >
        <p className="text-sm text-steel">
          Looking for support instead?{" "}
          <Link href="/crisis" className="font-bold text-help hover:underline">
            Get help now
          </Link>{" "}
          or{" "}
          <Link href="/resources" className="font-bold text-help hover:underline">
            find resources
          </Link>
          .
        </p>
      </PageHero>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Your Gift" title="Choose Where Your Gift Goes" />
          <RevealGrid>
            <div className="mt-8 flex flex-col gap-6">
              {partners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </RevealGrid>
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            title="Giving Levels"
            description="Cumulative giving across both organizations, tracked by donor once a gift is verified. What each level provides is something I can offer directly — recognition, not goods or services — since the campaign never receives or processes your donation itself."
          />
          <RevealOnScroll className="mt-8">
            <GivingLevels supporters={supporters} />
          </RevealOnScroll>
        </Container>
      </section>

      <section className="border-t border-ink/10 py-10 sm:py-12">
        <Container className="max-w-3xl">
          <details className="group rounded-xl border border-line bg-white p-5">
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
                  <div key={partner.id} className="rounded-xl border border-line bg-white p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-base uppercase text-ink">
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
                authorized donation platform. {SITE_NAME} does not receive, process, or take
                possession of charitable contributions and does not issue tax receipts.
              </p>

              {allocationBreakdown && <CampaignAllocation breakdown={allocationBreakdown} />}
            </div>
          </details>
          <div className="mt-6 flex flex-wrap gap-3">
            <CTAButton href="/impact#beneficiaries" variant="secondary">
              Meet the organizations
            </CTAButton>
            <CTAButton href="/transparency" variant="ghost">
              How the money moves →
            </CTAButton>
          </div>
        </Container>
      </section>

      <PillarNextSteps current="impact" />
    </>
  );
}
