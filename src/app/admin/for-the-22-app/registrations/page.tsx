import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAppEventRegistrationsForAdmin } from "@/lib/data/app/admin-stats";
import { Container } from "@/components/shared/container";
import { formatDateLong } from "@/lib/utils";
import { CURRENT_APP_EVENT_SLUG } from "@/lib/data/app/events";

export default async function ForThe22AppRegistrationsPage() {
  await requireAdminUser();
  const admin = createAdminClient();

  const { data: event } = await admin.from("events").select("id, name, required_sessions").eq("slug", CURRENT_APP_EVENT_SLUG).maybeSingle();
  if (!event) {
    return (
      <Container className="max-w-4xl py-16">
        <p className="text-sm text-charcoal-light">No event found.</p>
      </Container>
    );
  }

  const registrations = await getAppEventRegistrationsForAdmin(event.id);

  return (
    <Container className="max-w-4xl py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold uppercase text-ink">App Registrations</h1>
        <Link href="/admin/for-the-22-app" className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink">
          Back
        </Link>
      </div>
      <p className="mt-1 text-sm text-charcoal-light">
        {registrations.length} registration(s) for {event.name}.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">City / State</th>
              <th className="py-2 pr-4">Type</th>
              <th className="py-2 pr-4">Sessions</th>
              <th className="py-2 pr-4">Minutes</th>
              <th className="py-2 pr-4">Registered</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r) => (
              <tr key={r.registrationId} className="border-b border-ink/5">
                <td className="py-2.5 pr-4 font-medium text-ink">
                  {r.firstName} {r.lastName}
                </td>
                <td className="py-2.5 pr-4 text-charcoal-light">{r.email ?? "—"}</td>
                <td className="py-2.5 pr-4 text-charcoal-light">
                  {r.city && r.state ? `${r.city}, ${r.state}` : "—"}
                </td>
                <td className="py-2.5 pr-4 text-charcoal-light">
                  {r.registrationType === "team" ? `Team — ${r.teamName ?? ""}` : "Solo"}
                </td>
                <td className="py-2.5 pr-4 tabular-nums text-charcoal-light">
                  {r.sessionCount}
                  {event.required_sessions ? ` / ${event.required_sessions}` : ""}
                </td>
                <td className="py-2.5 pr-4 tabular-nums text-charcoal-light">{r.totalMinutes}</td>
                <td className="py-2.5 pr-4 text-charcoal-light">{formatDateLong(r.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {registrations.length === 0 && (
          <p className="rounded-sm border border-dashed border-ink/20 p-6 text-center text-sm text-charcoal-light">
            No registrations yet.
          </p>
        )}
      </div>
    </Container>
  );
}
