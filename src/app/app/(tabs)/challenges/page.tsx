import type { Metadata } from "next";
import Link from "next/link";
import { requireParticipant } from "@/lib/supabase/require-participant";
import { getAppEvents } from "@/lib/data/app/events";
import { createClient } from "@/lib/supabase/server";
import { formatDateLong } from "@/lib/utils";

export const metadata: Metadata = { title: "Challenges" };

const STATUS_LABEL: Record<string, string> = {
  draft: "Coming Soon",
  open: "Registration Open",
  active: "Underway",
  complete: "Complete",
  archived: "Archived",
};

export default async function ChallengesPage() {
  const user = await requireParticipant();
  const events = await getAppEvents();

  const supabase = await createClient();
  const { data: myRegistrations } = await supabase.from("registrations").select("event_id").eq("user_id", user.id);
  const registeredEventIds = new Set((myRegistrations ?? []).map((r) => r.event_id));

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-ink">Challenges</h1>
      <p className="mt-1 text-sm text-charcoal-light">Active and upcoming For the 22 challenges.</p>

      <div className="mt-6 space-y-4">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/app/challenges/${event.slug}`}
            className="block rounded-sm border border-ink/10 bg-off-white p-6 transition-shadow hover:shadow-md"
          >
            <p className="font-display text-xl font-semibold uppercase tracking-wide text-ink">{event.name}</p>
            {event.description && <p className="mt-2 text-sm text-charcoal-light">{event.description}</p>}
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
              {formatDateLong(event.start_at)} &ndash; {formatDateLong(event.end_at)}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-full border border-bronze/30 bg-bronze/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-bronze">
                {STATUS_LABEL[event.status] ?? event.status}
              </span>
              {registeredEventIds.has(event.id) && (
                <span className="rounded-full border border-olive/30 bg-olive/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-olive">
                  Registered
                </span>
              )}
            </div>
          </Link>
        ))}

        {events.length === 0 && (
          <p className="rounded-sm border border-dashed border-ink/20 p-6 text-center text-sm text-charcoal-light">
            No challenges available yet.
          </p>
        )}
      </div>
    </div>
  );
}
