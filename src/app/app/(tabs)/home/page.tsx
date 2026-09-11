import type { Metadata } from "next";
import Link from "next/link";
import { requireParticipant } from "@/lib/supabase/require-participant";
import { getMyProfile } from "@/lib/data/app/profiles";
import { getAppEvents } from "@/lib/data/app/events";
import { getMyActivities, summarizeActivities } from "@/lib/data/app/activities";
import { getMilestonesForEvent } from "@/lib/data/app/milestones";
import { createClient } from "@/lib/supabase/server";
import { DONATE_LINK, EVENT22_CAMPAIGN_URL } from "@/lib/constants";

export const metadata: Metadata = { title: "Home" };

export default async function AppHomePage() {
  const user = await requireParticipant();
  const [profile, events] = await Promise.all([getMyProfile(), getAppEvents()]);

  const supabase = await createClient();
  const { data: myRegistrations } = await supabase
    .from("registrations")
    .select("event_id")
    .eq("user_id", user.id);
  const registeredEventIds = new Set((myRegistrations ?? []).map((r) => r.event_id));
  const activeEvent = events.find((e) => registeredEventIds.has(e.id) && e.status !== "archived");

  const [activities, milestones] = activeEvent
    ? await Promise.all([getMyActivities(activeEvent.id), getMilestonesForEvent(activeEvent.id)])
    : [[], []];
  const summary = summarizeActivities(activities);
  const nextMilestone = milestones.find((m) => m.threshold > summary.sessionCount) ?? null;

  const greetingName = profile?.first_name || "there";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-bronze">For the 22</p>
      <h1 className="mt-1 font-display text-2xl font-bold uppercase tracking-tight text-ink">Hello, {greetingName}.</h1>

      {activeEvent ? (
        <div className="mt-6 rounded-sm border border-ink/10 bg-sand-light p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-bronze">Active Challenge</p>
          <p className="mt-1 font-display text-xl font-semibold uppercase tracking-wide text-ink">
            {activeEvent.name}
          </p>

          {activeEvent.required_sessions && (
            <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <p className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
                {summary.sessionCount} OF {activeEvent.required_sessions} COMPLETE
              </p>
              {activeEvent.minimum_total_minutes && (
                <p className="text-sm font-semibold text-charcoal-light">
                  {summary.totalMinutes} / {activeEvent.minimum_total_minutes} minutes
                </p>
              )}
            </div>
          )}

          <Link
            href={`/app/challenges/${activeEvent.slug}`}
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
          >
            Continue Challenge
          </Link>

          {nextMilestone && (
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
              {nextMilestone.threshold - summary.sessionCount} session
              {nextMilestone.threshold - summary.sessionCount === 1 ? "" : "s"} until your next milestone.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-sm border border-dashed border-ink/20 p-6 text-center">
          <p className="text-sm text-charcoal-light">You&apos;re not registered for a challenge yet.</p>
          <Link
            href="/app/challenges"
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
          >
            Explore Challenges
          </Link>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3">
        <Link href="/app/challenges" className="rounded-sm border border-ink/10 bg-off-white p-4 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5">
          Challenges
        </Link>
        <Link href="/app/share" className="rounded-sm border border-ink/10 bg-off-white p-4 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5">
          Share Progress
        </Link>
        <a
          href={`${EVENT22_CAMPAIGN_URL}/promokit`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm border border-ink/10 bg-off-white p-4 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
        >
          Promo Kit
        </a>
        <a
          href={EVENT22_CAMPAIGN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm border border-ink/10 bg-off-white p-4 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
        >
          Event Details
        </a>
      </div>

      <div className="mt-8 border-t border-ink/10 pt-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">Optional Donation</p>
        <p className="mt-2 text-sm text-charcoal-light">
          Donation is completely separate from challenge completion and giveaway eligibility.
        </p>
        <a
          href="https://tri.forthe22.org/donate"
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-event="donation_link_clicked"
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-sm border border-ink/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
        >
          {DONATE_LINK.label}
        </a>
      </div>
    </div>
  );
}
