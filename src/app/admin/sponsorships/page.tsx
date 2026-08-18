import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Container } from "@/components/shared/container";
import { cn, formatCurrency, formatDateLong } from "@/lib/utils";
import { hasVettingFlags, SPONSORSHIP_STATUS_LABELS } from "@/lib/sponsorship";
import type { SponsorshipRequestRow, SponsorshipStatus } from "@/types/database";

const FILTERS: { value: "all" | SponsorshipStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "additional_information_requested", label: "More Info Requested" },
  { value: "ethics_review", label: "Ethics Review" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
  { value: "withdrawn", label: "Withdrawn" },
  { value: "completed", label: "Completed" },
];

export default async function SponsorshipQueuePage(props: PageProps<"/admin/sponsorships">) {
  await requireAdminUser();
  const searchParams = await props.searchParams;
  const statusParam = Array.isArray(searchParams.status) ? searchParams.status[0] : searchParams.status;
  const activeFilter = (statusParam ?? "all") as "all" | SponsorshipStatus;

  const admin = createAdminClient();
  let query = admin
    .from("sponsorship_requests")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (activeFilter !== "all") {
    query = query.eq("status", activeFilter);
  }

  const { data: requests, error } = await query;

  return (
    <Container className="max-w-6xl py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold uppercase text-ink">
          Sponsorship Review Queue
        </h1>
        <Link
          href="/admin"
          className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
        >
          Back to Overview
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/admin/sponsorships" : `/admin/sponsorships?status=${f.value}`}
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

      {error && (
        <p className="mt-6 text-sm font-medium text-red-700">Failed to load requests.</p>
      )}

      <div className="mt-6 overflow-x-auto rounded-sm border border-ink/10">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 bg-sand-light text-xs font-semibold uppercase tracking-wide text-charcoal-light">
              <th className="px-4 py-3">Organization</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Proposed Value</th>
              <th className="px-4 py-3">Support Type</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Mile</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Flags</th>
            </tr>
          </thead>
          <tbody>
            {(requests as SponsorshipRequestRow[] | null)?.map((request) => (
              <tr key={request.id} className="border-b border-ink/5 last:border-0 hover:bg-sand-light/50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/sponsorships/${request.id}`}
                    className="font-medium text-ink hover:text-bronze"
                  >
                    {request.organization_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-charcoal-light">{request.contact_name}</td>
                <td className="px-4 py-3 text-charcoal-light">
                  {formatDateLong(request.submitted_at)}
                </td>
                <td className="px-4 py-3 text-charcoal-light">
                  {request.cash_value || request.in_kind_value
                    ? [
                        request.cash_value ? `${formatCurrency(request.cash_value)} cash` : null,
                        request.in_kind_value
                          ? `${formatCurrency(request.in_kind_value)} in-kind`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(" + ")
                    : "—"}
                </td>
                <td className="px-4 py-3 text-charcoal-light">
                  {request.support_type.join(", ")}
                </td>
                <td className="px-4 py-3 text-charcoal-light">{request.proposed_tier ?? "—"}</td>
                <td className="px-4 py-3 text-charcoal-light">
                  {request.requested_mile_number ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-ink/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
                    {SPONSORSHIP_STATUS_LABELS[request.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {hasVettingFlags(request) && (
                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-red-800">
                      Flagged
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {requests && requests.length === 0 && (
          <p className="p-6 text-sm text-charcoal-light">No requests match this filter.</p>
        )}
      </div>
    </Container>
  );
}
