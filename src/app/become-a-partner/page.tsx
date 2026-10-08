import { getMissionPartners, isCampaignPartner } from "@/lib/data/mission-partners";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGrid } from "@/components/shared/reveal-on-scroll";
import { CTAButton } from "@/components/shared/cta-button";
import { SponsorshipProgression } from "@/components/sponsors/sponsorship-progression";
import { DonateVsPartner } from "@/components/sponsors/donate-vs-partner";
import { CurrentGearNeeds } from "@/components/sponsors/current-gear-needs";
import { CAMPAIGN_NAME, CAMPAIGN_URL, CUSTOM_PARTNERSHIP_CATEGORIES, SPONSOR_VALUE_PROPS } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, CAMPAIGN_HOME_CRUMB, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "Become a Partner",
  description:
    "Sponsorship and in-kind partnership opportunities for Tri For The 22 — why partner, recognition tiers, and current campaign needs.",
  canonical: `${CAMPAIGN_URL}/become-a-partner`,
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  CAMPAIGN_HOME_CRUMB,
  { name: "Become a Partner", url: `${CAMPAIGN_URL}/become-a-partner` },
]);

/**
 * The prospective-sponsor pitch, split out of /sponsors so confirmed
 * partners aren't sent through sales material to find their own listing
 * (see that page's doc comment). Every section here already existed —
 * SponsorshipProgression, DonateVsPartner, and CurrentGearNeeds previously
 * rendered on /sponsors — and SPONSOR_VALUE_PROPS / CUSTOM_PARTNERSHIP_CATEGORIES
 * (src/lib/constants.ts) were already written for exactly this page but had
 * no consumer. Nothing here is new copy, just a new home for it.
 */
export default async function BecomeAPartnerPage() {
  const missionPartners = await getMissionPartners();
  const generalPartners = missionPartners.filter(isCampaignPartner).filter((p) => p.associated_campaigns?.includes("tri"));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          eyebrow="Support the Campaign"
          title="Become a Tri For the 22 Partner"
          description={`${CAMPAIGN_NAME} is being built with the help of businesses and organizations providing equipment, services, expertise, and financial support. Partnership opportunities recognize the organizations helping get the campaign to the starting line while keeping fundraising for the beneficiary organizations separate.`}
        />
      </CampaignPageHero>

      {/* Why partner — SPONSOR_VALUE_PROPS, previously written but never rendered anywhere. */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Why Partner" title="What Your Support Makes Possible" />
          <RevealGrid>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SPONSOR_VALUE_PROPS.map((prop) => (
                <div key={prop.id} className="rounded-sm border border-ink/10 bg-off-white p-6">
                  <h3 className="font-display text-base font-bold uppercase tracking-wide text-ink">{prop.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-light">{prop.body}</p>
                </div>
              ))}
            </div>
          </RevealGrid>
        </Container>
      </section>

      {/* Partnership levels — the recruitment ladder, moved from /sponsors. */}
      <section className="border-t border-ink/10 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Partnership Levels" title="Where Your Support Lands" align="center" />
          <div className="mt-10">
            <SponsorshipProgression />
          </div>

          <div className="mx-auto mt-10 max-w-3xl space-y-3 text-sm leading-relaxed text-charcoal-light">
            <p>
              Support doesn&apos;t have to come in the form of a check. {CAMPAIGN_NAME} recognizes qualifying
              contributions of equipment, products, printing, professional services, and other campaign needs
              toward partnership levels based on their fair-market value.
            </p>
            <p>Partnership levels may reflect the cumulative value of qualifying support provided during the campaign.</p>
          </div>

          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
            {CUSTOM_PARTNERSHIP_CATEGORIES.map((category) => (
              <span
                key={category}
                className="rounded-full border border-ink/15 bg-sand-light px-3 py-1 text-xs font-semibold uppercase tracking-wide text-charcoal"
              >
                {category}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Current Gear & Support Needs — moved from /sponsors. */}
      <section className="border-t border-ink/10 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Current Campaign Needs"
            title="Want to Help in a Specific Way?"
            description="These are the equipment, services, and resources still needed on the road to Chattanooga."
          />
          <div className="mt-8">
            <CurrentGearNeeds partners={generalPartners} />
          </div>
        </Container>
      </section>

      {/* Donate vs. Partner — moved from /sponsors; kept explicit. */}
      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-4xl">
          <DonateVsPartner />
        </Container>
      </section>

      {/* Final CTA */}
      <section className="border-t border-ink/10 bg-ink py-16 text-center sm:py-20">
        <Container className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">Let&apos;s Talk</p>
          <p className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-off-white sm:text-4xl">
            Ready to Partner?
          </p>
          <p className="mt-3 text-base text-off-white/80">
            Have equipment, services, expertise, or resources that can help move {CAMPAIGN_NAME} toward
            Chattanooga? Let&apos;s talk.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CTAButton href="/contact?item=Campaign%20Partnership" tone="dark" magnetic>
              Contact the Campaign
            </CTAButton>
            <CTAButton href="/sponsors" variant="secondary" tone="dark">
              See Current Partners
            </CTAButton>
          </div>
        </Container>
      </section>
    </>
  );
}
