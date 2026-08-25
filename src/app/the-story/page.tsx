import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { Timeline } from "@/components/shared/timeline";
import { ABOUT_CONTENT } from "@/lib/content/about";
import {
  BENEFICIARY_EXPLANATION,
  HOW_THIS_BEGAN,
  MOVEMENT_TIMELINE,
  REMEMBRANCE_STATEMENT,
  STORY_TAGLINE,
  WHY_ENDURANCE,
} from "@/lib/content/the-story";
import { CAMPAIGN_NAME, SITE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "The Story",
  description: `The athletic story behind ${CAMPAIGN_NAME} — training, the road to race day, and why it's run in memory of the 22.`,
  canonical: "/the-story",
});

export default function TheStoryPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading
            as="h1"
            eyebrow={CAMPAIGN_NAME}
            title="The Athlete's Story"
            description={`${ABOUT_CONTENT.name} — ${STORY_TAGLINE}`}
          />
          <a
            href={`${SITE_URL}/about`}
            className="mt-4 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
          >
            Read the founder&apos;s full story at For The 22 &rarr;
          </a>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
            {HOW_THIS_BEGAN.heading}
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-charcoal-light">
            {HOW_THIS_BEGAN.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-24">
        <Container className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
            {WHY_ENDURANCE.heading}
          </h2>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink">{WHY_ENDURANCE.body[0]}</p>
          <div className="mt-10">
            <Timeline entries={[...MOVEMENT_TIMELINE]} />
          </div>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink">{WHY_ENDURANCE.body[1]}</p>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
            Who This Supports
          </h2>
          <p className="mt-5 text-base leading-relaxed text-charcoal-light">{BENEFICIARY_EXPLANATION}</p>
        </Container>
      </section>

      <div data-rail-quiet className="bg-ink py-20 text-off-white sm:py-28">
        <Container className="max-w-2xl text-center">
          <span
            aria-hidden="true"
            className="font-display text-6xl font-bold leading-none text-bronze-light sm:text-7xl"
          >
            22
          </span>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-off-white/75">
            {REMEMBRANCE_STATEMENT}
          </p>
        </Container>
      </div>

      <CTASection
        title="Help Fund the Mission"
        description="Fund a mile or support a beneficiary organization directly."
        buttons={[
          { label: "Fund a Mile", href: "/fund-a-mile" },
          { label: "Meet the Beneficiaries", href: "/partners#beneficiaries", variant: "secondary" },
        ]}
      />
    </>
  );
}
