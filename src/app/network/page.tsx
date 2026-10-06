import Link from "next/link";
import { Handshake, HeartHandshake, Network as NetworkIcon, Users } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { CTASection } from "@/components/shared/cta-section";
import { PartnerCard } from "@/components/partners/partner-card";
import { MissionPartnerCard } from "@/components/partners/mission-partner-card";
import { getPartners } from "@/lib/data/partners";
import { getMissionPartners } from "@/lib/data/mission-partners";
import { getMissionMetrics } from "@/lib/data/mission-metrics";
import { buildOrganizationNetwork } from "@/lib/data/organization-network";
import { CAMPAIGN_URL, ORG_SUPPORTING_LINE, SITE_NAME, SITE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "The Network",
  description: `The resource network, current beneficiaries, campaign partners, and community that make ${SITE_NAME} work — programs we connect people to, organizations campaigns fund, and the people who move the mission forward.`,
  canonical: "/network",
});

/** BreadcrumbList per credibility plan §25 — Home→page shape. */
const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: "Network", url: `${SITE_URL}/network` },
]);

export default async function NetworkPage() {
  const [beneficiaries, missionPartners, metrics] = await Promise.all([
    getPartners(),
    getMissionPartners(),
    getMissionMetrics(),
  ]);
  const organizations = buildOrganizationNetwork(beneficiaries, missionPartners);
  const organizationByName = new Map(organizations.map((organization) => [organization.name, organization]));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      {/* Hero */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading
            as="h1"
            eyebrow="The Network"
            title="A Mission Is Only as Strong as Its Network"
            description={`${SITE_NAME} is four things at once: a directory of resources, campaigns that fund organizations doing the work, the partners who back those campaigns, and the community that carries all of it forward. ${ORG_SUPPORTING_LINE}`}
          />
        </Container>
      </section>

      {/* 1 — Resource Network */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="border border-ink/10 bg-off-white p-8">
            <NetworkIcon className="h-6 w-6 text-bronze" aria-hidden="true" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-bronze">
              01 — Resource Network
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
              Programs, Services & Communities
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal-light">
              The directory is the connective tissue of {SITE_NAME} — the starting point for
              someone looking for mental health support, adaptive sport, career help, or simply a
              community that understands. Every entry is reviewed for legitimacy and relevance
              before it goes live.{" "}
              <Link href="/standards" className="font-semibold text-bronze hover:text-bronze-dark">
                How resources are reviewed &rarr;
              </Link>
            </p>
            {metrics.resources !== null && (
              <p className="mt-3 font-display text-xl font-semibold uppercase tracking-tight text-bronze">
                {metrics.resources} resources and counting
              </p>
            )}
            <CTAButton href="/resources" className="mt-6">
              Explore Resources
            </CTAButton>
          </div>
        </Container>
      </section>

      {/* 2 — Current Beneficiaries */}
      <section className="border-y border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="border border-ink/10 bg-off-white p-8">
            <HeartHandshake className="h-6 w-6 text-bronze" aria-hidden="true" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-bronze">
              02 — Current Beneficiaries
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
              Where the Money Goes
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal-light">
              Every {SITE_NAME} campaign contributes toward the same mission, and every dollar of
              that mission reaches verified nonprofit organizations serving veterans, first
              responders, and their families.
            </p>
            <ul className="mt-6 space-y-6">
              {beneficiaries.map((partner) => (
                <li key={partner.id}>
                  <PartnerCard partner={partner} />
                  {organizationByName.get(partner.name)?.relationships.includes("resource") && (
                    <Link
                      href={`/resources?q=${encodeURIComponent(partner.name)}`}
                      className="mt-2 inline-flex text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
                    >
                      Find in the Resource Directory &rarr;
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <CTAButton href={`${CAMPAIGN_URL}/beneficiaries`} external variant="secondary" className="mt-6">
              Meet the Beneficiaries
            </CTAButton>
          </div>
        </Container>
      </section>

      {/* 3 — Campaign Partners */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="border border-ink/10 bg-off-white p-8">
            <Handshake className="h-6 w-6 text-bronze" aria-hidden="true" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-bronze">
              03 — Campaign Partners
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
              The Organizations & Businesses Behind the Campaigns
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal-light">
              Campaign partners sponsor events, supply gear, and back the work directly — the
              reason a campaign can promise 100% of proceeds to its beneficiaries.
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {missionPartners.map((partner) => (
                <li key={partner.id}>
                  <MissionPartnerCard partner={partner} categoryLabel={partner.relationship_label} />
                </li>
              ))}
            </ul>
            <CTAButton href={`${CAMPAIGN_URL}/sponsors`} external variant="secondary" className="mt-6">
              See All Campaign Partners
            </CTAButton>
          </div>
        </Container>
      </section>

      {/* 4 — Community Network (no dataset behind it — describes the roles,
          links out, never invents counts or names) */}
      <section className="border-y border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="border border-ink/10 bg-off-white p-8">
            <Users className="h-6 w-6 text-bronze" aria-hidden="true" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-bronze">
              04 — Community Network
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
              The People Who Carry It Forward
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal-light">
              Behind every campaign is a community: ruckers and triathletes covering the miles,
              volunteers running events, artists and creators amplifying the message, nonprofit
              leaders pointing people toward real support, and supporters who show up in ways big
              and small.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <CTAButton href={`${CAMPAIGN_URL}/get-involved`} external>
                Join the Community
              </CTAButton>
              <CTAButton href="/contact" variant="secondary">
                Get in Touch
              </CTAButton>
            </div>
          </div>
        </Container>
      </section>

      {/* Closer */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl text-center">
          <p className="text-balance font-display text-xl font-semibold uppercase tracking-tight text-ink sm:text-2xl">
            Resources connect people. Campaigns mobilize support. Partners and community make it
            last.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-charcoal-light">
            Curious how the pieces fit together?{" "}
            <Link href="/mission" className="font-semibold text-bronze hover:text-bronze-dark">
              Read the mission
            </Link>
            ,{" "}
            <Link href="/impact" className="font-semibold text-bronze hover:text-bronze-dark">
              see the impact
            </Link>
            , or{" "}
            <Link href="/campaigns" className="font-semibold text-bronze hover:text-bronze-dark">
              see the campaigns
            </Link>
            .
          </p>
        </Container>
      </section>

      <CTASection
        title="Find Support, or Stand With Those Who Serve"
        buttons={[
          { label: "Explore Resources", href: "/resources" },
          { label: "See the Campaigns", href: "/campaigns", variant: "secondary" },
        ]}
      />
    </>
  );
}
