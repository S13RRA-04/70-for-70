import type { Metadata } from "next";
import Link from "next/link";
import { requireParticipant } from "@/lib/supabase/require-participant";
import { getMyProfile } from "@/lib/data/app/profiles";
import { getAppEvents } from "@/lib/data/app/events";
import { getMyActivities, summarizeActivities } from "@/lib/data/app/activities";
import { createClient } from "@/lib/supabase/server";
import { ProgressShareCard } from "@/components/app/progress-share-card";
import { EVENT22_CAMPAIGN_URL } from "@/lib/constants";

export const metadata: Metadata = { title: "Share" };

export default async function SharePage(props: PageProps<"/app/share">) {
  const user = await requireParticipant();
  const searchParams = await props.searchParams;
  const [profile, events] = await Promise.all([getMyProfile(), getAppEvents()]);

  const supabase = await createClient();
  const { data: myRegistrations } = await supabase.from("registrations").select("event_id").eq("user_id", user.id);
  const registeredEventIds = new Set((myRegistrations ?? []).map((r) => r.event_id));
  const activeEvent = events.find((e) => registeredEventIds.has(e.id) && e.required_sessions);

  const activityType = typeof searchParams.activityType === "string" ? searchParams.activityType : undefined;
  const durationMinutes =
    typeof searchParams.durationMinutes === "string" ? Number(searchParams.durationMinutes) : undefined;
  const distance = typeof searchParams.distance === "string" ? Number(searchParams.distance) : undefined;
  const distanceUnit = typeof searchParams.distanceUnit === "string" ? searchParams.distanceUnit : undefined;
  const lastActivity =
    activityType && durationMinutes ? { activityType, durationMinutes, distance, distanceUnit } : undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-center font-display text-2xl font-bold uppercase tracking-tight text-ink">Share</h1>

      {activeEvent ? (
        <ShareCardSection
          eventId={activeEvent.id}
          eventName={activeEvent.name}
          requiredSessions={activeEvent.required_sessions!}
          firstName={profile?.first_name || "Participant"}
          lastActivity={lastActivity}
        />
      ) : (
        <div className="mt-8 rounded-sm border border-dashed border-ink/20 p-8 text-center">
          <p className="text-sm text-charcoal-light">Register for a challenge to get your shareable progress card.</p>
          <Link
            href="/app/challenges"
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-sm border border-ink/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
          >
            View Challenges
          </Link>
        </div>
      )}

      <div className="mt-8 rounded-sm border border-ink/10 bg-sand-light p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">Participant Promo Kit</p>
        <p className="mt-2 text-sm text-charcoal-light">
          Social graphics, photo frames, suggested captions, and hashtags — ready to use.
        </p>
        <a
          href={`${EVENT22_CAMPAIGN_URL}/promokit`}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-event="promo_asset_downloaded"
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
        >
          Open Promo Kit
        </a>
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-charcoal-light/80">
        Sharing is optional and does not provide additional giveaway entries or improve odds of winning.
      </p>
    </div>
  );
}

async function ShareCardSection({
  eventId,
  eventName,
  requiredSessions,
  firstName,
  lastActivity,
}: {
  eventId: string;
  eventName: string;
  requiredSessions: number;
  firstName: string;
  lastActivity?: { activityType: string; durationMinutes: number; distance?: number; distanceUnit?: string };
}) {
  const activities = await getMyActivities(eventId);
  const summary = summarizeActivities(activities);

  return (
    <div className="mt-8">
      <ProgressShareCard
        firstName={firstName}
        eventName={eventName}
        sessionCount={summary.sessionCount}
        requiredSessions={requiredSessions}
        totalMinutes={summary.totalMinutes}
        lastActivity={lastActivity}
      />
    </div>
  );
}
