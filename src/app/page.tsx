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
  { id: "current-mission", label: "Team" },
  { id: "why-22", label: "Meaning" },
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

        Rendered via dangerouslySetInnerHTML, byte-for-byte matching the
        snippet AvantLink emailed — JSX would HTML-entity-escape the "&" in
        the src URL to "&amp;", and AvantLink's verifier does a literal
        string match against the page source rather than parsing the DOM,
        so the escaped version fails their check.
      */}
      <div
        dangerouslySetInnerHTML={{
          __html:
            '<script type="text/javascript" src="http://classic.avantlink.com/affiliate_app_confirm.php?mode=js&authResponse=f4570744e7bc43830fca392edd4d80ec04d58824"></script>',
        }}
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

      {/* Current Mission + The Team — Tier 2: dashboard split, one composition not two */}
      <section id="current-mission" className="scroll-mt-20 bg-off-white py-16 sm:py-24">
        <Container>
          <RevealOnScroll>
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <CurrentCampaignCard />
              </div>
              <div className="flex flex-col justify-center border border-ink/10 bg-off-white p-8 lg:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
                  Mission Three: Compete
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-ink">
                  The Team
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-light">
                  The For The 22 Athletic Team races, rides, rucks, swims, and lifts to raise
                  awareness and support fundraising for the nonprofit organizations serving
                  veterans and first responders.
                </p>
                <CTAButton href="/athletes" className="mt-6 self-start">
                  Become an Athlete
                </CTAButton>
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* Why 22 + Black — Tier 1: one dark memorial composition, no cards, no icons, typography-led */}
      {why22 && (
        <section id="why-22" className="scroll-mt-20 bg-ink py-20 text-off-white sm:py-28">
          <Container>
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
