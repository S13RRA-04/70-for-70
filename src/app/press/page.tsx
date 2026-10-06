import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { RESOURCES } from "@/lib/content/resources";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { getPartners } from "@/lib/data/partners";
import { getMissionPartners } from "@/lib/data/mission-partners";
import {
  CAMPAIGN_URL,
  CONTACT_EMAIL,
  MOVEMENT_CAMPAIGNS,
  ORG_SUPPORTING_LINE,
  ORG_SUPPORTING_STATEMENT,
  ORG_TAGLINE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "Press & Media",
  description: `Core mission summary, key numbers, founder bios, campaign and beneficiary information, logos, and media contact for ${SITE_NAME}.`,
  canonical: "/press",
});

/** BreadcrumbList per credibility plan §25 — same Home→page shape as /70k. */
const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: "Press & Media", url: `${SITE_URL}/press` },
]);

/**
 * Founder bios — ~50-word and ~150-word lengths per the press-kit spec.
 * Every claim traces to source material that's already published elsewhere:
 * the /mission founder story (Navy service, 2011 deployment, 2016 surgery,
 * Mighty Oaks 2023) and MOVEMENT_CAMPAIGNS (campaign names). Keep them in
 * sync with /mission if any of those facts change.
 */
const FOUNDER_BIO_SHORT =
  "Cody Hitson is a Navy veteran, husband, and father who served seven years on active duty as a Mass Communication Specialist, including a 2011 deployment to Afghanistan as a combat journalist. He founded For The 22 to help veterans and first responders find trusted resources — and to mobilize communities behind the organizations serving them.";

const FOUNDER_BIO_LONG = [
  "Cody Hitson is a Navy veteran, husband, father, and endurance athlete who spent seven years on active duty as a Mass Communication Specialist, deploying to Afghanistan in 2011 in support of Operation Enduring Freedom as a combat journalist. After returning home, he spent years learning to function without dealing with what was underneath — a season that included major back surgery in 2016 and no clear sense of what came next. A 2023 retreat with the Mighty Oaks Warrior Program became a turning point, redirecting his recovery around faith, responsibility, and purpose.",
  "Cody founded For The 22 to make that search easier for the next person: a directory of established programs, services, and communities serving veterans, first responders, and their families — paired with campaigns that mobilize communities and raise direct support for confirmed beneficiary organizations. He was featured as the VA's #VeteranOfTheDay.",
];

/** Real earned coverage only — add entries here only once the piece is live and verifiable. */
const MEDIA_COVERAGE = [
  {
    outlet: "U.S. Department of Veterans Affairs",
    title: "#VeteranOfTheDay — Navy Veteran Cody Hitson",
    url: "https://news.va.gov/91792/veteranoftheday-navy-veteran-cody-hitson/",
  },
] as const;

