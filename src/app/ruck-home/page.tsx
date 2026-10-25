import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getPartners } from "@/lib/data/partners";
import { getMissionPartners } from "@/lib/data/mission-partners";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGrid, RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { EmptyState } from "@/components/shared/empty-state";
import { PartnerSupportDisclaimer } from "@/components/partners/partner-support-disclaimer";
import { MissionProgress } from "@/components/campaign/mission-progress";
import { BeneficiaryCard } from "@/components/ruck/beneficiary-card";
import { MissionAccomplishedStamp } from "@/components/ruck/mission-accomplished-stamp";
import { MissionTabs } from "@/components/ruck/mission-tabs";
import {
  COMPLETED_RUCK_MISSIONS,
  UPCOMING_RUCK_MISSIONS,
  type RuckMission,
} from "@/lib/content/ruck-missions";
import {
  CAMPAIGNS,
  MISSION_NAME,
  ORG_HOME_LINK,
  RUCK_DONATION_TRACKING_CODE,
  RUCK_EVENT_INFO,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { formatCurrency } from "@/lib/utils";

const RUCK = CAMPAIGNS.ruck;

export const metadata = pageMetadata({
  // Root layout's title template already appends " | Ruck For The 22" on
  // this host (see generateMetadata in src/app/layout.tsx).
  title: RUCK.tagline,
  description: RUCK.description,
  canonical: `${RUCK.url}/`,
});

function missionHref(mission: RuckMission) {
  return `/missions/${mission.slug}`;
}

/** What a completed mission's page holds — shown as chips on its card. */
function missionHighlights(mission: RuckMission) {
  const photos = mission.journal.filter((entry) => !entry.video).length;
  const videos = mission.journal.length - photos;
  return [
    mission.mediaCoverage.length > 0 && `Media coverage · ${mission.mediaCoverage.map((c) => c.outlet).join(", ")}`,
    mission.amountRaised !== null && `${formatCurrency(mission.amountRaised)} raised`,
    mission.journal.length > 0 &&
      `Journal · ${photos} photo${photos === 1 ? "" : "s"}${videos ? ` · ${videos} video${videos === 1 ? "" : "s"}` : ""}`,
  ].filter((item): item is string => Boolean(item));
}

function CompletedMissionCard({ mission }: { mission: RuckMission }) {
  return (
    <a
      href={missionHref(mission)}
      className="group grid overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-md sm:grid-cols-[0.9fr_1.1fr]"
    >
      <div className="relative aspect-[4/3] bg-ink sm:aspect-auto sm:min-h-72">
        {mission.cover && (
          <Image
            src={mission.cover.src}
            alt={mission.cover.alt}
            fill
            sizes="(min-width: 640px) 45vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-col p-6 sm:p-8">
        <MissionAccomplishedStamp date={mission.dateDisplay} className="self-start" />
        <h3 className="mt-5 font-display text-3xl uppercase text-ink group-hover:text-navy">{mission.name}</h3>
        <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.16em] text-olive">
          {mission.distanceMiles} Miles · {mission.location}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-charcoal-light">{mission.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {missionHighlights(mission).map((item) => (
            <li key={item} className="rounded-full bg-sand-light px-3 py-1 text-xs font-semibold text-charcoal">
              {item}
            </li>
          ))}
        </ul>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-bronze-text group-hover:text-bronze-dark">
          View Mission
          <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}

function UpcomingMissionCard({ mission }: { mission: RuckMission }) {
  return (
    <div className="rounded-xl border border-line bg-white p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-bronze">Next Mission</p>
      <h3 className="mt-2 font-display text-3xl uppercase text-ink">{mission.name}</h3>
      <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.16em] text-olive">
        {mission.dateDisplay} · {mission.distanceMiles} Miles · {mission.location}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-charcoal-light">{mission.summary}</p>
    </div>
  );
}

/**
 * Ruck For The 22's home on ruck.forthe22.org — rendered at "/" via a
 * transparent middleware rewrite (see src/middleware.ts). Missions are data
 * (RUCK_MISSIONS in src/lib/content/ruck-missions.ts): this page lists them
 * on Completed / Next tabs, and each completed mission has its own page at
 * /missions/<slug> (src/app/ruck-missions/[slug]) with its media coverage,
 * amount raised, and participation journal. Any other path on this host
 * redirects back here (see applyRuckGuard in src/middleware.ts).
 */
