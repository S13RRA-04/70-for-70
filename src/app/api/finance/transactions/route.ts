import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/client-ip";
import { isRateLimited } from "@/lib/rate-limit";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LEDGER_TYPES, getDistributionSummary, getLedger, ledgerToCsv, type LedgerType } from "@/lib/finance/ledger";
import { logServerError } from "@/lib/log";

/**
 * GET /api/finance/transactions — read-only ledger for bookkeeping sync.
 * See docs/finance-api.md for the contract.
 *
 * Auth: `Authorization: Bearer <FINANCE_API_KEY>`. The key is never accepted
 * in the query string (URLs end up in logs). With no key configured the
 * endpoint answers 404, as if it didn't exist.
 */

export const dynamic = "force-dynamic";

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

function error(status: number, message: string) {
  return NextResponse.json({ error: message }, { status, headers: NO_STORE });
}

async function digest(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

/** Constant-time comparison over fixed-length hashes, so neither length nor content leaks through timing. */
async function keyMatches(given: string, expected: string): Promise<boolean> {
  const [a, b] = await Promise.all([digest(given), digest(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function validDate(value: string): boolean {
  return DATE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().startsWith(value);
}

export async function GET(request: Request) {
  const expected = process.env.FINANCE_API_KEY;
  if (!expected || expected.length < 32) return error(404, "Not found.");

  if (await isRateLimited(`finance:${getClientIp(request)}`, { limit: 30, windowMs: 60_000, binding: "RATE_LIMITER_FINANCE" })) {
    return error(429, "Too many requests.");
  }

  const header = request.headers.get("authorization") ?? "";
  const given = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!given || !(await keyMatches(given, expected))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers: { ...NO_STORE, "WWW-Authenticate": "Bearer" } });
  }

  const params = new URL(request.url).searchParams;
  const from = params.get("from") ?? undefined;
  const to = params.get("to") ?? undefined;
  if ((from && !validDate(from)) || (to && !validDate(to))) return error(400, "from and to must be dates in YYYY-MM-DD form.");
  if (from && to && from > to) return error(400, "from must be on or before to.");

  const typeParam = params.get("type");
  const types = typeParam ? typeParam.split(",").map((type) => type.trim()) : [...LEDGER_TYPES];
  if (!types.length || types.some((type) => !(LEDGER_TYPES as readonly string[]).includes(type))) {
    return error(400, `type must be a comma-separated list of: ${LEDGER_TYPES.join(", ")}.`);
  }

  const format = params.get("format") ?? "json";
  if (format !== "json" && format !== "csv") return error(400, "format must be json or csv.");

  if (!isSupabaseConfigured()) return error(503, "Finance data is not available.");

  try {
    const query = { from, to, types: types as LedgerType[] };
    if (format === "csv") {
      const csv = ledgerToCsv(await getLedger(query));
      return new NextResponse(csv, {
        headers: {
          ...NO_STORE,
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="for-the-22-ledger${from ? `-${from}` : ""}${to ? `-to-${to}` : ""}.csv"`,
        },
      });
    }

    const [transactions, distributions] = await Promise.all([getLedger(query), getDistributionSummary()]);
    return NextResponse.json(
      {
        generated_at: new Date().toISOString(),
        range: { from: from ?? null, to: to ?? null },
        types,
        count: transactions.length,
        transactions,
        distributions,
      },
      { headers: NO_STORE },
    );
  } catch (err) {
    logServerError("finance: ledger query failed", err);
    return error(500, "Could not load finance data.");
  }
}
