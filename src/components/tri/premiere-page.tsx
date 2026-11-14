import Link from "next/link";
import { Container } from "@/components/shared/container";
import { CTAButton } from "@/components/shared/cta-button";
import { PageHero } from "@/components/shared/page-hero";
import { PillarNextSteps } from "@/components/shared/pillar-next-steps";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { MissionProgress } from "@/components/campaign/mission-progress";
import { PremiereCountdown, PremiereLocalTime } from "@/components/live/premiere-countdown";
import { VerticalVideoEmbed } from "@/components/live/vertical-video-embed";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import {
  formatPremiereDate,
  formatPremiereTimes,
  premiereCalendarUrl,
  premiereWatchUrl,
  type Premiere,
} from "@/lib/content/premieres";
import { CAMPAIGN_NAME, CURRENT_CAMPAIGN, DONATE_LINK, MISSION_NAME, TRI_PAGE_PATH, TRI_PAGE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { parseVideoUrl } from "@/lib/video-url";

/**
 * A Tri For The 22 artist premiere — rendered by
 * src/app/campaigns/tri/premiere/[slug]/page.tsx for an entry in PREMIERES.
 * The release itself stays on the artist's channel; this page is the launch
 * that sends viewers there, and the place to tell them what Tri For The 22
 * is racing for.
 */
export async function PremierePage({ premiere }: { premiere: Premiere }) {
  const { amountRaised, fundraisingGoal } = await getFundraisingImpactStats();
  const watchUrl = premiereWatchUrl(premiere);
  const dateLine = formatPremiereDate(premiere, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const teaser = premiere.teasers
    .map((url) => parseVideoUrl(url))
    .find((video) => video?.provider === "youtube");

  return (
    <>
      <PageHero
        pillar="mobilization"
        eyebrow={`${CAMPAIGN_NAME} presents`}
        title={`“${premiere.title}”`}
        description={
          <>
            <span className="font-bold text-navy">{premiere.artist}</span> · {premiere.kind}
          </>
        }
        aside={
          teaser ? (
            <div className="mx-auto w-[min(300px,72vw)]">
              <VerticalVideoEmbed videoId={teaser.id} title={`${premiere.artist} — “${premiere.title}” teaser`} />
            </div>
          ) : undefined
        }
      >
        <p className="font-display text-3xl uppercase leading-none text-navy">{dateLine}</p>
        <p className="mt-2 text-base text-copy">{formatPremiereTimes(premiere)}</p>
        <PremiereLocalTime startsAtIso={premiere.startsAt} className="text-sm text-steel" />
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <CTAButton href={watchUrl} external newTab size="lg" magnetic>
            Watch on YouTube
          </CTAButton>
          <CTAButton href={DONATE_LINK.href} size="lg" variant="secondary">
            Donate
          </CTAButton>
        </div>
        <a
          href={premiereCalendarUrl(premiere, `${TRI_PAGE_URL}/premiere/${premiere.slug}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block font-bold text-navy hover:text-help hover:underline"
        >
          + Add to calendar
        </a>
      </PageHero>

      {/* Countdown — PremiereCountdown is styled for a dark band. */}
      <section aria-label="Countdown to the premiere" className="bg-navy py-10 text-white">
        <Container className="flex flex-col items-center gap-3 text-center">
          <PremiereCountdown startsAtIso={premiere.startsAt} releasedLabel={`“${premiere.title}” is out now`} />
        </Container>
      </section>

      {/* Run of show. */}
      <section aria-labelledby="program-heading" className="border-b border-line py-16 sm:py-20">
        <Container>
          <RevealOnScroll>
            <SectionHeading eyebrow="The night" title="One song. One mission." />
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-copy">{premiere.summary}</p>
            <ol className="mt-8 grid gap-4 md:grid-cols-2">
              {premiere.program.map((step, i) => (
                <li
                  key={step.title}
                  className={cn(
                    "flex flex-col gap-2.5 rounded-xl border p-7",
                    step.mainEvent ? "border-navy bg-navy text-white" : "border-line bg-white text-jet",
                  )}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span
                      aria-hidden="true"
                      className={cn("font-display text-5xl leading-none", step.mainEvent ? "text-gold" : "text-olive")}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step.time && (
                      <span className="label-caps text-xs">
                        {step.mainEvent ? `The main event · ${step.time}` : step.time}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-3xl uppercase leading-none">{step.title}</h3>
                  <p className={cn("text-base", step.mainEvent ? "text-mist" : "text-copy")}>{step.description}</p>
                </li>
              ))}
            </ol>
          </RevealOnScroll>
        </Container>
      </section>

      {/* Why Tri For The 22. */}
      <section aria-labelledby="why-heading" className="border-b border-line bg-paper py-16 sm:py-20">
        <Container>
          <RevealOnScroll className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <SectionHeading eyebrow={CAMPAIGN_NAME} title="Why the song meets the race" />
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-copy">
                <p>
                  {CAMPAIGN_NAME} is a combat veteran&apos;s road to {CURRENT_CAMPAIGN.event} — 70.3 miles of
                  swimming, biking, and running that set the number behind {MISSION_NAME}.
                </p>
                <p>
                  The premiere is a chance to talk about that fundraising effort, and about the veterans, first
                  responders, and families it&apos;s for — and the organizations already helping them.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <CTAButton href={DONATE_LINK.href}>Donate</CTAButton>
                <CTAButton href="/crisis" accent="emergency">
                  Get Help Now
                </CTAButton>
                <Link href={TRI_PAGE_PATH} className="font-bold text-navy hover:text-help hover:underline">
                  About {CAMPAIGN_NAME} →
                </Link>
              </div>
            </div>
            <div className="rounded-xl border border-line bg-white p-6 lg:col-span-6">
              <MissionProgress totalRaised={amountRaised} goal={fundraisingGoal} />
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* The artist's release. */}
      <section aria-labelledby="artist-heading" className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Their song. Their release." title="Every view stays with the band" />
          <p className="mt-4 text-base leading-relaxed text-copy">
            &ldquo;{premiere.title}&rdquo; and its music video belong to {premiere.artist}. The official video premieres
            on the band&apos;s own YouTube channel, so the views, subscribers, and long-term value stay with the
            artist. {CAMPAIGN_NAME} is the launch that sends you there.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <CTAButton href={premiere.artistChannelUrl} external newTab accent="black">
              {premiere.artist} on YouTube
            </CTAButton>
            {premiere.listenUrl && (
              <CTAButton href={premiere.listenUrl} external newTab variant="secondary">
                Listen to &ldquo;{premiere.title}&rdquo;
              </CTAButton>
            )}
          </div>
        </Container>
      </section>

      <PillarNextSteps current="mobilization" />
    </>
  );
}
