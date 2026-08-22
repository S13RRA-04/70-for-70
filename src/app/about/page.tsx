import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/shared/container";
import { CTASection } from "@/components/shared/cta-section";
import { Timeline } from "@/components/shared/timeline";
import { ChapterRail } from "@/components/about/chapter-rail";
import { ImageTextRow } from "@/components/about/image-text-row";
import { MarkDiagram } from "@/components/about/mark-diagram";
import {
  ABOUT_CHAPTERS,
  ABOUT_CONTENT,
  MOVEMENT_TIMELINE,
  findAboutSubsection,
} from "@/lib/content/about";
import { THREE_MISSIONS } from "@/lib/content/three-missions";
import { CAMPAIGN_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About",
  description: "Why For The 22 exists — service, struggle, recovery, and the mission that came after.",
  canonical: "/about",
});

const READING_COLUMN = "max-w-[46rem]";

const myStory = findAboutSubsection("my-story")!;
const after = findAboutSubsection("after")!;
const testimony = findAboutSubsection("my-testimony")!;
const mightyOaks = findAboutSubsection("mighty-oaks")!;
const whyEndurance = findAboutSubsection("why-endurance-sports")!;
const echelon = findAboutSubsection("project-echelon")!;
const theIdea = findAboutSubsection("the-idea")!;
const why22 = findAboutSubsection("why-22")!;
const whyBlack = findAboutSubsection("why-black")!;

export default function AboutPage() {
  return (
    <>
      {/* 1. Opening statement */}
      <section className="relative min-h-[80vh] border-b border-ink/10 bg-sand-light">
        <Container className="grid min-h-[80vh] items-center gap-10 py-20 sm:grid-cols-[minmax(0,22rem)_1fr] sm:gap-16">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
            <Image
              src={ABOUT_CONTENT.portraitUrl ?? "/about/hiking.jpg"}
              alt={ABOUT_CONTENT.name}
              fill
              priority
              sizes="(min-width: 640px) 22rem, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bronze">About</p>
            <h1 className="mt-3 text-balance font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Why For The 22 Exists
            </h1>
            <p className="mt-4 text-sm font-medium uppercase tracking-wide text-charcoal-light">
              {ABOUT_CONTENT.name} — {ABOUT_CONTENT.tagline}
            </p>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-charcoal-light">
              For The 22 grew out of a Navy deployment to Afghanistan, the years of struggle
              that followed, a recovery that started with faith and community, and an
              athlete&apos;s answer: keep moving. This is the story of how one veteran&apos;s
              fight to find a way forward became a mission to help others find theirs.
            </p>
          </div>
        </Container>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-8 flex justify-center motion-safe:animate-bounce"
        >
          <ChevronDown className="h-6 w-6 text-charcoal-light/50" />
        </div>
      </section>

      <ChapterRail chapters={ABOUT_CHAPTERS} />

      {/* 2. Service */}
      <section id="service" className="scroll-mt-28 border-b border-ink/10 py-16 sm:py-24">
        <span id="my-story" aria-hidden="true" className="block scroll-mt-28 sm:scroll-mt-32" />
        <Container className="max-w-[1400px]">
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
            </ImageTextRow>
          </div>
        </Container>
      </section>

      {/* 3. What came after */}
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

      {/* 4. Turning point */}
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

      {/* 5. Movement */}
      <section id="movement" className="scroll-mt-28 border-b border-ink/10 py-16 sm:py-24">
        <Container className={READING_COLUMN}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze">04 — Movement</p>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink">{whyEndurance.body[0]}</p>
          <div className="mt-10">
            <Timeline entries={[...MOVEMENT_TIMELINE]} />
          </div>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink">{whyEndurance.body[1]}</p>
          <div className="mt-10 border-t border-ink/10 pt-8">
            <h3 className="font-display text-lg font-semibold uppercase tracking-tight text-ink">
              {echelon.heading}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-charcoal-light">{echelon.body[0]}</p>
          </div>
        </Container>
      </section>

      {/* 6. For The 22 */}
      <section id="for-the-22" className="scroll-mt-28 pt-16 sm:pt-24">
        <Container className={READING_COLUMN}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze">05 — For The 22</p>
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
            There is another veteran somewhere trying to figure out what comes next. Another
            who needs a mission. Another who needs a team.
          </blockquote>
          <a
            href={CAMPAIGN_URL}
            className="mt-6 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
          >
            Visit Tri For The 22 &rarr;
          </a>
        </Container>

        <Container className="mt-14 max-w-[1400px] sm:mt-20">
          <div className="grid gap-8 sm:grid-cols-3">
            {Object.values(THREE_MISSIONS).map((mission) => (
              <div key={mission.title}>
                <span className="font-display text-3xl font-bold text-bronze/40">{mission.number}</span>
                <h3 className="mt-2 font-display text-xl font-semibold uppercase tracking-tight text-ink">
                  {mission.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-light">{mission.description}</p>
                <Link
                  href={mission.ctaHref}
                  className="mt-3 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
                >
                  {mission.ctaLabel}
                </Link>
              </div>
            ))}
          </div>
        </Container>

        <Container className="mt-14 max-w-[1400px] sm:mt-20">
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

      {/* 7. The Mark */}
      <section id="the-mark" className="scroll-mt-28 border-b border-ink/10 py-16 sm:py-24">
        <Container className="max-w-[1400px]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze">06 — The Mark</p>
          <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-tight text-ink sm:text-3xl">
            Nothing in the mark is decorative.
          </h2>
          <div className="mt-12">
            <MarkDiagram />
          </div>
        </Container>
      </section>

      {/* 8. Closing statement */}
      <CTASection
        title="For Those Who Serve. For What Comes Next."
        buttons={[
          { label: "Find Resources", href: "/resources" },
          { label: "Get Involved", href: "/join", variant: "secondary" },
        ]}
      />
    </>
  );
}
