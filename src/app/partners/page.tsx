import type { Metadata } from "next";
import { getPartners } from "@/lib/data/partners";
import { getMissionPartners } from "@/lib/data/mission-partners";
import { getSponsors } from "@/lib/data/sponsors";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { PartnerCard } from "@/components/partners/partner-card";
import { MissionPartnerCard } from "@/components/partners/mission-partner-card";
import { SponsorWall } from "@/components/sponsors/sponsor-wall";
import { EmptyState } from "@/components/shared/empty-state";
import { CTAButton } from "@/components/shared/cta-button";
import { CTASection } from "@/components/shared/cta-section";
import { CAMPAIGN_NAME, CAMPAIGN_URL, DONATE_LINK } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "The beneficiary organizations, mission partners, and sponsors who stand behind For The 22.",
  alternates: { canonical: `${CAMPAIGN_URL}/partners` },
};

export default async function PartnersPage() {
  const [partners, missionPartners, sponsors] = await Promise.all([
    getPartners(),
    getMissionPartners(),
    getSponsors(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            as="h1"
            title="Partners in the Mission"
            description="For The 22 is strengthened by organizations and companies that believe veterans and first responders deserve access to resources, opportunity, community, and continued support."
          />
          <p className="mt-3 max-w-2xl text-base text-charcoal-light/90">
            These partners help us connect, advocate, compete, and move the mission forward.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <CTAButton href="/partners/inquire">Become a Partner</CTAButton>
            <CTAButton href={DONATE_LINK.href} variant="secondary">
              Support the Mission
            </CTAButton>
          </div>
        </Container>
      </section>

      {/* Beneficiary Organizations */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Who It Supports"
            title="Beneficiary Organizations"
            description={`${CAMPAIGN_NAME} raises funds in support of approved 501(c)(3) organizations serving veterans, first responders, and their families. Charitable donations are made through each beneficiary organization's authorized giving platform.`}
          />
          <div className="mt-8 flex flex-col gap-6">
            {partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>

          <p className="mt-10 max-w-2xl text-sm text-charcoal-light">
            Donations are directed through each organization&apos;s authorized donation
            platform. For The 22 does not independently process charitable contributions
            unless explicitly stated.
          </p>
        </Container>
      </section>

      {/* Mission Partners */}
      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Working Alongside Us"
            title="Mission Partners"
            description="Mission Partners work alongside For The 22 to connect people with opportunities, resources, programs, and community — adaptive athletics, veteran programming, first-responder support, recovery programs, athlete referrals, training, and outreach."
          />
          <div className="mt-8">
            {missionPartners.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {missionPartners.map((partner) => (
                  <MissionPartnerCard key={partner.id} partner={partner} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Mission Partner relationships are still being formalized."
                description="We're building relationships with organizations across adaptive athletics, veteran programming, athlete referrals, and community outreach."
                cta={{ label: "Propose a Partnership", href: "/partners/inquire" }}
              />
            )}
          </div>
        </Container>
      </section>

      {/* Sponsors & Supporters */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Backing the Mission"
            title="Sponsors & Supporters"
            description={`These organizations provide products, services, equipment, financial support, or other resources that help make ${CAMPAIGN_NAME} programs and athletic campaigns possible.`}
          />
          <div className="mt-8">
            <SponsorWall sponsors={sponsors} />
          </div>
          <div className="mt-8">
            <CTAButton href="/sponsors" variant="secondary">
              View Sponsorship Levels &amp; Apply
            </CTAButton>
          </div>
        </Container>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-ink/10 bg-sand-light py-10 sm:py-12">
        <Container className="max-w-3xl">
          <p className="text-sm text-charcoal-light">
            Inclusion on this page reflects an approved relationship with For The 22. Unless
            specifically stated, participation does not imply endorsement by any employer,
            government agency, military branch, or other third party.
          </p>
          <p className="mt-3 text-sm text-charcoal-light">
            Charitable beneficiary relationships and commercial sponsorship relationships are
            separate and are identified accordingly.
          </p>
        </Container>
      </section>

      {/* Join the Mission CTA */}
      <CTASection
        eyebrow="Get Involved"
        title="Join the Mission"
        description="Whether through equipment, services, programming, financial support, or community collaboration, there are many ways to help For The 22 serve veterans and first responders."
        buttons={[
          { label: "Become a Partner", href: "/partners/inquire" },
          { label: "Sponsor an Athletic Mission", href: "/sponsors/request", variant: "secondary" },
        ]}
      />
    </>
  );
}
