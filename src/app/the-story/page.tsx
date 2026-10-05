import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { Timeline } from "@/components/shared/timeline";
import { FocusScrollSection } from "@/components/shared/focus-scroll-section";
import { ImageTextRow } from "@/components/about/image-text-row";
import { ABOUT_CONTENT, findAboutSubsection } from "@/lib/content/about";
import {
  BENEFICIARY_EXPLANATION,
  BEYOND_CHATTANOOGA,
  HOW_THIS_BEGAN,
  MOVEMENT_TIMELINE,
  REMEMBRANCE_STATEMENT,
  STORY_TAGLINE,
  WHY_ENDURANCE,
} from "@/lib/content/the-story";
import { CAMPAIGN_NAME, CAMPAIGN_URL, DONATE_LINK } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, CAMPAIGN_HOME_CRUMB, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "Cody Hitson's Story",
  description: `Cody Hitson's athletic story behind ${CAMPAIGN_NAME} — training, the road to race day, and why it's run in memory of the 22.`,
  canonical: "/the-story",
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([CAMPAIGN_HOME_CRUMB, { name: "The Story", url: `${CAMPAIGN_URL}/the-story` }]);

/** Already public on the org domain (src/app/about/page.tsx) — reused here, not duplicated, same pattern the homepage uses for findAboutSubsection("why-22"). */
const myStory = findAboutSubsection("my-story")!;

export default function TheStoryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading
            as="h1"
            eyebrow={CAMPAIGN_NAME}
            title="The Athlete's Story"
            description={`${ABOUT_CONTENT.name} — ${STORY_TAGLINE}`}
          />
        </Container>
      </section>

      {/* Who I Am — the personal-bio opener the campaign-domain story was missing. */}
      <section className="py-16 sm:py-24">
        <Container>
          <FocusScrollSection>
            <ImageTextRow image={myStory.image!} eyebrow="Who I Am" heading={myStory.heading}>
              {myStory.body.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-charcoal-light">
                  {paragraph}
                </p>
              ))}
            </ImageTextRow>
          </FocusScrollSection>
        </Container>
      </section>

      <section className="border-t border-ink/10 py-16 sm:py-24">
        <Container className="max-w-2xl">
          <FocusScrollSection>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
              {HOW_THIS_BEGAN.heading}
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-charcoal-light">
              {HOW_THIS_BEGAN.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </FocusScrollSection>
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-24">
        <Container className="max-w-2xl">
          <FocusScrollSection>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
              {WHY_ENDURANCE.heading}
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink">{WHY_ENDURANCE.body[0]}</p>
            <div className="mt-10">
              <Timeline entries={[...MOVEMENT_TIMELINE]} />
            </div>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink">{WHY_ENDURANCE.body[1]}</p>
          </FocusScrollSection>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="max-w-2xl">
          <FocusScrollSection>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
              Who This Supports
            </h2>
            <p className="mt-5 text-base leading-relaxed text-charcoal-light">{BENEFICIARY_EXPLANATION}</p>
          </FocusScrollSection>
        </Container>
      </section>

      <div data-rail-quiet className="bg-ink py-20 text-off-white sm:py-28">
        <Container className="max-w-2xl text-center">
          <FocusScrollSection>
            <span
              aria-hidden="true"
              className="font-display text-6xl font-bold leading-none text-bronze-light sm:text-7xl"
            >
              22
            </span>
            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-off-white/75">
              {REMEMBRANCE_STATEMENT}
            </p>
          </FocusScrollSection>
        </Container>
      </div>

      <section className="border-t border-ink/10 py-16 sm:py-24">
        <Container className="max-w-2xl">
          <FocusScrollSection>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
              {BEYOND_CHATTANOOGA.heading}
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-charcoal-light">
              {BEYOND_CHATTANOOGA.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </FocusScrollSection>
        </Container>
      </section>

      <CTASection
        title="Help Fund the Mission"
        description="Support the $70,000 goal directly, or meet the beneficiary organizations it funds."
        buttons={[
          { label: DONATE_LINK.label, href: DONATE_LINK.href },
          { label: "Meet the Beneficiaries", href: "/beneficiaries", variant: "secondary" },
        ]}
      />
    </>
  );
}
