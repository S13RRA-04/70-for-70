import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { getCurrentEventConfig } from "@/lib/data/event-config";
import { Container } from "@/components/shared/container";
import { formatDateLong } from "@/lib/utils";
import { updateEventConfigAction } from "./actions";

export default async function EventSettingsAdminPage(props: PageProps<"/admin/22-for-the-22/settings">) {
  await requireAdminUser();
  const searchParams = await props.searchParams;
  const errorParam = Array.isArray(searchParams.error) ? searchParams.error[0] : searchParams.error;

  const event = await getCurrentEventConfig();

  return (
    <Container className="max-w-2xl py-16">
      <Link
        href="/admin/22-for-the-22"
        className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
      >
        &larr; Back to Registrations
      </Link>

      <h1 className="mt-4 font-display text-2xl font-semibold uppercase text-ink">22 For the 22 Settings</h1>
      <p className="mt-1 text-sm text-charcoal-light">
        Operational fields for the current event instance — safe to change during the live 22-hour window
        without a redeploy.
      </p>

      {errorParam && (
        <p role="alert" className="mt-6 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {errorParam}
        </p>
      )}

      {!event ? (
        <p className="mt-8 text-sm text-charcoal-light">No event_config row found for the current event slug.</p>
      ) : (
        <form action={updateEventConfigAction} className="mt-8 space-y-6">
          <input type="hidden" name="id" value={event.id} />

          <div className="rounded-sm border border-ink/10 bg-sand-light p-6 text-sm text-charcoal-light">
            <p>
              <span className="font-semibold text-ink">{event.event_name}</span> — {formatDateLong(event.starts_at)}{" "}
              → {formatDateLong(event.ends_at)}
            </p>
            <p className="mt-1">
              Dates aren&apos;t editable from this form — update them directly in Supabase if the event ever
              needs to move.
            </p>
          </div>

          <div>
            <label htmlFor="statusOverride" className="text-sm font-medium text-ink">
              Status Override
            </label>
            <select
              id="statusOverride"
              name="statusOverride"
              defaultValue={event.status_override ?? ""}
              className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
            >
              <option value="">Auto (compute from dates)</option>
              <option value="pre">Force Pre-Event</option>
              <option value="live">Force Live</option>
              <option value="complete">Force Complete</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              name="registrationOpen"
              defaultChecked={event.registration_open}
              className="h-4 w-4 accent-bronze"
            />
            Registration open
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="fundraisingGoal" className="text-sm font-medium text-ink">
                Fundraising Goal ($)
              </label>
              <input
                id="fundraisingGoal"
                name="fundraisingGoal"
                type="number"
                step="1"
                min="0"
                defaultValue={event.fundraising_goal}
                className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
              />
            </div>
            <div>
              <label htmlFor="amountRaised" className="text-sm font-medium text-ink">
                Amount Raised ($)
              </label>
              <input
                id="amountRaised"
                name="amountRaised"
                type="number"
                step="1"
                min="0"
                defaultValue={event.amount_raised}
                className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
              />
              <p className="mt-1 text-xs text-charcoal-light">
                Hand-updated — there&apos;s no automatic donation tagging for this event yet.
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="merchUrl" className="text-sm font-medium text-ink">
              Merch (Bonfire) URL
            </label>
            <input
              id="merchUrl"
              name="merchUrl"
              type="url"
              defaultValue={event.merch_url ?? ""}
              className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
            />
          </div>

          <div>
            <label htmlFor="donateUrl" className="text-sm font-medium text-ink">
              Donate URL
            </label>
            <input
              id="donateUrl"
              name="donateUrl"
              type="url"
              placeholder="https://tri.forthe22.org/donate"
              defaultValue={event.donate_url ?? ""}
              className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
            />
          </div>

          <div>
            <label htmlFor="officialRulesBody" className="text-sm font-medium text-ink">
              Official Rules (Markdown)
            </label>
            <p className="mt-1 text-xs text-charcoal-light">
              Leave blank to show the placeholder rules scaffold at /22forthe22/rules. Set once reviewed legal
              copy is approved — it fully replaces the placeholder.
            </p>
            <textarea
              id="officialRulesBody"
              name="officialRulesBody"
              rows={8}
              defaultValue={event.official_rules_body ?? ""}
              className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 font-mono text-sm text-ink"
            />
          </div>

          <div>
            <label htmlFor="winnerAnnouncement" className="text-sm font-medium text-ink">
              Winner Announcement
            </label>
            <p className="mt-1 text-xs text-charcoal-light">
              Shown in the recap section once the event is complete. Leave blank until winners are announced.
            </p>
            <textarea
              id="winnerAnnouncement"
              name="winnerAnnouncement"
              rows={4}
              defaultValue={event.winner_announcement ?? ""}
              className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
            />
          </div>

          <button
            type="submit"
            className="rounded-sm bg-bronze px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
          >
            Save Settings
          </button>
        </form>
      )}
    </Container>
  );
}
