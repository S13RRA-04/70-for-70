import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";

export function AthleteTeamTeaser() {
  return (
    <section className="bg-sand-light py-16 sm:py-20">
      <Container className="max-w-2xl text-center">
        <SectionHeading
          align="center"
          eyebrow="Mission Three: Compete"
          title="The For The 22 Athletic Team"
          description="Compete for something bigger than the finish line. Affiliated athletes race, ride, ruck, swim, and lift to raise awareness and support fundraising efforts for nonprofit organizations serving veterans and first responders."
        />
        <CTAButton href="/athletes" size="lg" className="mt-8">
          Meet the Team
        </CTAButton>
      </Container>
    </section>
  );
}
