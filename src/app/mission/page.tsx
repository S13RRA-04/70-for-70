import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { MissionPanel } from "@/components/home/mission-panel";
import { THREE_MISSIONS } from "@/lib/content/three-missions";
import { GET_INVOLVED_LINK, ORG_SUPPORTING_STATEMENT, ORG_TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mission",
  description: ORG_SUPPORTING_STATEMENT,
  alternates: { canonical: "/mission" },
};

/**
 * Minimal foundation-phase placeholder — just enough for the "Mission" nav
 * item to resolve to a real page. The full editorial treatment (large
 * asymmetric layout, expanded copy per pillar) is later-phase work; this
 * reuses the same MissionPanel/copy already built for the homepage rather
 * than inventing new content.
 */
export default function MissionPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading as="h1" eyebrow="Our Mission" title={ORG_TAGLINE} description={ORG_SUPPORTING_STATEMENT} />
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <MissionPanel {...THREE_MISSIONS.connect} featured />
            </div>
            <div className="grid gap-4 lg:col-span-5">
              <MissionPanel {...THREE_MISSIONS.advocate} />
              <MissionPanel {...THREE_MISSIONS.compete} />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-anchor py-16 text-center sm:py-20">
        <Container>
          <p className="mx-auto max-w-xl text-lg text-off-white/80">
            Whatever moves you — find a resource, join the team, or help carry the mission forward.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <CTAButton href="/resources" variant="secondary" tone="dark" size="lg">
              Find Resources
            </CTAButton>
            <CTAButton href={GET_INVOLVED_LINK.href} variant="primary" accent="black" size="lg">
              {GET_INVOLVED_LINK.label}
            </CTAButton>
          </div>
        </Container>
      </section>
    </>
  );
}
