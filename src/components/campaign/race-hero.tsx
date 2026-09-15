import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Countdown } from "@/components/shared/countdown";
import { RACE_INFO } from "@/lib/constants";

/**
 * The cinematic race-day hero — replaces the old CampaignPageHero block and
 * absorbs the countdown/event-info half of the retired RaceDashboard (see
 * DistanceStrip for the other half, the leg-distance cards).
 *
 * Background photo: the Walnut Street Bridge over the Tennessee River at
 * sunrise, with open-water swimmers, kayak safety escorts, and support
 * boats on the water — the actual IRONMAN 70.3 Chattanooga swim course.
 * A dark gradient overlay sits on top for text contrast; verified against
 * WCAG AA for the off-white text at every breakpoint.
 */
export function RaceHero() {
  return (
    <section className="relative overflow-hidden bg-ink text-off-white">
      <Image
        src="/the-race/chattanooga-river-bridge.jpg"
        alt="The Walnut Street Bridge over the Tennessee River at sunrise, with open-water swimmers, kayak safety escorts, and support boats on the IRONMAN 70.3 Chattanooga swim course"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/80 to-ink" aria-hidden="true" />

      <Container className="relative py-20 sm:py-28">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-bronze-light">
              The Road to Chattanooga
            </p>
            <h1 className="mt-4 text-balance font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              IRONMAN 70.3
              <br />
              Chattanooga
            </h1>
            <p className="mt-5 text-balance font-display text-2xl font-semibold uppercase tracking-tight text-off-white/90 sm:text-3xl">
              70.3 Miles. One Finish Line.
            </p>
            <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-off-white/70">
              {RACE_INFO.raceDate && (
                <>
                  {new Date(RACE_INFO.raceDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                  {RACE_INFO.raceLocation && " · "}
                </>
              )}
              {RACE_INFO.raceLocation}
            </p>

            {RACE_INFO.registrationUrl && (
              <a
                href={RACE_INFO.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-1.5 rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
              >
                Register for the Race
                <ExternalLink size={14} aria-hidden />
              </a>
            )}
          </div>

          <div className="flex shrink-0 flex-col items-center gap-6">
            <Image
              src="/campaign-logo-white.png"
              alt="Tri For The 22 campaign logo mark"
              width={140}
              height={140}
              className="w-28 sm:w-32"
              priority
            />
            {RACE_INFO.raceDate && (
              <div className="w-full max-w-xs rounded-sm border border-off-white/15 bg-off-white/5 p-5 backdrop-blur-sm">
                <p className="text-center text-xs font-semibold uppercase tracking-widest text-off-white/60">
                  Race Day
                </p>
                <div className="mt-3">
                  <Countdown targetIso={RACE_INFO.raceDate} />
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
