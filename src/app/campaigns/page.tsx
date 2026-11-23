import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Backpack, Bike, Footprints, Music, Palette, type LucideIcon } from "lucide-react";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { PillarNextSteps } from "@/components/shared/pillar-next-steps";
import { CampaignFilm } from "@/components/home/campaign-film";
import { CampaignJournalEntryCard } from "@/components/campaign/campaign-journal-entry";
import { getMissionMetrics } from "@/lib/data/mission-metrics";
import { getLatestCampaignJournalEntries } from "@/lib/content/campaign-journal";
import { COMPLETED_RUCK_MISSIONS } from "@/lib/content/ruck-missions";
import {
  CAMPAIGN_STATUS_LABELS,
  FUNDRAISING_GOAL,
  MISSION_NAME,
  MISSION_ORIGIN_LINE,
  MOVEMENT_CAMPAIGNS,
  isCurrentCampaign,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";
import { cn, formatCurrency } from "@/lib/utils";
import type { MovementCampaign } from "@/types/organization";

/**
 * /campaigns — a gateway to the individual campaigns, not a mission report.
 *
 * Hero → one tile per current campaign (the next one you can still join
 * leads) → one line of mission progress → a compact row of other ways to
 * help → the campaign film. Depth lives elsewhere: each campaign's own site,
 * the mission overview plus "Beyond the Campaigns" and "What's Next" on
 * /70k, beneficiaries on /impact, the full calendar on /awareness, and
 * announcements on /campaigns/journal.
 */

export async function generateMetadata(): Promise<Metadata> {
  const { fundraisingGoal } = await getMissionMetrics();
  return pageMetadata({
    title: "Campaigns: Ruck, Tri, Live, SEEN & 22 For the 22",
    description: `Five campaigns, one goal: Tri, Ruck, Live, SEEN, and 22 For the 22 all raise money toward ${SITE_NAME}'s shared ${formatCurrency(fundraisingGoal ?? FUNDRAISING_GOAL)} goal for veterans and first responders.`,
    canonical: "/campaigns",
  });
}

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: "Campaigns", url: `${SITE_URL}/campaigns` },
]);

/** Gateway-length copy per campaign; the full descriptions live on each campaign's own page. */
const GATEWAY: Record<string, { icon: LucideIcon; pitch: string; cta: string }> = {
  "22": { icon: Footprints, pitch: "22 sessions of 22 minutes of movement, at your own pace, across one 22-hour window.", cta: "Take part" },
  ruck: { icon: Backpack, pitch: "Rucking missions that carry For The 22 mile by mile.", cta: "See the missions" },
  tri: { icon: Bike, pitch: "IRONMAN 70.3 Chattanooga — the race that started The $70K Mission.", cta: "Follow the race" },
  live: { icon: Music, pitch: "A benefit concert series bringing artists, veterans, first responders, and supporters together.", cta: "See the series" },
  seen: { icon: Palette, pitch: "The stories of veterans, first responders, and their families, told through visual art.", cta: "See the art" },
};

const OTHER_WAYS: { title: string; body: string; href: string }[] = [
  { title: "Partner with us", body: "Brands, artists, and organizations: gear, services, funding, or reach.", href: "/network#partners" },
  { title: "Donate", body: "Give directly to a beneficiary organization.", href: "/donate" },
  { title: "Shop", body: "Apparel and gear that funds the mission.", href: "/store" },
  { title: "Share resources", body: "Help trusted support reach the people who need it.", href: "/resources" },
  { title: "Awareness calendar", body: "Observances to rally around all year.", href: "/awareness" },
  { title: "Campaign journal", body: "Announcements and milestones across every campaign.", href: "/campaigns/journal" },
];

