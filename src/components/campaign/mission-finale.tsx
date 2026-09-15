import { CampaignProgress } from "@/components/campaign/campaign-progress";
import { CTAButton } from "@/components/shared/cta-button";
import { DONATE_LINK, RACE_INFO, RACE_TOTAL_DISTANCE } from "@/lib/constants";
import { formatDateLong } from "@/lib/utils";

/**
 * The page's closing section — deliberately does NOT end on FTP/CTL/VO2max/
 * benchmark data. Reconnects the race back to the fundraiser it's the
 * physical anchor of. `totalRaised`/`goal` come from the live
 * public.campaign row (getCampaign(), src/lib/data/campaign.ts) passed in
 * by the page — never hardcoded here. "Donate Now" routes to the real,
 * live /donate route (DONATE_LINK) — NOT the retired /fund-a-mile stub,
 * which no longer represents how this campaign frames giving (see
 * src/app/fund-a-mile/page.tsx's own doc comment).
 */
export function MissionFinale({ totalRaised, goal }: { totalRaised: number; goal: number }) {
  return (
    <section className="bg-ink py-20 text-off-white sm:py-28">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <p className="text-balance font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          70.3 Is the Distance.
          <br />
          <span className="text-bronze-light">The Mission Is Bigger.</span>
        </p>

        <div className="mt-10 rounded-sm border border-off-white/15 bg-off-white/5 p-8 text-left">
          <CampaignProgress totalRaised={totalRaised} goal={goal} tone="dark" showStats={false} />
          <p className="mt-6 text-center text-sm text-off-white/70">
            {RACE_TOTAL_DISTANCE} miles
            {RACE_INFO.raceDate && ` · ${formatDateLong(RACE_INFO.raceDate)}`}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <CTAButton href={DONATE_LINK.href} tone="dark">
            {DONATE_LINK.label}
          </CTAButton>
          <CTAButton href="/journal" variant="secondary" tone="dark">
            Follow the Road
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
