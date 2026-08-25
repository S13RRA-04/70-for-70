import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { CrisisQuickLink } from "@/components/shared/crisis-quick-link";
import { ScrollProgressRail } from "@/components/shared/scroll-progress-rail";
import { RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { ResourceCategoryGrid } from "@/components/home/resource-category-grid";
import { ABOUT_CONTENT, findAboutSubsection } from "@/lib/content/about";
import { OUTER_RING_COLORS } from "@/lib/ring-colors";
import {
  ORG_SUPPORTING_STATEMENT,
  ORG_TAGLINE,
  PERSONAL_PROJECT_DISCLOSURE,
  SITE_NAME,
} from "@/lib/constants";

/** The four areas of support the resource directory covers — physical health includes sports/fitness programs, but that's one entry among equals, not the site's emphasis. */
const AREAS_OF_SUPPORT = [
  {
    title: "Mental Health",
    description:
      "Counseling, therapy access, and peer support for PTSD, anxiety, depression, and the invisible weight of service.",
  },
  {
    title: "Physical Health",
    description:
      "Adaptive fitness, recovery, medical support, and athletic programs — including sports and fitness resources built for veterans and first responders.",
  },
  {
    title: "Emotional Wellness",
    description:
      "Family support, relationship resources, and community connection for those adjusting to life after service.",
  },
  {
    title: "Spiritual Health & Purpose",
    description:
      "Faith-based support, purpose-finding programs, and communities that help people rebuild direction.",
  },
] as const;

const WHO_WE_SERVE = [
  "Veterans",
  "Law Enforcement",
  "Fire",
  "EMS",
  "Dispatch",
  "Corrections",
  "Families & Caregivers",
] as const;

const RAIL_SECTIONS = [
  { id: "resources", label: "Resources" },
  { id: "support-areas", label: "Support" },
  { id: "who-we-serve", label: "Who We Serve" },
  { id: "why-22", label: "Meaning" },
  { id: "story", label: "Story" },
];

export default function HomePage() {
  const why22 = findAboutSubsection("why-22");
  const theIdea = findAboutSubsection("the-idea");

  return (
    <>
      <ScrollProgressRail sections={RAIL_SECTIONS} />

      {/* Hero — Tier 1: full-bleed photo, oversized type, full desktop viewport height */}
      <section className="relative overflow-hidden bg-ink text-off-white lg:flex lg:min-h-[88vh] lg:items-end">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: "url(/topo-map.png)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" aria-hidden="true" />

        <Container className="relative w-full py-24 sm:py-32 lg:pb-24">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-bronze-light">
            {SITE_NAME}
            <sup className="text-[0.6em] font-medium tracking-normal">™</sup>
          </p>
          <div
            aria-hidden="true"
            className="mt-4 flex h-1 w-40 overflow-hidden rounded-full"
          >
            {OUTER_RING_COLORS.map((ring) => (
              <span key={ring.branch} className="flex-1" style={{ backgroundColor: ring.hex }} />
            ))}
          </div>
          <h1 className="mt-5 text-balance font-display text-[clamp(2.5rem,8vw,5.5rem)] font-bold uppercase leading-[0.95] tracking-tight">
            {ORG_TAGLINE}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-off-white/80 sm:text-lg">
            {ORG_SUPPORTING_STATEMENT}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <CTAButton href="/resources" size="lg">
              Find Resources
            </CTAButton>
            <CTAButton href="/crisis" variant="secondary" tone="dark" size="lg">
              Get Help Now
            </CTAButton>
          </div>

          <a
            href="#crisis"
            className="mt-12 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-off-white/60 transition-colors hover:text-off-white"
          >
            Need Help Now?
            <ChevronDown size={14} aria-hidden="true" />
          </a>

          <p className="mt-10 max-w-xl text-xs leading-relaxed text-off-white/50">
            {PERSONAL_PROJECT_DISCLOSURE}
          </p>
        </Container>
      </section>

      {/* Find the Support You Need — Tier 2: gateway into the resource directory, crisis access integrated as a paired dark panel rather than its own full-width band */}
      <section id="resources" className="scroll-mt-20 bg-sand-light py-16 sm:py-24">
        <Container className="max-w-[1400px]">
          <RevealOnScroll>
            <SectionHeading
              eyebrow="Our Core Mission"
              title="Find the Support You Need"
              description="Resources for veterans, first responders, and their families. Start with what you need, and we'll help you find the right programs."
            />
          </RevealOnScroll>
          <RevealOnScroll className="mt-10">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-8 xl:col-span-9">
                <ResourceCategoryGrid />

                <p className="mt-8 max-w-xl text-sm leading-relaxed text-charcoal-light">
                  Not sure where to start? Browse all available resources or search by service type.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <CTAButton href="/resources" size="lg">
                    Find Resources
                  </CTAButton>
                  <CTAButton href="/resources" variant="ghost">
                    Browse All Resources &rarr;
                  </CTAButton>
                </div>
              </div>
              <div className="lg:col-span-4 xl:col-span-3">
                <CrisisQuickLink />
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* Areas of Support — the four pillars of the core mission, equal weight, no sport-specific emphasis */}
      <section id="support-areas" className="scroll-mt-20 bg-off-white py-16 sm:py-24">
        <Container className="max-w-[1400px]">
          <RevealOnScroll>
            <SectionHeading eyebrow="How We Help" title="Areas of Support" />
          </RevealOnScroll>
          <RevealOnScroll className="mt-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {AREAS_OF_SUPPORT.map((area) => (
                <div key={area.title} className="flex flex-col border border-ink/10 bg-sand-light/40 p-6">
                  <h3 className="font-display text-lg font-bold uppercase tracking-tight text-ink">
                    {area.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-light">{area.description}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* Who the Directory Serves */}
      <section id="who-we-serve" className="scroll-mt-20 bg-sand-light py-16 sm:py-24">
        <Container className="max-w-[1400px]">
          <RevealOnScroll>
            <SectionHeading eyebrow="Built For" title="Who the Directory Serves" />
          </RevealOnScroll>
          <RevealOnScroll className="mt-10">
            <ul className="flex flex-wrap gap-3">
              {WHO_WE_SERVE.map((group) => (
                <li
                  key={group}
                  className="border border-ink/10 bg-off-white px-5 py-3 text-sm font-semibold uppercase tracking-wide text-ink"
                >
                  {group}
                </li>
              ))}
            </ul>
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

      {/* Why I Started This — Tier 2: shrunk founder teaser, one image/paragraph/pull-quote, pointing to the full story on /about rather than retelling it here */}
      {theIdea && (
        <section id="story" className="scroll-mt-20 bg-sand-light py-16 sm:py-24">
          <Container className="max-w-[1400px]">
            <RevealOnScroll>
              <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm lg:col-span-5">
                  <Image
                    src={ABOUT_CONTENT.portraitUrl ?? "/about/hiking.jpg"}
                    alt={ABOUT_CONTENT.name}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="lg:col-span-7">
                  <SectionHeading eyebrow="Why I Started This" title="Finding the Right Support" />
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal-light">
                    {theIdea.body[0]}
                  </p>
                  <blockquote className="mt-6 max-w-xl border-l-2 border-bronze pl-5 font-display text-xl font-semibold uppercase leading-snug tracking-tight text-ink sm:text-2xl">
                    There is another veteran somewhere trying to figure out what comes next.
                    Another who needs a mission. Another who needs a team.
                  </blockquote>
                  <Link
                    href="/about#my-story"
                    className="mt-6 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze transition-colors hover:text-bronze-light"
                  >
                    Read My Story &rarr;
                  </Link>
                </div>
              </div>
            </RevealOnScroll>
          </Container>
        </section>
      )}

      {/* Final CTA — Tier 1: closing call to action, resource-finding stays the point to the last line */}
      <section id="find-resources" className="scroll-mt-20 bg-ink py-20 text-off-white sm:py-28">
        <Container className="max-w-3xl text-center">
          <p className="text-balance font-display text-[clamp(2rem,6vw,3.5rem)] font-bold uppercase leading-[0.95] tracking-tight">
            Where Can We Help You Find Support?
          </p>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-off-white/75">
            Search the directory, or reach out directly if you&apos;re not sure where to start.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CTAButton href="/resources" size="lg">
              Find Resources
            </CTAButton>
          </div>
        </Container>
      </section>
    </>
  );
}
