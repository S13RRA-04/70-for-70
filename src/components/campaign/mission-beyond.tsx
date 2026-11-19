import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { RevealGrid, RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { CONTRIBUTION_MECHANISMS } from "@/lib/content/campaigns";
import { SITE_NAME } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

/**
 * Mission areas for the "What's Next?" closer — areas of need, NOT promised
 * beneficiaries. Kept as plain labels with that caveat stated on the page,
 * so nothing here reads as a commitment to a specific organization.
 */
const FUTURE_MISSION_AREAS = [
  "Mental Health & Recovery",
  "First Responder Support",
  "Adaptive Sport & Recreation",
  "Families & Transition",
] as const;

/** Joins beneficiary names into natural list copy ("A, B, and C"). */
function joinNames(names: string[]): string {
  if (names.length === 0) return "its beneficiary organizations";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/**
 * "Beyond the Campaigns" (the non-campaign contribution channels) and
 * "What's Next?" (the $70K Mission is a milestone, not the ceiling). Lives on
 * /70k, the mission's canonical page; moved off /campaigns when that page
 * became a gateway to the individual campaigns.
 */
export function MissionBeyond({ goal, beneficiaryNames }: { goal: number; beneficiaryNames: string[] }) {
  return (
    <>
      <section id="beyond-the-campaigns" className="scroll-mt-28 border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <RevealOnScroll>
            <SectionHeading
              eyebrow="How the Mission Grows"
              title="Beyond the Campaigns"
              description="Auctions, merchandise, corporate sponsorships, and direct giving all feed the same shared goal — no single event carries it alone."
            />
          </RevealOnScroll>
          <RevealGrid>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {CONTRIBUTION_MECHANISMS.map((mechanism) => (
                <div key={mechanism.name} className="flex flex-col rounded-xl border border-line bg-white p-6">
                  <h3 className="font-display text-xl uppercase text-ink">{mechanism.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-charcoal-light">{mechanism.description}</p>
                  {mechanism.href && (
                    <CTAButton href={mechanism.href} external={mechanism.external} variant="ghost" className="mt-4 px-0">
                      Learn More &rarr;
                    </CTAButton>
                  )}
                </div>
              ))}
            </div>
          </RevealGrid>
        </Container>
      </section>

      <section id="whats-next" className="scroll-mt-28 border-y border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container className="max-w-2xl">
          <RevealOnScroll>
            <SectionHeading eyebrow="What's Next?" title="The Beginning, Not the Finish Line" tone="dark" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-off-white/80">
              <p>
                The current campaigns are working toward a shared {formatCurrency(goal)} goal benefiting{" "}
                {joinNames(beneficiaryNames)}.
              </p>
              <p>
                But {SITE_NAME} was never intended to end with one race, one fundraising goal, or
                {beneficiaryNames.length > 0
                  ? ` ${beneficiaryNames.length === 2 ? "two" : String(beneficiaryNames.length)} organizations`
                  : " a fixed list of organizations"}
                .
              </p>
              <p>
                We are exploring future fundraising opportunities supporting additional verified nonprofit organizations
                serving veterans, first responders, and their families.
              </p>
            </div>
            <blockquote className="mt-8 border-l-2 border-bronze pl-5 font-display text-2xl uppercase text-bronze-light sm:text-3xl">
              The $70K Mission has a finish line. {SITE_NAME} does not.
            </blockquote>
            <div className="mt-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-bronze-light">Areas of Future Focus</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {FUTURE_MISSION_AREAS.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border border-off-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-off-white/80"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-off-white/50">
                Mission areas of interest — not commitments to specific organizations or campaigns.
              </p>
            </div>
          </RevealOnScroll>
        </Container>
      </section>
    </>
  );
}
