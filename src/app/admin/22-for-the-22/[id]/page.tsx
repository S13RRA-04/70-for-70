import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Container } from "@/components/shared/container";
import { formatDateLong } from "@/lib/utils";
import { EVENT_DISCIPLINE_LABELS } from "@/lib/content/22-for-the-22";
import { updateRegistrationStatusAction, setGiveawayEligibleAction, saveRegistrationNotesAction } from "../actions";
import type { EventRegistrationRow, EventRegistrationStatus } from "@/types/database";

const STATUS_OPTIONS: EventRegistrationStatus[] = ["confirmed", "cancelled"];

export default async function EventRegistrationDetailPage(props: PageProps<"/admin/22-for-the-22/[id]">) {
  await requireAdminUser();
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const errorParam = Array.isArray(searchParams.error) ? searchParams.error[0] : searchParams.error;

  const admin = createAdminClient();
  const { data: registration } = await admin
    .from("event_registrations")
    .select("*")
    .eq("id", id)
    .single();

  if (!registration) notFound();

  const r = registration as EventRegistrationRow;

  return (
    <Container className="max-w-4xl py-16">
      <Link
        href="/admin/22-for-the-22"
        className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
      >
        &larr; Back to Registrations
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold uppercase text-ink">
            {r.first_name} {r.last_name}
          </h1>
          <p className="mt-1 text-sm text-charcoal-light">
            {r.email} {r.phone ? `· ${r.phone}` : ""} &middot; {r.city}, {r.state}
          </p>
          <p className="text-xs text-charcoal-light">Registered {formatDateLong(r.created_at)}</p>
        </div>
        <span className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink">
          {r.status}
        </span>
      </div>

      {errorParam && (
        <p role="alert" className="mt-6 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {errorParam}
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <Section title="Participation">
            <Info label="Type" value={r.participation_type === "team" ? "Team" : "Solo"} />
            {r.participation_type === "team" && (
              <>
                <Info label="Team Name" value={r.team_name} />
                <Info label="Team Captain" value={r.team_captain ? "Yes" : "No"} />
              </>
            )}
            <Info
              label="Disciplines"
              value={r.disciplines.map((d) => EVENT_DISCIPLINE_LABELS[d] ?? d).join(", ")}
            />
            {r.disciplines.includes("other") && <Info label="Other Discipline" value={r.discipline_other_note} />}
          </Section>

          {r.participation_reason && (
            <Section title="Why They're Participating">
              <TextBlock value={r.participation_reason} />
            </Section>
          )}

          <Section title="Consents">
            <Info label="Waiver / giveaway entry agreed" value={r.waiver_accepted ? "Agreed" : "Not agreed"} />
            <Info label="Email updates opt-in" value={r.email_consent ? "Yes" : "No"} />
          </Section>
        </div>

        <div className="space-y-8">
          <section className="rounded-sm border border-ink/10 bg-sand-light p-6">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Status</h2>
            <form action={updateRegistrationStatusAction} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={r.id} />
              <select
                name="status"
                defaultValue={r.status}
                className="w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full rounded-sm bg-bronze px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
              >
                Update Status
              </button>
            </form>
          </section>

          <section className="rounded-sm border border-ink/10 bg-off-white p-6">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
              Giveaway Eligibility
            </h2>
            <p className="mt-1 text-xs text-charcoal-light">
              Uncheck to exclude a flagged (bot/duplicate/fraud) entry from the drawing without deleting the
              registration. Never shown publicly.
            </p>
            <form action={setGiveawayEligibleAction} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={r.id} />
              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  name="giveawayEligible"
                  defaultChecked={r.giveaway_eligible}
                  className="h-4 w-4 accent-bronze"
                />
                Eligible for the giveaway drawing
              </label>
              <button
                type="submit"
                className="w-full rounded-sm border border-ink/20 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
              >
                Save Eligibility
              </button>
            </form>
          </section>

          <section className="rounded-sm border border-ink/10 bg-off-white p-6">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
              Internal Notes
            </h2>
            <p className="mt-1 text-xs text-charcoal-light">Never shown publicly.</p>
            <form action={saveRegistrationNotesAction} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={r.id} />
              <textarea
                name="adminNotes"
                defaultValue={r.admin_notes ?? ""}
                rows={6}
                className="w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
              />
              <button
                type="submit"
                className="w-full rounded-sm border border-ink/20 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
              >
                Save Notes
              </button>
            </form>
          </section>
        </div>
      </div>
    </Container>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-sm border border-ink/10 bg-off-white p-6">
      <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">{title}</h2>
      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">{children}</dl>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">{label}</dt>
      <dd className="mt-0.5 text-ink">{value || "—"}</dd>
    </div>
  );
}

function TextBlock({ value }: { value: string }) {
  return <p className="col-span-2 whitespace-pre-line text-sm text-ink">{value}</p>;
}
