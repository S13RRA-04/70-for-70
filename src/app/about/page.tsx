import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { Timeline } from "@/components/shared/timeline";
import { SectionSubnav } from "@/components/shared/section-subnav";
import {
  ABOUT_CONTENT,
  INNER_RING_COLORS,
  OUTER_RING_COLORS,
  PHOTO_GALLERY,
  STORY_TIMELINE,
} from "@/lib/content/about";
import { CAMPAIGN_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About",
  description: `${ABOUT_CONTENT.name} — ${ABOUT_CONTENT.tagline}`,
  canonical: "/about",
});

const READING_COLUMN = "max-w-[46rem]";

const SUBNAV = [
  ...ABOUT_CONTENT.groups.map((group) => ({ id: group.id, label: group.navLabel })),
  { id: "gallery", label: "Gallery" },
  { id: "brand-meaning", label: "Brand Meaning" },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="grid gap-10 sm:grid-cols-[200px_1fr] sm:items-center">
          <div className="relative aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-sm bg-charcoal/10">
            {ABOUT_CONTENT.portraitUrl ? (
              <Image
                src={ABOUT_CONTENT.portraitUrl}
                alt={ABOUT_CONTENT.name}
                fill
                sizes="200px"
                priority
                className="object-cover"
              />
            ) : (
              <MediaPlaceholder />
            )}
          </div>

          <div>
            <SectionHeading as="h1" eyebrow="About" title={ABOUT_CONTENT.name} />
            <p className="mt-3 text-base font-medium text-charcoal-light">
              {ABOUT_CONTENT.tagline}
            </p>
          </div>
        </Container>
      </section>

      <section id="founders-story" className="scroll-mt-32 py-12 sm:py-16">
        <Container className={READING_COLUMN}>
          <Timeline entries={[...STORY_TIMELINE]} />
        </Container>
      </section>

      <SectionSubnav items={SUBNAV} />

      {ABOUT_CONTENT.groups.map((group) => (
        <section
          key={group.id}
          id={group.id}
          className="scroll-mt-32 border-b border-ink/10 py-16 sm:py-20"
        >
          <Container className={READING_COLUMN}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze">
              {group.navLabel}
            </p>
            <div className="mt-6 space-y-14">
              {group.subsections.map((section) => (
                <div key={section.id}>
                  <h2 className="font-display text-2xl font-semibold uppercase tracking-tight text-ink sm:text-3xl">
                    {section.heading}
                  </h2>
                  {section.image && (
                    <div className="relative mt-5 aspect-[16/10] w-full overflow-hidden rounded-sm">
                      <Image
                        src={section.image.src}
                        alt={section.image.alt}
                        fill
                        sizes="(min-width: 768px) 46rem, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="mt-4 space-y-4">
                    {section.body.map((paragraph, i) => (
                      <p key={i} className="text-base leading-relaxed text-charcoal-light">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {section.pullQuote && (
                    <blockquote className="mt-6 border-l-2 border-bronze py-1 pl-5 text-lg italic leading-relaxed text-ink">
                      <p>&ldquo;{section.pullQuote.text}&rdquo;</p>
                      <footer className="mt-2 text-sm font-medium not-italic uppercase tracking-wide text-bronze">
                        {section.pullQuote.attribution}
                      </footer>
                    </blockquote>
                  )}
                </div>
              ))}
            </div>

            {group.id === "origin" && (
              <a
                href={CAMPAIGN_URL}
                className="mt-8 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
              >
                Visit Tri For The 22 &rarr;
              </a>
            )}
          </Container>
        </section>
      ))}

      <section id="gallery" className="scroll-mt-32 border-b border-ink/10 py-16 sm:py-20">
        <Container className="max-w-[1400px]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze">
            Gallery
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-tight text-ink sm:text-3xl">
            In Photos
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PHOTO_GALLERY.map((photo) => (
              <figure key={photo.src} className="group">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-charcoal/10">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <figcaption className="mt-2 text-sm text-charcoal-light">{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <section id="brand-meaning" className="scroll-mt-32 bg-sand-light py-16 sm:py-20">
        <Container className={READING_COLUMN}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze">
            Brand Meaning
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-tight text-ink sm:text-3xl">
            The Mark
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal-light">
            Nothing in the For The 22 mark is decorative. The outer ring carries a color for
            every branch of the U.S. Armed Forces — the mission isn&apos;t about any one service,
            it&apos;s about every veteran, from every branch, still finding their way forward. The
            inner ring does the same for first responders, carrying a color for every sector that
            answers the call.
          </p>

          <div className="relative mx-auto mt-10 aspect-square w-full max-w-[220px]">
            <Image src="/logo.png" alt="The For The 22 mark" fill className="object-contain" sizes="220px" />
          </div>

          <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-ink">
            Outer Ring — Armed Forces
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {OUTER_RING_COLORS.map((ring) => (
              <div key={ring.branch} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-6 w-6 shrink-0 rounded-full border border-ink/10"
                  style={{ backgroundColor: ring.hex }}
                />
                <div>
                  <p className="text-sm font-semibold text-ink">{ring.branch}</p>
                  <p className="text-xs text-charcoal-light">{ring.color}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-ink">
            Inner Ring — First Responders
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {INNER_RING_COLORS.map((ring) => (
              <div key={ring.color} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-6 w-6 shrink-0 rounded-full border border-ink/10"
                  style={{ backgroundColor: ring.hex }}
                />
                <div>
                  <p className="text-sm font-semibold text-ink">{ring.color}</p>
                  <p className="text-xs text-charcoal-light">{ring.sector}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-4 border-t border-ink/10 pt-8">
            <p className="text-base leading-relaxed text-charcoal-light">
              <span className="font-semibold text-ink">The star</span> is for the fallen — those
              lost in service, and those lost after it.
            </p>
            <p className="text-base leading-relaxed text-charcoal-light">
              <span className="font-semibold text-ink">The 22</span> is a symbolic figure
              historically associated with veteran suicide awareness — not presented as a precise
              current daily statistic. It&apos;s the number the entire movement is named for and
              built against.
            </p>
          </div>
        </Container>
      </section>

      <CTASection
        title="Follow the Journey"
        description="Training updates and race prep are posted regularly."
        buttons={[
          { label: "View Updates", href: `${CAMPAIGN_URL}/updates` },
          { label: "Fund a Mile", href: `${CAMPAIGN_URL}/fund-a-mile`, variant: "secondary" },
        ]}
      />
    </>
  );
}
