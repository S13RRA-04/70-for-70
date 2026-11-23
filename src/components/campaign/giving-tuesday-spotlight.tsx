import { CTAButton } from "@/components/shared/cta-button";
import { Container } from "@/components/shared/container";
import { MissionProgress } from "@/components/campaign/mission-progress";
import { getCampaign } from "@/lib/data/campaign";
import { getPartners } from "@/lib/data/partners";
import { formatGivingTuesdayDate, getGivingTuesdayPhase } from "@/lib/giving-tuesday";
import { MISSION_NAME } from "@/lib/constants";

function listNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} or ${names[names.length - 1]}`;
}

/**
 * GivingTuesday band for the homepage and /donate. Shows the week before
 * (countdown), on the day, and for a few days after (thank you); renders
 * nothing the rest of the year. See src/lib/giving-tuesday.ts for the dates.
 *
 * The give button points at /donate's beneficiary cards rather than straight
 * at a donation platform, because those cards carry each organization's
 * tracking-note instructions.
 */
export async function GivingTuesdaySpotlight({ giveHref = "/donate#give" }: { giveHref?: string }) {
  const state = getGivingTuesdayPhase();
  if (!state) return null;

  const [campaign, partners] = await Promise.all([getCampaign(), getPartners()]);
  const beneficiaries = listNames(partners.filter((partner) => partner.active).map((partner) => partner.name));
  const dateLabel = formatGivingTuesdayDate(state.date);

  const heading =
    state.phase === "live"
      ? "Today is GivingTuesday"
      : state.phase === "thanks"
        ? "Thank you for GivingTuesday"
        : state.daysUntil === 1
          ? "GivingTuesday is tomorrow"
          : `GivingTuesday is in ${state.daysUntil} days`;

  const body =
    state.phase === "thanks"
      ? `Every gift made directly to ${beneficiaries} counts toward ${MISSION_NAME} once it's verified, and it isn't too late to give.`
      : `One day set aside, everywhere, for generosity. Give directly to ${beneficiaries}, and your gift counts toward ${MISSION_NAME}.`;

  return (
    <section
      id="giving-tuesday"
      aria-labelledby="giving-tuesday-heading"
      // Navy, not the auction spotlight's jet: on the homepage the two bands sit back to back.
      className="scroll-mt-28 border-b border-line bg-navy py-14 text-white sm:py-16"
    >
      <Container className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="label-caps text-xs text-bronze-light">
            GivingTuesday · {dateLabel}
          </p>
          <h2 id="giving-tuesday-heading" className="mt-3 font-display text-4xl uppercase leading-none sm:text-5xl">
            {heading}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-mist">{body}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <CTAButton href={giveHref} tone="dark" size="lg" data-analytics-event="giving_tuesday_give_click">
              {state.phase === "live" ? "Give Today" : "Give Now"}
            </CTAButton>
            <CTAButton href="/impact#beneficiaries" tone="dark" variant="secondary" size="lg">
              Where It Goes
            </CTAButton>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <MissionProgress totalRaised={campaign.amount_raised} goal={campaign.fundraising_goal} tone="dark" />
        </div>
      </Container>
    </section>
  );
}
