import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Container } from "@/components/shared/container";
import { CURRENT_APP_EVENT_SLUG } from "@/lib/data/app/events";
import { updateMilestoneAction } from "./actions";
import type { MilestoneRow } from "@/types/app";

export default async function ForThe22AppMilestonesPage() {
  await requireAdminUser();
  const admin = createAdminClient();

  const { data: event } = await admin.from("events").select("id").eq("slug", CURRENT_APP_EVENT_SLUG).maybeSingle();
  if (!event) {
    return (
      <Container className="max-w-2xl py-16">
        <p className="text-sm text-charcoal-light">No event found.</p>
      </Container>
    );
  }

  const { data: milestones } = await admin
    .from("milestones")
    .select("*")
    .eq("event_id", event.id)
    .order("display_order", { ascending: true })
    .returns<MilestoneRow[]>();

  return (
    <Container className="max-w-2xl py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold uppercase text-ink">Milestones</h1>
        <Link href="/admin/for-the-22-app" className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink">
          Back
        </Link>
      </div>

      <div className="mt-6 space-y-6">
        {(milestones ?? []).map((milestone) => (
          <form
            key={milestone.id}
            action={updateMilestoneAction}
            className="space-y-3 rounded-sm border border-ink/10 bg-off-white p-5"
          >
            <input type="hidden" name="id" value={milestone.id} />
            <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
              Threshold: {milestone.threshold} session{milestone.threshold === 1 ? "" : "s"}
            </p>

            <div>
              <label htmlFor={`title-${milestone.id}`} className="text-sm font-medium text-ink">
                Title
              </label>
              <input
                id={`title-${milestone.id}`}
                name="title"
                defaultValue={milestone.title}
                className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
              />
            </div>

            <div>
              <label htmlFor={`message-${milestone.id}`} className="text-sm font-medium text-ink">
                Message
              </label>
              <textarea
                id={`message-${milestone.id}`}
                name="message"
                rows={2}
                defaultValue={milestone.message}
                className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
              />
            </div>

            <div>
              <label htmlFor={`share-${milestone.id}`} className="text-sm font-medium text-ink">
                Share Template
              </label>
              <textarea
                id={`share-${milestone.id}`}
                name="shareTemplate"
                rows={3}
                defaultValue={milestone.share_template ?? ""}
                className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 font-mono text-xs text-ink"
              />
            </div>

            <button
              type="submit"
              className="rounded-sm border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
            >
              Save
            </button>
          </form>
        ))}
      </div>
    </Container>
  );
}
