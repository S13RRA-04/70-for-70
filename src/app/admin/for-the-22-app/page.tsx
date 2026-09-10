import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAppEventAdminStats } from "@/lib/data/app/admin-stats";
import { CURRENT_APP_EVENT_SLUG, isAppEventRegistrationOpen } from "@/lib/data/app/events";
import { updateAppEventAction } from "./actions";
import { Container } from "@/components/shared/container";
import { StatCard } from "@/components/shared/stat-card";
import { EVENT_DISCIPLINE_LABELS } from "@/lib/content/22-for-the-22";
import type { AppEventRow } from "@/types/app";

function toDatetimeLocal(iso: string): string {
  return iso.slice(0, 16);
}

export default async function ForThe22AppAdminPage() {
  await requireAdminUser();
  const admin = createAdminClient();

  const { data: event } = await admin
    .from("events")
    .select("*")
    .eq("slug", CURRENT_APP_EVENT_SLUG)
    .maybeSingle<AppEventRow>();

  if (!event) {
    return (
      <Container className="max-w-3xl py-16">
        <p className="text-sm text-charcoal-light">No events row found for slug &quot;{CURRENT_APP_EVENT_SLUG}&quot;.</p>
      </Container>
    );
  }

  const stats = await getAppEventAdminStats(event.id);
  const registrationOpen = isAppEventRegistrationOpen(event);

  return (
    <Container className="max-w-3xl py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold uppercase text-ink">For the 22 App</h1>
        <Link href="/admin" className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink">
          Back to Overview
        </Link>
      </div>
      <p className="mt-1 text-sm text-charcoal-light">{event.name} — app.forthe22.org</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/admin/for-the-22-app/registrations"
          className="rounded-sm border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
        >
          View Registrations
        </Link>
        <Link
          href="/admin/for-the-22-app/milestones"
          className="rounded-sm border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
        >
          Manage Milestones
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Total Registered" value={String(stats.totalRegistered)} />
        <StatCard label="Active Participants" value={String(stats.activeParticipants)} />
        <StatCard label="Sessions Completed" value={String(stats.sessionsCompleted)} />
        <StatCard label="Total Movement Minutes" value={String(stats.totalMovementMinutes)} />
        <StatCard label={`${event.required_sessions ?? "?"} of ${event.required_sessions ?? "?"} Finishers`} value={String(stats.finishers)} />
        <StatCard label="Teams" value={String(stats.teams)} />
      </div>

      {Object.keys(stats.activityBreakdown).length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">Activity Breakdown</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(stats.activityBreakdown).map(([type, count]) => (
              <span
                key={type}
                className="rounded-full border border-bronze/30 bg-bronze/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-bronze"
              >
                {EVENT_DISCIPLINE_LABELS[type] ?? type}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      <form action={updateAppEventAction} className="mt-10 space-y-5 rounded-sm border border-ink/10 bg-off-white p-6">
        <p className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Event Settings</p>
        <input type="hidden" name="id" value={event.id} />

        <label className="flex items-center gap-3 text-sm text-ink">
          <input type="checkbox" name="registrationOpen" defaultChecked={registrationOpen} className="h-4 w-4 accent-bronze" />
          Registration Open
        </label>

        <div>
          <label htmlFor="status" className="text-sm font-medium text-ink">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={event.status}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink"
          >
            {["draft", "open", "active", "complete", "archived"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="requiredSessions" className="text-sm font-medium text-ink">
              Required Sessions
            </label>
            <input
              id="requiredSessions"
              name="requiredSessions"
              type="number"
              defaultValue={event.required_sessions ?? ""}
              className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink"
            />
          </div>
          <div>
            <label htmlFor="minimumSessionMinutes" className="text-sm font-medium text-ink">
              Min. Minutes / Session
            </label>
            <input
              id="minimumSessionMinutes"
              name="minimumSessionMinutes"
              type="number"
              defaultValue={event.minimum_session_minutes ?? ""}
              className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink"
            />
          </div>
          <div>
            <label htmlFor="minimumTotalMinutes" className="text-sm font-medium text-ink">
              Min. Total Minutes
            </label>
            <input
              id="minimumTotalMinutes"
              name="minimumTotalMinutes"
              type="number"
              defaultValue={event.minimum_total_minutes ?? ""}
              className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="startAt" className="text-sm font-medium text-ink">
              Event Start
            </label>
            <input
              id="startAt"
              name="startAt"
              type="datetime-local"
              defaultValue={toDatetimeLocal(event.start_at)}
              className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink"
            />
          </div>
          <div>
            <label htmlFor="endAt" className="text-sm font-medium text-ink">
              Event End
            </label>
            <input
              id="endAt"
              name="endAt"
              type="datetime-local"
              defaultValue={toDatetimeLocal(event.end_at)}
              className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium text-ink">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={event.description ?? ""}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink"
          />
        </div>

        <button
          type="submit"
          className="rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
        >
          Save Settings
        </button>
      </form>
    </Container>
  );
}
