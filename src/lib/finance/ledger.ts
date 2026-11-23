import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { SITE_NAME } from "@/lib/constants";
import {
  FOR_THE_22,
  donationLine,
  money,
  sponsorshipLines,
  type DonationLedgerRow,
  type LedgerLine,
  type LedgerType,
  type SponsorshipLedgerRow,
} from "@/lib/finance/ledger-format";

export { LEDGER_TYPES, ledgerToCsv, type LedgerLine, type LedgerType } from "@/lib/finance/ledger-format";

/**
 * Read-only finance ledger for bookkeeping sync (GET /api/finance/transactions).
 * Row → line mapping is in ./ledger-format.ts; this file only queries.
 *
 * What's included:
 * - Verified donations only. Unverified self-reports are not money anyone has
 *   confirmed. `received_by`/`pass_through` come from the admin-recorded
 *   `collected_by`, and are null (unknown) when it isn't set.
 * - Approved or completed sponsorships, one line for cash and one for in-kind.
 * - Beneficiary distributions are cumulative per organization (the site keeps
 *   one running total, not individual transfers), so they're a separate
 *   summary, never ledger lines.
 */

if (FOR_THE_22 !== SITE_NAME) throw new Error("ledger-format FOR_THE_22 must match SITE_NAME");

export interface DistributionSummary {
  beneficiary: string;
  /** Running total sent, as entered by an admin. Cumulative, not a single transfer. */
  distributed_amount: string | null;
  last_distributed_at: string | null;
  status: string | null;
}

export interface LedgerQuery {
  /** Inclusive, YYYY-MM-DD. */
  from?: string;
  /** Inclusive, YYYY-MM-DD. */
  to?: string;
  types: readonly LedgerType[];
}

const PAGE = 1000;

async function fetchAll<T>(query: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  const rows: T[] = [];
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await query(offset, offset + PAGE - 1);
    if (error) throw error;
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) return rows;
  }
}

async function donationLines(query: LedgerQuery): Promise<LedgerLine[]> {
  const admin = createAdminClient();
  const rows = await fetchAll<DonationLedgerRow>((start, end) => {
    let q = admin
      .from("donations")
      .select("id, donor_name, amount, organization_benefited, anonymous, date, external_reference, collected_by, dedication_type, dedication_name")
      .eq("verified", true)
      .order("date", { ascending: true })
      .order("id", { ascending: true })
      .range(start, end);
    if (query.from) q = q.gte("date", query.from);
    if (query.to) q = q.lte("date", `${query.to}T23:59:59.999Z`);
    return q;
  });
  return rows.map(donationLine);
}

async function sponsorshipLedger(query: LedgerQuery): Promise<LedgerLine[]> {
  const admin = createAdminClient();
  const rows = await fetchAll<SponsorshipLedgerRow>((start, end) =>
    admin
      .from("sponsorship_requests")
      .select("id, organization_name, cash_value, in_kind_value, support_type, status, approved_at, submitted_at")
      .in("status", ["approved", "completed"])
      .order("submitted_at", { ascending: true })
      .order("id", { ascending: true })
      .range(start, end),
  );
  // Date-filtered here rather than in SQL: the effective date falls back across two columns.
  return rows
    .flatMap(sponsorshipLines)
    .filter((line) => !(query.from && line.date < query.from) && !(query.to && line.date > query.to));
}

export async function getLedger(query: LedgerQuery): Promise<LedgerLine[]> {
  const parts = await Promise.all([
    query.types.includes("donation") ? donationLines(query) : [],
    query.types.includes("sponsorship") ? sponsorshipLedger(query) : [],
  ]);
  return parts.flat().sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
}

export async function getDistributionSummary(): Promise<DistributionSummary[]> {
  const { data, error } = await createAdminClient()
    .from("partners")
    .select("name, distributed_amount, last_distributed_at, distribution_status")
    .eq("active", true)
    .order("name");
  if (error) throw error;
  return (data ?? []).map((row) => ({
    beneficiary: row.name,
    distributed_amount: row.distributed_amount == null ? null : money(row.distributed_amount),
    last_distributed_at: row.last_distributed_at,
    status: row.distribution_status,
  }));
}
