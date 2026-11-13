import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { PillarNextSteps } from "@/components/shared/pillar-next-steps";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { InstitutionalRecognition } from "@/components/shared/institutional-recognition";
import { MissionProgress } from "@/components/campaign/mission-progress";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { getAllocationBreakdown } from "@/lib/data/allocation";
import { getCampaign } from "@/lib/data/campaign";
import { getPartners } from "@/lib/data/partners";
import { HOW_THIS_BEGAN } from "@/lib/content/the-story";
import { getRecognitionsForCampaign } from "@/lib/content/recognitions";
import {
  CAMPAIGN_NAME,
  DONATE_LINK,
  MISSION_NAME,
  RACE_INFO,
  RACE_LEGS,
  RACE_TOTAL_DISTANCE,
  SITE_URL,
  TRI_BIKE_BUILD_PATH,
  TRI_JOURNAL_PATH,
  TRI_PAGE_PATH,
  TRI_PAGE_URL,
} from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

/**
 * Impact.com publisher/affiliate-partnership domain-ownership proof. It used
 * to sit on tri.forthe22.org's home page; that host now redirects here.
 */
const IMPACT_SITE_VERIFICATION_ID = "e5ccd9f5-f773-4c29-b6ce-4e1fb9b6b356";

export const metadata: Metadata = {
  ...pageMetadata({
    title: CAMPAIGN_NAME,
    description: `Founder Cody Hitson races IRONMAN 70.3 Chattanooga — the 70.3 miles behind ${MISSION_NAME} — for Mighty Oaks Foundation and Veterans and Athletes United.`,
    canonical: TRI_PAGE_PATH,
    image: "/og-campaign.png",
  }),
  verification: { other: { "impact-site-verification": IMPACT_SITE_VERIFICATION_ID } },
};

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: "Campaigns", url: `${SITE_URL}/campaigns` },
  { name: CAMPAIGN_NAME, url: TRI_PAGE_URL },
]);

const raceDay = RACE_INFO.raceDate
  ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" }).format(
      new Date(RACE_INFO.raceDate),
    )
  : null;

const RACE_FACTS = [
  { label: "Swim", value: `${RACE_LEGS.swim} mi` },
  { label: "Bike", value: `${RACE_LEGS.bike} mi` },
  { label: "Run", value: `${RACE_LEGS.run} mi` },
  { label: "Total", value: `${RACE_TOTAL_DISTANCE} mi` },
];

/**
 * Birmingham Bulls Military Night (announced in src/lib/content/campaign-journal.ts).
 * The section hides itself once the night is over. Set ticketUrl to the
 * fundraiser ticket link to show the button — leave it null until there's a
 * real link, never a placeholder.
 */
const MILITARY_NIGHT = {
  endsAt: "2026-11-20T23:59:00-06:00",
  dateLabel: "Friday, November 20, 2026 · 7:00 PM CT",
  venue: "Pelham Civic Complex",
  ticketUrl: null as string | null,
};

function isMilitaryNightUpcoming(): boolean {
  return Date.now() < new Date(MILITARY_NIGHT.endsAt).getTime();
}

/**
 * Tri For The 22 — one Mobilization campaign page. This replaces the whole
 * former tri.forthe22.org site; every old Tri URL redirects here, to one
 * of its two sub-pages (the training journal and the bike build), or to its
 * org equivalent (see triDestination in src/middleware.ts). Giving lives on
 * /donate, beneficiaries on /impact, partners on /network — this page links
 * to them rather than repeating them.
 */
