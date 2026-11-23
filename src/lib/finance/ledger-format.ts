/**
 * Pure mapping from database rows to finance-API ledger lines, plus CSV
 * output. Kept free of `server-only` and database imports so the tests in
 * tests/e2e/finance-api.spec.ts can run it directly. Data access lives in
 * ./ledger.ts.
 */

/** Organization name used in `received_by` when For The 22 collected the money. Matches SITE_NAME. */
export const FOR_THE_22 = "For The 22";

export const LEDGER_TYPES = ["donation", "sponsorship"] as const;
export type LedgerType = (typeof LEDGER_TYPES)[number];

export interface LedgerLine {
  /** Stable across pulls: `donation:<uuid>`, `sponsorship:<uuid>:cash`, `sponsorship:<uuid>:in_kind`. */
  id: string;
  type: LedgerType;
  /** YYYY-MM-DD (UTC): the gift date, or the sponsorship's approval date. */
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
  /** Who actually collected the money. Null when the site doesn't know. */
  received_by: string | null;
  /** True when someone other than For The 22 collected it; null when unknown. */
  pass_through: boolean | null;
  /** Processor/receipt reference as recorded by the admin. */
  reference: string | null;
  /** verified (donations) or the sponsorship's workflow status. */
  status: string;
  memo: string;
}

export interface DonationLedgerRow {
  id: string;
  donor_name: string;
  amount: number | string;
  organization_benefited: string | null;
  anonymous: boolean;
  date: string;
  external_reference: string | null;
  /** for_the_22 | beneficiary | null (not recorded). */
  collected_by: string | null;
  dedication_type: string | null;
  dedication_name: string | null;
}

export interface SponsorshipLedgerRow {
  id: string;
  organization_name: string;
  cash_value: number | string | null;
  in_kind_value: number | string | null;
  support_type: string[];
  status: string;
  approved_at: string | null;
  submitted_at: string;
}

export function money(value: number | string | null | undefined): string {
  return Number(value ?? 0).toFixed(2);
}

export function utcDay(value: string): string {
  return new Date(value).toISOString().slice(0, 10);
}

/**
 * Who collected a donation, from the admin-recorded `collected_by`. Never
 * inferred from organization_benefited: that says who a gift is *for*, not
 * who took the cash (booth cash for Mighty Oaks is collected by For The 22).
 */
export function donationReceipt(row: Pick<DonationLedgerRow, "collected_by" | "organization_benefited">): {
  received_by: string | null;
  pass_through: boolean | null;
} {
  if (row.collected_by === "for_the_22") return { received_by: FOR_THE_22, pass_through: false };
  if (row.collected_by === "beneficiary" && row.organization_benefited) {
    return { received_by: row.organization_benefited, pass_through: row.organization_benefited !== FOR_THE_22 };
  }
  return { received_by: null, pass_through: null };
}

export function donationLine(row: DonationLedgerRow): LedgerLine {
  const dedication =
    row.dedication_type && row.dedication_name
      ? ` (${row.dedication_type === "in_memory_of" ? "in memory of" : "in honor of"} ${row.dedication_name})`
      : "";
  return {
    id: `donation:${row.id}`,
    type: "donation",
    date: utcDay(row.date),
    amount: money(row.amount),
    currency: "USD",
    kind: "cash",
    counterparty: row.donor_name,
    anonymous: row.anonymous,
    beneficiary: row.organization_benefited,
    ...donationReceipt(row),
    reference: row.external_reference,
    status: "verified",
    memo: `Donation to ${row.organization_benefited ?? "unspecified organization"}${dedication}`,
  };
}

/** One line for cash and one for in-kind; none when both values are empty. */
export function sponsorshipLines(row: SponsorshipLedgerRow): LedgerLine[] {
  const base = {
    type: "sponsorship" as const,
    date: utcDay(row.approved_at ?? row.submitted_at),
    currency: "USD" as const,
    counterparty: row.organization_name,
    anonymous: false,
    beneficiary: null,
    // The site doesn't record who received sponsorship money or whether it was paid.
    received_by: null,
    pass_through: null,
    reference: null,
    status: row.status,
  };
  const lines: LedgerLine[] = [];
  if (Number(row.cash_value) > 0) {
    lines.push({ ...base, id: `sponsorship:${row.id}:cash`, amount: money(row.cash_value), kind: "cash", memo: `Sponsorship (cash) from ${row.organization_name}` });
  }
  if (Number(row.in_kind_value) > 0) {
    const what = row.support_type.filter((type) => type !== "cash").join(", ") || "in-kind";
    lines.push({ ...base, id: `sponsorship:${row.id}:in_kind`, amount: money(row.in_kind_value), kind: "in_kind", memo: `Sponsorship (in-kind: ${what}) from ${row.organization_name}` });
  }
  return lines;
}

export const CSV_COLUMNS: (keyof LedgerLine)[] = [
  "id", "date", "type", "kind", "amount", "currency", "counterparty", "anonymous",
  "beneficiary", "received_by", "pass_through", "reference", "status", "memo",
];

export function csvCell(value: unknown): string {
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
