import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { CrisisQuickLink } from "@/components/shared/crisis-quick-link";
import { CurrentCampaignCard } from "@/components/shared/current-campaign-card";
import { ScrollProgressRail } from "@/components/shared/scroll-progress-rail";
import { RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { MissionPanel } from "@/components/home/mission-panel";
import { AthleteTeamTeaser } from "@/components/home/athlete-team-teaser";
import { ResourceFinderPreview } from "@/components/home/resource-finder-preview";
import { ABOUT_CONTENT, findAboutSubsection } from "@/lib/content/about";
import { SITE_NAME } from "@/lib/constants";

const HERO_HEADLINE = "For Those Who Serve. For What Comes Next.";
const HERO_COPY =
  "For The 22 connects veterans and first responders with the resources they need, raises awareness of the challenges they face, and brings athletes together to support the nonprofit organizations serving them.";

const MISSIONS = {
  connect: {
    number: "01" as const,
    title: "Connect",
    description:
      "Connecting veterans and first responders with athletic opportunities, recovery programs, grants, support services, and communities that promote mental, physical, and spiritual wellbeing.",
    ctaLabel: "Find Resources →",
    ctaHref: "/resources",
  },
  advocate: {
    number: "02" as const,
    title: "Advocate",
    description:
      "Raising awareness of the challenges carried by those who serve.",
    ctaLabel: "Why It Matters →",
    ctaHref: "/advocacy",
  },
  compete: {
    number: "03" as const,
    title: "Compete",
    description: "An athletic team that competes to support the nonprofits serving them.",
    ctaLabel: "Meet the Team →",
    ctaHref: "/athletes",
  },
};

const RAIL_SECTIONS = [
  { id: "missions", label: "Mission" },
  { id: "resources", label: "Resources" },
  { id: "current-mission", label: "Current Mission" },
  { id: "why-22", label: "Why 22" },
  { id: "join", label: "Join" },
];

const MOVE_VERBS = ["Race.", "Ride.", "Ruck.", "Swim.", "Lift.", "Move."];

export default function HomePage() {
  const why22 = findAboutSubsection("why-22");

  return (
    <>
      {/*
        TEMPORARY — AvantLink affiliate application site-ownership
        verification (application_id=1640161). Per AvantLink's own
        instructions this is meant to be removed once verification
        succeeds — after confirming at
        https://classic.avantlink.com/affiliate_app_confirm.php?mode=verify-js&application_id=1640161
        (only works once this is deployed live), delete this script tag.
      */}
      <script
        type="text/javascript"
        src="https://classic.avantlink.com/affiliate_app_confirm.php?mode=js&authResponse=f4570744e7bc43830fca392edd4d80ec04d58824"
        async
      />
      <ScrollProgressRail sections={RAIL_SECTIONS} />

      {/* Hero — Tier 1: full-bleed photo, oversized type */}
      <section className="relative overflow-hidden bg-ink text-off-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: "url(/hero-placeholder.svg)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" aria-hidden="true" />

        <Container className="relative py-24 sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-bronze-light">
            {SITE_NAME}
            <sup className="text-[0.6em] font-medium tracking-normal">™</sup>
          </p>
          <h1 className="mt-3 text-balance font-display text-[clamp(2.5rem,8vw,5rem)] font-bold uppercase leading-[0.95] tracking-tight">
            {HERO_HEADLINE}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-off-white/80 sm:text-lg">
            {HERO_COPY}
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

      {/* Our Three Missions — Tier 3: wide editorial grid, CONNECT dominant */}
      <section id="missions" className="scroll-mt-20 bg-off-white py-16 sm:py-24">
        <Container>
          <RevealOnScroll>
            <SectionHeading eyebrow="How It Works" title="Our Three Missions" />
          </RevealOnScroll>
          <RevealOnScroll className="mt-10">
            <div className="grid gap-4 lg:grid-cols-2">
              <MissionPanel {...MISSIONS.connect} featured />
              <div className="grid gap-4">
                <MissionPanel {...MISSIONS.advocate} />
                <MissionPanel {...MISSIONS.compete} />
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* Find What You Need — Tier 2: functional tool, distinct light tone */}
      <section id="resources" className="scroll-mt-20 bg-sand-light py-16 sm:py-24">
        <Container className="max-w-2xl">
          <RevealOnScroll>
            <SectionHeading
              eyebrow="Mission One: Connect"
              title="Find What You Need"
              description="Search programs serving veterans, first responders, and their families — filter by what you need and who you are."
            />
          </RevealOnScroll>
          <RevealOnScroll className="mt-8">
            <ResourceFinderPreview />
          </RevealOnScroll>
        </Container>
      </section>

      {/* Need Help Now — Tier 1: compact dark utility strip */}
      <CrisisQuickLink />

      {/* Current Athletic Mission — Tier 2: dashboard split */}
      <section id="current-mission" className="scroll-mt-20 bg-off-white py-16 sm:py-24">
        <Container className="max-w-3xl">
          <RevealOnScroll>
            <CurrentCampaignCard />
          </RevealOnScroll>
        </Container>
      </section>

      {/* Black — Tier 1: full-black poster moment, no card, no clutter */}
      <section className="flex min-h-[75vh] flex-col items-center justify-center bg-ink px-4 py-20 text-center text-off-white sm:py-28">
        <Image src="/logo-white.png" alt="" aria-hidden="true" width={44} height={44} className="opacity-90" />
        <p className="mt-8 text-balance font-display text-6xl font-bold uppercase leading-none tracking-tight sm:text-8xl">
          Black.
        </p>
        <p className="mt-3 font-display text-xl font-semibold uppercase tracking-tight text-bronze-light sm:text-2xl">
          Because 22 &ne; 0.
        </p>
        <p className="mt-6 max-w-md text-base leading-relaxed text-off-white/70">
          Black represents mourning. We wear it for the veterans and first responders who are no
          longer here.
        </p>
        <Link
          href="/about#why-black"
          className="mt-6 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze-light transition-colors hover:text-bronze"
        >
          Why We Wear Black &rarr;
        </Link>
      </section>

      {/* Why 22 — Tier 3: editorial, ghosted numeral device */}
      {why22 && (
        <section id="why-22" className="relative scroll-mt-20 overflow-hidden bg-sand-light py-20 sm:py-28">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-16 select-none font-display text-[16rem] font-bold leading-none text-ink/[0.05] sm:text-[24rem]"
          >
            22
          </span>
          <Container className="relative max-w-2xl">
            <RevealOnScroll>
              <SectionHeading eyebrow="Why 22" title={why22.heading} />
              <div className="mt-5 space-y-4">
                {why22.body.map((paragraph, i) => (
                  <p key={i} className="text-base leading-relaxed text-charcoal-light">
                    {paragraph}
                  </p>
                ))}
              </div>
            </RevealOnScroll>
          </Container>
        </section>
      )}

      {/* Why I Started This — Tier 3: editorial photo + short excerpt */}
      <section className="bg-off-white py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:items-center">
          <RevealOnScroll className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
            <Image
              src="/about/ultra-1.jpg"
              alt="Cody racing his first 100-kilometer ultramarathon"
              fill
              sizes="(min-width: 1024px) 360px, 100vw"
              className="object-cover"
            />
          </RevealOnScroll>
          <RevealOnScroll>
            <SectionHeading eyebrow="Founder Story" title="Why I Started This" />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal-light">
              {ABOUT_CONTENT.homepageStoryExcerpt}
            </p>
            <CTAButton href="/about" className="mt-6">
              Read the Full Story →
            </CTAButton>
          </RevealOnScroll>
        </Container>
      </section>

      {/* The Athletic Team — Tier 2, compact */}
      <AthleteTeamTeaser />

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
