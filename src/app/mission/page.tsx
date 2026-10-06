import Image from "next/image";
import Link from "next/link";
import {
  Ambulance,
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
import { ChapterRail } from "@/components/about/chapter-rail";
import { ImageTextRow } from "@/components/about/image-text-row";
import { MarkDiagram } from "@/components/about/mark-diagram";
import { ABOUT_CHAPTERS, ABOUT_CONTENT, findAboutSubsection } from "@/lib/content/about";
import { CAMPAIGN_URL, ORG_SUPPORTING_LINE, ORG_SUPPORTING_STATEMENT, ORG_TAGLINE, SITE_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { FOUNDER_PERSON_JSON_LD, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "Mission",
  description: `${ORG_SUPPORTING_STATEMENT} Includes why it matters, and founder Cody Hitson's own story of service, struggle, and recovery.`,
  canonical: "/mission",
});

/**
 * Standalone Person entity, same pattern the old standalone /about page
 * used — distinct from FOUNDER_PERSON_JSON_LD's other use nested inside the
 * root layout's Organization.founder (every page, same generic object).
 * This is his bio page now, so it gets its own top-level Person record with
 * @context, which carries more weight for a personal-name search than a
 * nested reference.
 */
const ABOUT_PERSON_JSON_LD = {
  "@context": "https://schema.org",
  ...FOUNDER_PERSON_JSON_LD,
  description: ABOUT_CONTENT.tagline,
};

const WHO_WE_SERVE = [
  { label: "Veterans", icon: Star },
  { label: "Law Enforcement", icon: Shield },
  { label: "Fire", icon: Flame },
  { label: "EMS", icon: Ambulance },
  { label: "Dispatch", icon: Radio },
  { label: "Corrections", icon: Lock },
  { label: "Families & Caregivers", icon: HeartHandshake },
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
    title: "What They Carry",
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

const myStory = findAboutSubsection("my-story")!;
const after = findAboutSubsection("after")!;
const testimony = findAboutSubsection("my-testimony")!;
const mightyOaks = findAboutSubsection("mighty-oaks")!;
const theIdea = findAboutSubsection("the-idea")!;
const why22 = findAboutSubsection("why-22")!;
const whyBlack = findAboutSubsection("why-black")!;

const READING_COLUMN = "max-w-[46rem]";

export default function MissionPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(ABOUT_PERSON_JSON_LD)} />

      {/* Hero */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading as="h1" eyebrow="Our Mission" title={ORG_TAGLINE} description={ORG_SUPPORTING_STATEMENT} />
        </Container>
      </section>

      {/* Who We Serve — chip row, not a bullet list */}
      <section className="bg-off-white py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Built For" title="Who We Serve" />
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {WHO_WE_SERVE.map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="flex flex-col items-center gap-2.5 border border-ink/10 bg-sand-light/60 px-4 py-6 text-center"
              >
                <Icon size={24} strokeWidth={1.5} className="text-bronze" aria-hidden="true" />
                <span className="text-sm font-semibold uppercase tracking-wide text-ink">{label}</span>
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
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
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
          </div>
          <p className="mt-6 text-sm leading-relaxed text-charcoal-light">
            None of that stays contained to one person. Spouses, kids, and coworkers absorb part of
            it too, which is part of why {SITE_NAME}&apos;s resource directory includes family and
            caregiver support alongside programs built for veterans and first responders directly.
          </p>
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
            {HOW_IT_WORKS.map((step) => (
              <div key={step.number} className="border border-ink/10 bg-sand-light/40 p-8">
                <span className="font-display text-3xl font-bold text-bronze/40">{step.number}</span>
                <h3 className="mt-3 font-display text-xl font-semibold uppercase tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-charcoal-light">{step.body}</p>
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
          <SectionHeading
            eyebrow="Connect + Mobilize"
            title="How We Move the Mission Forward"
            description={ORG_SUPPORTING_LINE}
          />
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

      {/* Founder's Story — folded in from the retired /about page */}
      <section id="founders-story" className="scroll-mt-28 border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <ImageTextRow
            image={{ src: ABOUT_CONTENT.portraitUrl ?? "/about/hiking.jpg", alt: ABOUT_CONTENT.name }}
            eyebrow="Founder's Story"
            heading="Why For The 22 Exists"
          >
            <p className="text-sm font-medium uppercase tracking-wide text-charcoal-light">
              {ABOUT_CONTENT.name} — {ABOUT_CONTENT.tagline}
            </p>
            <p className="text-base leading-relaxed text-charcoal-light">
              For The 22 grew out of a Navy deployment to Afghanistan, the years of struggle that
              followed, and a recovery that started with faith and community. This is the story of
              how one veteran&apos;s fight to find a way forward became a mission to help others
              find theirs.
            </p>
          </ImageTextRow>
        </Container>
      </section>

      <ChapterRail chapters={ABOUT_CHAPTERS} />

      {/* Service */}
      <section id="service" className="scroll-mt-28 border-b border-ink/10 bg-off-white py-16 sm:py-24">
        <span id="my-story" aria-hidden="true" className="block scroll-mt-28 sm:scroll-mt-32" />
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze">01 — Service</p>
          <div className="mt-6">
            <ImageTextRow image={myStory.image!} heading={myStory.heading}>
              {myStory.body.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-charcoal-light">
                  {paragraph}
                </p>
              ))}
              <div className="relative mt-6 aspect-[3/2] w-full max-w-[280px] overflow-hidden rounded-sm">
                <Image
                  src="/about/navy.jpg"
                  alt="Cody in Navy uniform aboard a ship"
                  fill
                  sizes="280px"
                  className="object-cover"
                />
              </div>
              <a
                href="https://news.va.gov/91792/veteranoftheday-navy-veteran-cody-hitson/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
              >
                Featured as VA&apos;s #VeteranOfTheDay &rarr;
              </a>
            </ImageTextRow>
          </div>
        </Container>
      </section>

      {/* What came after */}
      <section id="after" className="scroll-mt-28 bg-charcoal py-16 text-off-white sm:py-24">
        <Container className={READING_COLUMN}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">02 — After</p>
          <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
            {after.heading}
          </h2>
          <div className="mt-6 space-y-4">
            {after.body.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-off-white/75">
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </section>

      {/* Turning point */}
      <section id="turning-point" className="scroll-mt-28 border-b border-ink/10 bg-off-white py-20 sm:py-28">
        <Container className={READING_COLUMN}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze">03 — Turning Point</p>
          <blockquote className="mt-8 border-l-2 border-bronze pl-6 font-display text-xl font-medium italic leading-relaxed text-ink sm:text-2xl">
            <p>&ldquo;{testimony.pullQuote!.text}&rdquo;</p>
            <footer className="mt-3 text-sm font-semibold not-italic uppercase tracking-wide text-bronze">
              {testimony.pullQuote!.attribution}
            </footer>
          </blockquote>
          <div className="mt-10 space-y-4">
            {testimony.body.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-charcoal-light">
                {paragraph}
              </p>
            ))}
            {mightyOaks.body.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-charcoal-light">
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </section>

      {/* For The 22 */}
      <section id="for-the-22" className="scroll-mt-28 pt-16 sm:pt-24">
        <Container className={READING_COLUMN}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze">04 — For The 22</p>
          <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-tight text-ink sm:text-3xl">
            {theIdea.heading}
          </h2>
          <div className="mt-5 space-y-4">
            {theIdea.body.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-charcoal-light">
                {paragraph}
              </p>
            ))}
          </div>
          <blockquote className="mt-6 border-l-2 border-bronze py-1 pl-5 text-lg italic leading-relaxed text-ink">
            There is another veteran somewhere trying to figure out what comes next — another
            who needs a mission.
          </blockquote>
          <a
            href={`${CAMPAIGN_URL}/the-story`}
            className="mt-6 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
          >
            Read the full athletic story at Tri For The 22 &rarr;
          </a>
        </Container>

        <Container className="mt-14 sm:mt-20">
          <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr] lg:items-start">
            <div data-rail-quiet className="bg-ink px-6 py-14 text-off-white sm:px-16 sm:py-20">
              <span className="font-display text-7xl font-bold leading-none text-bronze-light sm:text-8xl">
                22
              </span>
              <div className="mt-6 max-w-lg space-y-4">
                {why22.body.map((paragraph, i) => (
                  <p key={i} className="text-base leading-relaxed text-off-white/75">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="border border-bronze/30 bg-off-white p-6">
              <div className="flex items-center gap-3">
                <LifeBuoy className="h-6 w-6 shrink-0 text-bronze" aria-hidden="true" />
                <p className="text-sm font-semibold uppercase tracking-widest text-bronze">
                  Need Help Now?
                </p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-light">
                If you or someone you know is in crisis, immediate support is available.{" "}
                {SITE_NAME} is not a crisis-response service — the organizations listed connect
                you with people equipped to help.
              </p>
              <Link
                href="/crisis"
                className="mt-4 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
              >
                Get Crisis Support &rarr;
              </Link>
            </div>
          </div>
        </Container>

        <div
          id="why-black"
          data-rail-quiet
          className="scroll-mt-28 mt-14 w-full bg-ink py-24 text-off-white sm:mt-20 sm:py-36"
        >
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <p className="text-balance font-display text-6xl font-bold uppercase leading-none tracking-tight sm:text-8xl">
              Black.
            </p>
            <p className="mt-4 font-display text-lg font-semibold uppercase tracking-tight text-bronze-light sm:text-xl">
              Because 22 &ne; 0.
            </p>
            <div className="mx-auto mt-8 max-w-md space-y-3">
              {whyBlack.body.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-off-white/75">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Mark */}
      <section id="the-mark" className="scroll-mt-28 border-b border-ink/10 bg-off-white py-16 sm:py-24">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze">05 — The Mark</p>
          <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-tight text-ink sm:text-3xl">
            Nothing in the mark is decorative.
          </h2>
          <div className="mt-12">
            <MarkDiagram />
          </div>
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
