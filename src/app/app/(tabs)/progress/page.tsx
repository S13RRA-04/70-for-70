import type { Metadata } from "next";
import Link from "next/link";
import { requireParticipant } from "@/lib/supabase/require-participant";
import { getAppEvents } from "@/lib/data/app/events";
import { getMyActivities, summarizeActivities } from "@/lib/data/app/activities";
import { EVENT_DISCIPLINE_LABELS } from "@/lib/content/22-for-the-22";
import { ActivityTimeline } from "@/components/app/activity-timeline";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Progress" };

export default async function ProgressPage() {
  const user = await requireParticipant();
  const events = await getAppEvents();

  const supabase = await createClient();
  const { data: myRegistrations } = await supabase.from("registrations").select("event_id").eq("user_id", user.id);
  const registeredEventIds = new Set((myRegistrations ?? []).map((r) => r.event_id));
  const registeredEvents = events.filter((e) => registeredEventIds.has(e.id));

  if (registeredEvents.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-ink">Your Progress</h1>
        <div className="mt-8 rounded-sm border border-dashed border-ink/20 p-8 text-center">
          <p className="text-sm text-charcoal-light">Register for a challenge to start tracking your progress.</p>
          <Link
            href="/app/challenges"
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-sm border border-ink/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
          >
            View Challenges
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-ink">Your Progress</h1>

      <div className="mt-6 space-y-10">
        {await Promise.all(
          registeredEvents.map(async (event) => {
            const activities = await getMyActivities(event.id);
            const summary = summarizeActivities(activities);
            const minimumTotal = event.minimum_total_minutes;

            return (
              <section key={event.id}>
                <p className="font-display text-lg font-semibold uppercase tracking-wide text-ink">{event.name}</p>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-sm border border-ink/10 bg-sand-light px-5 py-4">
                    <p className="font-display text-2xl font-semibold tabular-nums text-ink">
                      {summary.sessionCount}
                      {event.required_sessions ? ` / ${event.required_sessions}` : ""}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-charcoal-light">Sessions</p>
                  </div>
                  <div className="rounded-sm border border-ink/10 bg-sand-light px-5 py-4">
                    <p className="font-display text-2xl font-semibold tabular-nums text-ink">
                      {summary.totalMinutes}
                      {minimumTotal ? ` / ${minimumTotal}` : ""}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-charcoal-light">Minutes</p>
                  </div>
                </div>

                {Object.keys(summary.byActivityType).length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {Object.entries(summary.byActivityType).map(([type, count]) => (
                      <span
                        key={type}
                        className="rounded-full border border-bronze/30 bg-bronze/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-bronze"
                      >
                        {EVENT_DISCIPLINE_LABELS[type] ?? type}: {count}
                      </span>
                    ))}
                  </div>
                )}

                {Object.keys(summary.totalDistanceByUnit).length > 0 && (
                  <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                    {Object.entries(summary.totalDistanceByUnit)
                      .map(([unit, dist]) => `${dist} ${unit}`)
                      .join(" · ")}
                  </p>
                )}

                <div className="mt-4">
                  <Link href={`/app/challenges/${event.slug}`} className="text-sm font-semibold text-bronze hover:text-bronze-light">
                    View Challenge &rarr;
                  </Link>
                </div>

                <p className="mb-2 mt-6 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                  Session Timeline
                </p>
                <ActivityTimeline activities={activities} />
              </section>
            );
          }),
        )}
      </div>
    </div>
  );
}
