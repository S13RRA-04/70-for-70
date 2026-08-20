import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Dumbbell, HeartPulse, Package, Users } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ABOUT_CONTENT } from "@/lib/content/about";
import { CAMPAIGN_HOME_LINK, CAMPAIGN_NAME, ORG_TAGLINE, SITE_NAME } from "@/lib/constants";

const MISSION_STATEMENT =
  "For The 22 is a national mission to raise awareness of veteran and first responder suicide, and to get them the help they need. Part of that mission is connecting them to resources — specifically, engagement in endurance sports.";

/** A preview of four of the seven Resources need-categories — see src/components/resources/resource-directory.tsx. */
const RESOURCE_PREVIEW_TILES = [
  { icon: HeartPulse, label: "Mental Health" },
  { icon: Dumbbell, label: "Sports & Fitness" },
  { icon: Package, label: "Equipment & Grants" },
  { icon: Users, label: "Family Support" },
] as const;

const MOVE_VERBS = ["Race.", "Ride.", "Ruck.", "Swim.", "Lift.", "Move."];

export default function HomePage() {
  const why22 = ABOUT_CONTENT.sections.find((s) => s.id === "why-22");

  return (
    <>
      {/* Hero — the movement, not a fundraiser */}
      <section className="relative overflow-hidden bg-ink text-off-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: "url(/hero-placeholder.svg)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" aria-hidden="true" />

        <Container className="relative py-24 sm:py-32">
          <h1 className="text-balance font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl">
            {SITE_NAME}
            <sup className="text-[0.3em] font-medium tracking-normal">™</sup>
          </h1>
          <p className="mt-3 max-w-xl text-lg font-medium text-off-white/90 sm:text-xl">
            {ORG_TAGLINE}
          </p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-off-white/75">
            {MISSION_STATEMENT}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/resources"
              className="rounded-sm bg-bronze px-8 py-4 text-base font-semibold uppercase tracking-wide text-off-white shadow-sm transition-colors hover:bg-bronze-light"
            >
              Browse Resources
            </Link>
            <Link
              href="/join"
              className="rounded-sm border border-off-white/40 px-6 py-4 text-base font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-off-white/10"
            >
              Join the Movement
            </Link>
          </div>

          <a
            href="#why-22"
            className="mt-12 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-off-white/60 transition-colors hover:text-off-white"
          >
            Why 22?
            <ChevronDown size={14} aria-hidden="true" />
          </a>
        </Container>
      </section>

      {/* Why 22 — huge background numeral as the visual anchor */}
      {why22 && (
        <section id="why-22" className="relative scroll-mt-20 overflow-hidden py-20 sm:py-28">
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

      {/* The Mission — dark, deliberate contrast against Why 22 */}
      <section className="bg-ink py-20 text-off-white sm:py-28">
        <Container className="max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-bronze-light">
            The Mission
          </p>
          <h2 className="text-balance font-display text-3xl font-semibold uppercase tracking-tight sm:text-4xl">
            Endurance as a Path Forward
          </h2>
          <p className="mt-3 max-w-2xl text-base text-off-white/75">
            Awareness starts the conversation. Getting people moving — with a team, a mission, and
            people who understand — is what turns awareness into action.
          </p>
          <p className="mt-5 text-base leading-relaxed text-off-white/75">
            {SITE_NAME} connects veterans and first responders to the programs, communities, and
            equipment that make endurance sport an on-ramp back to purpose — not a replacement
            for professional help, but a real part of the path.
          </p>
        </Container>
      </section>

      {/* Resources teaser — a preview of the directory, not just a link */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl text-center">
          <SectionHeading
            align="center"
            eyebrow="Get Connected"
            title="Find What You Need"
            description="Mental health, sports, equipment, family support, career, and more — filter by what you need and who you are."
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
          <Link
            href="/resources"
            className="mt-8 inline-flex rounded-sm bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-charcoal"
          >
            Browse All Resources
          </Link>
        </Container>
      </section>

      {/* My Story teaser */}
      <section className="border-y border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:items-center">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
            <Image src="/about/ultra-1.jpg" alt="Cody racing his first 100-kilometer ultramarathon" fill className="object-cover" />
          </div>
          <div>
            <SectionHeading eyebrow="Who's Behind This" title="My Story" />
            <div className="mt-5 space-y-4">
              {ABOUT_CONTENT.homepageTeaser.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-charcoal-light">
                  {paragraph}
                </p>
              ))}
            </div>
            <Link
              href="/about"
              className="mt-6 inline-flex rounded-sm bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-charcoal"
            >
              Read My Story
            </Link>
          </div>
        </Container>
      </section>

      {/* Current campaign — a featured module, not another information block */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <div className="relative overflow-hidden rounded-sm border border-bronze/30 bg-ink p-8 text-off-white">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-bronze"
            />
            <div className="flex items-center gap-4">
              <Image
                src="/campaign-logo.png"
                alt=""
                aria-hidden="true"
                width={48}
                height={48}
                className="shrink-0"
              />
              <p className="text-xs font-semibold uppercase tracking-widest text-bronze-light">
                Current Mission
              </p>
            </div>
            <p className="mt-3 font-display text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
              {CAMPAIGN_NAME}
            </p>
            <p className="mt-2 max-w-lg text-sm text-off-white/75">
              A 70.3-mile triathlon paired with a $70,000 fundraising goal, in support of Mighty
              Oaks Foundation and Project Echelon — the first campaign under the {SITE_NAME}
              {" "}naming convention.
            </p>
            <a
              href={CAMPAIGN_HOME_LINK.href}
              className="mt-6 inline-flex rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
            >
              Visit {CAMPAIGN_HOME_LINK.label}
            </a>
          </div>
        </Container>
      </section>

      {/* Join — poster-style closer */}
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
            <Link
              href="/join"
              className="rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
            >
              Join the Movement
            </Link>
            <Link
              href="/resources"
              className="rounded-sm border border-off-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-off-white/10"
            >
              Browse Resources
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
