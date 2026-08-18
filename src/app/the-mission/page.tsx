import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { CampaignByTheNumbers } from "@/components/campaign/campaign-by-the-numbers";
import { MISSION_SECTIONS } from "@/lib/content/mission";

export const metadata: Metadata = {
  title: "The Mission",
  description:
    "Why 70 for 70 exists: 70 miles, $70,000, and a mission to support veteran-focused nonprofit organizations.",
  alternates: { canonical: "/the-mission" },
};

export default function MissionPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="The Mission"
            title="One Mile. One Thousand Dollars. One Mission."
            description="70 for 70 pairs a 70.3-mile triathlon with a $70,000 fundraising goal in support of veteran-focused nonprofit organizations."
          />
          <div className="mt-10">
            <CampaignByTheNumbers />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="space-y-14">
            {MISSION_SECTIONS.map((section) => (
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
                {section.link && (
                  <Link
                    href={section.link.href}
                    className="mt-3 inline-block text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
                  >
                    {section.link.label} &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Help Fund the Mission"
        description="Fund a mile, support the mission directly, or bring your company on board as a sponsor."
        buttons={[
          { label: "Fund a Mile", href: "/fund-a-mile" },
          { label: "Meet the Partners", href: "/partners", variant: "secondary" },
        ]}
      />
    </>
  );
}
