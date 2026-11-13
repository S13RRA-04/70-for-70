import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { CTAButton } from "@/components/shared/cta-button";
import { BrandStripe } from "@/components/shared/brand-stripe";
import { EmailSignupForm } from "@/components/forms/email-signup-form";
import { EqualizerBars } from "@/components/live/equalizer-bars";
import { StageLoopVideo } from "@/components/live/stage-loop-video";
import { PremiereCountdown, PremiereDaysLeft, PremiereLocalTime } from "@/components/live/premiere-countdown";
import { VerticalVideoEmbed } from "@/components/live/vertical-video-embed";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import {
  formatPremiereDate,
  formatPremiereTimes,
  premiereCalendarUrl,
  premiereWatchUrl,
  type LivePremiere,
} from "@/lib/content/live-premieres";
import { LIVE_FUNDS_DISCLOSURE } from "@/lib/content/live-campaign";
import { LIVE_CAMPAIGN_NAME, LIVE_CAMPAIGN_URL, MISSION_NAME, SITE_URL, DONATE_URL, LIVE_CAMPAIGN_PATH } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { parseVideoUrl } from "@/lib/video-url";

/** Three stage lights over the hero: white wash, the red key light, white wash. */
const BEAMS = [
  { left: "22%", sway: "live-beam-sway-1", gradient: "conic-gradient(from 165deg at 50% 0%, transparent 0deg, rgb(255 255 255 / 0.12) 10deg, transparent 20deg)" },
  { left: "50%", sway: "live-beam-sway-2", gradient: "conic-gradient(from 168deg at 50% 0%, transparent 0deg, rgb(211 32 42 / 0.24) 12deg, transparent 24deg)" },
  { left: "78%", sway: "live-beam-sway-3", gradient: "conic-gradient(from 165deg at 50% 0%, transparent 0deg, rgb(255 255 255 / 0.10) 10deg, transparent 20deg)" },
] as const;

/**
 * A For The 22: LIVE artist premiere — rendered by
 * src/app/campaigns/live/[slug]/page.tsx when the slug matches an entry in
 * LIVE_PREMIERES. The release itself stays on the artist's channel; this
 * page is the launch event that sends viewers there.
 */
