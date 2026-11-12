import Image from "next/image";
import { Container } from "@/components/shared/container";
import { CTAButton } from "@/components/shared/cta-button";
import { EmailSignupForm } from "@/components/forms/email-signup-form";
import { EqualizerBars } from "@/components/live/equalizer-bars";
import { PremiereCountdown } from "@/components/live/premiere-countdown";
import {
  formatPremiereDate,
  formatPremiereTimes,
  premiereWatchUrl,
  type LivePremiere,
} from "@/lib/content/live-premieres";
import { LIVE_FUNDS_DISCLOSURE } from "@/lib/content/live-campaign";
import { CAMPAIGN_URL, LIVE_CAMPAIGN_NAME, MISSION_NAME, SITE_URL } from "@/lib/constants";

/**
 * A For The 22: LIVE artist premiere — rendered by
 * src/app/campaigns/live/[slug]/page.tsx when the slug matches an entry in
 * LIVE_PREMIERES. The release itself stays on the artist's channel; this
 * page is the launch event that sends viewers there.
 */
export function PremierePage({ premiere }: { premiere: LivePremiere }) {
  const watchUrl = premiereWatchUrl(premiere);
  const dateLine = formatPremiereDate(premiere, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <>
      {/* Hero — the premiere poster. */}
      <section aria-labelledby="premiere-heading" className="relative overflow-hidden bg-live-stage text-white">
        <Container className="relative flex max-w-[1080px] flex-col items-center gap-6 pb-20 pt-16 text-center sm:pb-24 sm:pt-20">
          <span className="label-caps text-[#bdbdbd]">{LIVE_CAMPAIGN_NAME} presents</span>
          <h1 id="premiere-heading" className="flex flex-col items-center gap-3">
            <span className="font-display text-[clamp(1.75rem,4vw,2.75rem)] uppercase leading-none text-[#cfcfcf]">
              {premiere.artist}
            </span>
            <span className="text-worn font-display text-[clamp(4.5rem,15vw,10rem)] uppercase leading-[0.9]">
              &ldquo;{premiere.title}&rdquo;
            </span>
          </h1>
          <EqualizerBars />
          <p className="label-caps rounded-full bg-live-red px-4 py-2 text-sm text-white">{premiere.kind}</p>
          <div className="flex flex-col items-center gap-1">
            <p className="font-display text-[clamp(1.5rem,3vw,2rem)] uppercase leading-tight">{dateLine}</p>
            <p className="text-[#cfcfcf]">{formatPremiereTimes(premiere)}</p>
          </div>
          <PremiereCountdown startsAtIso={premiere.startsAt} releasedLabel={`“${premiere.title}” is out now`} />
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <CTAButton href={watchUrl} external size="lg" magnetic>
              Watch on YouTube
            </CTAButton>
            <CTAButton href="#list" size="lg" variant="secondary" tone="dark">
              Get on the list
            </CTAButton>
          </div>
        </Container>
      </section>

      {/* The night. */}
      <section aria-labelledby="program-heading" className="scroll-mt-24">
        <Container className="flex flex-col gap-11 py-section">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-3.5">
              <span className="label-caps text-live-red">The night</span>
              <h2 id="program-heading" className="text-worn font-display text-[clamp(3.25rem,6.6vw,5.75rem)] uppercase leading-none">
                <span className="text-outline">One song.</span>
                <br />
                One mission.
              </h2>
            </div>
            <p className="max-w-[420px] text-copy">{premiere.summary}</p>
          </div>
          <div aria-hidden="true" className="h-1 border-y-2 border-jet" />
          <ol className="grid gap-4 md:grid-cols-2">
            {premiere.program.map((step, i) => (
              <li key={step.title} className="flex flex-col gap-2.5 rounded-[4px] border-2 border-jet bg-white p-7">
                <span aria-hidden="true" className="font-display text-[54px] leading-none text-live-red">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-[30px] uppercase leading-none">{step.title}</h3>
                <p className="text-base text-copy">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* The artist's release. */}
      <section aria-labelledby="artist-heading" className="border-y-2 border-jet bg-white">
        <Container className="flex flex-wrap items-center gap-x-16 gap-y-8 py-section">
          <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-3.5">
            <span className="label-caps text-live-red">Their song. Their release.</span>
            <h2 id="artist-heading" className="font-display text-[clamp(2.5rem,4.6vw,3.75rem)] uppercase leading-none">
              Every view stays with the band.
            </h2>
          </div>
          <div className="flex min-w-0 flex-[999_1_420px] flex-col gap-5">
            <p className="text-copy">
              &ldquo;{premiere.title}&rdquo; and its music video belong to {premiere.artist}. The official video
              premieres on the band&apos;s own YouTube channel, so the views, subscribers, and long-term value stay
              with the artist. {LIVE_CAMPAIGN_NAME} is the launch event that sends you there.
            </p>
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

      {/* Why it matters. */}
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
            <span className="label-caps text-[#8c8c8c]">Watching is free</span>
            <h2 id="why-heading" className="font-display text-[clamp(2.5rem,4.6vw,3.75rem)] uppercase leading-none">
              Every song is for someone.
            </h2>
            <p className="text-[#cfcfcf]">
              The 22 is a symbol of the veterans and first responders we&apos;ve lost. If the night moves you, give
              to {MISSION_NAME} — it supports the organizations helping the people still here.
            </p>
            <p className="text-sm text-[#a9a9a9]">{LIVE_FUNDS_DISCLOSURE}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <CTAButton href={`${CAMPAIGN_URL}/donate`} external tone="dark">
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
      <section id="list" aria-labelledby="list-heading" className="scroll-mt-24">
        <Container className="flex max-w-[820px] flex-col items-center gap-5 py-section text-center">
          <Image src="/brand/live/badge.webp" alt="" width={130} height={130} />
          <h2 id="list-heading" className="font-display text-[clamp(2.75rem,5vw,4.25rem)] uppercase leading-none">
            Get on the list.
          </h2>
          <p className="text-copy">
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
