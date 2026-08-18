import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { ABOUT_CONTENT } from "@/lib/content/about";

/**
 * The six rings in the For The 22 logo each carry a branch color — every
 * branch of the U.S. Armed Forces, since the campaign's beneficiaries serve
 * veterans across all of them, not just the Navy Cody served in.
 */
const LOGO_RING_COLORS = [
  { branch: "Army", color: "Ranger Green", hex: "#4B5320" },
  { branch: "Marine Corps", color: "Scarlet", hex: "#C41E3A" },
  { branch: "Navy", color: "Navy Blue", hex: "#002147" },
  { branch: "Air Force", color: "Air Force Blue", hex: "#00308F" },
  { branch: "Space Force", color: "Black", hex: "#1A1A1A" },
  { branch: "Coast Guard", color: "Coast Guard Blue", hex: "#0093AF" },
] as const;

export const metadata: Metadata = {
  title: "About",
  description: `${ABOUT_CONTENT.name} — ${ABOUT_CONTENT.tagline}`,
  alternates: { canonical: "/about" },
};

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
                className="object-cover"
              />
            ) : (
              <MediaPlaceholder />
            )}
          </div>

          <div>
            <SectionHeading eyebrow="About" title={ABOUT_CONTENT.name} />
            <p className="mt-3 text-base font-medium text-charcoal-light">
              {ABOUT_CONTENT.tagline}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <div className="space-y-14">
            {ABOUT_CONTENT.sections.map((section) => (
              <div key={section.id} id={section.id}>
                <h2 className="font-display text-2xl font-semibold uppercase tracking-tight text-ink sm:text-3xl">
                  {section.heading}
                </h2>
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
        </Container>
      </section>

      <section id="the-brand" className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <h2 className="font-display text-2xl font-semibold uppercase tracking-tight text-ink sm:text-3xl">
            The Brand
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal-light">
            The six rings in the For The 22 logo aren&apos;t decorative — each one is the color of
            a branch of the U.S. Armed Forces. The mission behind this campaign isn&apos;t about
            any one service. It&apos;s about every veteran, from every branch, still finding their
            way forward.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {LOGO_RING_COLORS.map((ring) => (
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
        </Container>
      </section>

      <CTASection
        title="Follow the Journey"
        description="Training updates and race prep are posted regularly."
        buttons={[
          { label: "View Updates", href: "/updates" },
          { label: "Fund a Mile", href: "/fund-a-mile", variant: "secondary" },
        ]}
      />
    </>
  );
}
