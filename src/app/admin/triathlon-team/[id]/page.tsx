import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Container } from "@/components/shared/container";
import { formatDateLong } from "@/lib/utils";
import { updateApplicationStatusAction, saveApplicationNotesAction } from "../actions";
import type { TriathlonApplicationStatus, TriathlonTeamApplicationRow } from "@/types/database";

const STATUS_OPTIONS: TriathlonApplicationStatus[] = ["new", "reviewing", "approved", "waitlisted", "declined"];

export default async function TriathlonTeamDetailPage(props: PageProps<"/admin/triathlon-team/[id]">) {
  await requireAdminUser();
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const errorParam = Array.isArray(searchParams.error) ? searchParams.error[0] : searchParams.error;

  const admin = createAdminClient();
  const { data: application } = await admin
    .from("triathlon_team_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (!application) notFound();

  const a = application as TriathlonTeamApplicationRow;

  return (
    <Container className="max-w-4xl py-16">
      <Link
        href="/admin/triathlon-team"
        className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
      >
        &larr; Back to Applications
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold uppercase text-ink">{a.full_name}</h1>
          <p className="mt-1 text-sm text-charcoal-light">
            {a.email} &middot; {a.phone} &middot; {a.city}, {a.state}
          </p>
          <p className="text-xs text-charcoal-light">Applied {formatDateLong(a.created_at)}</p>
        </div>
        <span className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink">
          {a.status}
        </span>
      </div>

      {errorParam && (
        <p role="alert" className="mt-6 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {errorParam}
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <Section title="Triathlon Background">
            <Info label="Experience Level" value={a.experience_level} />
            <Info label="Years in Triathlon" value={a.years_in_triathlon} />
            <Info label="Preferred Distance" value={a.preferred_distance} />
          </Section>

          <Section title="Upcoming Racing">
            <Info label="Currently Registered" value={a.registered_for_race ? "Yes" : "No"} />
            {a.registered_for_race ? (
              <>
                <Info label="Race Name" value={a.race_name} />
                <Info label="Race Date" value={a.race_date ? formatDateLong(a.race_date) : null} />
                <Info label="Race Distance" value={a.race_distance} />
                <Info label="Race Location" value={a.race_location} />
              </>
            ) : (
              <Info label="Wants Help Finding a Race" value={a.needs_race_help ? "Yes" : "No"} />
            )}
          </Section>

          <Section title="Mission">
            <TextBlock value={a.mission_reason} />
          </Section>

          <Section title="Fundraising">
            <Info label="Fundraised Before" value={a.fundraising_experience ? "Yes" : "No"} />
            <Info label="Fundraising Goal" value={a.fundraising_goal} />
          </Section>

          <Section title="Social / Outreach">
            <Info label="Instagram" value={a.instagram} />
            <Info label="Facebook" value={a.facebook} />
            <Info label="Strava" value={a.strava} />
            <Info label="Other" value={a.other_social} />
          </Section>

          <Section title="Apparel">
            <Info label="Size" value={a.apparel_size} />
          </Section>

          <Section title="Acknowledgments">
            <Info label="Costs acknowledgment" value={a.ack_costs ? "Agreed" : "Not agreed"} />
            <Info label="Safety acknowledgment" value={a.ack_safety ? "Agreed" : "Not agreed"} />
            <Info label="Conduct acknowledgment" value={a.ack_conduct ? "Agreed" : "Not agreed"} />
          </Section>
        </div>

        <div className="space-y-8">
          <section className="rounded-sm border border-ink/10 bg-sand-light p-6">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Status</h2>
            <form action={updateApplicationStatusAction} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={a.id} />
              <select
                name="status"
                defaultValue={a.status}
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
              Internal Notes
            </h2>
            <p className="mt-1 text-xs text-charcoal-light">Never shown publicly.</p>
            <form action={saveApplicationNotesAction} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={a.id} />
              <textarea
                name="adminNotes"
                defaultValue={a.admin_notes ?? ""}
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
