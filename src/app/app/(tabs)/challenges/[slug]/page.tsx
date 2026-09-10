import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAppEventBySlug, isAppEventRegistrationOpen } from "@/lib/data/app/events";
import { getMyRegistration } from "@/lib/data/app/registrations";
import { getMyActivities, summarizeActivities } from "@/lib/data/app/activities";
import { getMilestonesForEvent } from "@/lib/data/app/milestones";
import { findLinkableEventRegistration } from "@/lib/data/app/link-registration";
import { formatDateLong } from "@/lib/utils";
import { RegisterForChallengeButton } from "@/components/app/register-for-challenge-button";
import { ChallengeSessionPanel } from "@/components/app/challenge-session-panel";
import { LinkRegistrationPrompt } from "@/components/app/link-registration-prompt";

export async function generateMetadata(props: PageProps<"/app/challenges/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const event = await getAppEventBySlug(slug);
  return { title: event?.name ?? "Challenge" };
}

export default async function ChallengeDetailPage(props: PageProps<"/app/challenges/[slug]">) {
  const { slug } = await props.params;
  const event = await getAppEventBySlug(slug);
  if (!event) notFound();

  const [registration, activities, milestones] = await Promise.all([
    getMyRegistration(event.id),
    getMyActivities(event.id),
    getMilestonesForEvent(event.id),
  ]);
  const summary = summarizeActivities(activities);
  const linkableRegistration = registration ? null : await findLinkableEventRegistration(event.id);
  const registrationOpen = isAppEventRegistrationOpen(event);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-bronze">Challenge</p>
      <h1 className="mt-1 font-display text-3xl font-bold uppercase tracking-tight text-ink">{event.name}</h1>
      {event.description && <p className="mt-3 text-base leading-relaxed text-charcoal-light">{event.description}</p>}

      <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-charcoal-light">
        {formatDateLong(event.start_at)} &ndash; {formatDateLong(event.end_at)}
      </p>

      {event.event_type === "session_count" && event.required_sessions && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-sm border border-ink/10 bg-sand-light px-5 py-4">
            <p className="font-display text-2xl font-semibold tabular-nums text-ink">{event.required_sessions}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-charcoal-light">Sessions</p>
          </div>
          <div className="rounded-sm border border-ink/10 bg-sand-light px-5 py-4">
            <p className="font-display text-2xl font-semibold tabular-nums text-ink">
              {event.minimum_session_minutes}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-charcoal-light">Min. Minutes Each</p>
          </div>
        </div>
      )}

      <div className="mt-8">
        {registration ? (
          event.event_type === "session_count" && event.required_sessions && event.minimum_session_minutes ? (
            <ChallengeSessionPanel
              eventId={event.id}
              slug={event.slug}
              requiredSessions={event.required_sessions}
              minimumSessionMinutes={event.minimum_session_minutes}
              sessionCount={summary.sessionCount}
              totalMinutes={summary.totalMinutes}
              milestones={milestones}
            />
          ) : (
            <div className="rounded-sm border border-olive/30 bg-olive/10 p-6">
              <p className="font-display text-sm font-semibold uppercase tracking-wide text-olive">
                You&apos;re Registered
              </p>
            </div>
          )
        ) : linkableRegistration ? (
          <LinkRegistrationPrompt eventId={event.id} slug={event.slug} firstName={linkableRegistration.firstName} />
        ) : registrationOpen ? (
          <RegisterForChallengeButton eventId={event.id} slug={event.slug} />
        ) : (
          <div className="rounded-sm border border-dashed border-ink/20 p-6 text-center">
            <p className="text-sm text-charcoal-light">Registration for this challenge is closed.</p>
          </div>
        )}
      </div>

      <p className="mt-8 text-xs leading-relaxed text-charcoal-light/80">
        Registering here is challenge participation, separate from the free giveaway entry on the public event page.
        No purchase or donation necessary to enter or win. Completing challenge activities, sharing content, or
        making donations does not increase your odds of winning.
      </p>
    </div>
  );
}