export default async function TriPage() {
  const [stats, campaign, beneficiaries] = await Promise.all([
    getFundraisingImpactStats(),
    getCampaign(),
    getPartners(),
  ]);
  const breakdown = await getAllocationBreakdown(campaign);
  const recognitions = getRecognitionsForCampaign("tri");
  const militaryNightUpcoming = isMilitaryNightUpcoming();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <PageHero
        pillar="mobilization"
        eyebrow="Campaign"
        title={CAMPAIGN_NAME}
        description={`One combat veteran, one IRONMAN 70.3, and the 70.3 miles that set the number behind ${MISSION_NAME}.`}
        aside={
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src="/journal/building-the-bike/bike-complete-full-side.jpeg"
              alt="The Tri For The 22 race bike, fully built"
              fill
              priority
              sizes="(min-width: 1024px) 34vw, 100vw"
              className="object-cover"
            />
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <CTAButton href={DONATE_LINK.href} size="lg" magnetic>
            Donate
          </CTAButton>
          <CTAButton href="/crisis" accent="emergency" size="lg">
            Get Help Now
          </CTAButton>
        </div>
      </PageHero>

      {militaryNightUpcoming && (
        <section id="military-night" className="scroll-mt-28 border-b border-line bg-jet py-14 text-white sm:py-16">
          <Container>
            <RevealOnScroll className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <SectionHeading eyebrow="Event · Mission Partner" title="Military Night with the Birmingham Bulls" tone="dark" />
                <p className="mt-4 text-lg leading-relaxed text-mist">
                  {MILITARY_NIGHT.dateLabel}
                  <br />
                  {MILITARY_NIGHT.venue}
                </p>
                <p className="mt-4 text-base leading-relaxed text-mist">
                  $4 from every ticket bought through the fundraiser link goes to Mighty Oaks Foundation.
                </p>
                {MILITARY_NIGHT.ticketUrl && (
                  <CTAButton href={MILITARY_NIGHT.ticketUrl} external newTab tone="dark" className="mt-6">
                    Get Tickets
                  </CTAButton>
                )}
              </div>
              <div className="relative aspect-square overflow-hidden rounded-xl lg:col-span-5">
                <Image
                  src="/campaigns/tri/birmingham-bulls-military-night.webp"
                  alt="Military Night with the Birmingham Bulls: Friday, November 20, 2026, 7:00 PM CT at Pelham Civic Complex. $4 from each ticket bought through the fundraiser link supports the mission."
                  fill
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  className="object-cover"
                />
              </div>
            </RevealOnScroll>
          </Container>
        </section>
      )}

      {/* The race */}
      <section className="border-b border-line py-14 sm:py-16">
        <Container>
          <RevealOnScroll className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="The race" title="IRONMAN 70.3 Chattanooga" />
              <p className="mt-4 text-base leading-relaxed text-copy">
                {[raceDay, RACE_INFO.raceLocation].filter(Boolean).join(" · ")}
                {RACE_INFO.athleteGoalTime && (
                  <>
                    <br />
                    Goal: {RACE_INFO.athleteGoalTime}
                  </>
                )}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:col-span-7">
              {RACE_FACTS.map((fact) => (
                <div key={fact.label} className="rounded-xl border border-line bg-white p-5 text-center">
                  <dd className="font-display text-3xl text-navy sm:text-4xl">{fact.value}</dd>
                  <dt className="label-caps mt-1 text-xs text-steel">{fact.label}</dt>
                </div>
              ))}
            </dl>
          </RevealOnScroll>
        </Container>
      </section>

      {/* Follow the build — the campaign's two running stories. */}
      <section className="border-b border-line py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow="Follow along" title="Follow the build" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link href={TRI_JOURNAL_PATH} className="lift group flex flex-col gap-2 rounded-xl border border-line bg-white p-7">
              <span className="label-caps text-xs text-olive">Training journal</span>
              <span className="font-display text-3xl uppercase leading-none text-navy">The road to Chattanooga</span>
              <span className="text-base text-copy">Training, setbacks, milestones, and race-prep updates.</span>
              <span className="mt-2 font-bold text-navy group-hover:text-help group-hover:underline">Read the journal →</span>
            </Link>
            <Link href={TRI_BIKE_BUILD_PATH} className="lift group flex flex-col gap-2 rounded-xl border border-line bg-white p-7">
              <span className="label-caps text-xs text-olive">Bike build</span>
              <span className="font-display text-3xl uppercase leading-none text-navy">Built piece by piece</span>
              <span className="text-base text-copy">The race bike, from bare frame to first ride, and the partners behind each part.</span>
              <span className="mt-2 font-bold text-navy group-hover:text-help group-hover:underline">See the build →</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* Why */}
      <section className="border-b border-line py-14 sm:py-16">
        <Container className="max-w-3xl">
          <RevealOnScroll>
            <SectionHeading eyebrow="Why" title="Why a triathlon" />
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-copy">
              {HOW_THIS_BEGAN.body.slice(0, 2).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link href="/about#my-story" className="mt-5 inline-flex font-bold text-navy hover:text-help hover:underline">
              Read Cody&apos;s story →
            </Link>
            {recognitions.length > 0 && (
              <div className="mt-10 grid gap-4">
                {recognitions.map((recognition) => (
                  <InstitutionalRecognition key={recognition.id} recognition={recognition} variant="listing" headingLevel="h3" />
                ))}
              </div>
            )}
          </RevealOnScroll>
        </Container>
      </section>

      {/* Where it goes */}
      <section className="bg-paper py-14 sm:py-16">
        <Container>
          <RevealOnScroll className="max-w-3xl">
            <SectionHeading eyebrow="03 · Impact" title="Where every mile goes" />
            <p className="mt-4 text-base leading-relaxed text-copy">
              {CAMPAIGN_NAME} raises money for {beneficiaries.map((b) => b.name).join(" and ") || "verified nonprofit organizations"}{" "}
              — counted toward {MISSION_NAME}, the shared goal every For The 22 campaign works toward. Gifts go
              straight to each organization through its own donation platform.
            </p>
            <div className="mt-6">
              <MissionProgress totalRaised={stats.amountRaised} goal={stats.fundraisingGoal} breakdown={breakdown} />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <CTAButton href={DONATE_LINK.href}>Donate</CTAButton>
              <CTAButton href="/impact#beneficiaries" variant="secondary">
                Who we fund
              </CTAButton>
              <Link href="/network#partners" className="font-bold text-navy hover:text-help hover:underline">
                Partners behind the race →
              </Link>
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      <PillarNextSteps current="mobilization" />
    </>
  );
}
