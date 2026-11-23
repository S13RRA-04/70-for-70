# Finance API: bookkeeping sync

A read-only feed of the site's finance records. Bookkeeping software or a
connector (Zapier, Make, a script) pulls from it on a schedule. It never writes
anything, to the site or to your books.

```
GET https://forthe22.org/api/finance/transactions
Authorization: Bearer <FINANCE_API_KEY>
```

## Setup

1. Generate a key of at least 32 characters, e.g. `openssl rand -hex 32`.
2. Add it as the GitHub repo secret `FINANCE_API_KEY`. The deploy's "Sync Worker
   secrets" step pushes it to the Worker. Don't set it only in the Cloudflare
   dashboard, because the next deploy wipes it.
3. Push to `master`, or re-run the deploy. Until the key is set, the endpoint
   answers `404`.

To rotate the key, replace the repo secret and redeploy. The old key stops
working immediately.

The key only goes in the `Authorization` header. It is never accepted in the URL,
because URLs end up in logs and browser history.

## Query parameters

| Param    | Default                  | Notes |
|----------|--------------------------|-------|
| `from`   | none (all history)       | `YYYY-MM-DD`, inclusive (UTC) |
| `to`     | none                     | `YYYY-MM-DD`, inclusive (UTC) |
| `type`   | `donation,sponsorship`   | Comma-separated |
| `format` | `json`                   | `json` or `csv` |

Examples:

```
/api/finance/transactions?from=2026-11-01&to=2026-11-30
/api/finance/transactions?format=csv&from=2026-01-01
```

## What's in it

**Ledger lines** (the `transactions` array in JSON, or one CSV row each):

| Field          | Meaning |
|----------------|---------|
| `id`           | Stable across pulls: `donation:<uuid>`, `sponsorship:<uuid>:cash`, `sponsorship:<uuid>:in_kind`. Use it to dedupe when date ranges overlap. |
| `date`         | Gift date, or sponsorship approval date (UTC). |
| `type`         | `donation` or `sponsorship` |
| `kind`         | `cash` or `in_kind` |
| `amount`       | Decimal string, USD, e.g. `"25.00"` |
| `counterparty` | Donor name or sponsoring organization |
| `anonymous`    | The donor asked not to be named publicly |
| `beneficiary`  | Organization the gift was credited to |
| `received_by`  | Who actually collected the money: `For The 22`, the beneficiary's name, or `null` when not recorded |
| `pass_through` | `true` when the donor gave directly to the beneficiary, `false` when For The 22 collected it, `null` when not recorded |
| `reference`    | Receipt or processor reference entered by an admin |
| `status`       | `verified` for donations; `approved` or `completed` for sponsorships |
| `memo`         | Human-readable description, including any dedication |

- **Donations:** only verified ones. Unverified self-reports are left out.
  `beneficiary` says who a gift is *for*. Who *collected* it comes from the
  donation's "Who collected the money?" field in `/admin/donations`
  (`donations.collected_by`):
  - *For The 22 collected it* (booth cash, Venmo): `received_by: "For The 22"`,
    `pass_through: false`. This is cash For The 22 holds until it's passed on.
  - *Donor gave on the beneficiary's platform* (OneCause, PayPal):
    `received_by: <beneficiary>`, `pass_through: true`. This is money raised for
    them, not For The 22 income.
  - *Not recorded*: both `null`. The API never guesses from `beneficiary`.
- **Sponsorships:** only `approved` and `completed`, split into a cash line and an
  in-kind line. The site doesn't record who received sponsorship money or whether
  it was paid, so `received_by` and `pass_through` are `null`. Confirm before
  booking.

**Distributions** (JSON only): one entry per active beneficiary, with the
running `distributed_amount` and `last_distributed_at` an admin entered. These
are cumulative totals, not individual transfers. Use them to reconcile, not
as ledger lines.

## Responses

| Status | When |
|--------|------|
| `200`  | JSON or CSV |
| `400`  | Bad `from`/`to`/`type`/`format`; the message says which |
| `401`  | Missing or wrong key |
| `404`  | `FINANCE_API_KEY` isn't configured |
| `429`  | More than 30 requests a minute |
| `500`  | Database query failed. Retry later. |

Responses are `Cache-Control: no-store`. In CSV output, values starting with `=`,
`+`, `-` or `@` are prefixed with `'` so a donor-entered name can't run as a
spreadsheet formula.

Code: `src/app/api/finance/transactions/route.ts`, `src/lib/finance/ledger.ts`
(queries), `src/lib/finance/ledger-format.ts` (row mapping and CSV). Tests:
`tests/e2e/finance-api.spec.ts`, which run in CI before every deploy. The
Google Sheets sync is `scripts/google-sheets/` (Apps Script and its manifest).