export default async function PressPage() {
  const [fundraisingStats, beneficiaries, missionPartners] = await Promise.all([
    getFundraisingImpactStats(),
    getPartners(),
    getMissionPartners(),
  ]);
  const currentCampaigns = MOVEMENT_CAMPAIGNS.filter((c) => c.status === "current");

  const keyNumbers = [
    { label: "Resources Listed", value: String(RESOURCES.length) },
    { label: "Current Campaigns", value: String(currentCampaigns.length) },
    { label: "Beneficiaries", value: String(beneficiaries.length) },
    { label: "Campaign Partners", value: String(missionPartners.length) },
    { label: "Raised to Date", value: `$${fundraisingStats.amountRaised.toLocaleString()}` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading as="h1" eyebrow="Press & Media" title="Media Resources" />
        </Container>
      </section>

      {/* Mission at a Glance */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-14">
          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Mission at a Glance
            </h2>
            <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-bronze-text">
              {ORG_TAGLINE}
            </p>
            <p className="mt-3 text-base leading-relaxed text-charcoal-light">
              {ORG_SUPPORTING_STATEMENT}
            </p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-charcoal-light">
              {ORG_SUPPORTING_LINE}
            </p>
          </div>

          {/* Key Numbers — every value from the same shared getters the rest
              of the site reads, never hand-entered. */}
          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Key Numbers
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
              {keyNumbers.map((stat) => (
                <div key={stat.label} className="rounded-sm border border-ink/10 bg-sand-light/60 p-4 text-center">
                  <dd className="font-display text-2xl font-semibold text-ink">{stat.value}</dd>
                  <dt className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-charcoal-light">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          {/* Founder Bio */}
          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Founder Bio
            </h2>
            <p className="mt-1 text-sm text-charcoal-light">Cody Hitson — Founder, For The 22</p>
            <div className="mt-4 space-y-4">
              <div className="border-l-2 border-bronze/50 pl-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
                  Short Bio (≈50 words)
                </p>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-light">
                  {FOUNDER_BIO_SHORT}
                </p>
              </div>
              <div className="border-l-2 border-bronze/50 pl-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
                  Full Bio (≈150 words)
                </p>
                {FOUNDER_BIO_LONG.map((paragraph) => (
                  <p key={paragraph} className="mt-2 text-sm leading-relaxed text-charcoal-light">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <p className="mt-4 text-sm text-charcoal-light">
              The full story is published at{" "}
              <Link href="/mission#founders-story" className="text-bronze hover:underline">
                forthe22.org/mission
              </Link>
              .
            </p>
          </div>

          {/* Current Campaigns */}
          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Current Campaigns
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {currentCampaigns.map((campaign) => {
                const isSameSite = "url" in campaign && campaign.url.startsWith("/");
                const statusLine = [
                  "statusLabel" in campaign ? campaign.statusLabel : "Active",
                  campaign.discipline,
                  "statusNote" in campaign ? campaign.statusNote : null,
                ]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <li key={campaign.name} className="border border-ink/10 bg-off-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
                      {statusLine}
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold uppercase tracking-tight text-ink">
                      {campaign.name}
                    </p>
                    {"description" in campaign && (
                      <p className="mt-2 text-sm leading-relaxed text-charcoal-light">
                        {campaign.description}
                      </p>
                    )}
                    {"url" in campaign &&
                      (isSameSite ? (
                        <Link
                          href={campaign.url}
                          className="mt-3 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
                        >
                          {campaign.name} &rarr;
                        </Link>
                      ) : (
                        <a
                          href={campaign.url}
                          className="mt-3 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
                        >
                          {campaign.name} &rarr;
                        </a>
                      ))}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Current Beneficiaries */}
          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Current Beneficiaries
            </h2>
            <p className="mt-3 text-base leading-relaxed text-charcoal-light">
              Every {SITE_NAME} campaign contributes toward a shared goal supporting verified
              nonprofit organizations serving veterans, first responders, and their families.
              Current beneficiaries:
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {beneficiaries.map((partner) => (
                <li
                  key={partner.id}
                  className="rounded-full border border-ink/15 bg-sand-light/60 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-ink"
                >
                  {partner.name}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-charcoal-light">
              Profiles at{" "}
              <a href={`${CAMPAIGN_URL}/beneficiaries`} className="text-bronze hover:underline">
                tri.forthe22.org/beneficiaries
              </a>
              .
            </p>
          </div>

          {/* Media Coverage — real earned coverage only; hidden entirely
              rather than showing an empty state or fabricated logos. */}
          {MEDIA_COVERAGE.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
                Media Coverage
              </h2>
              <ul className="mt-4 space-y-3">
                {MEDIA_COVERAGE.map((item) => (
                  <li key={item.url} className="border-l-2 border-bronze/50 pl-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                      {item.outlet}
                    </p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex text-sm font-semibold text-bronze hover:underline"
                    >
                      {item.title} &rarr;
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Project Summary
            </h2>
            <p className="mt-3 text-base leading-relaxed text-charcoal-light">
              For The 22 is an independent, off-duty resource initiative that helps veterans and
              first responders find established programs, services, and communities supporting
              mental, physical, emotional, and spiritual health.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Logo Downloads
            </h2>
            <p className="mt-1 text-sm text-charcoal-light">
              The compact icon/mark is available below, shown on both light and dark backgrounds.
              A horizontal lockup hasn&apos;t been produced yet.
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              <div className="inline-flex flex-col items-start gap-3 rounded-sm border border-ink/10 bg-off-white p-6">
                <Image src="/logo.png" alt="For The 22 logo mark" width={140} height={140} />
                <a
                  href="/logo.png"
                  download
                  className="inline-flex rounded-sm border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
                >
                  Download (Light Background)
                </a>
              </div>
              <div className="inline-flex flex-col items-start gap-3 rounded-sm border border-ink/10 bg-ink p-6">
                <Image
                  src="/logo-white.png"
                  alt="For The 22 logo mark"
                  width={140}
                  height={140}
                />
                <a
                  href="/logo-white.png"
                  download
                  className="inline-flex rounded-sm border border-off-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-off-white hover:bg-off-white/10"
                >
                  Download (Dark Background)
                </a>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Media Contact
            </h2>
            <p className="mt-3 text-base leading-relaxed text-charcoal-light">
              {CONTACT_EMAIL ? (
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-bronze hover:underline">
                  {CONTACT_EMAIL}
                </a>
              ) : (
                <>
                  For media inquiries, use the{" "}
                  <Link href="/contact" className="text-bronze hover:underline">
                    contact form
                  </Link>
                  .
                </>
              )}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Campaign Media Kit
            </h2>
            <p className="mt-3 text-base leading-relaxed text-charcoal-light">
              For campaign statistics, athlete bio, beneficiary information, and the campaign
              logo, see the{" "}
              <a href={`${CAMPAIGN_URL}/press`} className="text-bronze hover:underline">
                Tri For The 22 media kit
              </a>
              .
            </p>
            <CTAButton href="/network" variant="secondary" className="mt-5">
              Explore the Network
            </CTAButton>
          </div>
        </Container>
      </section>
    </>
  );
}
