import Image from "next/image";
import Link from "next/link";
import {
  Ambulance,
  ArrowRight,
  Ban,
  Brain,
  Activity,
  Compass,
  Eye,
  Flame,
  HeartHandshake,
  LifeBuoy,
  Link2,
  Lock,
  Megaphone,
  MessageCircle,
  Radio,
  RefreshCw,
  Scale,
  Shield,
  ShieldAlert,
  Star,
  Users,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { ORG_SUPPORTING_LINE, ORG_SUPPORTING_STATEMENT, ORG_TAGLINE, SITE_NAME } from "@/lib/constants";
import { INNER_RING_COLORS, OUTER_RING_COLORS } from "@/lib/ring-colors";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Mission",
  description: `${ORG_SUPPORTING_STATEMENT} Who we serve, how the resource directory works, and why it exists.`,
  canonical: "/mission",
});

const WHO_WE_SERVE = [
  { label: "Veterans", icon: Star, color: OUTER_RING_COLORS[4], background: "#EEF0E5" },
  { label: "Law Enforcement", icon: Shield, color: INNER_RING_COLORS[0], background: "#E8EFF5" },
  { label: "Fire", icon: Flame, color: INNER_RING_COLORS[1], background: "#F9E7EA" },
  { label: "EMS", icon: Ambulance, color: INNER_RING_COLORS[2], background: "#FFFFFF", iconColor: "#4B5563" },
  { label: "Dispatch", icon: Radio, color: INNER_RING_COLORS[3], background: "#FFF8D6", iconColor: "#8A6500" },
  { label: "Corrections", icon: Lock, color: INNER_RING_COLORS[5], background: "#F0F1F3", iconColor: "#59616D" },
  {
    label: "Families & Caregivers",
    icon: HeartHandshake,
    color: { color: "Purple Blend", hex: "#6D3F82" },
    background: "#F1EAF4",
  },
] as const;

const RESOURCE_AREAS = [
  {
    icon: Brain,
    title: "Mental Health",
    description: "Counseling, therapy access, and peer support.",
  },
  {
    icon: Activity,
    title: "Physical Health",
    description: "Adaptive fitness, recovery, and medical support.",
  },
  {
    icon: Users,
    title: "Emotional Wellness",
    description: "Family, relationship, and community connection.",
  },
  {
    icon: Compass,
    title: "Spiritual Health & Purpose",
    description: "Faith-based support and purpose-finding communities.",
  },
  {
    icon: Scale,
    title: "Career, Financial & Legal",
    description: "Career transition, financial, and legal assistance.",
  },
] as const;

const THE_REALITY = [
  {
    icon: ShieldAlert,
    title: "Service Doesn't End at Discharge",
    body: [
      "Veterans, law-enforcement officers, firefighters, EMS personnel, dispatchers, and other frontline professionals routinely serve their communities and country under extraordinary physical and psychological demands. Many place their health and their lives at risk in service to others.",
      "That service doesn't simply end when the deployment, the shift, or the career does. Leaving a role built around mission, unit, and purpose is its own kind of transition — one that can leave people carrying real weight without the structure that once helped them carry it.",
    ],
  },
  {
    icon: HeartHandshake,
    title: "The Costs That Don't Show",
    body: [
      "The effects of service aren't always visible. Physical injury, chronic pain, and the strain of years spent operating under pressure can persist long after the uniform comes off. So can the harder-to-see costs — reintegration, identity, and the mental and emotional load of what the job asked of them.",
    ],
  },
] as const;

const HOW_TO_HELP = [
  {
    icon: Eye,
    title: "Learn the Signs",
    body: "Isolation, sudden changes in mood or habits, giving away possessions, or talking about being a burden are all worth taking seriously — in a veteran, a first responder, or anyone else.",
  },
  {
    icon: MessageCircle,
    title: "Check In, Directly",
    body: "A direct, specific question — not \"how are you,\" but \"how are you really doing since you got back / since that call\" — tells someone their answer actually matters.",
  },
  {
    icon: LifeBuoy,
    title: "Point Toward Real Support",
    body: "You don't have to be the solution. Knowing where to send someone — a resource, a crisis line, a peer support program — is often the most useful thing you can offer.",
  },
  {
    icon: RefreshCw,
    title: "Stay Past the Headline",
    body: "Public attention on veteran and first-responder wellbeing tends to spike around anniversaries and news cycles. The need doesn't. Staying engaged year-round is its own form of advocacy.",
  },
] as const;