export async function PremierePage({ premiere }: { premiere: LivePremiere }) {
  const { amountRaised, fundraisingGoal } = await getFundraisingImpactStats();
  const percentRaised = fundraisingGoal > 0 ? Math.min(100, (amountRaised / fundraisingGoal) * 100) : 0;

  const watchUrl = premiereWatchUrl(premiere);
  const dateLine = formatPremiereDate(premiere, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const [startTime] = formatPremiereTimes(premiere).split(" / ");
  const teasers = premiere.teasers
    .map((url) => ({ url, video: parseVideoUrl(url) }))
    .filter((teaser) => teaser.video?.provider === "youtube");

  return (
    <>
      {/* Hero — the stage. */}
      <section aria-labelledby="premiere-heading" className="relative overflow-hidden bg-live-stage text-white">
        {/* Same concert-footage treatment as the LIVE home's lineup section:
            bottom-anchored so the real crowd stays in frame, darkened at the
            top where the title and countdown sit. */}
        <StageLoopVideo className="pointer-events-none absolute inset-0 h-full w-full object-cover object-bottom" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-live-stage/85 via-live-stage/55 to-live-stage/10"
        />
        {BEAMS.map((beam) => (
          <span
            key={beam.sway}
            aria-hidden="true"
            className={`live-beam ${beam.sway}`}
            style={{ left: beam.left, background: beam.gradient }}
          />
        ))}

        <Container className="relative z-10 flex max-w-[980px] flex-col items-center gap-4.5 pb-[230px] pt-18 text-center">
          <Link href={`${LIVE_CAMPAIGN_PATH}/events`} className="self-start text-sm text-[#bdbdbd] hover:text-white">
            &larr; All shows
          </Link>
          <span className="label-caps text-xs tracking-[0.32em] text-[#cfcfcf]">{LIVE_CAMPAIGN_NAME} presents</span>
          <h1 id="premiere-heading" className="flex flex-col items-center gap-1">
            <span className="font-display text-[clamp(36px,4vw,54px)] uppercase leading-none text-[#e2e2e2]">
              {premiere.artist}
            </span>
            <span className="text-worn font-display text-[clamp(96px,15vw,210px)] uppercase leading-[0.9]">
              &ldquo;{premiere.title}&rdquo;
            </span>
          </h1>
          <EqualizerBars tone="dark" className="h-14" />
          <span className="label-caps rounded-full bg-live-red px-4 py-1.5 text-xs text-white">{premiere.kind}</span>
          <div className="flex flex-col gap-0.5">
            <p className="font-display text-[clamp(30px,3.4vw,44px)] uppercase leading-none">{dateLine}</p>
            <p className="mt-1.5 text-[17px] text-[#cfcfcf]">{formatPremiereTimes(premiere)}</p>
            <PremiereLocalTime startsAtIso={premiere.startsAt} className="text-sm text-[#8c8c8c]" />
          </div>
          <PremiereCountdown startsAtIso={premiere.startsAt} releasedLabel={`“${premiere.title}” is out now`} />
          <div className="mt-1.5 flex flex-wrap justify-center gap-3">
            <CTAButton href={watchUrl} external size="lg" magnetic>
              Watch on YouTube
            </CTAButton>
            <CTAButton href="#list" size="lg" variant="secondary" tone="dark">
              Get on the list
            </CTAButton>
          </div>
          <a
            href={premiereCalendarUrl(premiere, `${LIVE_CAMPAIGN_URL}/${premiere.slug}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] text-[#cfcfcf] underline-offset-4 hover:text-white hover:underline"
          >
            + Add to calendar
          </a>
        </Container>
      </section>

      <BrandStripe variant="live" className="h-1.5 bg-live-stage" />

      {/* First look — the artist's own teasers. */}
      {teasers.length > 0 && (
        <section aria-labelledby="teaser-heading" className="bg-white text-jet">
          <Container className="flex max-w-[1080px] flex-wrap items-center justify-center gap-x-20 gap-y-12 py-26">
            <div className="flex min-w-0 max-w-[480px] flex-[1_1_380px] flex-col gap-4.5">
              <span className="label-caps text-live-red">First look</span>
              <h2 id="teaser-heading" className="text-worn font-display text-[clamp(56px,6.4vw,88px)] uppercase leading-none">
                A taste of
                <br />
                &ldquo;{premiere.title}&rdquo;
              </h2>
              <p className="text-[#3a3a3a]">
                The full video debuts {dateLine.split(", ").slice(0, 2).join(", ")} at {startTime}. Until then,
                here&apos;s a first look from {premiere.artist}.
              </p>
              <PremiereDaysLeft startsAtIso={premiere.startsAt} />
              <a
                href={premiere.artistChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start font-bold text-jet hover:text-live-red"
              >
                More from {premiere.artist} on YouTube &rarr;
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-12">
              {teasers.map(({ url, video }, i) => (
                <div key={url} className="w-[min(340px,78vw)]">
                  <VerticalVideoEmbed
                    videoId={video!.id}
                    title={`${premiere.artist} — “${premiere.title}” teaser${teasers.length > 1 ? ` ${i + 1}` : ""}`}
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* The night — run of show. */}
      <section aria-labelledby="program-heading" className="border-t-2 border-jet text-jet">
        <Container className="flex flex-col gap-10 py-26">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-3.5">
              <span className="label-caps text-live-red">The night</span>
              <h2 id="program-heading" className="text-worn font-display text-[clamp(52px,6.6vw,92px)] uppercase leading-none">
                <span className="text-outline">One song.</span>
                <br />
                One mission.
              </h2>
            </div>
            <p className="max-w-[420px] text-[#3a3a3a]">{premiere.summary}</p>
          </div>
          <div aria-hidden="true" className="h-1 border-y-2 border-jet" />
          <ol className="grid gap-4 md:grid-cols-2">
            {premiere.program.map((step, i) => (
              <li
                key={step.title}
                className={`flex flex-col gap-2.5 rounded-[4px] border-2 border-jet p-7.5 ${step.mainEvent ? "bg-jet text-white" : "bg-white"}`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className={`font-display text-[54px] leading-none ${step.mainEvent ? "text-gold" : "text-live-red"}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {step.mainEvent ? (
                    <span className="label-caps inline-flex items-center gap-2 text-xs">
                      <span aria-hidden="true" className="live-on-air h-[9px] w-[9px] rounded-full bg-live-red" />
                      The main event
                    </span>
                  ) : (
                    step.time && <span className="label-caps text-xs">{step.time}</span>
                  )}
                </div>
                <h3 className="font-display text-[32px] uppercase leading-none">{step.title}</h3>
                <p className={`text-base ${step.mainEvent ? "text-[#d8d8d8]" : "text-[#3a3a3a]"}`}>{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* The artist's release. */}
      <section aria-labelledby="artist-heading" className="border-t-2 border-jet bg-white text-jet">
        <Container className="flex flex-wrap items-center gap-x-18 gap-y-8 py-24">
          <div className="flex flex-[1_1_340px] flex-col gap-3">
            <span className="label-caps text-live-red">Their song. Their release.</span>
            <h2 id="artist-heading" className="font-display text-[clamp(44px,5vw,66px)] uppercase leading-none">
              Every view stays with the band.
            </h2>
          </div>
          <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-5">
            <p className="text-[#3a3a3a]">
              &ldquo;{premiere.title}&rdquo; and its music video belong to {premiere.artist}. The official video
              premieres on the band&apos;s own YouTube channel, so the views, subscribers, and long-term value stay
              with the artist. {LIVE_CAMPAIGN_NAME} is the launch event that sends you there.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[4px] border-2 border-jet px-5 py-4.5">
                <span className="label-caps text-[11px] text-[#4a4a4a]">{premiere.artist} keeps</span>
                <p className="mt-1.5 font-display text-2xl uppercase leading-none">The song · the video · every view</p>
              </div>
              <div className="rounded-[4px] bg-jet px-5 py-4.5 text-white">
                <span className="label-caps text-[11px] text-[#bdbdbd]">{LIVE_CAMPAIGN_NAME} brings</span>
                <p className="mt-1.5 font-display text-2xl uppercase leading-none">The launch night · the crowd</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <CTAButton href={premiere.artistChannelUrl} external accent="black">
                {premiere.artist} on YouTube
              </CTAButton>
              {premiere.listenUrl && (
                <CTAButton href={premiere.listenUrl} external variant="secondary">
                  Listen to &ldquo;{premiere.title}&rdquo;
                </CTAButton>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Why it matters, and where the mission stands. */}
      <section aria-labelledby="why-heading" className="bg-jet text-paper">
        <Container className="flex flex-wrap items-center gap-x-20 gap-y-10 py-26">
          <div className="min-w-0 flex-[1_1_320px]">
            <Image
              src="/brand/because-22-white.webp"
              alt="Because 22 does not equal 0"
              width={1600}
              height={1014}
              sizes="(min-width: 768px) 420px, 100vw"
              className="h-auto w-full max-w-[420px]"
            />
          </div>
          <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-4.5">
            <span className="label-caps text-[#8c8c8c]">Watching is free</span>
            <h2 id="why-heading" className="font-display text-[clamp(40px,4.6vw,60px)] uppercase leading-none">
              Every song is for someone.
            </h2>
            <p className="text-[#cfcfcf]">
              The 22 is a symbol of the veterans and first responders we&apos;ve lost. If the night moves you, give
              to {MISSION_NAME} — it supports the organizations helping the people still here.
            </p>
            <div className="flex flex-col gap-3 rounded-[4px] border border-[#2e2e2e] px-5.5 py-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="label-caps text-xs text-[#bdbdbd]">{MISSION_NAME}</span>
                  <span className="font-display text-[40px] leading-none tabular-nums text-gold">
                    {formatCurrency(amountRaised)}
                  </span>
                  <span className="text-[15px] text-[#cfcfcf]">raised</span>
                </div>
                <span className="label-caps text-xs text-[#bdbdbd]">Goal · {formatCurrency(fundraisingGoal)}</span>
              </div>
              <div
                role="progressbar"
                aria-label={`Funds raised toward ${formatCurrency(fundraisingGoal)}`}
                aria-valuemin={0}
                aria-valuemax={fundraisingGoal}
                aria-valuenow={amountRaised}
                className="h-3 overflow-hidden rounded-full bg-[#2a2a2a]"
              >
                <div className="h-full min-w-3 rounded-full bg-gold" style={{ width: `${percentRaised}%` }} />
              </div>
            </div>
            <p className="text-sm text-[#9a9a9a]">{LIVE_FUNDS_DISCLOSURE}</p>
            <div className="flex flex-wrap items-center gap-x-4.5 gap-y-3">
              <CTAButton href={DONATE_URL} external tone="dark">
                Support the mission
              </CTAButton>
              <a href={`${SITE_URL}/crisis`} className="font-bold text-white underline-offset-4 hover:underline">
                Need help now? &rarr;
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Get on the list. */}
      <section id="list" aria-labelledby="list-heading" className="scroll-mt-24 text-jet">
        <Container className="flex max-w-[820px] flex-col items-center gap-5 py-24 text-center">
          <Image src="/brand/live/badge.webp" alt="" width={130} height={130} />
          <h2 id="list-heading" className="font-display text-[clamp(44px,5vw,68px)] uppercase leading-none">
            Get on the list.
          </h2>
          <p className="text-[#3a3a3a]">
            First word on premieres, lineups, and stream links, along with For The 22&apos;s other updates.
          </p>
          <div className="mt-1.5 flex justify-center">
            <EmailSignupForm idleLabel="Count me in" />
          </div>
        </Container>
      </section>
    </>
  );
}
