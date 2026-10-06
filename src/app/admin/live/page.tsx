import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Container } from "@/components/shared/container";
import { cn, formatDateLong } from "@/lib/utils";
import { deleteLiveEventAction } from "./actions";
import type { LiveEventRow } from "@/types/database";

export default async function LiveAdminPage() {
  await requireAdminUser();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("live_events")
    .select("*")
    .order("display_order", { ascending: true })
    .order("starts_at", { ascending: true });
  const events = (data ?? []) as LiveEventRow[];

  return (
    <Container className="max-w-6xl py-16">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink">
            &larr; Back to Overview
          </Link>
          <h1 className="mt-4 font-display text-2xl font-semibold uppercase text-ink">For The 22: Live</h1>
          <p className="mt-1 text-sm text-charcoal-light">
            Concert dates for the For The 22: Live series — public at /campaigns/live/events once published.
          </p>
        </div>
        <Link
          href="/admin/live/new"
          className="rounded-sm bg-bronze-text px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-dark"
        >
          New Event
        </Link>
      </div>

      {error && <p className="mt-6 text-sm font-medium text-red-700">Failed to load live events.</p>}

      <div className="mt-6 overflow-x-auto rounded-sm border border-ink/10">
        <table className="w-full min-w-[800px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 bg-sand-light text-xs font-semibold uppercase tracking-wide text-charcoal-light">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Venue</th>
              <th className="px-4 py-3">Starts</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b border-ink/5 last:border-0 hover:bg-sand-light/50">
                <td className="px-4 py-3">
                  <Link href={`/admin/live/${event.id}/edit`} className="font-medium text-ink hover:text-bronze">
                    {event.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-charcoal-light">
                  {[event.venue_name, event.venue_city, event.venue_state].filter(Boolean).join(", ") || "—"}
                </td>
                <td className="px-4 py-3 text-charcoal-light">
                  {event.starts_at ? formatDateLong(event.starts_at) : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
                      event.published
                        ? "border-olive/40 bg-olive/10 text-olive-dark"
                        : "border-ink/20 text-charcoal-light",
                    )}
                  >
                    {event.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/live/${event.id}/edit`} className="text-xs font-semibold uppercase tracking-wide text-bronze hover:underline">
                      Edit
                    </Link>
                    <form action={deleteLiveEventAction}>
                      <input type="hidden" name="id" value={event.id} />
                      <button type="submit" className="text-xs font-semibold uppercase tracking-wide text-red-700 hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {events.length === 0 && <p className="p-6 text-sm text-charcoal-light">No live events yet.</p>}
      </div>
    </Container>
  );
}
