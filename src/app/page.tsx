import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { CTAButton } from "@/components/shared/cta-button";
import { findAboutSubsection } from "@/lib/content/about";
import { getMissionMetrics } from "@/lib/data/mission-metrics";
import { DONATE_LINK, ORG_TAGLINE } from "@/lib/constants";
import { ORG_PILLARS, PILLAR_TEXT, type MissionPillar } from "@/lib/pillars";
import { cn } from "@/lib/utils";
import { AuctionSpotlight } from "@/components/live/auction-spotlight";

/**
 * Org homepage — a front door, not the whole house.
 *
 * Hero (who we are + the two standing CTAs) → three doors, one per mission
 * pillar → one closing line on why the work matters. Each door carries one
 * stat and one action and leads to its pillar's hub (src/lib/pillars.ts),
 * where the depth lives: the resource finder and crisis lines on /resources
 * and /crisis, campaigns and the campaign film on /campaigns, the $70K
 * progress, beneficiaries and partners on /impact, Voices on /voices, and
 * the founder's story on /about. Resist adding sections here — add them to
 * the hub and let the door point to it.
 */

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const count = new Intl.NumberFormat("en-US");

/** Pillar accent per door: top rule + primary button. Text color comes from PILLAR_TEXT. */
const DOOR_ACCENT: Record<MissionPillar, { rule: string; button: string }> = {
  connection: { rule: "border-t-help", button: "bg-help hover:bg-help-dark" },
  mobilization: { rule: "border-t-olive", button: "bg-olive hover:bg-olive-dark" },
  impact: { rule: "border-t-impact", button: "bg-impact hover:bg-navy" },
};

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn("label-caps", className)}>{children}</span>;
}

export default async function HomePage() {
  const why22 = findAboutSubsection("why-22");
  const metrics = await getMissionMetrics();
  const [taglineFirst, ...taglineRest] = ORG_TAGLINE.split(/(?<=\.)\s+/);

  const raised = metrics.totalRaised;
  const goal = metrics.fundraisingGoal;
  const percent = raised !== null && goal ? Math.min(100, (raised / goal) * 100) : null;

  const doors: Record<MissionPillar, { question: string; body: string; stat: string | null; statLabel: string }> = {
    connection: {
      question: "Looking for support?",
      body: "Free and low-cost programs for veterans, first responders, and their families — every one reviewed by our team.",
      stat: metrics.resources !== null ? count.format(metrics.resources) : null,
      statLabel: "reviewed programs",
    },
    mobilization: {
      question: "Want to get involved?",
      body: "Ruck, race, move, or bring your team, brand, or audience into the mission. Every campaign feeds The $70K Mission.",
      stat: metrics.activeCampaigns !== null ? String(metrics.activeCampaigns) : null,
      statLabel: metrics.activeCampaigns === 1 ? "active campaign" : "active campaigns",
    },
    impact: {
      question: "Where does it go?",
      body: "Participation becomes funding and visibility for the organizations doing the work. See who it reaches.",
      stat: raised !== null ? usd.format(raised) : null,
      statLabel: goal ? `raised of ${usd.format(goal)}` : "raised",
    },
  };

  return (
    <>
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
            <CTAButton href="/crisis" size="lg" accent="emergency">
              Get Help Now
            </CTAButton>
            <CTAButton href={DONATE_LINK.href} size="lg" variant="secondary">
              Donate
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Renders only while an auction is open or upcoming. */}
      <AuctionSpotlight />

      {/* Three doors — one per mission pillar. */}
      <section aria-labelledby="doors-heading" className="border-y border-line bg-white">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-10 px-6 py-16 sm:py-20">
          <h2 id="doors-heading" className="text-center font-display text-[clamp(32px,3.6vw,44px)] uppercase leading-none text-navy">
            Where do you want to start?
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {ORG_PILLARS.map((pillar) => {
              const door = doors[pillar.id];
              const accent = DOOR_ACCENT[pillar.id];
              return (
                <article
                  key={pillar.id}
                  aria-labelledby={`door-${pillar.id}`}
                  className={cn("flex flex-col gap-4 rounded-xl border border-t-4 border-line bg-paper p-7 sm:p-8", accent.rule)}
                >
                  <Label className={cn("text-xs", PILLAR_TEXT[pillar.id])}>
                    {pillar.number} · {pillar.title}
                  </Label>
                  <h3 id={`door-${pillar.id}`} className="font-display text-[36px] uppercase leading-none text-navy">
                    {door.question}
                  </h3>
                  <p className="text-base leading-relaxed text-copy">{door.body}</p>

                  {door.stat && (
                    <div className="flex flex-col gap-2 border-t border-line pt-4">
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-display text-[32px] leading-none text-navy">{door.stat}</span>
                        <span className="text-[15px] text-muted">{door.statLabel}</span>
                      </div>
                      {pillar.id === "impact" && percent !== null && goal !== null && raised !== null && (
                        <div
                          role="progressbar"
                          aria-label={`Funds raised toward ${usd.format(goal)}`}
                          aria-valuemin={0}
                          aria-valuemax={goal}
                          aria-valuenow={raised}
                          className="h-2.5 overflow-hidden rounded-full bg-impact-tint"
                        >
                          <div className="h-full min-w-2.5 rounded-full bg-impact" style={{ width: `${percent}%` }} />
                        </div>
                      )}
                    </div>
                  )}

                  {pillar.id === "connection" && (
                    <form action="/resources" role="search" className="flex gap-2">
                      <label htmlFor="home-resource-search" className="sr-only">
                        Search for support
                      </label>
                      <input
                        id="home-resource-search"
                        type="search"
                        name="q"
                        maxLength={100}
                        placeholder="PTSD, rent help, caregiver…"
                        className="min-h-12 min-w-0 flex-1 rounded-lg border-[1.5px] border-[#8a909c] bg-white px-3.5 text-base text-jet placeholder:text-[#5f636b] focus-visible:border-help"
                      />
                      <button
                        type="submit"
                        aria-label="Search for support"
                        className="action-control inline-flex min-h-12 w-12 shrink-0 items-center justify-center border-[1.5px] border-navy bg-white text-navy hover:bg-paper"
                      >
                        <Search size={18} aria-hidden="true" />
                      </button>
                    </form>
                  )}

                  <Link
                    href={pillar.hub.href}
                    className={cn("action-control mt-auto inline-flex min-h-[50px] items-center justify-center px-6 font-bold text-white", accent.button)}
                  >
                    {pillar.navLabel} →
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why 22 — the one closing line, and where to read more. */}
      <section aria-labelledby="why-heading" className="bg-jet text-paper">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-16 gap-y-8 px-6 py-16 sm:py-20">
          <Image
            src="/brand/because-22-white.webp"
            alt="Because 22 does not equal 0"
            width={1600}
            height={1014}
            sizes="(min-width: 768px) 320px, 70vw"
            className="h-auto w-full max-w-[320px]"
          />
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">
            <h2 id="why-heading" className="font-display text-[clamp(32px,3.6vw,48px)] uppercase leading-none">
              A symbol we carry, not a statistic we repeat.
            </h2>
            {why22?.body.at(-1) && <p className="max-w-[620px] text-lg leading-relaxed text-[#cfcfcf]">{why22.body.at(-1)}</p>}
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-bold">
              <Link href="/about#why-22" className="text-white underline underline-offset-4 hover:text-gold">
                Why 22 →
              </Link>
              <Link href="/about#my-story" className="text-white underline underline-offset-4 hover:text-gold">
                Why I started this →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
