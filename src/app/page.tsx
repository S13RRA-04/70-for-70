import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  Handshake,
  HeartHandshake,
  Share2,
  Footprints,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { CrisisQuickLink } from "@/components/shared/crisis-quick-link";
import { ScrollProgressRail } from "@/components/shared/scroll-progress-rail";
import { RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { ResourceCategoryGrid } from "@/components/home/resource-category-grid";
import { MissionProgress } from "@/components/campaign/mission-progress";
import { ABOUT_CONTENT, findAboutSubsection } from "@/lib/content/about";
import { OUTER_RING_COLORS } from "@/lib/ring-colors";
import { getMissionMetrics } from "@/lib/data/mission-metrics";
import { getPartners } from "@/lib/data/partners";
import {
  CAMPAIGN_URL,
  MISSION_NAME,
  MISSION_SUPPORTING_LINE,
  ORG_SUPPORTING_STATEMENT,
  ORG_TAGLINE,
  SITE_NAME,
} from "@/lib/constants";

/** Who the directory serves — a quiet inline line under the resource categories, not a repeated icon grid (the categories above already show "what you need"; this just confirms "who this is for"). */
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
  { id: "network", label: "Network" },
  { id: "resources", label: "Resources" },
  { id: "why-22", label: "Meaning" },
  { id: "mission", label: "The Mission" },
  { id: "story", label: "Story" },
];

/**
 * Homepage "Get Involved" options (secondary path for visitors who arrive
 * wanting to help — see the credibility plan's §21). Deliberately routed
 * through existing destinations: participate → /campaigns, partner → Tri's
 * partnership form (absolute URL, org host would 308 a relative link),
 * support → Tri's donate page, share → /resources. Resource discovery
 * stays the primary CTA elsewhere on the page; this section renders after
 * it and uses secondary-weight styling.
 */
const GET_INVOLVED_OPTIONS = [
  {
    icon: Footprints,
    title: "Participate",
    body: "Join an active challenge or event.",
    href: "/campaigns",
    cta: "See the Campaigns",
    external: false,
  },
  {
    icon: Handshake,
    title: "Partner",
    body: "Businesses and organizations can contribute equipment, services, funding, expertise, or reach.",
    href: `${CAMPAIGN_URL}/become-a-partner`,
    cta: "Become a Partner",
    external: true,
  },
  {
    icon: HeartHandshake,
    title: "Support",
    body: "Donate through a current beneficiary campaign.",
    href: `${CAMPAIGN_URL}/donate`,
    cta: "Donate",
    external: true,
  },
  {
    icon: Share2,
    title: "Share",
    body: "Help get trusted resources in front of the people who need them.",
    href: "/resources",
    cta: "Find Resources to Share",
    external: false,
  },
] as const;

