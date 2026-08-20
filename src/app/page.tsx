import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Dumbbell, HeartPulse, Package, Users } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { CrisisQuickLink } from "@/components/shared/crisis-quick-link";
import { CurrentCampaignCard } from "@/components/shared/current-campaign-card";
import { MissionPanel } from "@/components/home/mission-panel";
import { AthleteTeamTeaser } from "@/components/home/athlete-team-teaser";
import { ABOUT_CONTENT, findAboutSubsection } from "@/lib/content/about";
import { SITE_NAME } from "@/lib/constants";

const HERO_HEADLINE = "For Those Who Serve. For What Comes Next.";
const HERO_COPY =
  "For The 22 connects veterans and first responders with the resources they need, raises awareness of the challenges they face, and brings athletes together to support nonprofit organizations serving those who serve us.";

/** The three missions that organize everything For The 22 does — see MissionPanel. */
const MISSIONS = [
  {
    number: "01" as const,
    title: "Connect",
    description:
      "Connecting veterans and first responders with athletic opportunities, recovery programs, grants, support services, and communities that promote mental, physical, and spiritual wellbeing.",
    ctaLabel: "Find Resources →",
    ctaHref: "/resources",
  },
  {
    number: "02" as const,
    title: "Advocate",
    description:
      "Raising awareness of the challenges carried by those who serve and encouraging communities to give veterans and first responders the respect, care, and support they have earned.",
    ctaLabel: "Why It Matters →",
    ctaHref: "/advocacy",
  },
  {
    number: "03" as const,
    title: "Compete",
    description:
      "Building an athletic team that uses races and physical challenges to raise awareness and support fundraising efforts for qualified nonprofit organizations serving veterans and first responders.",
    ctaLabel: "Meet the Team →",
    ctaHref: "/athletes",
  },
];

/** A preview of four of the seven Resources need-categories — see src/components/resources/resource-directory.tsx. */
const RESOURCE_PREVIEW_TILES = [
  { icon: HeartPulse, label: "Mental Health" },
  { icon: Dumbbell, label: "Sports & Fitness" },
  { icon: Package, label: "Equipment & Grants" },
  { icon: Users, label: "Family Support" },
] as const;

const MOVE_VERBS = ["Race.", "Ride.", "Ruck.", "Swim.", "Lift.", "Move."];

export default function HomePage() {
  const why22 = findAboutSubsection("why-22");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-off-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: "url(/hero-placeholder.svg)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" aria-hidden="true" />

        <Container className="relative py-24 sm:py-32">
          <h1 className="text-balance font-display text-[clamp(2.5rem,8vw,5rem)] font-bold uppercase leading-[0.95] tracking-tight">
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
            href="#missions"
            className="mt-12 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-off-white/60 transition-colors hover:text-off-white"
          >
            What Is {SITE_NAME}?
            <ChevronDown size={14} aria-hidden="true" />
          </a>
        </Container>
      </section>

      <CrisisQuickLink />

      {/* Our Three Missions */}
      <section id="missions" className="scroll-mt-20 py-16 sm:py-20">
        <Container>
          <SectionHeading align="center" eyebrow="How It Works" title="Our Three Missions" className="mx-auto" />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {MISSIONS.map((mission) => (
              <MissionPanel key={mission.number} {...mission} />
            ))}
          </div>
        </Container>
      </section>

      {/* Resource Finder Preview — Mission One */}
      <section className="border-y border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl text-center">
          <SectionHeading
            align="center"
            eyebrow="Mission One: Connect"
            title="Find What You Need"
            description="Search programs serving veterans, first responders, adaptive athletes, and their families — with an emphasis on athletics and whole-person wellbeing."
          />
          <div className="mx-auto mt-8 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
            {RESOURCE_PREVIEW_TILES.map(({ icon: Icon, label }) => (
              <Link
                key={label}
                href="/resources"
                className="group flex flex-col items-center gap-2.5 rounded-sm border border-ink/10 bg-off-white px-3 py-5 transition-colors hover:border-bronze/40"
              >
                <Icon size={22} className="text-bronze" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-wide text-ink group-hover:text-bronze">
                  {label}
                </span>
              </Link>
            ))}
          </div>
          <CTAButton href="/resources" variant="secondary" className="mt-8">
            Browse All Resources
          </CTAButton>
        </Container>
      </section>

      {/* Current Athletic Mission — Tri For The 22, nested under the Athletic Team */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <CurrentCampaignCard />
        </Container>
      </section>

      {/* Why 22 — huge background numeral as the visual anchor */}
      {why22 && (
        <section className="relative overflow-hidden py-20 sm:py-28">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-16 select-none font-display text-[16rem] font-bold leading-none text-ink/[0.04] sm:text-[24rem]"
          >
            22
          </span>
          <Container className="relative max-w-2xl">
            <SectionHeading eyebrow="Why 22" title={why22.heading} />
            <div className="mt-5 space-y-4">
              {why22.body.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-charcoal-light">
                  {paragraph}
                </p>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Why We Wear Black */}
      <section className="bg-ink py-20 text-off-white sm:py-28">
        <Container className="max-w-2xl">
          <p className="text-balance font-display text-4xl font-bold uppercase leading-none tracking-tight sm:text-6xl">
            Black.
          </p>
          <p className="mt-2 font-display text-xl font-semibold uppercase tracking-tight text-bronze-light sm:text-2xl">
            Because 22 &ne; 0.
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-off-white/75">
            Black is the foundation of the For The 22 brand because it represents mourning. We
            wear black for the veterans and first responders we have lost to suicide, trauma,
            injury, and the invisible battles carried long after the uniform comes off.
          </p>
          <Link
            href="/about#why-black"
            className="mt-6 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze-light transition-colors hover:text-bronze"
          >
            Learn the Meaning Behind the Brand &rarr;
          </Link>
        </Container>
      </section>

      {/* Athlete Team — Mission Three */}
      <AthleteTeamTeaser />

      {/* Public Awareness / Story — Mission Two */}
      <section className="border-y border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:items-center">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
            <Image
              src="/about/ultra-1.jpg"
              alt="Cody racing his first 100-kilometer ultramarathon"
              fill
              sizes="(min-width: 1024px) 360px, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading eyebrow="Mission Two: Advocate" title="Public Awareness & Story" />
            <div className="mt-5 space-y-4">
              {ABOUT_CONTENT.homepageTeaser.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-charcoal-light">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <CTAButton href="/about">Read the Story</CTAButton>
              <CTAButton href="/advocacy" variant="secondary">
                Why It Matters
              </CTAButton>
            </div>
          </div>
        </Container>
      </section>

      {/* Join the Mission — poster-style closer */}
      <section className="bg-ink py-20 text-off-white sm:py-28">
        <Container className="max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-bronze-light">
            Join {SITE_NAME}
          </p>
          <p className="text-balance font-display text-5xl font-bold uppercase leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl">
            {MOVE_VERBS.map((verb, i) => (
              <span key={verb}>
                {verb}
                {i < MOVE_VERBS.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
          <p className="mx-auto mt-8 max-w-xl text-base text-off-white/75">
            Use your challenge for something bigger. Onboarding isn&apos;t open yet — this is just
            the start of the list.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CTAButton href="/join">Join the Mission</CTAButton>
            <CTAButton href="/resources" variant="secondary" tone="dark">
              Find Resources
            </CTAButton>
          </div>
        </Container>
      </section>
    </>
  );
}
