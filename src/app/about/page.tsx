import Image from "next/image";
import Link from "next/link";
import { LifeBuoy } from "lucide-react";
import { Container } from "@/components/shared/container";
import { CTASection } from "@/components/shared/cta-section";
import { ChapterRail } from "@/components/about/chapter-rail";
import { ImageTextRow } from "@/components/about/image-text-row";
import { MarkDiagram } from "@/components/about/mark-diagram";
import { ABOUT_CHAPTERS, ABOUT_CONTENT, findAboutSubsection } from "@/lib/content/about";
import { CAMPAIGN_URL, SITE_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { FOUNDER_PERSON_JSON_LD, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "About",
  description: `Founder Cody Hitson's own story of service, struggle, and recovery — and how it became ${SITE_NAME}.`,
  canonical: "/about",
});

/**
 * Standalone Person entity, distinct from FOUNDER_PERSON_JSON_LD's other use
 * nested inside the root layout's Organization.founder (every page, same
 * generic object). This is his bio page, so it gets its own top-level Person
 * record with @context, which carries more weight for a personal-name search
 * than a nested reference.
 */
const ABOUT_PERSON_JSON_LD = {
  "@context": "https://schema.org",
  ...FOUNDER_PERSON_JSON_LD,
  description: ABOUT_CONTENT.tagline,
};

const myStory = findAboutSubsection("my-story")!;
const after = findAboutSubsection("after")!;
const testimony = findAboutSubsection("my-testimony")!;
const mightyOaks = findAboutSubsection("mighty-oaks")!;
const theIdea = findAboutSubsection("the-idea")!;
const why22 = findAboutSubsection("why-22")!;
const whyBlack = findAboutSubsection("why-black")!;

const READING_COLUMN = "max-w-[46rem]";

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(ABOUT_PERSON_JSON_LD)} />

      {/* Founder's Story intro */}
      <section id="founders-story" className="scroll-mt-28 border-b border-ink/10 bg-sand-light py-16 sm:py-20">
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
          <p className="mt-10 text-center text-sm text-charcoal-light">
            <Link href="/press#brand-colors" className="font-semibold text-bronze hover:text-bronze-dark">
              See the full color breakdown &rarr;
            </Link>
          </p>
        </Container>
      </section>

      <CTASection
        title="Read the Mission, or Find Support"
        buttons={[
          { label: "Read the Mission", href: "/mission" },
          { label: "Find Resources", href: "/resources", variant: "secondary" },
        ]}
      />
    </>
  );
}