export default async function HomePage() {
  const why22 = findAboutSubsection("why-22");
  const theIdea = findAboutSubsection("the-idea");
  const [metrics, beneficiaries] = await Promise.all([getMissionMetrics(), getPartners()]);

  const networkStats = [
    { value: metrics.resources, label: "Resources" },
    { value: metrics.beneficiaries, label: "Current Beneficiaries" },
    { value: metrics.campaignPartners, label: "Campaign Partners" },
    { value: metrics.activeCampaigns, label: "Active Campaigns" },
  ].filter((stat): stat is { value: number; label: string } => stat.value !== null);

  return (
    <>
      <ScrollProgressRail sections={RAIL_SECTIONS} />

      {/* Hero — Tier 1: full-bleed photo, oversized type, full desktop viewport height */}
      <section className="relative overflow-hidden bg-ink text-off-white lg:flex lg:min-h-[88vh] lg:items-end">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80 motion-safe:animate-hero-drift"
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
        </Container>
      </section>

      {/* Network Snapshot — Tier 2: a restrained institutional proof band
          directly after the hero, before anything else, so a new visitor
          sees evidence of a real organization before diving into either the
          resource directory or the founder story. Values from
          getMissionMetrics()/getFundraisingImpactStats(), never hardcoded. */}
      <section id="network" className="scroll-mt-20 bg-off-white py-16 sm:py-20">
        <Container>
          <RevealOnScroll>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
              <div className="lg:col-span-5">
                <SectionHeading
                  eyebrow="The Ecosystem"
                  title="A Growing Network Behind the Mission"
                  description="Resources, beneficiaries, campaign partners, and active campaigns — one organization, not separate projects."
                />
                <CTAButton href="/network" variant="secondary" className="mt-6">
                  Explore the Network &rarr;
                </CTAButton>
              </div>
              <dl className="grid grid-cols-2 gap-4 lg:col-span-7 sm:grid-cols-4">
                {networkStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-sm border border-ink/10 bg-sand-light/60 p-5 text-center"
                  >
                    <dd className="font-display text-3xl font-semibold text-ink sm:text-4xl">
                      {String(stat.value)}
                    </dd>
                    <dt className="mt-1 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* Find the Support You Need — Tier 2: gateway into the resource directory, crisis access integrated as a paired dark panel rather than its own full-width band */}
      <section id="resources" className="scroll-mt-20 bg-sand-light py-16 sm:py-24">
        <Container>
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

                <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                  Built for {WHO_WE_SERVE.join(" · ")}
                </p>

                <p className="mt-6 max-w-xl text-sm leading-relaxed text-charcoal-light">
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

      {/* Why 22 + Black — Tier 1: sparse, poster-like memorial composition, typography-led */}
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

      {/* $70K Mission — the one active initiative, not the org's identity.
          Beneficiary names come from real data (getPartners()), never
          invented; the progress bar reads the same canonical campaign
          total every other money-displaying page on the site reads. */}
      <section id="mission" className="scroll-mt-20 border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <RevealOnScroll>
            <SectionHeading eyebrow={MISSION_NAME} title={MISSION_SUPPORTING_LINE} />
            {beneficiaries.length > 0 && (
              <p className="mt-3 text-sm text-charcoal-light">
                Supporting {beneficiaries.map((p) => p.name).join(" and ")}.
              </p>
            )}
            <div className="mt-8 rounded-sm border border-ink/10 bg-off-white p-6 sm:p-8">
              {metrics.totalRaised !== null && metrics.fundraisingGoal !== null && (
                <MissionProgress totalRaised={metrics.totalRaised} goal={metrics.fundraisingGoal} showStats={false} />
              )}
            </div>
            <CTAButton href="/70k" className="mt-6">
              Explore The $70K Mission &rarr;
            </CTAButton>
          </RevealOnScroll>
        </Container>
      </section>

      {/* Why I Started This — Tier 2: shrunk founder teaser, one image/paragraph/pull-quote, pointing to the full story on /mission rather than retelling it here */}
      {theIdea && (
        <section id="story" className="scroll-mt-20 bg-sand-light py-16 sm:py-24">
          <Container>
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
                    className="mt-6 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze transition-colors hover:text-bronze-dark"
                  >
                    Read My Story &rarr;
                  </Link>
                </div>
              </div>
            </RevealOnScroll>
          </Container>
        </section>
      )}

      {/* Get Involved — secondary path for visitors who arrive wanting to
          help (credibility plan §21). Placed after the primary resource
          journey and the story so it never competes with Find Resources;
          the final CTA below still closes on resource discovery. */}
      <section id="get-involved" className="scroll-mt-20 bg-sand-light py-16 sm:py-20">
        <Container>
          <RevealOnScroll>
            <SectionHeading
              eyebrow="Get Involved"
              title="Want to Move the Mission Forward?"
              description="Not everyone who lands here is looking for help. If you're here to give it, four ways in:"
            />
          </RevealOnScroll>
          <RevealOnScroll className="mt-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {GET_INVOLVED_OPTIONS.map((option) => (
                <div key={option.title} className="flex flex-col border border-ink/10 bg-off-white p-6">
                  <option.icon className="h-6 w-6 text-bronze" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-tight text-ink">
                    {option.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-light">
                    {option.body}
                  </p>
                  {option.external ? (
                    <a
                      href={option.href}
                      className="mt-4 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze transition-colors hover:text-bronze-dark"
                    >
                      {option.cta} &rarr;
                    </a>
                  ) : (
                    <Link
                      href={option.href}
                      className="mt-4 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze transition-colors hover:text-bronze-dark"
                    >
                      {option.cta} &rarr;
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-charcoal-light">
              Curious what all of this adds up to?{" "}
              <Link href="/impact" className="font-semibold text-bronze hover:text-bronze-dark">
                See the impact &rarr;
              </Link>
            </p>
          </RevealOnScroll>
        </Container>
      </section>

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