const HOW_IT_WORKS = [
  {
    number: "01",
    title: "Search & Filter",
    body: "Search the directory by what you need and who you are — veteran or first responder, family member or caregiver.",
  },
  {
    number: "02",
    title: "Every Resource Is Reviewed",
    body: "Submissions come from the community and are checked for legitimacy and relevance before going live.",
  },
] as const;

const WHAT_WE_ARE_NOT = [
  {
    title: "Not a Crisis-Response Provider",
    body: "If you're in crisis, visit our Need Help Now page for immediate resources.",
  },
  {
    title: "Not a Medical Provider",
    body: "We do not diagnose, treat, or offer clinical advice.",
  },
  {
    title: "Not a Government Program",
    body: "Not sponsored, endorsed, or operated by any employer or government entity.",
  },
  {
    title: "Not the Operator of Listed Programs",
    body: "We connect people to third-party programs and services — we don't run them.",
  },
] as const;

export default function MissionPage() {
  return (
    <>
      {/* Hero — asymmetrical rather than a centered text column; the ring-
          color strip echoes the branch/sector colors "Who We Serve" uses
          just below, tying the two together instead of introducing an
          unrelated visual. */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-8">
              <SectionHeading as="h1" eyebrow="Our Mission" title={ORG_TAGLINE} description={ORG_SUPPORTING_STATEMENT} />
            </div>
            <div className="flex flex-col items-center lg:col-span-4">
              <div className="relative aspect-square w-full max-w-[180px]">
                <Image src="/logo.png" alt="" fill className="object-contain" sizes="180px" />
              </div>
              <div className="mt-4 flex h-1 w-40 overflow-hidden rounded-full" aria-hidden="true">
                {OUTER_RING_COLORS.map((ring) => (
                  <span key={ring.branch} className="flex-1" style={{ backgroundColor: ring.hex }} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Who We Serve — chip row, not a bullet list */}
      <section className="bg-off-white py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Built For" title="Who We Serve" />
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {WHO_WE_SERVE.map(({ label, icon: Icon, color, background, ...item }) => (
              <li
                key={label}
                className="flex flex-col items-center gap-2.5 border border-ink/10 border-t-4 px-4 py-6 text-center"
                style={{ backgroundColor: background, borderTopColor: color.hex }}
              >
                <Icon
                  size={24}
                  strokeWidth={1.75}
                  style={{ color: "iconColor" in item ? item.iconColor : color.hex }}
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold uppercase tracking-wide text-ink">{label}</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-charcoal-light">
                  {color.color}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* What We Connect People To — icon-card grid */}
      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="How We Help" title="What We Connect People To" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {RESOURCE_AREAS.map((area) => (
              <div key={area.title} className="flex flex-col border border-ink/10 bg-off-white p-6">
                <area.icon className="h-6 w-6 text-bronze" aria-hidden="true" />
                <h3 className="mt-4 font-display text-base font-bold uppercase tracking-tight text-ink">
                  {area.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-light">{area.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why It Matters — folded in from the retired /advocacy page */}
      <section id="why-it-matters" className="scroll-mt-28 border-t border-ink/10 bg-off-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Why It Matters"
            title="What They Carry"
            description="Raising awareness of the challenges carried by those who serve, and asking the public to give them the respect, care, and support they've earned."
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start">
            <div className="relative min-h-[420px] overflow-hidden rounded-sm lg:sticky lg:top-28 lg:col-span-5 lg:min-h-[560px]">
              <Image src="/about/navy-green.jpg" alt="A veteran in uniform" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
              <blockquote className="absolute inset-x-0 bottom-0 p-7 font-display text-2xl font-semibold uppercase leading-tight text-off-white">
                The need does not end when the uniform comes off.
              </blockquote>
            </div>
            <div className="space-y-4 lg:col-span-7">
            {THE_REALITY.map((item) => (
              <div key={item.title} className="border border-ink/10 bg-sand-light/40 p-8">
                <item.icon className="h-6 w-6 text-bronze" aria-hidden="true" />
                <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-tight text-ink">
                  {item.title}
                </h3>
                <div className="mt-3 space-y-3 text-base leading-relaxed text-charcoal-light">
                  {item.body.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
            <p className="border-l-2 border-bronze py-2 pl-6 text-sm leading-relaxed text-charcoal-light">
              None of that stays contained to one person. Spouses, kids, and coworkers absorb part of
              it too, which is part of why {SITE_NAME}&apos;s resource directory includes family and
              caregiver support alongside programs built for veterans and first responders directly.
            </p>
            </div>
          </div>
        </Container>
      </section>

      {/* A Public Responsibility — four-up icon-card grid */}
      <section className="border-t border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container>
          <SectionHeading
            tone="dark"
            eyebrow="A Public Responsibility"
            title="A Handful of Things Anyone Can Do"
            description="Service deserves continued respect, care, and support — not just while it's happening, but long after. Advocacy doesn't require a uniform, a badge, or a donation."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_TO_HELP.map((item) => (
              <div key={item.title} className="border border-off-white/15 p-6">
                <item.icon className="h-6 w-6 text-bronze-light" aria-hidden="true" />
                <h3 className="mt-4 font-display text-sm font-bold uppercase tracking-wide text-off-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-off-white/70">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How the directory works — numbered process row */}
      <section className="border-t border-ink/10 bg-off-white py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="The Process" title="How the Directory Works" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.number} className="relative border border-ink/10 bg-sand-light/40 p-8">
                <span className="font-display text-5xl font-bold text-bronze/60">{step.number}</span>
                <h3 className="mt-3 font-display text-xl font-semibold uppercase tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-charcoal-light">{step.body}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <ArrowRight
                    aria-hidden="true"
                    className="absolute right-0 top-1/2 hidden h-6 w-6 -translate-y-1/2 translate-x-1/2 text-bronze sm:block"
                  />
                )}
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-charcoal-light">
            Raising awareness of the challenges carried by those who serve supports this mission —
            it&apos;s part of why the directory exists at {SITE_NAME}, not a separate goal of its own.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-charcoal-light">
            <Link href="/standards" className="font-semibold text-bronze hover:text-bronze-dark">
              How Resources Are Reviewed &rarr;
            </Link>
          </p>
        </Container>
      </section>

      {/* How We Move the Mission Forward — the two arms of the org (Connect
          = the directory, Mobilize = the campaigns), added so the mission
          reads as connect + mobilize rather than directory-only. Cards carry
          the plan's exact copy; the closing line is the anti-duplication
          position statement. */}
      <section id="move-the-mission" className="scroll-mt-28 border-t border-ink/10 bg-off-white py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Connect + Mobilize" title="How We Move the Mission Forward" />
          <div className="mx-auto mt-6 max-w-2xl border-y border-bronze/30 py-6 text-center">
            <p className="font-display text-2xl font-semibold uppercase tracking-tight text-ink sm:text-3xl">
              {ORG_SUPPORTING_LINE}
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="border border-ink/10 bg-sand-light/40 p-8">
              <Link2 className="h-6 w-6 text-bronze" aria-hidden="true" />
              <h3 className="mt-4 font-display text-xl font-semibold uppercase tracking-tight text-ink">
                Connect
              </h3>
              <p className="mt-2 text-base leading-relaxed text-charcoal-light">
                We maintain and grow a directory of programs, services, and communities serving
                veterans, first responders, and their families.
              </p>
              <Link
                href="/resources"
                className="mt-4 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
              >
                Explore the Directory &rarr;
              </Link>
            </div>
            <div className="border border-ink/10 bg-sand-light/40 p-8">
              <Megaphone className="h-6 w-6 text-bronze" aria-hidden="true" />
              <h3 className="mt-4 font-display text-xl font-semibold uppercase tracking-tight text-ink">
                Mobilize
              </h3>
              <p className="mt-2 text-base leading-relaxed text-charcoal-light">
                We build campaigns, challenges, events, partnerships, and stories that direct
                attention and support toward organizations already doing the work.
              </p>
              <Link
                href="/campaigns"
                className="mt-4 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
              >
                See the Campaigns &rarr;
              </Link>
            </div>
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-balance text-center font-display text-xl font-semibold uppercase tracking-tight text-ink sm:text-2xl">
            For The 22 does not exist to duplicate good programs. It exists to help people find
            them — and help those programs find more support.
          </p>
        </Container>
      </section>

      {/* What For The 22 is not — dark full-bleed contrast block */}
      <section className="bg-ink py-16 text-off-white sm:py-20">
        <Container>
          <SectionHeading tone="dark" eyebrow="For Clarity" title="What For The 22 Is Not" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {WHAT_WE_ARE_NOT.map((item) => (
              <div key={item.title} className="flex gap-4 border border-off-white/15 p-6">
                <Ban className="h-5 w-5 shrink-0 text-off-white/40" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-base font-bold uppercase tracking-tight text-off-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-off-white/70">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Find a Resource, or Get Help Right Now"
        buttons={[
          { label: "Find Resources", href: "/resources" },
          { label: "Need Help Now", href: "/crisis", variant: "secondary" },
        ]}
      />
    </>
  );
}
