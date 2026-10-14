import Link from "next/link";
import Image from "next/image";
import { CTAButton } from "@/components/shared/cta-button";
import { ScrollProgressRail } from "@/components/shared/scroll-progress-rail";
import { RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { NEED_CATEGORIES } from "@/lib/content/resources";
import { AWARENESS_CALENDAR, getNextOccurrence, getUpcomingEntries } from "@/lib/content/awareness-calendar";
import { ABOUT_CONTENT, findAboutSubsection } from "@/lib/content/about";
import { getMissionMetrics } from "@/lib/data/mission-metrics";
import { getPartners } from "@/lib/data/partners";
import { getMissionPartners, isCampaignPartner } from "@/lib/data/mission-partners";
import { CAMPAIGN_URL, MOVEMENT_CAMPAIGNS, ORG_TAGLINE, isCurrentCampaign } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CampaignFilm } from "@/components/home/campaign-film";
import type { MovementCampaign } from "@/types/organization";

/**
 * Org homepage — "Steady Ground · Brand Edition" (design D), organized
 * around the three mission pillars: 01 Connection (help blue), 02
 * Mobilization (olive), 03 Impact (green). Each pillar's color is used only
 * for that pillar's labels/marks; navy carries structure everywhere.
 */

const RAIL_SECTIONS = [
  { id: "connection", label: "Connection" },
  { id: "mobilization", label: "Mobilization" },
  { id: "impact", label: "Impact" },
  { id: "why-22", label: "Why 22" },
  { id: "story", label: "Story" },
];

/** Real audienceTags values from the resource data — see PRIMARY_AUDIENCE_TAGS in resource-directory.tsx for the fuller set. */
const QUICK_FINDER_AUDIENCES = ["Veteran", "Active Military", "Law Enforcement", "Fire", "EMS", "Family"] as const;

/** Homepage-length copy for each athletic campaign card; the full descriptions live on /campaigns. */
const CAMPAIGN_CARD_COPY: Record<string, { blurb: string; cta: string }> = {
  ruck: {
    blurb: "RuckUp22 in Huntsville. Ruck all 22 miles, or walk any distance with family and friends.",
    cta: "Join the ruck",
  },
  "22": {
    blurb: "22 sessions of 22 minutes of movement, at your own pace, across a 22-hour window.",
    cta: "Take part",
  },
  tri: {
    blurb: "IRONMAN 70.3 Chattanooga — the race that started The $70K Mission.",
    cta: "Follow the journey",
  },
};

const DAY_MS = 86_400_000;

function parseDate(value: string): Date {
  return new Date(`${value}T12:00:00Z`);
}

function daysFromToday(value: string): number {
  return Math.ceil((parseDate(value).getTime() - Date.now()) / DAY_MS);
}

const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const shortDateYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function campaignDateLine(campaign: MovementCampaign): string | null {
  if (!campaign.startDate) return null;
  if (!campaign.endDate) return shortDateYear.format(parseDate(campaign.startDate));
  const start = parseDate(campaign.startDate);
  const end = parseDate(campaign.endDate);
  return `${shortDate.format(start)}–${end.getUTCDate()}, ${end.getUTCFullYear()}`;
}

/** Filled pill when the event is within a month; outlined status otherwise. */
function campaignPill(campaign: MovementCampaign): { label: string; filled: boolean } {
  const days = campaign.startDate ? daysFromToday(campaign.startDate) : null;
  if (days !== null && days >= 0 && days <= 30) {
    return { label: days === 0 ? "Today" : `In ${days} day${days === 1 ? "" : "s"}`, filled: true };
  }
  if (campaign.status === "active") return { label: "Training now", filled: false };
  return { label: "Upcoming", filled: false };
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const count = new Intl.NumberFormat("en-US");

/** Tracked-caps eyebrow. */
function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn("label-caps", className)}>{children}</span>;
}

