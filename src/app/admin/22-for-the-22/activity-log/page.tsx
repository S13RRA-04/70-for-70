import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { getCurrentEventConfig } from "@/lib/data/event-config";
import { getEventActivityLog } from "@/lib/data/event-activity-log";
import { Container } from "@/components/shared/container";
import { addActivityLogEntryAction, deleteActivityLogEntryAction } from "./actions";

export default async function ActivityLogAdminPage() {
  await requireAdminUser();
  const event = await getCurrentEventConfig();

  if (!event) {
    return (
      <Container className="max-w-3xl py-16">
        <p className="text-sm text-charcoal-light">No event_config row found for the current event slug.</p>
      </Container>
    );
  }

  const entries = await getEventActivityLog(event.id);

  return (
    <Container className="max-w-3xl py-16">
      <Link
        href="/admin/22-for-the-22"
        className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
      >
        &larr; Back to Registrations
      </Link>

      <h1 className="mt-4 font-display text-2xl font-semibold uppercase text-ink">Current Movement Log</h1>
      <p className="mt-1 text-sm text-charcoal-light">
        Powers the &quot;Current Movement&quot; module on the live event page — add an entry each time the
        activity changes (e.g. &quot;Hour 1&quot; / &quot;Run&quot;).
      </p>

      <div className="mt-8 rounded-sm border border-ink/10 bg-off-white p-6">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Add Entry</h2>
        <form action={addActivityLogEntryAction} className="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="hourLabel" className="text-xs font-medium text-ink">
              Hour
            </label>
            <input
              id="hourLabel"
              name="hourLabel"
              type="text"
              placeholder="Hour 1"
              required
              className="mt-1.5 w-32 rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
            />
          </div>
          <div>
            <label htmlFor="activityLabel" className="text-xs font-medium text-ink">
              Activity
            </label>
            <input
              id="activityLabel"
              name="activityLabel"
              type="text"
              placeholder="Run"
              required
              className="mt-1.5 w-40 rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="note" className="text-xs font-medium text-ink">
              Note (optional)
            </label>
            <input
              id="note"
              name="note"
              type="text"
              className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
            />
          </div>
          <button
            type="submit"
            className="rounded-sm border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
          >
            Add
          </button>
        </form>
      </div>

      <div className="mt-6 rounded-sm border border-ink/10 bg-off-white p-6">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Log</h2>
        {entries.length === 0 ? (
          <p className="mt-4 text-sm text-charcoal-light">No entries yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-3 border-t border-ink/10 pt-2 text-sm first:border-t-0 first:pt-0"
              >
                <span className="text-ink">
                  <span className="mr-2 text-xs font-semibold uppercase tracking-widest text-charcoal-light/70">
                    {entry.hour_label}
                  </span>
                  {entry.activity_label}
                  {entry.note && <span className="text-charcoal-light"> — {entry.note}</span>}
                </span>
                <form action={deleteActivityLogEntryAction}>
                  <input type="hidden" name="id" value={entry.id} />
                  <button
                    type="submit"
                    className="shrink-0 text-xs font-semibold uppercase tracking-wide text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}
