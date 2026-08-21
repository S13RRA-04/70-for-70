import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { EmptyState } from "@/components/shared/empty-state";
import { MobileActionBar } from "@/components/shared/mobile-action-bar";
import { CurrentCampaignCard } from "@/components/shared/current-campaign-card";
import { AthleteCard } from "@/components/athletes/athlete-card";
import { ATHLETES } from "@/lib/content/athletes";
import { SITE_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Athletes",
  description: "The For The 22 Athletic Team — competing for something bigger than the finish line.",
  canonical: "/athletes",
});

const SUPPORT_TYPES = [
  "Equipment",
  "Race or event entry fees",
  "Coaching",
  "Training resources",
  "Adaptive equipment",
  "Travel or other approved mission support",
];

const EXPECTATIONS = [
  "Integrity",
  "Responsible representation of the brand",
  "Compliance with the Athlete Participation & Affiliation Agreement",
  "Appropriate fundraising conduct",
  "Sponsor disclosure",
  "Sportsmanship",
  "Accurate reporting",
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-charcoal-light">
          <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function AthletesPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading
            as="h1"
            eyebrow="Mission Three: Compete"
            title="The For The 22 Athletic Team"
            description="Compete for something bigger than the finish line."
          />
          <p className="mt-5 text-base leading-relaxed text-charcoal-light">
            Affiliated athletes participate in individual campaigns supporting approved
            501(c)(3) organizations serving veterans and first responders. Athletes do not
            collect charitable donations personally — contributions are directed through each
            beneficiary&apos;s own authorized platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <CTAButton href="/join">Apply to Affiliate</CTAButton>
            <CTAButton href="/athlete-agreement" variant="secondary">
              View Athlete Program Rules
            </CTAButton>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <CurrentCampaignCard />
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="Eligibility" title="Who Can Participate" />
          <p className="mt-4 text-base leading-relaxed text-charcoal-light">
            Veterans and eligible first-responder communities, depending on the specific program
            and campaign. Eligibility criteria may vary by mission.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="Program Support" title="What Support May Include" />
          <BulletList items={SUPPORT_TYPES} />
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="Standards" title="What We Expect" />
          <BulletList items={EXPECTATIONS} />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <div className="rounded-sm border border-ink/10 bg-off-white p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-bronze">
              No Guaranteed Funding
            </p>
            <p className="mt-3 text-base leading-relaxed text-charcoal-light">
              Affiliation with {SITE_NAME} does not guarantee financial, equipment, or other
              program support. Support is approved case by case, based on program capacity and
              mission fit.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="The Team" title="Featured Athletes" />
          <div className="mt-8">
            {ATHLETES.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {ATHLETES.map((athlete) => (
                  <AthleteCard key={athlete.id} athlete={athlete} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="The Team Is Just Getting Started"
                description="Featured athlete profiles will appear here as they affiliate with For The 22."
                cta={{ label: "Apply to Affiliate", href: "/join" }}
              />
            )}
          </div>
        </Container>
      </section>

      <div className="h-16 sm:hidden" aria-hidden="true" />
      <MobileActionBar
        secondary={{ label: "Program Rules", href: "/athlete-agreement" }}
        primary={{ label: "Apply", href: "/join" }}
      />
    </>
  );
}
