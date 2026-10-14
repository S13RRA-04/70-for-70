import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { CTAButton } from "@/components/shared/cta-button";
import { RevealGrid, RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { EmailSignupForm } from "@/components/forms/email-signup-form";
import { EqualizerBars } from "@/components/live/equalizer-bars";
import { TicketStub, type TicketStubProps } from "@/components/live/ticket-stub";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { getPublishedLiveEvents } from "@/lib/data/live-events";
import {
  LIVE_CAMPAIGN_DESCRIPTION,
  LIVE_CAMPAIGN_TAGLINE,
  LIVE_CONTRIBUTION_METHODS,
  LIVE_FUNDS_DISCLOSURE,
  LIVE_JOIN_PATHS,
  LIVE_MARQUEE_PHRASES,
  LIVE_PILLARS,
  UPCOMING_LIVE_PERFORMERS,
} from "@/lib/content/live-campaign";
import { CAMPAIGN_URL, CONTACT_EMAIL, LIVE_CAMPAIGN_NAME, LIVE_CAMPAIGN_URL, MISSION_NAME, SITE_URL } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: `${LIVE_CAMPAIGN_NAME} | ${LIVE_CAMPAIGN_TAGLINE}`,
  description: LIVE_CAMPAIGN_DESCRIPTION,
  canonical: "/",
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([{ name: LIVE_CAMPAIGN_NAME, url: LIVE_CAMPAIGN_URL }]);

const STAGE_BEAMS = [
  { left: "18%", sway: "live-sway-1", background: "conic-gradient(from 165deg at 50% 0%, transparent 0deg, rgba(255,255,255,0.14) 10deg, transparent 20deg)" },
  { left: "50%", sway: "live-sway-2", background: "conic-gradient(from 168deg at 50% 0%, transparent 0deg, rgba(255,255,255,0.10) 12deg, transparent 24deg)" },
  { left: "82%", sway: "live-sway-3", background: "conic-gradient(from 165deg at 50% 0%, transparent 0deg, rgba(211,32,42,0.20) 10deg, transparent 20deg)" },
] as const;

const SHORT_DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

const ARTIST_MAILTO = CONTACT_EMAIL
  ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${LIVE_CAMPAIGN_NAME} — Artist interest`)}`
  : null;

/**
 * Published DB shows first (they carry dates and ticket links), then any
 * confirmed performer from live-campaign.ts that doesn't have a show row
 * yet — matched by name in the show title, so a performer stops being
 * listed separately the moment their show is published.
 */
async function getShowStubs(): Promise<TicketStubProps[]> {
  const events = await getPublishedLiveEvents();
  const eventTitles = events.map((event) => event.title.toLowerCase());
  const unscheduled = UPCOMING_LIVE_PERFORMERS.filter(
    (performer) => !eventTitles.some((title) => title.includes(performer.name.toLowerCase())),
  );

  const stubs: Omit<TicketStubProps, "number">[] = [
    ...events.map((event) => ({
      dateLabel: event.starts_at ? SHORT_DATE.format(new Date(event.starts_at)) : "Date TBA",
      headliner: event.title,
      detail:
        [event.venue_name, event.venue_city, event.venue_state].filter(Boolean).join(", ") ||
        event.tagline ||
        undefined,
      action: event.ticket_url ? { label: "Get tickets", href: event.ticket_url, external: true } : undefined,
      detailHref: `/${event.slug}`,
    })),
    ...unscheduled.map((performer) => ({
      dateLabel: "Date TBA",
      headliner: performer.name,
      detail: performer.format,
      action: performer.registrationUrl
        ? { label: "Register", href: performer.registrationUrl, external: true }
        : undefined,
    })),
  ];

  return stubs.map((stub, i) => ({ ...stub, number: `Show ${String(i + 1).padStart(2, "0")}` }));
}

export default async function LiveCampaignPage() {
  const [shows, fundraisingStats] = await Promise.all([getShowStubs(), getFundraisingImpactStats()]);
  const { amountRaised, fundraisingGoal } = fundraisingStats;
  const percentRaised = fundraisingGoal > 0 ? Math.min(100, (amountRaised / fundraisingGoal) * 100) : 0;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />

      {/* Hero — the identity banner. */}
      <section className="relative overflow-hidden">
        <Image src="/brand/hero-topo.webp" alt="" fill priority sizes="100vw" className="pointer-events-none object-cover" />
        <Image
          src="/brand/hero-paint-left.webp"
          alt=""
          width={760}
          height={900}
          className="pointer-events-none absolute left-0 top-0 h-full w-auto opacity-35 md:opacity-100"
        />
        <Image
          src="/brand/hero-paint-right.webp"
          alt=""
          width={820}
          height={900}
          className="pointer-events-none absolute right-0 top-0 h-full w-auto opacity-35 md:opacity-100"
        />
        <Container className="relative flex max-w-[1080px] flex-col items-center gap-5 pb-20 pt-16 text-center sm:pb-22 sm:pt-18">
          <h1 className="w-full">
            <Image
              src="/brand/live/wordmark.webp"
              alt={LIVE_CAMPAIGN_NAME}
              width={1092}
              height={297}
              priority
              sizes="(min-width: 1080px) 960px, 100vw"
              className="mx-auto h-auto w-full max-w-[960px]"
            />
          </h1>
          <EqualizerBars />
          <p className="text-[15px] font-bold uppercase tracking-[0.42em]">{LIVE_CAMPAIGN_TAGLINE}</p>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
            {LIVE_PILLARS.join("  |  ")}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <CTAButton href="#list" size="lg" magnetic>
              Get on the list
            </CTAButton>
            <CTAButton href="#join" size="lg" variant="secondary" className="bg-transparent">
              Bring your band
            </CTAButton>
          </div>
        </Container>
      </section>

      {/* One stage — the concert scene and the show lineup. */}
      <section id="shows" aria-labelledby="shows-heading" className="relative scroll-mt-24 overflow-hidden bg-live-stage text-white">
        {STAGE_BEAMS.map((beam) => (
          <span
            key={beam.left}
            aria-hidden="true"
            className={`live-beam ${beam.sway}`}
            style={{ left: beam.left, background: beam.background }}
          />
        ))}
        {/* z-10 so the content always sits in front of the crowd silhouette below,
            whose raised arms reach well up into the bottom padding. */}
        <Container className="relative z-10 flex flex-col gap-11 pb-72 pt-section">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2
              id="shows-heading"
              className="text-worn font-display text-[clamp(3.25rem,6.6vw,5.75rem)] uppercase leading-[1.02]"
            >
              <span className="block">One stage.</span>
              <span className="block">One community.</span>
              <span className="block">One mission.</span>
            </h2>
            <div className="flex max-w-[400px] flex-col gap-3.5">
              <div aria-hidden="true" className="flex h-1.5 gap-1.5">
                <span className="flex-1 bg-impact" />
                <span className="flex-1 bg-[#1e78c8]" />
                <span className="flex-1 bg-live-red" />
              </div>
              <p className="text-[#cfcfcf]">
                We&apos;re starting as a streamed series so anyone, anywhere can pull up a chair. Live stages come
                next. Lineups drop here first.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            {shows.map((show) => (
              <TicketStub key={show.number} {...show} />
            ))}
            <div className="flex flex-wrap items-center gap-x-10 gap-y-3 rounded-[4px] border-2 border-dashed border-[#5a5a5a] px-7 py-6 sm:px-10">
              <div className="flex min-w-[120px] flex-col gap-0.5">
                <span className="label-caps text-xs text-[#bdbdbd]">Down the road</span>
                <span className="font-display text-[32px] uppercase leading-none">In person</span>
              </div>
              <div className="flex flex-[1_1_280px] flex-col gap-1">
                <p className="font-display text-[clamp(1.875rem,4vw,2.5rem)] uppercase leading-none">A live stage</p>
                <p className="text-[#cfcfcf]">When the artists are ready, so are we.</p>
              </div>
            </div>
          </div>

          <Link href="/events" className="self-start font-bold text-white underline underline-offset-4 hover:text-live-red">
            Every show &amp; performer &rarr;
          </Link>
        </Container>
        <Image
          src="/brand/live/crowd.webp"
          alt=""
          width={2880}
          height={440}
          className="pointer-events-none absolute bottom-0 left-1/2 ml-[-1440px] w-[2880px] max-w-none"
        />
      </section>

      {/* Marquee. The visible track is decorative; the sr-only line carries the words once. */}
      <div className="relative overflow-hidden bg-live-red py-4.5 text-white">
        <p className="sr-only">{LIVE_MARQUEE_PHRASES.join(". ")}.</p>
        <div aria-hidden="true" className="live-marquee gap-9 whitespace-nowrap font-display text-[38px] uppercase leading-none">
          {Array.from({ length: 4 }, (_, copy) =>
            LIVE_MARQUEE_PHRASES.map((phrase) => (
              <span key={`${copy}-${phrase}`} className="flex items-center gap-9">
                <span>{phrase}</span>
                <span className="text-jet">&#9733;</span>
              </span>
            )),
          )}
        </div>
      </div>

      {/* Where it goes. */}
      <section id="impact" aria-labelledby="impact-heading" className="scroll-mt-24">
        <Container className="flex flex-col gap-11 py-section">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-3.5">
              <span className="label-caps text-live-red">Where it goes</span>
              <h2 id="impact-heading" className="text-worn font-display text-[clamp(3.25rem,6.6vw,5.75rem)] uppercase leading-none">
                <span className="text-outline">Invest in more</span>
                <br />
                than a show.
              </h2>
            </div>
            <p className="max-w-[420px] text-copy">
              Every part of {LIVE_CAMPAIGN_NAME} feeds {MISSION_NAME} — the shared goal behind every For The 22
              campaign.
            </p>
          </div>
          <div aria-hidden="true" className="h-1 border-y-2 border-jet" />
          <RevealGrid>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {LIVE_CONTRIBUTION_METHODS.map((method, i) => (
                <div key={method.label} className="flex flex-col gap-2.5 rounded-[4px] border-2 border-jet bg-white p-7">
                  <span aria-hidden="true" className="font-display text-[54px] leading-none text-live-red">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-[30px] uppercase leading-none">{method.label}</h3>
                  <p className="text-base text-copy">{method.description}</p>
                </div>
              ))}
            </div>
          </RevealGrid>
          <RevealOnScroll>
            <div className="flex flex-col gap-3.5 rounded-[4px] bg-jet px-7 py-8 text-white sm:px-9">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex flex-wrap items-baseline gap-3.5">
                  <span className="label-caps text-[#bdbdbd]">{MISSION_NAME}</span>
                  <span className="font-display text-[56px] leading-none text-gold tabular-nums">
                    {formatCurrency(amountRaised)}
                  </span>
                  <span className="text-[#cfcfcf]">raised</span>
                </div>
                <span className="label-caps text-[#bdbdbd]">Goal · {formatCurrency(fundraisingGoal)}</span>
              </div>
              <div
                role="progressbar"
                aria-label={`Funds raised toward ${formatCurrency(fundraisingGoal)}`}
                aria-valuemin={0}
                aria-valuemax={fundraisingGoal}
                aria-valuenow={amountRaised}
                className="h-3.5 overflow-hidden rounded-full bg-[#2a2a2a]"
              >
                <div className="h-full min-w-3.5 rounded-full bg-gold" style={{ width: `${percentRaised}%` }} />
              </div>
            </div>
          </RevealOnScroll>
          <p className="max-w-3xl text-sm text-copy">
            {LIVE_FUNDS_DISCLOSURE}{" "}
            <a href={`${SITE_URL}/beneficiaries`} className="font-bold text-jet underline underline-offset-4 hover:text-live-red">
              See the beneficiaries &rarr;
            </a>
          </p>
        </Container>
      </section>

      {/* Turn up — the three ways in. */}
      <section id="join" aria-labelledby="join-heading" className="scroll-mt-24 border-y-2 border-jet bg-white">
        <Container className="flex flex-col gap-12 py-section">
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 id="join-heading" className="text-worn font-display text-[clamp(4rem,8vw,7.5rem)] uppercase leading-none">
              <span className="text-outline">Turn up</span>
            </h2>
            <p className="font-display text-[clamp(1.625rem,3vw,2.5rem)] uppercase leading-none">For those who served</p>
            <span aria-hidden="true" className="flex w-80 max-w-full items-center gap-3.5">
              <span className="h-[3px] flex-1 bg-jet" />
              <span className="text-[22px]">&#9733;</span>
              <span className="h-[3px] flex-1 bg-jet" />
            </span>
          </div>
          <RevealGrid>
            <div className="grid gap-5 md:grid-cols-3">
              {ARTIST_MAILTO && (
                <JoinCard
                  icon={
                    <svg aria-hidden="true" width="44" height="50" viewBox="0 0 100 112">
                      <path d="M50 4 C78 4 96 18 96 40 C96 70 66 96 50 108 C34 96 4 70 4 40 C4 18 22 4 50 4 Z" fill="#111111" />
                      <path d="M50 26 L56 44 L75 44 L60 55 L66 73 L50 62 L34 73 L40 55 L25 44 L44 44 Z" fill="#F2F1EC" />
                    </svg>
                  }
                  {...LIVE_JOIN_PATHS.artists}
                  href={ARTIST_MAILTO}
                  external
                  primary
                />
              )}
              <JoinCard
                icon={
                  <svg aria-hidden="true" width="44" height="50" viewBox="0 0 100 112">
                    <path d="M50 8 L61 40 L95 40 L67 60 L78 94 L50 73 L22 94 L33 60 L5 40 L39 40 Z" fill="#111111" />
                  </svg>
                }
                {...LIVE_JOIN_PATHS.sponsors}
                href={`${CAMPAIGN_URL}/become-a-partner`}
                external
              />
              <JoinCard
                icon={
                  <svg aria-hidden="true" width="64" height="50" viewBox="0 0 128 100">
                    <path d="M6 14 H122 V38 A12 12 0 0 0 122 62 V86 H6 V62 A12 12 0 0 0 6 38 Z" fill="#111111" />
                    <text x="64" y="61" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="30" fill="#F2F1EC">
                      LIVE
                    </text>
                  </svg>
                }
                {...LIVE_JOIN_PATHS.auction}
                href="/auction"
              />
            </div>
          </RevealGrid>
        </Container>
      </section>

      {/* Remembrance. */}
      <section aria-labelledby="why-heading" className="bg-jet text-paper">
        <Container className="flex flex-wrap items-center gap-x-20 gap-y-10 py-section">
          <div className="min-w-0 flex-[1_1_360px]">
            <Image
              src="/brand/because-22-white.webp"
              alt="Because 22 does not equal 0"
              width={1600}
              height={1014}
              sizes="(min-width: 768px) 460px, 100vw"
              className="h-auto w-full max-w-[460px]"
            />
          </div>
          <div className="flex min-w-0 flex-[999_1_420px] flex-col gap-4.5">
            <span className="label-caps text-[#8c8c8c]">Lives have value. Always.</span>
            <h2 id="why-heading" className="font-display text-[clamp(2.5rem,4.6vw,3.75rem)] uppercase leading-none">
              Every song is for someone.
            </h2>
            <p className="text-[#cfcfcf]">
              The 22 is a symbol of the veterans and first responders we&apos;ve lost. We play so the people still
              here know they&apos;re not alone — and so the organizations helping them can keep going.
            </p>
            <a href={`${SITE_URL}/about#why-black`} className="self-start font-bold text-white underline-offset-4 hover:underline">
              Why we wear black &rarr;
            </a>
          </div>
        </Container>
      </section>

      {/* Get on the list. */}
      <section id="list" aria-labelledby="list-heading" className="scroll-mt-24">
        <Container className="flex max-w-[820px] flex-col items-center gap-5 py-section text-center">
          <Image src="/brand/live/badge.webp" alt="" width={130} height={130} />
          <h2 id="list-heading" className="font-display text-[clamp(2.75rem,5vw,4.25rem)] uppercase leading-none">
            Get on the list.
          </h2>
          <p className="text-copy">
            First word on lineups, stream links, and auction drops, along with For The 22&apos;s other updates.
          </p>
          <div className="mt-1.5 flex justify-center">
            <EmailSignupForm idleLabel="Count me in" />
          </div>
        </Container>
      </section>
    </>
  );
}

function JoinCard({
  icon,
  title,
  description,
  cta,
  href,
  external = false,
  primary = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  href: string;
  external?: boolean;
  primary?: boolean;
}) {
  return (
    <div className="flex h-full flex-col gap-3.5 rounded-[4px] border-2 border-jet bg-paper p-8">
      {icon}
      <h3 className="font-display text-4xl uppercase leading-none">{title}</h3>
      <p className="flex-grow text-copy">{description}</p>
      <CTAButton href={href} external={external} size="lg" accent={primary ? "bronze" : "black"} className="self-start">
        {cta}
      </CTAButton>
    </div>
  );
}
