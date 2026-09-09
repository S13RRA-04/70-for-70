import Link from "next/link";
import { Container } from "@/components/shared/container";
import { CurrentMovementLog } from "./current-movement-log";
import { CampaignProgress } from "@/components/campaign/campaign-progress";
import { DONATE_LINK } from "@/lib/constants";
import type { EventActivityLogRow, EventConfigRow, JournalEntryRow } from "@/types/database";

/**
 * Rendered only while the event's computed status is "live" — see
 * /22forthe22/page.tsx. Elapsed/remaining time is already shown prominently
 * by EventStatusClock in the hero, so this panel focuses on what's actually
 * happening: fundraising progress, the current-movement log, and the latest
 * live journal updates, rather than duplicating the same countdown numbers.
 */
export function LiveEventPanel({
  event,
  activityLog,
  latestJournalEntries,
}: {
  event: EventConfigRow;
  activityLog: EventActivityLogRow[];
  latestJournalEntries: JournalEntryRow[];
}) {
  return (
    <section className="border-y border-ink/10 bg-sand-light py-16 sm:py-20">
      <Container>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-bronze">Live Now</p>
        <h2 className="text-balance font-display text-3xl font-semibold uppercase tracking-tight text-ink sm:text-4xl">
          22 For the 22 Is Underway
        </h2>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-sm border border-ink/10 bg-off-white p-6">
            <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
              Fundraising Progress
            </h3>
            <div className="mt-4">
              <CampaignProgress totalRaised={event.amount_raised} goal={event.fundraising_goal} showStats={false} />
            </div>
            <Link
              href={event.donate_url ?? DONATE_LINK.href}
              data-analytics-event="22_donate_click"
              className="mt-4 inline-flex rounded-sm bg-bronze px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
            >
              Support the Mission
            </Link>
          </div>

          <div className="rounded-sm border border-ink/10 bg-off-white p-6">
            <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
              Current Movement
            </h3>
            <div className="mt-4">
              <CurrentMovementLog entries={activityLog} />
            </div>
          </div>
        </div>

        {latestJournalEntries.length > 0 && (
          <div className="mt-8">
            <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Live Updates</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {latestJournalEntries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/journal/${entry.slug}`}
                  className="rounded-sm border border-ink/10 bg-off-white p-5 transition-shadow hover:shadow-md"
                >
                  <p className="text-sm font-semibold text-ink">{entry.title}</p>
                  <p className="mt-1 text-xs text-charcoal-light">{entry.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
