import { expect, test } from "@playwright/test";
import {
  CSV_COLUMNS,
  csvCell,
  donationLine,
  ledgerToCsv,
  sponsorshipLines,
  type DonationLedgerRow,
} from "../../src/lib/finance/ledger-format";
import { FINANCE_API_TEST_KEY } from "./finance-test-key";

const ENDPOINT = "/api/finance/transactions";
const auth = { Authorization: `Bearer ${FINANCE_API_TEST_KEY}` };

const donation = (overrides: Partial<DonationLedgerRow> = {}): DonationLedgerRow => ({
  id: "6f1c1d1e-0000-4000-8000-000000000001",
  donor_name: "Jane Donor",
  amount: 25,
  organization_benefited: "Mighty Oaks Foundation",
  anonymous: false,
  date: "2026-11-21T18:30:00.000Z",
  external_reference: null,
  collected_by: null,
  dedication_type: null,
  dedication_name: null,
  ...overrides,
});

test.describe("finance API: authentication and validation", () => {
  test("rejects a request with no key", async ({ request }) => {
    const res = await request.get(ENDPOINT);
    expect(res.status()).toBe(401);
    expect(res.headers()["www-authenticate"]).toBe("Bearer");
    expect(res.headers()["cache-control"]).toBe("no-store");
  });

  test("rejects a wrong key", async ({ request }) => {
    const res = await request.get(ENDPOINT, { headers: { Authorization: `Bearer ${FINANCE_API_TEST_KEY}x` } });
    expect(res.status()).toBe(401);
  });

  test("never accepts the key in the query string", async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?key=${FINANCE_API_TEST_KEY}&token=${FINANCE_API_TEST_KEY}`);
    expect(res.status()).toBe(401);
  });

  for (const [query, reason] of [
    ["from=2026-13-01", "impossible month"],
    ["from=2026-02-30", "impossible day"],
    ["to=11/30/2026", "wrong format"],
    ["from=2026-12-01&to=2026-11-01", "from after to"],
    ["type=refund", "unknown type"],
    ["type=", "empty type"],
    ["format=xlsx", "unknown format"],
  ]) {
    test(`returns 400 for ${reason}`, async ({ request }) => {
      const res = await request.get(`${ENDPOINT}?${query}`, { headers: auth });
      expect(res.status()).toBe(400);
      expect((await res.json()).error).toBeTruthy();
    });
  }
});

test.describe("finance ledger: who collected the money", () => {
  test("reports unknown when the site hasn't recorded who collected it", () => {
    const line = donationLine(donation());
    expect(line.received_by).toBeNull();
    expect(line.pass_through).toBeNull();
    // The beneficiary is still reported. It says who the gift is for, not who took it.
    expect(line.beneficiary).toBe("Mighty Oaks Foundation");
  });

  test("booth cash collected by For The 22 is not pass-through", () => {
    const line = donationLine(donation({ collected_by: "for_the_22" }));
    expect(line.received_by).toBe("For The 22");
    expect(line.pass_through).toBe(false);
  });

  test("a gift made on the beneficiary's own platform is pass-through", () => {
    const line = donationLine(donation({ collected_by: "beneficiary" }));
    expect(line.received_by).toBe("Mighty Oaks Foundation");
    expect(line.pass_through).toBe(true);
  });

  test("'beneficiary' with no organization recorded stays unknown", () => {
    const line = donationLine(donation({ collected_by: "beneficiary", organization_benefited: null }));
    expect(line.received_by).toBeNull();
    expect(line.pass_through).toBeNull();
  });

  test("an unrecognized collected_by value is treated as unknown", () => {
    expect(donationLine(donation({ collected_by: "venmo" })).pass_through).toBeNull();
  });
});

test.describe("finance ledger: line shape", () => {
  test("donation lines have a stable id, a UTC date and a 2-decimal amount string", () => {
    const line = donationLine(donation({ amount: "24.1", date: "2026-11-21T23:59:59.000Z" }));
    expect(line.id).toBe("donation:6f1c1d1e-0000-4000-8000-000000000001");
    expect(line.date).toBe("2026-11-21");
    expect(line.amount).toBe("24.10");
    expect(line.status).toBe("verified");
  });

  test("dedications appear in the memo", () => {
    const line = donationLine(donation({ dedication_type: "in_memory_of", dedication_name: "SSgt. Example" }));
    expect(line.memo).toBe("Donation to Mighty Oaks Foundation (in memory of SSgt. Example)");
  });

  test("a sponsorship splits into cash and in-kind lines with unknown receipt", () => {
    const lines = sponsorshipLines({
      id: "s1",
      organization_name: "Acme Co",
      cash_value: 500,
      in_kind_value: "120.5",
      support_type: ["cash", "goods"],
      status: "approved",
      approved_at: "2026-11-02T15:00:00Z",
      submitted_at: "2026-10-20T15:00:00Z",
    });
    expect(lines.map((l) => [l.id, l.kind, l.amount, l.date])).toEqual([
      ["sponsorship:s1:cash", "cash", "500.00", "2026-11-02"],
      ["sponsorship:s1:in_kind", "in_kind", "120.50", "2026-11-02"],
    ]);
    expect(lines.every((l) => l.received_by === null && l.pass_through === null)).toBe(true);
  });

  test("a sponsorship with no stated value produces no lines", () => {
    expect(
      sponsorshipLines({
        id: "s2", organization_name: "X", cash_value: null, in_kind_value: 0, support_type: ["services"],
        status: "completed", approved_at: null, submitted_at: "2026-10-20T15:00:00Z",
      }),
    ).toEqual([]);
  });
});

test.describe("finance ledger: CSV", () => {
  test("neutralizes spreadsheet formulas in donor-entered text", () => {
    for (const evil of ["=HYPERLINK(\"http://x\")", "+1+1", "-2", "@SUM(A1)", "\tTAB"]) {
      expect(csvCell(evil).replace(/^"/, "").startsWith("'")).toBe(true);
    }
    expect(csvCell("Jane Donor")).toBe("Jane Donor");
  });

  test("quotes commas, quotes and newlines, and blanks nulls", () => {
    expect(csvCell('Smith, "Bob"')).toBe('"Smith, ""Bob"""');
    expect(csvCell("line\nbreak")).toBe('"line\nbreak"');
    expect(csvCell(null)).toBe("");
  });

  test("writes the header row and one row per line", () => {
    const csv = ledgerToCsv([donationLine(donation({ collected_by: "for_the_22" }))]);
    const [header, row, trailing] = csv.split("\r\n");
    expect(header).toBe(CSV_COLUMNS.join(","));
    expect(row.split(",")[CSV_COLUMNS.indexOf("received_by")]).toBe("For The 22");
    expect(row.split(",")[CSV_COLUMNS.indexOf("pass_through")]).toBe("false");
    expect(trailing).toBe("");
  });
});
