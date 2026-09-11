import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentEventConfig } from "@/lib/data/event-config";
import { Container } from "@/components/shared/container";
import { StatCard } from "@/components/shared/stat-card";
import { cn, formatDateLong } from "@/lib/utils";
import type { EventRegistrationRow, EventRegistrationStatus } from "@/types/database";

const FILTERS: { value: "all" | EventRegistrationStatus; label: string }[] = [
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "all", label: "All" },
];

const STATUS_TONE: Record<EventRegistrationStatus, string> = {
  confirmed: "border-olive/30 bg-olive/10 text-olive",
  cancelled: "border-red-300 bg-red-50 text-red-800",
};

export default async function EventRegistrationsAdminPage(props: PageProps<"/admin/22-for-the-22">) {
  await requireAdminUser();
  const searchParams = await props.searchParams;
  const filterParam = Array.isArray(searchParams.filter) ? searchParams.filter[0] : searchParams.filter;
  const activeFilter = (filterParam ?? "confirmed") as "all" | EventRegistrationStatus;

  const event = await getCurrentEventConfig();
  const admin = createAdminClient();

  if (!event) {
    return (
      <Container className="max-w-5xl py-16">
        <p className="text-sm text-charcoal-light">No event_config row found for the current event slug.</p>
      </Container>
    );
  }

  let query = admin
    .from("event_registrations")
    .select("*")
    .eq("event_id", event.id)
    .order("created_at", { ascending: false });
  if (activeFilter !== "all") query = query.eq("status", activeFilter);

  const { data, error } = await query;
  const registrations = (data ?? []) as EventRegistrationRow[];

  const { data: allForStats } = await admin
    .from("event_registrations")
    .select("participation_type, disciplines")
    .eq("event_id", event.id)
    .eq("status", "confirmed");
  const soloCount = (allForStats ?? []).filter((r) => r.participation_type === "solo").length;
  const teamCount = (allForStats ?? []).filter((r) => r.participation_type === "team").length;

  return (
    <Container className="max-w-5xl py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold uppercase text-ink">22 For the 22 Registrations</h1>
        <Link href="/admin" className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink">
          Back to Overview
        </Link>
      </div>
      <p className="mt-1 text-sm text-charcoal-light">
        Free registrations submitted at 22.forthe22.org — each one is an entry in the free giveaway. Nothing here
        is public.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/admin/22-for-the-22/settings"
          className="rounded-sm border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
        >
          Event Settings
        </Link>
        <Link
          href="/admin/22-for-the-22/prizes"
          className="rounded-sm border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
        >
          Giveaway Prizes
        </Link>
        <Link
          href="/admin/22-for-the-22/activity-log"
          className="rounded-sm border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
        >
          Current Movement Log
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Confirmed" value={String(soloCount + teamCount)} />
        <StatCard label="Solo" value={String(soloCount)} />
        <StatCard label="Team" value={String(teamCount)} />
        <StatCard label="Raised" value={`$${event.amount_raised.toLocaleString()}`} />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "confirmed" ? "/admin/22-for-the-22" : `/admin/22-for-the-22?filter=${f.value}`}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
              activeFilter === f.value
                ? "border-ink bg-ink text-off-white"
                : "border-ink/20 text-charcoal hover:border-ink/40",
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {error && <p className="mt-6 text-sm font-medium text-red-700">Failed to load registrations.</p>}

      <div className="mt-6 space-y-3">
        {registrations.map((r) => (
          <Link
            key={r.id}
            href={`/admin/22-for-the-22/${r.id}`}
            className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-ink/10 bg-off-white p-5 transition-shadow hover:shadow-md"
          >
            <div>
              <p className="font-medium text-ink">
                {r.first_name} {r.last_name}
                {r.participation_type === "team" && r.team_name ? ` — ${r.team_name}` : ""}
              </p>
              <p className="text-xs text-charcoal-light">
                {r.email} &middot; {r.city}, {r.state} &middot; {r.disciplines.join(", ")}
              </p>
              <p className="text-xs text-charcoal-light">{formatDateLong(r.created_at)}</p>
            </div>
            <div className="flex items-center gap-2">
              {!r.giveaway_eligible && (
                <span className="rounded-full border border-ink/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-charcoal-light">
                  Excluded
                </span>
              )}
              <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide", STATUS_TONE[r.status])}>
                {r.status}
              </span>
            </div>
          </Link>
        ))}

        {registrations.length === 0 && (
          <p className="rounded-sm border border-dashed border-ink/20 p-6 text-sm text-charcoal-light">
            No registrations match this filter.
          </p>
        )}
      </div>
    </Container>
  );
}
