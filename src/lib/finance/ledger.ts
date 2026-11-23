import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { SITE_NAME } from "@/lib/constants";

/**
 * Read-only finance ledger for bookkeeping sync (GET /api/finance/transactions).
 *
 * Every line has a stable `id`, so a bookkeeping tool that re-pulls an
 * overlapping date range can dedupe instead of double-booking. Amounts are
 * decimal strings ("123.45"), never floats.
 *
 * What's included, and why:
 * - Verified donations only — unverified self-reports are not money anyone
 *   has confirmed. `received_by` is the organization that took the gift; when
 *   that isn't For The 22, `pass_through` is true so the books can keep it out
 *   of For The 22's income (the site records gifts made on each
 *   beneficiary's own platform).
 * - Approved or completed sponsorships — one line for cash, one for in-kind.
 *   The site doesn't record who received sponsorship money or whether it was
 *   paid, so `received_by`/`pass_through` are null: confirm before booking.
 * - Beneficiary distributions are cumulative per organization (the site keeps
 *   one running total, not individual transfers), so they're reported as a
 *   separate summary, never as ledger lines.
 */

export const LEDGER_TYPES = ["donation", "sponsorship"] as const;
export type LedgerType = (typeof LEDGER_TYPES)[number];

export interface LedgerLine {
  /** Stable across pulls: `donation:<uuid>`, `sponsorship:<uuid>:cash`, `sponsorship:<uuid>:in_kind`. */
  id: string;
  type: LedgerType;
  /** YYYY-MM-DD (UTC) — the gift date, or the sponsorship's approval date. */
  date: string;
  amount: string;
  currency: "USD";
  /** cash, or in_kind (goods/services at the sponsor's stated value). */
  kind: "cash" | "in_kind";
  /** Donor or sponsoring organization. */
  counterparty: string;
  /** The donor asked not to be named publicly. Internal books may still need the name. */
  anonymous: boolean;
  /** Organization the gift was made to / is credited to. */
  beneficiary: string | null;
  /** Who actually took the money, when the site knows. */
  received_by: string | null;
  /** True when someone other than For The 22 received it; null when unknown. */
  pass_through: boolean | null;
  /** Processor/receipt reference as recorded by the admin. */
  reference: string | null;
  /** verified (donations) or the sponsorship's workflow status. */
  status: string;
  memo: string;
}

export interface DistributionSummary {
  beneficiary: string;
  /** Running total sent, as entered by an admin. Cumulative — not a single transfer. */
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

function money(value: number | string | null | undefined): string {
  return Number(value ?? 0).toFixed(2);
}

function day(value: string): string {
  return new Date(value).toISOString().slice(0, 10);
}

/** End of the `to` day, so the range is inclusive. */
function endOfDay(date: string): string {
  return `${date}T23:59:59.999Z`;
}

async function fetchAll<T>(query: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  const rows: T[] = [];
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await query(offset, offset + PAGE - 1);
    if (error) throw error;
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) return rows;
  }
}

interface DonationRow {
  id: string;
  donor_name: string;
  amount: number;
  organization_benefited: string | null;
  anonymous: boolean;
  date: string;
  external_reference: string | null;
  dedication_type: string | null;
  dedication_name: string | null;
}

interface SponsorshipRow {
  id: string;
  organization_name: string;
  cash_value: number | null;
  in_kind_value: number | null;
  support_type: string[];
  status: string;
  approved_at: string | null;
  submitted_at: string;
}

async function donationLines(query: LedgerQuery): Promise<LedgerLine[]> {
  const admin = createAdminClient();
  const rows = await fetchAll<DonationRow>((start, end) => {
    let q = admin
      .from("donations")
      .select("id, donor_name, amount, organization_benefited, anonymous, date, external_reference, dedication_type, dedication_name")
      .eq("verified", true)
      .order("date", { ascending: true })
      .order("id", { ascending: true })
      .range(start, end);
    if (query.from) q = q.gte("date", query.from);
    if (query.to) q = q.lte("date", endOfDay(query.to));
    return q;
  });

  return rows.map((row) => {
    const receivedBy = row.organization_benefited;
    const dedication =
      row.dedication_type && row.dedication_name
        ? ` (${row.dedication_type === "in_memory_of" ? "in memory of" : "in honor of"} ${row.dedication_name})`
        : "";
    return {
      id: `donation:${row.id}`,
      type: "donation",
      date: day(row.date),
      amount: money(row.amount),
      currency: "USD",
      kind: "cash",
      counterparty: row.donor_name,
      anonymous: row.anonymous,
      beneficiary: row.organization_benefited,
      received_by: receivedBy,
      pass_through: receivedBy ? receivedBy !== SITE_NAME : null,
      reference: row.external_reference,
      status: "verified",
      memo: `Donation to ${row.organization_benefited ?? "unspecified organization"}${dedication}`,
    } satisfies LedgerLine;
  });
}

async function sponsorshipLines(query: LedgerQuery): Promise<LedgerLine[]> {
  const admin = createAdminClient();
  const rows = await fetchAll<SponsorshipRow>((start, end) =>
    admin
      .from("sponsorship_requests")
      .select("id, organization_name, cash_value, in_kind_value, support_type, status, approved_at, submitted_at")
      .in("status", ["approved", "completed"])
      .order("submitted_at", { ascending: true })
      .order("id", { ascending: true })
      .range(start, end),
  );

  const lines: LedgerLine[] = [];
  for (const row of rows) {
    const date = day(row.approved_at ?? row.submitted_at);
    // Filtered here rather than in SQL: the effective date falls back across two columns.
    if ((query.from && date < query.from) || (query.to && date > query.to)) continue;
    const base = {
      type: "sponsorship" as const,
      date,
      currency: "USD" as const,
      counterparty: row.organization_name,
      anonymous: false,
      beneficiary: null,
      received_by: null,
      pass_through: null,
      reference: null,
      status: row.status,
    };
    if (Number(row.cash_value) > 0) {
      lines.push({ ...base, id: `sponsorship:${row.id}:cash`, amount: money(row.cash_value), kind: "cash", memo: `Sponsorship (cash) from ${row.organization_name}` });
    }
    if (Number(row.in_kind_value) > 0) {
      const what = row.support_type.filter((type) => type !== "cash").join(", ") || "in-kind";
      lines.push({ ...base, id: `sponsorship:${row.id}:in_kind`, amount: money(row.in_kind_value), kind: "in_kind", memo: `Sponsorship (in-kind: ${what}) from ${row.organization_name}` });
    }
  }
  return lines;
}

export async function getLedger(query: LedgerQuery): Promise<LedgerLine[]> {
  const parts = await Promise.all([
    query.types.includes("donation") ? donationLines(query) : [],
    query.types.includes("sponsorship") ? sponsorshipLines(query) : [],
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

const CSV_COLUMNS: (keyof LedgerLine)[] = [
  "id", "date", "type", "kind", "amount", "currency", "counterparty", "anonymous",
  "beneficiary", "received_by", "pass_through", "reference", "status", "memo",
];

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let text = String(value);
  // Neutralize spreadsheet formula injection from donor-entered names.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function ledgerToCsv(lines: LedgerLine[]): string {
  const rows = [CSV_COLUMNS.join(","), ...lines.map((line) => CSV_COLUMNS.map((column) => csvCell(line[column])).join(","))];
  return `${rows.join("\r\n")}\r\n`;
}