export default async function RuckHomePage() {
  const [allPartners, missionPartners, fundraisingStats] = await Promise.all([
    getPartners(),
    getMissionPartners(),
    getFundraisingImpactStats(),
  ]);
  const campaignBeneficiaries = allPartners.filter((p) =>
    (RUCK_EVENT_INFO.beneficiaries as readonly string[]).includes(p.name),
  );
  const campaignPartners = missionPartners.filter((p) => p.associated_campaigns?.includes("ruck"));
  const goruckPartner = campaignPartners.find((p) => p.name === "GORUCK");
  const latestMission = COMPLETED_RUCK_MISSIONS[0];
  const milesRucked = COMPLETED_RUCK_MISSIONS.reduce((sum, m) => sum + m.distanceMiles, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-off-white">
        <Image
          src="/topo-map.png"
          alt=""
          fill
          priority
          aria-hidden="true"
          className="object-cover opacity-[0.08]"
        />
        <Container className="relative grid gap-10 py-14 sm:py-20 lg:min-h-[70vh] lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
          <div>
            <a
              href={ORG_HOME_LINK.href}
              className="text-xs font-bold uppercase tracking-[0.2em] text-bronze-light hover:underline"
            >
              {SITE_NAME} Presents
            </a>
            <h1 className="mt-3 text-balance font-display text-hero uppercase leading-[0.95]">
              {RUCK.name}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-off-white/75">{RUCK.description}</p>

            <div className="mt-7 grid max-w-md grid-cols-2 gap-px bg-off-white/15">
              <div className="bg-ink/90 p-5">
                <p className="font-display text-6xl leading-none text-sand">{COMPLETED_RUCK_MISSIONS.length}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-off-white/65">
                  Mission{COMPLETED_RUCK_MISSIONS.length === 1 ? "" : "s"} Completed
                </p>
              </div>
              <div className="bg-ink/90 p-5">
                <p className="font-display text-6xl leading-none text-sand">{milesRucked}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-off-white/65">Miles Rucked</p>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href="#completed"
                className="inline-flex items-center gap-1.5 rounded-sm bg-bronze px-8 py-4 text-base font-semibold uppercase tracking-wide text-ink shadow-sm transition-colors hover:bg-bronze-light"
              >
                View Missions
              </a>
              <a
                href="#beneficiaries"
                className="rounded-sm border border-off-white/40 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-off-white/10"
              >
                Donate
              </a>
            </div>
          </div>

          {latestMission && (
            <a
              href={missionHref(latestMission)}
              className="group block border-l-4 border-olive bg-off-white/5 p-7 backdrop-blur-sm transition-colors hover:bg-off-white/10 sm:p-9"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sand">Latest Mission</p>
              <p className="mt-2 font-display text-4xl uppercase leading-tight text-off-white">{latestMission.name}</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-sand">
                {latestMission.dateDisplay} · {latestMission.distanceMiles} Miles
              </p>
              <MissionAccomplishedStamp tone="dark" className="mt-6" />
              <span className="mt-6 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-off-white/80 group-hover:text-off-white">
                Coverage, Journal &amp; More
                <ArrowRight size={15} aria-hidden />
              </span>
            </a>
          )}
        </Container>
      </section>

      {/* Why 22 */}
      <section className="relative overflow-hidden border-b border-off-white/10 bg-ink py-16 text-off-white sm:py-24">
        <Image src="/topo-map.png" alt="" fill aria-hidden="true" className="object-cover opacity-[0.06]" />
        <RevealOnScroll as="div" className="relative">
        <Container className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <p aria-hidden="true" className="font-display text-[10rem] leading-none text-olive sm:text-[14rem]">22</p>
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-sand">The Cause</p><h2 className="mt-2 font-display text-4xl uppercase">Why 22?</h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-off-white/75">
            22 has become a widely recognized symbol of veteran suicide awareness. It&apos;s historically
            significant, but it isn&apos;t the current national number — the VA&apos;s most recent data (2023)
            puts the daily average at 17.5 Veterans lost to suicide, and law enforcement, fire, EMS,
            dispatch, and corrections face a version of the same crisis with far less complete
            reporting. Each mission turns that awareness into a physical act: rucking, walking, or hiking
            with those numbers in mind, alongside family, friends, and community.
          </p>
          </div>
        </Container>
        </RevealOnScroll>
      </section>

      {/* Missions — Completed / Next tabs */}
      <section id="missions" className="relative scroll-mt-28 border-b border-ink/10 py-16 sm:py-20">
        {/* Hash targets for header links and shared URLs — MissionTabs reads the same hash to pick a tab. */}
        <span id="completed" className="absolute top-0 scroll-mt-28" aria-hidden="true" />
        <span id="next" className="absolute top-0 scroll-mt-28" aria-hidden="true" />
        <Container>
          <SectionHeading
            eyebrow="Missions"
            title="Ruck Missions"
            description="Each completed mission has its own page with media coverage, what For The 22 raised, and Cody's journal from the day."
          />
          <div className="mt-8">
            <MissionTabs
              counts={{ completed: COMPLETED_RUCK_MISSIONS.length, next: UPCOMING_RUCK_MISSIONS.length }}
              completed={
                COMPLETED_RUCK_MISSIONS.length > 0 ? (
                  <div className="grid gap-6">
                    {COMPLETED_RUCK_MISSIONS.map((mission) => (
                      <CompletedMissionCard key={mission.slug} mission={mission} />
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No completed missions yet" />
                )
              }
              next={
                UPCOMING_RUCK_MISSIONS.length > 0 ? (
                  <div className="grid gap-6 lg:grid-cols-2">
                    {UPCOMING_RUCK_MISSIONS.map((mission) => (
                      <UpcomingMissionCard key={mission.slug} mission={mission} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Next mission coming soon"
                    description={`The next ${RUCK.name} mission will be announced here.`}
                  />
                )
              }
            />
          </div>
        </Container>
      </section>

      {/* Campaign partners — e.g. GORUCK supporting the campaign with gear. */}
      {campaignPartners.length > 0 && (
        <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
          <Container>
            <RevealOnScroll>
            <SectionHeading eyebrow="With Thanks To" title="Campaign Partners" />
            <PartnerSupportDisclaimer className="mt-4" />
            <div className="mt-8 flex flex-wrap items-center gap-8">
              {campaignPartners.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.website_url ?? undefined}
                  target={partner.website_url ? "_blank" : undefined}
                  rel={partner.website_url ? "noopener noreferrer" : undefined}
                  className="group"
                >
                  <PartnerLogo
                    name={partner.name}
                    logoUrl={partner.logo_url}
                    logoLightUrl={partner.logo_light_url}
                    logoDarkUrl={partner.logo_dark_url}
                    background={partner.logo_background}
                    className="h-16 w-fit transition-opacity group-hover:opacity-80"
                  />
                </a>
              ))}
            </div>
            </RevealOnScroll>

            {/* Campaign update — plain page content, not a Supabase row. */}
            {goruckPartner && (
              <RevealOnScroll>
                <div className="mt-12 grid overflow-hidden rounded-xl border border-line bg-white sm:grid-cols-2">
                  <div className="relative aspect-[4/3] sm:aspect-auto">
                    <Image
                      src="/ruck/goruck-donation.jpeg"
                      alt="GORUCK gear donated to Ruck For The 22 — a Rucker, a 20lb ruck plate, and a pair of Mackall 45 rucking shoes"
                      fill
                      className="object-cover"
                      sizes="(min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-6 sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-bronze">Campaign Update</p>
                    <h3 className="mt-2 font-display text-2xl uppercase text-ink sm:text-3xl">
                      GORUCK Resupplies the Ruck
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-charcoal-light">
                      Huge shoutout and thank you to GORUCK for supporting the campaign with a donation of a
                      Rucker, a 20lb ruck plate, and a pair of their new Mackall 45 rucking shoes.
                    </p>
                    {goruckPartner.website_url && (
                      <a
                        href={goruckPartner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
                      >
                        Visit GORUCK &rarr;
                      </a>
                    )}
                  </div>
                </div>
              </RevealOnScroll>
            )}
          </Container>
        </section>
      )}

      {/* Beneficiaries — Cody's own Ruck For The 22 campaign. Each mission's
          event-organizer beneficiaries live on that mission's page. */}
      <section id="beneficiaries" className="scroll-mt-28 py-16 sm:py-20">
        <Container>
          <RevealOnScroll>
          <SectionHeading
            eyebrow="Cody's Ruck Campaign"
            title={`A Path Into ${MISSION_NAME}`}
            description={`${RUCK.name} supports the same causes as ${CAMPAIGNS.tri.name} — and contributes to ${SITE_NAME}'s shared ${formatCurrency(fundraisingStats.fundraisingGoal)} mission goal.`}
          />
          <div className="mt-6 rounded-sm border border-ink/10 bg-sand-light p-6 lg:max-w-3xl">
            <MissionProgress totalRaised={fundraisingStats.amountRaised} goal={fundraisingStats.fundraisingGoal} />
            <a
              href={`${SITE_URL}/70k`}
              className="mt-5 inline-flex text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
            >
              Explore {MISSION_NAME} &rarr;
            </a>
          </div>
          </RevealOnScroll>
          {campaignBeneficiaries.length > 0 && (
            <RevealGrid>
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {campaignBeneficiaries.map((partner) => (
                  <BeneficiaryCard
                    key={partner.id}
                    eyebrow="Ruck For The 22 Beneficiary"
                    data={{
                      name: partner.name,
                      description: partner.what_they_do,
                      websiteUrl: partner.website_url,
                      donationUrl: partner.donation_url,
                      ein: partner.ein,
                      verified: partner.nonprofit_status_verified,
                      logo: {
                        url: partner.logo_url,
                        lightUrl: partner.logo_light_url,
                        darkUrl: partner.logo_dark_url,
                        background: partner.logo_background,
                      },
                    }}
                    trackingCode={partner.requires_donation_note ? RUCK_DONATION_TRACKING_CODE : undefined}
                  />
                ))}
              </div>
            </RevealGrid>
          )}

          <p className="mt-8 max-w-2xl text-sm font-medium text-charcoal-light">
            Donations are made directly through each independent nonprofit organization&apos;s
            authorized donation platform. {SITE_NAME} does not receive, process, or take possession of
            charitable contributions made this way, and does not issue tax receipts.
          </p>
        </Container>
      </section>
    </>
  );
}
