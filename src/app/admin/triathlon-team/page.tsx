import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Container } from "@/components/shared/container";
import { cn, formatDateLong } from "@/lib/utils";
import type { TriathlonApplicationStatus, TriathlonTeamApplicationRow } from "@/types/database";

const FILTERS: { value: "all" | TriathlonApplicationStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "approved", label: "Approved" },
  { value: "waitlisted", label: "Waitlisted" },
  { value: "declined", label: "Declined" },
  { value: "all", label: "All" },
];

const STATUS_TONE: Record<TriathlonApplicationStatus, string> = {
  new: "border-ink/15 text-charcoal-light",
  reviewing: "border-bronze/40 bg-bronze/10 text-bronze",
  approved: "border-olive/30 bg-olive/10 text-olive",
  waitlisted: "border-ink/15 text-charcoal-light",
  declined: "border-red-300 bg-red-50 text-red-800",
};

export default async function TriathlonTeamAdminPage(props: PageProps<"/admin/triathlon-team">) {
  await requireAdminUser();
  const searchParams = await props.searchParams;
  const filterParam = Array.isArray(searchParams.filter) ? searchParams.filter[0] : searchParams.filter;
  const activeFilter = (filterParam ?? "new") as "all" | TriathlonApplicationStatus;

  const admin = createAdminClient();

  let query = admin
    .from("triathlon_team_applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (activeFilter !== "all") query = query.eq("status", activeFilter);

  const { data, error } = await query;
  const applications = (data ?? []) as TriathlonTeamApplicationRow[];

  return (
    <Container className="max-w-5xl py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold uppercase text-ink">Triathlon Team Applications</h1>
        <Link href="/admin" className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink">
          Back to Overview
        </Link>
      </div>
      <p className="mt-1 text-sm text-charcoal-light">
        Applications submitted at /get-involved/triathlon-team. Nothing here is public — review and
        change status below.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "new" ? "/admin/triathlon-team" : `/admin/triathlon-team?filter=${f.value}`}
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

      {error && <p className="mt-6 text-sm font-medium text-red-700">Failed to load applications.</p>}

      <div className="mt-6 space-y-3">
        {applications.map((app) => (
          <Link
            key={app.id}
            href={`/admin/triathlon-team/${app.id}`}
            className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-ink/10 bg-off-white p-5 transition-shadow hover:shadow-md"
          >
            <div>
              <p className="font-medium text-ink">{app.full_name}</p>
              <p className="text-xs text-charcoal-light">
                {app.email} &middot; {app.city}, {app.state} &middot; {app.experience_level}
              </p>
              <p className="text-xs text-charcoal-light">{formatDateLong(app.created_at)}</p>
            </div>
            <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide", STATUS_TONE[app.status])}>
              {app.status}
            </span>
          </Link>
        ))}

        {applications.length === 0 && (
          <p className="rounded-sm border border-dashed border-ink/20 p-6 text-sm text-charcoal-light">
            No applications match this filter.
          </p>
        )}
      </div>
    </Container>
  );
}
