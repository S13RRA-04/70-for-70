import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { ABOUT_CONTENT } from "@/lib/content/about";

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
              <div className="flex h-full w-full items-center justify-center text-center text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                Portrait
                <br />
                TODO
              </div>
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