/** A radio rendered as a pill — the quick-finder stays a plain GET form, no client JS. */
function Chip({ name, value, label, defaultChecked }: { name: string; value: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center rounded-full border-[1.5px] border-[#c9cdd3] bg-white px-4 text-[15px] font-semibold text-jet transition-colors hover:border-navy has-[:checked]:border-navy has-[:checked]:bg-navy has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-help">
      <input type="radio" name={name} value={value} defaultChecked={defaultChecked} className="sr-only" />
      {label}
    </label>
  );
}

export default async function HomePage() {
  const why22 = findAboutSubsection("why-22");
  const [metrics, beneficiaries, missionPartners] = await Promise.all([
    getMissionMetrics(),
    getPartners(),
    getMissionPartners(),
  ]);

  const [taglineFirst, ...taglineRest] = ORG_TAGLINE.split(/(?<=\.)\s+/);

  const current = MOVEMENT_CAMPAIGNS.filter(isCurrentCampaign);
  const athleticCampaigns = current
    .filter((c) => c.slug in CAMPAIGN_CARD_COPY)
    .sort((a, b) => (a.startDate ?? "9999").localeCompare(b.startDate ?? "9999"));
  const liveCampaign = MOVEMENT_CAMPAIGNS.find((c) => c.slug === "live" && c.url);

  const upcomingObservances = getUpcomingEntries(AWARENESS_CALENDAR, 3);

  const generalPartners = missionPartners.filter(isCampaignPartner);
  const presentingPartners = generalPartners.filter((p) => p.tier === "presenting-partner");
  const namedPartners = generalPartners.filter((p) => p.tier !== "presenting-partner").slice(0, 6);
  const remainingPartnerCount = generalPartners.length - presentingPartners.length - namedPartners.length;

  // Deliberately NOT part of generalPartners/the logo wall above — an
  // athlete-affiliation row (Cody personally selected to a team) isn't a
  // campaign partner, see isCampaignPartner(). Shown as a small, subordinate
  // credential line, not another sponsor card — see The Race page for the
  // fuller writeup.
  const athleteAffiliation = missionPartners.find((p) => p.partner_type === "athlete-affiliation");

  const raised = metrics.totalRaised;
  const goal = metrics.fundraisingGoal;
  const percent = raised !== null && goal ? Math.min(100, (raised / goal) * 100) : null;

  const pillars = [
    {
      id: "connection",
      number: "01",
      title: "Connection",
      color: "text-help",
      body: "Connecting veterans, first responders, and their families to trusted resources, people, organizations, and community.",
      stat: metrics.resources !== null ? count.format(metrics.resources) : null,
      statLabel: "vetted resources",
    },
    {
      id: "mobilization",
      number: "02",
      title: "Mobilization",
      color: "text-olive",
      body: "Turning awareness into action — getting communities, partners, artists, brands, and supporters involved.",
      stat:
        metrics.activeCampaigns !== null && metrics.campaignPartners !== null
          ? `${metrics.activeCampaigns} · ${metrics.campaignPartners}`
          : null,
      statLabel: "campaigns · partners",
    },
    {
      id: "impact",
      number: "03",
      title: "Impact",
      color: "text-impact",
      body: "Converting participation into measurable support — funding, visibility, access, and tangible outcomes for the people doing the work.",
      stat: raised !== null ? usd.format(raised) : null,
      statLabel:
        metrics.beneficiaries !== null
          ? `raised for ${metrics.beneficiaries} nonprofit${metrics.beneficiaries === 1 ? "" : "s"}`
          : "raised",
    },
  ];

  return (
    <>
      <ScrollProgressRail sections={RAIL_SECTIONS} />

      {/* Hero — topo texture fades in, the brush strokes paint in from each
          edge, then the mark and copy rise in sequence (see the hero-* motion
          utilities in globals.css; all of it is skipped under reduced motion). */}
      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- full-bleed decorative texture */}
        <img
          src="/brand/hero-topo.webp"
          alt=""
          aria-hidden="true"
          className="hero-fade pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative edge art sized to the section's height, which next/image can't express */}
        <img
          src="/brand/hero-paint-left.webp"
          alt=""
          aria-hidden="true"
          className="hero-paint-l pointer-events-none absolute left-0 top-0 h-full w-[45vw] object-contain object-left-top opacity-35 md:w-auto md:max-w-[26vw] md:object-cover md:object-left md:opacity-100"
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
        <img
          src="/brand/hero-paint-right.webp"
          alt=""
          aria-hidden="true"
          className="hero-paint-r pointer-events-none absolute right-0 top-0 h-full w-[45vw] object-contain object-right-top opacity-35 md:w-auto md:max-w-[26vw] md:object-cover md:object-right md:opacity-100"
        />
        <div className="relative mx-auto flex max-w-[860px] flex-col items-center gap-[26px] px-6 pb-[88px] pt-[72px] text-center">
          <Image
            src="/brand/ring-logo.webp"
            alt="For The 22 logo"
            width={220}
            height={220}
            priority
            className="hero-logo-in h-[180px] w-[180px] object-contain sm:h-[220px] sm:w-[220px]"
          />
          <Label className="hero-rise [animation-delay:450ms]">
            <span className="text-help">Connection</span> · <span className="text-olive">Mobilization</span> ·{" "}
            <span className="text-impact">Impact</span>
          </Label>
          <h1 className="hero-rise text-worn font-display text-[clamp(56px,7.4vw,108px)] uppercase leading-none [animation-delay:600ms]">
            <span className="text-outline">{taglineFirst}</span>
            {taglineRest.length > 0 && (
              <>
                <br />
                <span className="text-navy">{taglineRest.join(" ")}</span>
              </>
            )}
          </h1>
          <p className="hero-rise max-w-[620px] text-xl leading-relaxed text-copy [animation-delay:750ms]">
            We connect veterans, first responders, and their families to trusted support — and turn community action
            into real results for the people and organizations doing the work.
          </p>
          <div className="hero-rise flex flex-wrap justify-center gap-3 [animation-delay:900ms]">
            <CTAButton href="#connection" size="lg">
              Find resources
            </CTAButton>
            <CTAButton href="#mobilization" size="lg" variant="secondary">
              Get involved
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section aria-labelledby="pillars-heading" className="border-y border-line bg-white">
        <h2 id="pillars-heading" className="sr-only">
          Our mission pillars
        </h2>
        <div className="mx-auto grid max-w-[1240px] px-6 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <a
              key={pillar.id}
              href={`#${pillar.id}`}
              className={cn(
                "group flex flex-col gap-3 border-[#ece9e1] py-10 text-jet max-md:border-b max-md:last:border-b-0 md:px-8",
                i === 0 && "md:pl-0",
                i === pillars.length - 1 ? "md:pr-0" : "md:border-r",
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className={cn("font-display text-[40px] uppercase leading-none", pillar.color)}>
                  {pillar.title}
                </span>
                <Label className="text-xs text-[#6a6d72]">{pillar.number}</Label>
              </div>
              <span className="flex-grow text-base leading-relaxed text-copy">{pillar.body}</span>
              {pillar.stat && (
                <div className="flex items-baseline gap-2.5 border-t border-[#ece9e1] pt-3.5">
                  <span className="font-display text-[32px] leading-none text-navy">{pillar.stat}</span>
                  <span className="text-[15px] text-muted">{pillar.statLabel}</span>
                </div>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* 01 · Connection — quick-finder + crisis */}
      <section id="connection" aria-labelledby="find-heading" className="scroll-mt-28">
        <div className="mx-auto flex max-w-[1240px] flex-wrap gap-x-16 gap-y-10 px-6 pb-10 pt-20 sm:pt-[104px]">
          <RevealOnScroll className="flex flex-[1_1_300px] flex-col gap-4">
            <Label className="text-help">01 · Connection</Label>
            <h2
              id="find-heading"
              className="text-worn font-display text-[clamp(44px,5vw,64px)] uppercase leading-none text-navy"
            >
              The right help, matched to you.
            </h2>
            <p className="max-w-[400px] text-lg leading-relaxed text-copy">
              Resources, people, organizations, and community — every listing meets our{" "}
              <Link href="/standards" className="text-help underline underline-offset-2">
                resource standards
              </Link>
              .
            </p>
          </RevealOnScroll>

          <form
            action="/resources"
            className="flex min-w-0 flex-[999_1_560px] flex-col gap-7 rounded-xl border border-line bg-white p-6 shadow-[0_1px_0_#dedad0,0_12px_32px_rgba(18,30,61,0.06)] sm:p-8"
          >
            <fieldset>
              <legend className="mb-3 text-base font-bold">I am a…</legend>
              <div className="flex flex-wrap gap-2">
                <Chip name="audience" value="" label="Anyone" defaultChecked />
                {QUICK_FINDER_AUDIENCES.map((tag) => (
                  <Chip key={tag} name="audience" value={tag} label={tag} />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-3 text-base font-bold">I&apos;m looking for…</legend>
              <div className="flex flex-wrap gap-2">
                <Chip name="need" value="" label="Anything" defaultChecked />
                {NEED_CATEGORIES.map((category) => (
                  <Chip key={category.id} name="need" value={category.id} label={category.label} />
                ))}
              </div>
            </fieldset>
            <div className="flex flex-wrap items-end gap-3">
              <label className="flex flex-[1_1_260px] flex-col gap-2">
                <span className="text-base font-bold">Or search by keyword</span>
                <input
                  type="search"
                  name="q"
                  placeholder="Peer support, service dogs, scholarships…"
                  className="min-h-[52px] rounded-lg border-[1.5px] border-[#c9cdd3] bg-[#fafaf8] px-4 text-[17px] text-jet placeholder:text-[#6a6d72] focus-visible:border-help"
                />
              </label>
              <button
                type="submit"
                className="action-control inline-flex min-h-[52px] items-center justify-center bg-navy px-6 text-base font-bold text-white hover:bg-navy-hover"
              >
                Show resources
              </button>
            </div>
          </form>
        </div>

        <div className="mx-auto grid max-w-[1240px] gap-5 px-6 pb-20 sm:pb-[104px] md:grid-cols-2">
          <div id="crisis" className="flex scroll-mt-28 flex-col gap-3 rounded-xl bg-help p-8 text-white sm:p-9">
            <Label className="text-[#d3e6f3]">Need help now? · Veterans Crisis Line</Label>
            <h2 className="font-display text-[88px] leading-none sm:text-[104px]">988</h2>
            <p className="text-[17px] leading-relaxed text-[#e3eef6]">
              Free, confidential, 24/7. Press 1 to reach responders who understand service. In immediate danger, call
              911.
            </p>
            <div className="mt-1.5 flex flex-wrap gap-2.5">
              <a
                href="tel:988"
                className="action-control inline-flex min-h-[50px] items-center bg-white px-6 font-bold text-help hover:bg-paper"
              >
                Call 988, press 1
              </a>
              <a
                href="sms:838255"
                className="action-control inline-flex min-h-[50px] items-center border-2 border-white px-6 font-bold text-white hover:bg-white/10"
              >
                Text 838255
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-3.5 rounded-xl border border-line bg-white p-8 sm:p-9">
            <Label className="text-help">First responders</Label>
            <p className="font-display text-[40px] uppercase leading-none text-navy">
              Support built for those who answer the call.
            </p>
            <p className="text-lg leading-relaxed text-copy">
              Crisis lines and peer support for law enforcement, fire, EMS, dispatch, and corrections.
            </p>
            <Link
              href="/crisis#first-responders"
              className="action-control mt-auto inline-flex min-h-[50px] items-center self-start border-2 border-help px-6 font-bold text-help hover:bg-help hover:text-white"
            >
              View support
            </Link>
          </div>
        </div>
      </section>

      {/* 02 · Mobilization — campaigns on navy */}
      <section id="mobilization" aria-labelledby="mob-heading" className="scroll-mt-28 bg-navy text-white">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-10 px-6 py-20 sm:py-[104px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <Label className="text-[#b9c46a]">02 · Mobilization</Label>
              <h2 id="mob-heading" className="text-worn font-display text-[clamp(48px,6vw,80px)] uppercase leading-none">
                Awareness into action.
              </h2>
            </div>
            <p className="max-w-[440px] text-lg leading-relaxed text-mist">
              Every campaign feeds The $70K Mission — rucks, races, movement challenges, and a concert series that bring
              communities, partners, artists, and brands into the work.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-navy-rule pt-9">
            <Image
              src="/brand/movement-creates-momentum.webp"
              alt="Movement creates momentum"
              width={320}
              height={138}
              className="h-auto w-[320px] max-w-full"
            />
            <Label className="text-mist">Athletic campaigns</Label>
          </div>

          <CampaignFilm
            sources={[
              { src: "/video/campaign-film.mp4", type: 'video/mp4; codecs="avc1.64001f, mp4a.40.2"' },
              { src: "/video/campaign-film.webm", type: 'video/webm; codecs="vp9, opus"' },
            ]}
            poster="/media/campaign-film-poster.webp"
            title="Watch the campaign film"
            description="Rucks, rides, and the people who show up — 41 seconds, sound on."
          />

          {athleticCampaigns.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {athleticCampaigns.map((campaign) => {
                const copy = CAMPAIGN_CARD_COPY[campaign.slug];
                const pill = campaignPill(campaign);
                const dateLine = campaignDateLine(campaign);
                return (
                  <article
                    key={campaign.id}
                    className="lift view-rise bg-paper flex min-h-[280px] flex-col gap-3 rounded-xl p-7 text-jet"
                  >
                    <div className="flex justify-between gap-2 text-sm">
                      <span
                        className={cn(
                          "rounded-full px-3 font-bold",
                          pill.filled
                            ? "bg-olive py-1 text-white"
                            : "border-[1.5px] border-olive py-[3px] text-olive",
                        )}
                      >
                        {pill.label}
                      </span>
                      {dateLine && <span className="text-muted">{dateLine}</span>}
                    </div>
                    <h3 className="mt-2 font-display text-4xl uppercase leading-none">{campaign.name}</h3>
                    <p className="flex-grow text-base leading-relaxed text-copy">{copy.blurb}</p>
                    <a href={campaign.url} className="font-bold text-navy hover:text-help hover:underline">
                      {copy.cta} →
                    </a>
                  </article>
                );
              })}
            </div>
          )}

          {athleteAffiliation && (
            <div className="flex flex-wrap items-center gap-3 border-t border-navy-rule pt-6 text-sm">
              {athleteAffiliation.logo_url && (
                <Image
                  src={athleteAffiliation.logo_url}
                  alt={athleteAffiliation.name}
                  width={96}
                  height={64}
                  className="h-7 w-auto shrink-0"
                />
              )}
              <p className="text-mist">
                <span className="font-bold text-white">
                  Selected Athlete — {athleteAffiliation.name}
                  {athleteAffiliation.designation && ` · ${athleteAffiliation.designation}`}
                </span>
                <span className="block sm:inline"> Representing {athleteAffiliation.name} on the road to IRONMAN 70.3 Chattanooga.</span>
              </p>
            </div>
          )}

          {liveCampaign?.url && (
            <a
              href={liveCampaign.url}
              className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 rounded-xl border border-[#2c3d6b] px-7 py-6 text-white transition-colors hover:border-mist"
            >
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-mist">
                  Benefit concert series{liveCampaign.status === "in-development" && " · Coming soon"}
                </Label>
                <span className="font-display text-[32px] uppercase leading-none">{liveCampaign.name}</span>
                <span className="text-base text-mist">
                  Artists, veterans, first responders, and families — tickets, sponsorships, and auctions all count
                  toward the mission.
                </span>
              </div>
              <span className="font-bold text-gold">Get updates →</span>
            </a>
          )}
        </div>
      </section>

      {/* Mobilization · Get involved — banner bookend */}
      <section aria-labelledby="join-heading" className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative edge art sized to the section's height */}
        <img
          src="/brand/edge-left.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-full w-auto max-w-[24vw] object-cover object-right opacity-35 md:opacity-90"
        />
        <div className="relative mx-auto flex max-w-[1040px] flex-col gap-9 px-6 py-20 sm:py-24">
          <div className="flex flex-col items-center gap-3 text-center">
            <Label className="text-olive">Mobilization · Get involved</Label>
            <h2 id="join-heading" className="text-worn font-display text-[clamp(48px,6vw,80px)] uppercase leading-none">
              <span className="text-outline">Here to give help?</span>
              <br />
              <span className="text-navy">Four ways in.</span>
            </h2>
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            <GetInvolvedCard href="/campaigns" title="Participate" cta="See campaigns">
              Join a ruck, a race, or a movement challenge.
            </GetInvolvedCard>
            <GetInvolvedCard href={`${CAMPAIGN_URL}/become-a-partner`} external title="Partner" cta="Become a partner">
              Brands, artists, and organizations: contribute gear, services, funding, expertise, or reach.
            </GetInvolvedCard>
            <GetInvolvedCard href={`${CAMPAIGN_URL}/donate`} external title="Donate" cta="Donate" dark>
              Give directly through a beneficiary campaign.
            </GetInvolvedCard>
            <GetInvolvedCard href="/resources" title="Share" cta="Find resources">
              Help trusted resources reach the people who need them.
            </GetInvolvedCard>
          </div>
        </div>
      </section>

      {/* Kinetic slogan band — the tagline as a slow olive marquee. Screen
          readers get the line once; the repeated track is decorative. */}
      <div className="overflow-hidden border-y border-[#3c441a] bg-olive py-[22px] text-white">
        <p className="sr-only">{ORG_TAGLINE} Because 22 ≠ 0.</p>
        <div aria-hidden="true" className="animate-marquee-slow flex w-max gap-10 whitespace-nowrap font-display text-[36px] uppercase leading-none sm:text-[44px]">
          {[0, 1, 2, 3].map((copy) => (
            <span key={copy} className="flex gap-10">
              {[...ORG_TAGLINE.split(/(?<=\.)\s+/), "Because 22 ≠ 0"].map((phrase) => (
                <span key={phrase} className="flex gap-10">
                  <span>
                    {phrase.includes("≠") ? (
                      <>
                        Because 22 <span className="text-gold">≠</span> 0
                      </>
                    ) : (
                      phrase
                    )}
                  </span>
                  <span className="text-gold">★</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* 03 · Impact */}
      <section id="impact" aria-labelledby="impact-heading" className="scroll-mt-28 border-y border-line bg-white">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-12 px-6 py-20 sm:py-[104px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <Label className="text-impact">03 · Impact</Label>
              <h2
                id="impact-heading"
                className="text-worn font-display text-[clamp(48px,6vw,80px)] uppercase leading-none text-navy"
              >
                Participation, made measurable.
              </h2>
            </div>
            <Link href="/impact" className="font-bold text-navy hover:text-help hover:underline">
              See the full impact report →
            </Link>
          </div>

          {raised !== null && goal !== null && percent !== null && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <Label className="text-steel">The $70K Mission</Label>
                  <br />
                  <span className="font-display text-[56px] leading-none text-impact sm:text-[72px]">
                    {usd.format(raised)}
                  </span>{" "}
                  <span className="ml-1.5 text-muted">raised</span>
                </div>
                <Label className="text-steel">Goal · {usd.format(goal)}</Label>
              </div>
              <div
                role="progressbar"
                aria-label={`Funds raised toward ${usd.format(goal)}`}
                aria-valuemin={0}
                aria-valuemax={goal}
                aria-valuenow={raised}
                className="h-4 overflow-hidden rounded-full border border-[#cbd9cf] bg-impact-tint"
              >
                <div className="view-grow h-full min-w-4 rounded-full bg-impact" style={{ width: `${percent}%` }} />
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {beneficiaries.map((beneficiary) => (
              <div
                key={beneficiary.id}
                className="flex flex-col gap-2 rounded-xl border border-line bg-[#f7f6f2] p-7"
              >
                <Label className="text-xs text-impact">Funding</Label>
                <span className="font-display text-[32px] uppercase leading-none text-navy">{beneficiary.name}</span>
                <span className="text-base text-copy">Beneficiary of The $70K Mission.</span>
              </div>
            ))}
            {generalPartners.length > 0 && (
              <div className="flex flex-col gap-2 rounded-xl border border-line bg-[#f7f6f2] p-7">
                <Label className="text-xs text-impact">Access &amp; visibility</Label>
                <span className="font-display text-[32px] uppercase leading-none text-navy">
                  {generalPartners.length} partners
                </span>
                <span className="text-base leading-relaxed text-copy">
                  {presentingPartners.length > 0 && (
                    <>Led by presenting partners {presentingPartners.map((p) => p.name).join(" and ")}, with </>
                  )}
                  {presentingPartners.length === 0 && <>With </>}
                  {namedPartners.map((p) => p.name).join(", ")}
                  {remainingPartnerCount > 0 ? `, and ${remainingPartnerCount} more. ` : ". "}
                  <Link href="/network" className="font-bold text-impact hover:underline">
                    Meet them →
                  </Link>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Remembrance — the one jet-black band on the page. */}
      {why22 && (
        <section id="why-22" aria-labelledby="why-heading" className="scroll-mt-28 bg-jet text-paper">
          <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-20 gap-y-12 px-6 py-24 sm:py-28">
            <div className="min-w-0 flex-[1_1_380px]">
              <Image
                src="/brand/because-22-white.webp"
                alt="Because 22 does not equal 0"
                width={1600}
                height={1014}
                sizes="(min-width: 768px) 500px, 100vw"
                className="h-auto w-full max-w-[500px]"
              />
            </div>
            <div className="flex min-w-0 flex-[999_1_460px] flex-col gap-5">
              <Label className="text-[#bdbdbd]">Why 22 · Why we wear black</Label>
              <h2 id="why-heading" className="font-display text-[clamp(40px,4.4vw,60px)] uppercase leading-none">
                A symbol we carry, not a statistic we repeat.
              </h2>
              {why22.body.map((paragraph, i) => (
                <p key={i} className="text-lg leading-relaxed text-[#cfcfcf]">
                  {paragraph}
                </p>
              ))}
              <Link href="/about#why-black" className="font-bold text-white underline underline-offset-4">
                Why we wear black →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Founder */}
      <section id="story" aria-labelledby="founder-quote" className="scroll-mt-28">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-[72px] gap-y-12 px-6 py-24 sm:py-28">
          <div className="relative aspect-[4/5] min-w-0 flex-[1_1_360px] overflow-hidden rounded-xl bg-[#e3e0d6]">
            {ABOUT_CONTENT.portraitUrl && (
              <Image
                src={ABOUT_CONTENT.portraitUrl}
                alt={ABOUT_CONTENT.name}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            )}
          </div>
          <div className="flex min-w-0 flex-[999_1_460px] flex-col gap-[22px]">
            <Label className="text-steel">Why I started this</Label>
            <blockquote>
              <p
                id="founder-quote"
                className="text-[clamp(28px,3vw,40px)] font-semibold leading-tight text-navy"
              >
                “There is another veteran somewhere trying to figure out what comes next. Another who needs a mission.
                Another who needs a team.”
              </p>
            </blockquote>
            <p className="max-w-[540px] text-lg leading-relaxed text-copy">
              People and organizations invested in me when it mattered most. For The 22 is how I return that
              investment.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <div>
                <div className="font-bold">{ABOUT_CONTENT.name}</div>
                <Label className="text-xs text-muted">Founder · Combat veteran</Label>
              </div>
              <CTAButton href="/about#my-story" variant="secondary">
                Read my story
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* Awareness calendar */}
      {upcomingObservances.length > 0 && (
        <section aria-labelledby="cal-heading" className="border-t border-line">
          <div className="mx-auto flex max-w-[1240px] flex-wrap items-start gap-x-[72px] gap-y-8 px-6 py-20 sm:py-[88px]">
            <div className="flex flex-[1_1_320px] flex-col gap-3">
              <Label className="text-steel">Awareness calendar</Label>
              <h2 id="cal-heading" className="font-display text-5xl uppercase leading-none text-navy">
                Days we pause to recognize.
              </h2>
              <Link href="/awareness" className="mt-2 font-bold text-navy hover:text-help hover:underline">
                Full calendar →
              </Link>
            </div>
            <ol className="min-w-0 flex-[999_1_560px] border-t border-line">
              {upcomingObservances.map((entry) => {
                // getUpcomingEntries only returns entries with a next occurrence.
                const next = getNextOccurrence(entry);
                if (!next) return null;
                const when = new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  ...(entry.dateRule.type !== "month" && { day: "numeric" }),
                }).format(next.date);
                return (
                  <li key={entry.slug} className="border-b border-line">
                    <Link
                      href={`/awareness/${entry.slug}`}
                      className="flex items-baseline gap-6 py-5 font-bold text-navy hover:text-help hover:underline"
                    >
                      <span className="min-w-24 font-display text-[26px] font-normal uppercase leading-none text-help">
                        {when}
                      </span>
                      <span className="flex-1">{entry.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      )}
    </>
  );
}

function GetInvolvedCard({
  href,
  title,
  cta,
  dark = false,
  external = false,
  children,
}: {
  href: string;
  title: string;
  cta: string;
  dark?: boolean;
  external?: boolean;
  children: React.ReactNode;
}) {
  const className = cn(
    "lift view-rise flex min-h-[180px] flex-col gap-2 rounded-xl p-[26px]",
    dark ? "bg-navy text-white" : "border border-line bg-white text-jet hover:border-navy/40",
  );
  const content = (
    <>
      <span className="font-display text-[30px] uppercase leading-none">{title}</span>
      <span className={cn("flex-grow text-base leading-relaxed", dark ? "text-mist" : "text-copy")}>
        {children}
      </span>
      <span className={cn("font-bold", dark ? "text-gold" : "text-navy")}>{cta} →</span>
    </>
  );
  return external ? (
    <a href={href} className={className}>
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
