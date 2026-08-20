import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { CrisisQuickLink } from "@/components/shared/crisis-quick-link";
import { ScrollProgressRail } from "@/components/shared/scroll-progress-rail";
import { RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { MissionPanel } from "@/components/home/mission-panel";
import { ResourceFinderPreview } from "@/components/home/resource-finder-preview";
import { ABOUT_CONTENT, findAboutSubsection } from "@/lib/content/about";
import { THREE_MISSIONS } from "@/lib/content/three-missions";
import {
  ATHLETIC_TEAM_NAME,
  CAMPAIGN_HOME_LINK,
  CAMPAIGN_NAME,
  ORG_SUPPORTING_STATEMENT,
  ORG_TAGLINE,
  SITE_NAME,
} from "@/lib/constants";

const CAMPAIGN_STATS = [
  { value: "70.3 MI", label: "Race" },
  { value: "$70K", label: "Goal" },
  { value: "2027", label: "Chattanooga" },
] as const;

/** Real, confirmed beneficiary marks — shown on a light chip so each reads cleanly against the dark dashboard background regardless of the source logo's own color. */
const BENEFICIARY_LOGOS = [
  { name: "Mighty Oaks Foundation", src: "/partners/mighty-oaks-logo.png" },
  { name: "Project Echelon", src: "/partners/project-echelon-logo.png" },
  { name: "Veterans and Athletes United", src: "/partners/vau-logo.png" },
] as const;

const RAIL_SECTIONS = [
  { id: "missions", label: "Mission" },
  { id: "resources", label: "Resources" },
  { id: "current-mission", label: "Team" },
  { id: "why-22", label: "Meaning" },
  { id: "join", label: "Join" },
];

const MOVE_VERBS = ["Race.", "Ride.", "Ruck.", "Swim.", "Lift.", "Move."];

export default function HomePage() {
  const why22 = findAboutSubsection("why-22");
  const testimony = findAboutSubsection("my-testimony");

  return (
    <>
      <ScrollProgressRail sections={RAIL_SECTIONS} />

      {/* Hero — Tier 1: full-bleed photo, oversized type, full desktop viewport height */}
      <section className="relative overflow-hidden bg-ink text-off-white lg:flex lg:min-h-[88vh] lg:items-end">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: "url(/hero-placeholder.svg)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" aria-hidden="true" />

        <Container className="relative w-full py-24 sm:py-32 lg:pb-24">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-bronze-light">
            {SITE_NAME}
            <sup className="text-[0.6em] font-medium tracking-normal">™</sup>
          </p>
          <h1 className="mt-3 text-balance font-display text-[clamp(2.5rem,8vw,5.5rem)] font-bold uppercase leading-[0.95] tracking-tight">
            {ORG_TAGLINE}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-off-white/80 sm:text-lg">
            {ORG_SUPPORTING_STATEMENT}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <CTAButton href="/resources" size="lg">
              Find Resources
            </CTAButton>
            <CTAButton href="/join" variant="secondary" tone="dark" size="lg">
              Join the Mission
            </CTAButton>
          </div>

          <a
            href="#crisis"
            className="mt-12 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-off-white/60 transition-colors hover:text-off-white"
          >
            Need Help Now?
            <ChevronDown size={14} aria-hidden="true" />
          </a>
        </Container>
      </section>

      {/* Our Three Missions — Tier 3: CONNECT reads as a dark landmark panel; ADVOCATE/COMPETE stay light and secondary */}
      <section id="missions" className="scroll-mt-20 bg-off-white py-16 sm:py-24">
        <Container className="max-w-[1400px]">
          <RevealOnScroll>
            <SectionHeading eyebrow="How It Works" title="Our Three Missions" />
          </RevealOnScroll>
          <RevealOnScroll className="mt-10">
            <div className="grid gap-4 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <MissionPanel {...THREE_MISSIONS.connect} featured />
              </div>
              <div className="grid gap-4 lg:col-span-5">
                <MissionPanel {...THREE_MISSIONS.advocate} />
                <MissionPanel {...THREE_MISSIONS.compete} />
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* Find What You Need — Tier 2: wide functional composition, crisis access integrated as a paired dark panel rather than its own full-width band */}
      <section id="resources" className="scroll-mt-20 bg-sand-light py-16 sm:py-24">
        <Container className="max-w-[1400px]">
          <RevealOnScroll>
            <SectionHeading
              eyebrow="Mission One: Connect"
              title="Find What You Need"
              description="Search programs serving veterans, first responders, and their families — filter by what you need and who you are."
            />
          </RevealOnScroll>
          <RevealOnScroll className="mt-10">
            <div className="grid gap-6 lg:grid-cols-12 lg:gap-6">
              <div className="border border-ink/10 bg-off-white p-8 sm:p-10 lg:col-span-8">
                <ResourceFinderPreview />
              </div>
              <div className="lg:col-span-4">
                <CrisisQuickLink />
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* Current Mission + The Team — Tier 1: full-bleed campaign dashboard — photography, stats, beneficiary marks, and the team in one composition */}
      <section id="current-mission" className="scroll-mt-20 bg-ink py-20 text-off-white sm:py-28">
        <Container className="max-w-[1400px]">
          <RevealOnScroll>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm lg:col-span-5 lg:aspect-auto">
                <Image
                  src="/about/trail.jpg"
                  alt="Training on the road to 70.3"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="lg:col-span-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-bronze-light">
                  {ATHLETIC_TEAM_NAME} &middot; Current Campaign
                </p>
                <p className="mt-3 text-balance font-display text-4xl font-bold uppercase leading-none tracking-tight sm:text-5xl">
                  {CAMPAIGN_NAME}
                </p>
                <p className="mt-4 max-w-md text-base leading-relaxed text-off-white/75">
                  A 70.3-mile triathlon paired with a $70,000 fundraising goal, in support of
                  Mighty Oaks Foundation, Project Echelon, and Veterans and Athletes United.
                </p>

                <div className="mt-8 grid grid-cols-3 gap-4 border-t border-off-white/15 pt-6 sm:max-w-sm">
                  {CAMPAIGN_STATS.map((stat) => (
                    <div key={stat.label}>
                      <p className="font-display text-2xl font-bold tabular-nums text-bronze-light sm:text-3xl">
                        {stat.value}
                      </p>
                      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-off-white/60">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {BENEFICIARY_LOGOS.map((logo) => (
                    <div key={logo.name} className="rounded-sm bg-off-white/95 px-3 py-2">
                      <Image
                        src={logo.src}
                        alt={logo.name}
                        width={112}
                        height={40}
                        className="h-6 w-auto object-contain sm:h-7"
                      />
                    </div>
                  ))}
                </div>

                <CTAButton href={CAMPAIGN_HOME_LINK.href} external className="mt-9">
                  Follow the Campaign
                </CTAButton>
              </div>

              <div className="flex flex-col justify-center border-t border-off-white/15 pt-8 lg:col-span-3 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-bronze-light">
                  Mission Three: Compete
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight">
                  The Team
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-off-white/70">
                  The For The 22 Athletic Team races, rides, rucks, swims, and lifts to raise
                  awareness and support fundraising for the nonprofit organizations serving
                  veterans and first responders.
                </p>
                <CTAButton
                  href="/athletes"
                  variant="secondary"
                  tone="dark"
                  className="mt-6 self-start"
                >
                  Become an Athlete
                </CTAButton>
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* Why 22 + Black — Tier 1: sparse, poster-like memorial composition, typography-led */}
      {why22 && (
        <section id="why-22" className="scroll-mt-20 bg-ink py-20 text-off-white sm:py-28">
          <Container className="max-w-[1400px]">
            <RevealOnScroll>
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
                <div>
                  <span
                    aria-hidden="true"
                    className="font-display text-7xl font-bold leading-none text-bronze-light sm:text-8xl"
                  >
                    22
                  </span>
                  <div className="mt-6 space-y-4">
                    {why22.body.map((paragraph, i) => (
                      <p key={i} className="text-base leading-relaxed text-off-white/75">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="border-t border-off-white/15 pt-10 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
                  <p className="text-balance font-display text-5xl font-bold uppercase leading-none tracking-tight sm:text-6xl">
                    Black.
                  </p>
                  <p className="mt-2 font-display text-lg font-semibold uppercase tracking-tight text-bronze-light sm:text-xl">
                    Because 22 &ne; 0.
                  </p>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-off-white/75">
                    Black represents mourning. We wear it for the veterans and first responders
                    who are no longer here.
                  </p>
                  <Link
                    href="/about#why-black"
                    className="mt-5 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze-light transition-colors hover:text-bronze"
                  >
                    Why We Wear Black &rarr;
                  </Link>
                </div>
              </div>
            </RevealOnScroll>
          </Container>
        </section>
      )}

      {/* Why I Started This — Tier 3: editorial photo/text split with pull quote, quieter than the sections above and below it */}
      <section className="bg-off-white py-16 sm:py-24">
        <Container className="max-w-[1400px]">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
            <RevealOnScroll className="relative aspect-[4/5] w-full overflow-hidden rounded-sm lg:col-span-5">
              <Image
                src="/about/ultra-1.jpg"
                alt="Cody racing his first 100-kilometer ultramarathon"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </RevealOnScroll>
            <RevealOnScroll className="lg:col-span-7">
              <SectionHeading eyebrow="Founder Story" title="Why I Started This" />
              <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal-light">
                {ABOUT_CONTENT.homepageStoryExcerpt}
              </p>
              {testimony?.pullQuote && (
                <blockquote className="mt-6 max-w-xl border-l-2 border-bronze pl-5">
                  <p className="font-display text-lg italic leading-snug text-ink sm:text-xl">
                    &ldquo;{testimony.pullQuote.text}&rdquo;
                  </p>
                  <cite className="mt-2 block text-xs font-semibold uppercase not-italic tracking-widest text-bronze">
                    {testimony.pullQuote.attribution}
                  </cite>
                </blockquote>
              )}
              <CTAButton href="/about" className="mt-7">
                Read the Full Story →
              </CTAButton>
            </RevealOnScroll>
          </div>
        </Container>
      </section>

      {/* Join — Tier 1: kinetic oversized typography closer */}
      <section id="join" className="scroll-mt-20 bg-ink py-20 text-off-white sm:py-28">
        <Container className="max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-bronze-light">
            Whatever Moves You
          </p>
          <p className="text-balance font-display font-bold uppercase leading-[0.85] tracking-tight">
            {MOVE_VERBS.map((verb) => (
              <span
                key={verb}
                className="block text-[clamp(3rem,12vw,7rem)]"
              >
                {verb}
              </span>
            ))}
          </p>
          <p className="mx-auto mt-8 max-w-xl text-base text-off-white/75">
            Move for something bigger than the finish line.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CTAButton href="/join">Join For The 22</CTAButton>
            <CTAButton href="/resources" variant="secondary" tone="dark">
              Find Resources
            </CTAButton>
          </div>
        </Container>
      </section>
    </>
  );
}