const DAY_MS = 86_400_000;
const parseDate = (value: string) => new Date(`${value}T12:00:00Z`);
const daysUntil = (value: string) => Math.ceil((parseDate(value).getTime() - Date.now()) / DAY_MS);
const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/** Filled pill when the start is within a month; otherwise the campaign's status. */
function statusPill(campaign: MovementCampaign): { label: string; filled: boolean } {
  if (campaign.slug === "ruck" && COMPLETED_RUCK_MISSIONS.length > 0) {
    const n = COMPLETED_RUCK_MISSIONS.length;
    return { label: `${n} mission${n === 1 ? "" : "s"} complete`, filled: false };
  }
  const days = campaign.startDate ? daysUntil(campaign.startDate) : null;
  if (days !== null && days >= 0 && days <= 30) {
    return { label: days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`, filled: true };
  }
  return { label: CAMPAIGN_STATUS_LABELS[campaign.status], filled: false };
}

/** Joinable soonest first, then other active campaigns, then ones still in development. */
function gatewayOrder(campaigns: (MovementCampaign & { url: string })[]) {
  const upcoming = (c: MovementCampaign) => (c.startDate && daysUntil(c.startDate) >= 0 ? daysUntil(c.startDate) : Infinity);
  const developing = (c: MovementCampaign) => (c.status === "in-development" ? 1 : 0);
  return [...campaigns].sort((a, b) => developing(a) - developing(b) || upcoming(a) - upcoming(b));
}

export default async function CampaignsPage() {
  const metrics = await getMissionMetrics();
  const campaigns = gatewayOrder(MOVEMENT_CAMPAIGNS.filter(isCurrentCampaign).filter((c) => c.slug in GATEWAY));
  const journalEntries = getLatestCampaignJournalEntries(3);
  const raised = metrics.totalRaised;
  const goal = metrics.fundraisingGoal ?? FUNDRAISING_GOAL;
  const percent = raised !== null && goal ? Math.min(100, (raised / goal) * 100) : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <PageHero
        pillar="mobilization"
        title="Pick your campaign"
        description="Ruck it, race it, move it, hear it, or see it. Every campaign feeds one shared goal for organizations serving veterans, first responders, and their families."
        aside={
          <Image
            src="/brand/movement-creates-momentum.webp"
            alt="Movement creates momentum"
            width={1200}
            height={516}
            priority
            className="h-auto w-full max-w-[460px]"
          />
        }
      >
        <p className="label-caps text-olive">{MISSION_ORIGIN_LINE}</p>
      </PageHero>

      {/* The gateway */}
      <section id="current-campaigns" aria-labelledby="campaigns-heading" className="scroll-mt-28 pb-14 pt-4 sm:pb-16">
        <Container>
          <h2 id="campaigns-heading" className="sr-only">Current campaigns</h2>
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign, index) => (
              <CampaignTile key={campaign.id} campaign={campaign} featured={index === 0} />
            ))}
          </ul>
        </Container>
      </section>

      {/* Mission-wide updates across every campaign. */}
      {journalEntries.length > 0 && (
        <section aria-labelledby="campaign-journal-heading" className="border-y border-line bg-sand-light py-14 sm:py-16">
          <Container>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="label-caps text-bronze">Across the mission</p>
                <h2
                  id="campaign-journal-heading"
                  className="mt-2 font-display text-[clamp(32px,4vw,48px)] uppercase leading-none text-navy"
                >
                  Campaign Journal
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-copy">
                  Announcements, milestones, partnerships, and field updates from every For The 22 campaign.
                </p>
              </div>
              <Link href="/campaigns/journal" className="shrink-0 font-bold text-navy hover:text-help hover:underline">
                View all updates →
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {journalEntries.map((entry) => (
                <CampaignJournalEntryCard key={entry.id} entry={entry} variant="teaser" />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* One line of mission progress */}
      {raised !== null && percent !== null && (
        <section aria-label={MISSION_NAME} className="border-y border-line bg-white">
          <Container className="flex flex-wrap items-center gap-x-8 gap-y-3 py-6">
            <p className="text-base text-copy">
              <span className="font-display text-[28px] leading-none text-navy">{formatCurrency(raised)}</span>{" "}
              raised of {formatCurrency(goal)} for {MISSION_NAME}
            </p>
            <div
              role="progressbar"
              aria-label={`Funds raised toward ${formatCurrency(goal)}`}
              aria-valuemin={0}
              aria-valuemax={goal}
              aria-valuenow={raised}
              className="h-2.5 min-w-[160px] flex-1 overflow-hidden rounded-full bg-impact-tint"
            >
              <div className="h-full min-w-2.5 rounded-full bg-impact" style={{ width: `${percent}%` }} />
            </div>
            <Link href="/70k" className="font-bold text-navy hover:text-help hover:underline">
              See the mission →
            </Link>
          </Container>
        </section>
      )}

      {/* Other ways to help */}
      <section aria-labelledby="other-ways-heading" className="py-14 sm:py-16">
        <Container className="flex flex-col gap-6">
          <h2 id="other-ways-heading" className="font-display text-[clamp(28px,3vw,36px)] uppercase leading-none text-navy">
            Not a ruck-or-race person? Other ways to help
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {OTHER_WAYS.map((way) => (
              <li key={way.href}>
                <Link
                  href={way.href}
                  className="group flex h-full flex-col gap-1 rounded-lg border border-line bg-white px-5 py-4 hover:border-navy"
                >
                  <span className="font-bold text-navy group-hover:text-help">{way.title} →</span>
                  <span className="text-sm text-copy">{way.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-label="Campaign film" className="bg-navy py-12 sm:py-16">
        <Container>
          <CampaignFilm
            sources={[
              { src: "/video/campaign-film.mp4", type: 'video/mp4; codecs="avc1.64001f, mp4a.40.2"' },
              { src: "/video/campaign-film.webm", type: 'video/webm; codecs="vp9, opus"' },
            ]}
            poster="/media/campaign-film-poster.webp"
            title="Watch the campaign film"
            description="Rucks, rides, and the people who show up — 41 seconds, sound on."
          />
        </Container>
      </section>

      <PillarNextSteps current="mobilization" />
    </>
  );
}

function CampaignTile({ campaign, featured }: { campaign: MovementCampaign & { url: string }; featured: boolean }) {
  const gateway = GATEWAY[campaign.slug];
  const Icon = gateway.icon;
  const pill = statusPill(campaign);
  const meta = [campaign.type, campaign.location, campaign.startDate ? shortDate.format(parseDate(campaign.startDate)) : null]
    .filter(Boolean)
    .join(" · ");
  // Campaign sites on other hosts are absolute URLs: a plain <a>, never a relative <Link> (see AGENTS.md).
  const sameSite = campaign.url.startsWith("/");
  const ctaClass = cn(
    "action-control mt-auto inline-flex min-h-[50px] items-center justify-center self-start px-6 font-bold",
    featured ? "bg-olive text-white hover:bg-olive-dark" : "border-2 border-navy text-navy hover:bg-navy hover:text-white",
  );
  const cta = (
    <>
      {gateway.cta}
      {" "}
      <span aria-hidden="true">→</span>
      <span className="sr-only"> — {campaign.name}</span>
    </>
  );

  return (
    <li
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-t-4 border-line border-t-olive bg-white p-7",
        featured && "md:col-span-2 lg:row-span-1 sm:p-9",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-olive/10 text-olive">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
        <span
          className={cn(
            "rounded-full px-3 text-sm font-bold",
            pill.filled ? "bg-olive py-1 text-white" : "border-[1.5px] border-olive py-[3px] text-olive",
          )}
        >
          {pill.label}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className={cn("font-display uppercase leading-none text-navy", featured ? "text-[clamp(40px,4.4vw,56px)]" : "text-[32px]")}>
          {campaign.name}
        </h3>
        {meta && <p className="text-sm font-semibold text-muted">{meta}</p>}
      </div>
      <p className={cn("leading-relaxed text-copy", featured ? "max-w-xl text-lg" : "text-base")}>{gateway.pitch}</p>
      {sameSite ? (
        <Link href={campaign.url} className={ctaClass}>{cta}</Link>
      ) : (
        <a href={campaign.url} className={ctaClass}>{cta}</a>
      )}
    </li>
  );
}
