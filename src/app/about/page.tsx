import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { ABOUT_CONTENT } from "@/lib/content/about";
import { CAMPAIGN_URL } from "@/lib/constants";

/**
 * The For The 22 mark carries two rings, a star, and the "22" itself —
 * none of it decorative. The outer ring is every branch of the U.S. Armed
 * Forces; the inner ring is every sector of first-responder service. See
 * "The Brand" section below for the star and the 22.
 */
const OUTER_RING_COLORS = [
  { branch: "Navy", color: "Navy Blue", hex: "#002147" },
  { branch: "Marine Corps", color: "Scarlet", hex: "#C41E3A" },
  { branch: "Coast Guard", color: "Coast Guard Blue", hex: "#0093AF" },
  { branch: "Air Force", color: "Air Force Blue", hex: "#00308F" },
  { branch: "Army", color: "Ranger Green", hex: "#4B5320" },
  { branch: "Space Force", color: "Black", hex: "#1A1A1A" },
] as const;

const INNER_RING_COLORS = [
  { sector: "Law enforcement, police officers, and sheriff deputies", color: "Blue", hex: "#1C4E80" },
  { sector: "Firefighters and fire rescue departments", color: "Red", hex: "#C8102E" },
  { sector: "EMS, paramedics, nurses, and doctors", color: "White", hex: "#FFFFFF" },
  { sector: "911 dispatchers and public safety telecommunicators", color: "Gold / Yellow", hex: "#EAB308" },
  { sector: "Border patrol and federal security", color: "Green", hex: "#2E7D32" },
  { sector: "Corrections officers and probation staff", color: "Silver / Grey", hex: "#9CA3AF" },
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
            Nothing in the For The 22 mark is decorative. The outer ring carries a color for
            every branch of the U.S. Armed Forces — the mission isn&apos;t about any one service,
            it&apos;s about every veteran, from every branch, still finding their way forward. The
            inner ring does the same for first responders, carrying a color for every sector that
            answers the call.
          </p>

          <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-ink">
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
              <span className="font-semibold text-ink">The 22</span> is the rough, commonly cited
              figure for how many veterans and first responders take their own lives each day, on
              average. It&apos;s the number the entire movement is named for and built against.
            </p>
          </div>

          <div className="mt-10 rounded-sm bg-ink p-8 text-off-white sm:p-10">
            <h3 className="font-display text-xl font-semibold uppercase tracking-wide">
              Why We Wear Black
            </h3>
            <p className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-bronze-light sm:text-3xl">
              Black. Because 22 &ne; 0.
            </p>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-off-white/80">
              <p>Black is the foundation of the For The 22 brand because it represents mourning.</p>
              <p>
                We wear black for the veterans and first responders we have lost to suicide,
                trauma, injury, and the invisible battles carried long after the uniform comes
                off.
              </p>
              <p>
                The black racing uniform is not meant to look tactical. It is meant to be a
                memorial.
              </p>
              <p>
                Every race, every mile, and every challenge begins against that black background
                as a reminder that this mission was born from loss.
              </p>
              <p>
                The colors surrounding the For The 22 mark represent the communities still
                standing together. The black beneath them represents those who are no longer
                here.
              </p>
              <p>For The 22 athletes wear black because we carry their memory with us.</p>
            </div>
            <p className="mt-6 text-balance font-display text-lg font-semibold uppercase leading-relaxed tracking-wide text-bronze-light sm:text-xl">
              We do not race only for ourselves. We race in mourning. We race in remembrance. And
              we move forward for those who no longer can.
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
