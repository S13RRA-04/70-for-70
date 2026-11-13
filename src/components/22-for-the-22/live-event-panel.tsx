import { Container } from "@/components/shared/container";
import { CurrentMovementLog } from "./current-movement-log";
import { MissionProgress } from "@/components/campaign/mission-progress";
import { DONATE_URL } from "@/lib/constants";
import type { FundraisingImpactStats } from "@/lib/data/fundraising-impact";
import type { EventActivityLogRow, EventConfigRow } from "@/types/database";

/**
 * Rendered only while the event's computed status is "live" — see
 * /campaigns/22-for-the-22/page.tsx. Elapsed/remaining time is already shown prominently
 * by EventStatusClock in the hero, so this panel focuses on what's actually
 * happening: fundraising progress and the current-movement log, rather than
 * duplicating the same countdown numbers.
 */
export function LiveEventPanel({
  event,
  fundraisingStats,
  activityLog,
}: {
  event: EventConfigRow;
  fundraisingStats: FundraisingImpactStats;
  activityLog: EventActivityLogRow[];
}) {
  return (
    <section className="border-y border-ink/10 bg-sand-light py-16 sm:py-20">
      <Container>
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-bronze">Live Now</p>
        <h2 className="text-balance font-display text-4xl uppercase text-ink sm:text-4xl">
          22 For the 22 Is Underway
        </h2>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-line bg-white p-6">
            <h3 className="font-display text-xl uppercase text-ink">
              Fundraising Progress
            </h3>
            <div className="mt-4">
              <MissionProgress
                totalRaised={fundraisingStats.amountRaised}
                goal={fundraisingStats.fundraisingGoal}
              />
            </div>
            <a
              href={event.donate_url ?? DONATE_URL}
              data-analytics-event="22_donate_click"
              className="mt-4 inline-flex rounded-sm bg-bronze-text px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-dark"
            >
              Support the Mission
            </a>
          </div>

          <div className="rounded-xl border border-line bg-white p-6">
            <h3 className="font-display text-xl uppercase text-ink">
              Current Movement
            </h3>
            <div className="mt-4">
              <CurrentMovementLog entries={activityLog} />
            </div>
          </div>
        </div>

      </Container>
    </section>
  );
}
