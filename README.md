# For The 22 — Tri

70 miles. $70,000. One mission for veterans.

A fundraising campaign site pairing an IRONMAN 70.3-distance triathlon with a
$70,000 fundraising goal ($1,000 = one race mile) in support of veteran-focused
nonprofit organizations — initially Mighty Oaks Foundation and Project Echelon.

This is **Milestone 1**: a polished, public-facing campaign site with a
Supabase-backed data model. It does not process donations directly — donate
buttons route to each beneficiary organization's own donation platform.
Sponsorships go through a request-and-approval workflow — see
[Sponsorship Vetting Workflow](#sponsorship-vetting-workflow) below — and
off-site donations are recorded/verified through
[Donation Tracking Workflow](#donation-tracking-workflow).

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack, React 19)
- TypeScript (strict mode)
- Tailwind CSS v4
- [Supabase](https://supabase.com) (Postgres, Auth, Row Level Security)
- Deployed to Cloudflare Workers via the OpenNext adapter — see
  [Deployment](#deployment-cloudflare-workers) below

## Local Setup

```bash
npm install
cp .env.example .env.local   # fill in Supabase values, or leave blank — see below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Running without Supabase configured

If `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are unset, the
site automatically renders from bundled placeholder data
([`src/lib/data/seed-data.ts`](src/lib/data/seed-data.ts)) instead of querying
Supabase. This keeps local development and design review working before a
Supabase project exists. See `isSupabaseConfigured()` in
[`src/lib/supabase/config.ts`](src/lib/supabase/config.ts).

## Environment Variables

See [`.env.example`](.env.example) for the full list with descriptions:

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | For live data | Public Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For live data | Public anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | For inquiries + admin | **Server-only.** Never expose to the browser |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Used for metadata, canonical URLs, sitemap |
| `WHOOP_CLIENT_ID` / `WHOOP_CLIENT_SECRET` | For the training snapshot | **Server-only.** See [WHOOP Training Snapshot](#whoop-training-snapshot) below |
| `CLOUDFLARE_WEB_ANALYTICS_SITE_TAG` / `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_ANALYTICS_API_TOKEN` | For `/admin/analytics` | **Server-only.** No client beacon to configure — Cloudflare auto-installs it zone-wide. See [Analytics](#analytics-cloudflare-web-analytics) below |

## Deployment (Cloudflare Workers)

The site deploys to **Cloudflare Workers** via the
[OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare)
(`@opennextjs/cloudflare` + Wrangler), targeting the `forthe22.org` domain.
This replaced an earlier Netlify setup (`netlify.toml` is still present but
unused — remove it once Cloudflare is confirmed working).

**Repo-side setup (done):**

- [`wrangler.jsonc`](wrangler.jsonc) — Worker name (`forthe22`), assets
  binding, `nodejs_compat` flag
- [`open-next.config.ts`](open-next.config.ts) — default config, no R2
  incremental cache configured yet (optional; add later if ISR caching is
  needed)
- `next.config.ts` calls `initOpenNextCloudflareForDev()` for local binding
  emulation
- `package.json` scripts: `npm run preview` (build + run locally in the
  actual Workers runtime via Wrangler) and `npm run deploy` (build + deploy)
- **`src/middleware.ts`, not `src/proxy.ts`**: Next.js 16 renamed
  `middleware.ts` to `proxy.ts`, but `proxy.ts` always runs on the Node.js
  runtime with no override, which `@opennextjs/cloudflare` doesn't support
  yet ("Node.js middleware is not currently supported"). Deliberately kept
  on the deprecated-but-supported `middleware.ts` convention, which still
  defaults to the Edge runtime. Switch back to `proxy.ts` once OpenNext adds
  Node middleware support — see
  [cloudflare/workers-sdk#13755](https://github.com/cloudflare/workers-sdk/issues/13755).
- **`src/lib/supabase/public.ts`**: a cookie-free anon-key client for public
  reads (campaign, miles, partners, posts, sponsors, verified donations —
  everything RLS grants to `anon` regardless of session). All of
  `src/lib/data/*.ts` now use this instead of the cookie-bound
  `supabase/server.ts` client, which broke static generation for
  `/journal/[slug]` (`generateStaticParams` runs at build time, outside
  request context, so `cookies()` isn't available there). The cookie-bound
  client is now reserved for genuinely session-dependent code (the admin
  area).
- **`src/app/opengraph-image.tsx`** no longer reads `public/logo-white.png`
  via `node:fs` at request time — Workers have no real on-disk filesystem
  for bundled `public/` files. The logo is inlined as a base64 constant
  ([`src/lib/assets/og-logo.ts`](src/lib/assets/og-logo.ts), generated from
  the source PNG, downscaled to its actual 340×340 display size to keep the
  Worker bundle small) and imported directly — zero runtime I/O, works
  identically everywhere.

**Remaining steps (Cloudflare dashboard — needs your login, can't be done
from here):**

1. **Workers Builds (git auto-deploy)**: Workers & Pages → Create →
   Connect to Git → select the `S13RRA-04/70-for-70` GitHub repo. Build
   command: `npx opennextjs-cloudflare build`. Cloudflare's Workers Builds
   runs on Linux, so it won't hit the Windows-specific file-locking quirks
   this local environment did (`@opennextjs/cloudflare` itself warns it
   isn't fully compatible with Windows — WSL is recommended for local
   `npm run preview`/`deploy` from a Windows machine).
2. **Server-only secrets**: set as **repo secrets**
   (Settings → Secrets and variables → Actions), not in the Cloudflare
   dashboard. The [deploy workflow](.github/workflows/deploy.yml)'s
   "Sync Worker secrets" step pushes them to the Worker via
   `wrangler secret bulk` on every push to `master`, so they're never
   dashboard-only and can't be silently wiped or drift out of sync — see
   the comment above that step and the one above `vars` in
   [`wrangler.jsonc`](wrangler.jsonc) for the incident that motivated this.
   Add: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (two
   repo secrets already used at build time — reused here for the runtime
   binding too), `SUPABASE_SERVICE_ROLE_KEY`, `WHOOP_CLIENT_SECRET`,
   `PREVIEW_ACCESS_TOKEN`, `CLOUDFLARE_WEB_ANALYTICS_SITE_TAG`,
   `CLOUDFLARE_ACCOUNT_ID` (already a repo secret), and
   `CLOUDFLARE_ANALYTICS_API_TOKEN` — see [Pre-Launch Gate](#pre-launch-gate)
   and [Analytics](#analytics-cloudflare-web-analytics) below. To add or
   rotate one: `gh secret set SECRET_NAME` (reads the value from stdin/a
   prompt), then re-run the deploy workflow (or push) to sync it to the
   Worker. `WHOOP_CLIENT_ID` and `NEXT_PUBLIC_SITE_URL` are **not** secrets —
   `SITE_LIVE`/`CAMPAIGN_LIVE` (see [Pre-Launch Gate](#pre-launch-gate)) are
   already committed in `wrangler.jsonc`'s `vars` block too, so flipping one
   is a one-line edit + deploy, not a dashboard step.
   - There's no client-side beacon snippet or token to add anywhere — see
     Analytics below for why.
3. **Custom domain**: Worker → Settings → Domains & Routes → Add Custom
   Domain → `forthe22.org` (the zone is already on Cloudflare, so this
   provisions DNS automatically).
4. **Update the WHOOP redirect URI**: `WHOOP_REDIRECT_URI` is derived from
   `NEXT_PUBLIC_SITE_URL` (see [`src/lib/whoop/config.ts`](src/lib/whoop/config.ts)).
   Once step 2/3 are live, the redirect URL becomes
   `https://forthe22.org/api/whoop/callback` — this **must** also be
   updated in the [WHOOP Developer Dashboard](https://developer.whoop.com)
   or the OAuth connect flow at `/admin/whoop` will fail.

## Movement/Campaign Model

The site now distinguishes two levels deliberately:

- **The movement — "For The 22"** (`SITE_NAME`): the parent organization.
  Header, footer, legal copy, site-wide metadata.
- **The campaign — "Tri For The 22"** (`CAMPAIGN_NAME`): the current
  fundraising effort. Individual campaigns follow a "[Mission] For The 22"
  naming convention — see `MOVEMENT_CAMPAIGNS` in
  [`constants.ts`](src/lib/constants.ts) (Tri is current; Run, Ride, and
  Ruck For The 22 are named future directions, not commitments with
  dates). The homepage hero, footer, and `/the-mission`'s "About the
  Movement" section all surface this hierarchy explicitly.

`CURRENT_CAMPAIGN` in `constants.ts` is a first code-level step toward
supporting multiple campaigns without a rewrite — it holds the current
campaign as a data object (`name`, `goal`, `type`, `event`,
`beneficiaries`) rather than values hard-coded into page markup. **This
does not yet restructure the Supabase schema** — `public.campaign` is
still a single row. That's a real migration (campaign table keyed by
slug, a join table for per-campaign beneficiaries, RLS updates
throughout) worth doing deliberately once a second campaign is actually
being built, not speculatively right before launch. `CURRENT_CAMPAIGN` is
the seam that migration would plug into.

## Movement/Campaign Domain Split

The movement and the campaign now live on **two different domains**, served
by the **same** Next.js app/Cloudflare Worker — no second deployment:

- **forthe22.org** (org): home (three-mission framework — Connect,
  Advocate, Compete), Resources, Athletes, Advocacy, About, Shop/Merch,
  Join, Press, Contact, Privacy, Terms.
- **tri.forthe22.org** (campaign): home (the fundraiser — hero, progress,
  Fund a Mile), The Mission, The Race, Fund a Mile, Donate, Sponsors,
  Partners (Mighty Oaks/Project Echelon), Live, Updates, Miles, and the
  entire `/admin` area.

**How it's enforced** — three pieces, all reading the request's `Host`
header:

1. [`src/lib/site-mode.ts`](src/lib/site-mode.ts) — `isCampaignHost()` is
   the single source of truth for "which domain is this" (hostname starts
   with `tri.`). Shared by middleware (reads `NextRequest` directly) and
   Server Components (reads `next/headers`).
2. [`src/middleware.ts`](src/middleware.ts)'s `applyDomainSplit()` —
   redirects a request to the correct domain if it's on the wrong one
   (e.g. `forthe22.org/donate` → `307` to
   `tri.forthe22.org/donate`), and transparently rewrites `tri.forthe22.org/`
   to the real route `/campaign-home` (the URL bar still shows `/`) since
   "/" needs different content per domain. **API routes are intentionally
   not gated** — they work identically on either host since it's the same
   app instance.
3. [`src/app/layout.tsx`](src/app/layout.tsx) reads the host via
   `getSiteMode()` and passes `mode="org" | "campaign"` down to `Header`,
   `Footer`, and `MobileConversionBar`, which render entirely different
   nav/branding/CTAs per mode (see `ORG_NAV_LINKS` /
   `CAMPAIGN_NAV_LINKS` in `constants.ts`). **This makes every route
   dynamically rendered** (`ƒ` instead of `○` in the build output) — the
   root layout can no longer be statically optimized once it depends on
   the request's host. Acceptable for a low-traffic campaign site; worth
   revisiting if traffic ever justifies clawing back static rendering.

**Cross-domain links**: any place org content links to a campaign-only
path (or vice versa) uses a full absolute URL (`${CAMPAIGN_URL}/donate`),
not a relative `<Link>` — see `src/app/merch/page.tsx`,
`src/app/contact/page.tsx`, `src/app/about/page.tsx`, and
`src/lib/content/mission.ts` for examples. A relative link would still
technically work (the middleware redirect catches it) but bounces through
an extra hop.

**`SITE_URL` vs `CAMPAIGN_URL`**: both are in `constants.ts`, read from
`NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_CAMPAIGN_URL`. `WHOOP_REDIRECT_URI`
now derives from `CAMPAIGN_URL` (not `SITE_URL`) since `/admin/whoop`
lives on the campaign domain — the callback URL registered in the WHOOP
Developer Dashboard must be
`https://tri.forthe22.org/api/whoop/callback`.

**Admin auth**: `/admin/*` is campaign-only by design, so the Supabase
auth cookie only ever needs to work on one host — no cross-subdomain
cookie-sharing configuration required.

**Remaining manual steps (Cloudflare dashboard — needs your login):**

1. Add `tri.forthe22.org` as a second custom domain on the same Worker
   (Worker → Settings → Domains & Routes → Add Custom Domain). No new
   deployment needed — it's the same Worker serving both hostnames.
2. Set `NEXT_PUBLIC_CAMPAIGN_URL=https://tri.forthe22.org` alongside the
   existing `NEXT_PUBLIC_SITE_URL=https://forthe22.org` in the
   Worker's environment variables.
3. Update the WHOOP redirect URL in the
   [WHOOP Developer Dashboard](https://developer.whoop.com) to
   `https://tri.forthe22.org/api/whoop/callback`.

**Known imperfections, not fixed this pass:**
- `opengraph-image.tsx` and the favicon (`icon.png`/`apple-icon.png`) are
  shared across both domains (always show the "For The 22" org mark) —
  campaign-domain shares don't get campaign-specific OG art. Fine for now
  since the org mark is the parent brand either way.
- `/contact`'s form (`SponsorInquiryForm`) still offers sponsor-specific
  interest categories ("Corporate Sponsor", etc.) even though it's now
  org-only and the real sponsorship-vetting flow lives at
  `tri.forthe22.org/sponsors/request`. Not restructured this pass — worth
  simplifying `/contact`'s categories to general/media/community only.

## New Pages (Movement Brief)

- **`/resources`** — six categories (Veteran Athletes, First Responders,
  Adaptive Sports, Recovery & Wellness, Equipment & Grants, Community),
  each an honest empty state until real resources are curated — no
  fabricated organizations or links. "Submit a Resource" routes to a
  `mailto:` for now.
- **`/join`** — "Join the Movement" interest capture. Submits through the
  existing `/api/inquiries` pipeline (rate limiting, honeypot, admin
  queue) with four new interest categories — see `JOIN_INTEREST_TYPES` in
  [`src/lib/validation/inquiry.ts`](src/lib/validation/inquiry.ts). No
  dedicated onboarding workflow exists yet; submissions just land in the
  same `inquiries` table sponsor inquiries do, distinguished by
  `interest`. The DB check constraint was migrated live to include these
  new values (see the Migration note below).
- **Mile 22** (`FEATURED_MILE` in `constants.ts`) gets distinct visual
  treatment everywhere a mile is shown — the grid card, detail modal, and
  `/miles/22` — framed as a collective mile rather than a single-sponsor
  target.

## Pre-Launch Gate

Gated **per domain, independently** — see the Movement/Campaign Domain
Split above. `SITE_LIVE` controls forthe22.org (the org);
`CAMPAIGN_LIVE` controls tri.forthe22.org (the fundraising campaign).
This is how the org site can go live while the campaign stays closed:
**current production state is `SITE_LIVE=true`, `CAMPAIGN_LIVE=false`.**
While a domain's flag isn't exactly `"true"`, **every route on that
domain** — every page, every API route (donate/sponsor/merch links
included, and form submissions) — shows a "Coming Soon" page instead of
real content; the other domain is entirely unaffected. Implemented in
[`src/middleware.ts`](src/middleware.ts) and
[`src/lib/launch-gate.ts`](src/lib/launch-gate.ts).

Clicking from the (live) org site into the (gated) campaign — the header's
"Tri For The 22" button, the homepage's "Current Mission" card, etc. —
correctly redirects to tri.forthe22.org and then immediately shows
"Coming Soon" there, tailored to name the campaign specifically
(`src/app/coming-soon/page.tsx` reads a `?scope=campaign` query param the
middleware attaches) with a link back to the live org site.

- **To preview the gated campaign**: visit
  `https://tri.forthe22.org/?preview=<PREVIEW_ACCESS_TOKEN>` (the exact
  value you set for `PREVIEW_ACCESS_TOKEN` in the Worker's environment
  variables). This sets a 180-day cookie on that browser and redirects to
  the clean URL — share the link with anyone else who needs to review the
  campaign (a beneficiary org checking copy, for example) before launch.
  Rotating `PREVIEW_ACCESS_TOKEN` invalidates every previously shared link.
- **To launch the campaign publicly**: set `CAMPAIGN_LIVE=true` in the
  Worker's environment variables (Worker settings → Variables). Takes
  effect on the next request — no redeploy needed.
- **Locally**, `.env` has both flags `true` so `npm run dev` always shows
  the real site on either domain. To test the gate itself locally,
  temporarily set the relevant flag to `false` and restart the dev
  server.

## Database Initialization

Schema and seed data live in [`supabase/`](supabase):

- [`schema.sql`](supabase/schema.sql) — tables, constraints, indexes, and Row
  Level Security policies
- [`seed.sql`](supabase/seed.sql) — production-accurate seed: campaign at $0
  raised, all 70 miles `available` at $0/$1,000, Mighty Oaks Foundation and
  Project Echelon partner rows (Cody's real "why it matters to me" copy,
  `what_they_do` and donation URLs left `null` until each org supplies its
  own approved description/link — see
  [Eliminating Placeholder Content](#eliminating-placeholder-content)).
  `donations` also supports optional structured dedications
  (`dedication_type`/`dedication_name`/`dedication_message`/
  `dedication_public`) and `email_subscribers` captures "Follow the Road to
  70.3" signups — both start empty.
- [`seed-demo.sql`](supabase/seed-demo.sql) — **optional, local/demo only.**
  Layers in a partially-funded campaign, plus one illustrative sponsorship
  request, so the UI (including the admin review queue) can be previewed
  with populated states. Every name in it is a clearly-labeled placeholder
  or one of the illustrative examples from the campaign brief itself. Do
  not run against production.

To initialize a new Supabase project:

1. Create a project at [supabase.com](https://supabase.com).
2. Run `schema.sql` then `seed.sql` via the SQL Editor, or with the CLI:
   ```bash
   supabase db query < supabase/schema.sql
   supabase db query < supabase/seed.sql
   ```
3. Copy the project URL and anon key into `.env.local`.
4. To enable the admin dashboard and sponsor-inquiry inserts, also copy the
   **service role key** into `SUPABASE_SERVICE_ROLE_KEY` and create at least
   one user (Supabase Studio → Authentication → Users) to sign in at
   `/admin/login`.

## Development Commands

```bash
npm run dev         # start the dev server (Turbopack)
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run build        # production build
npm run start         # serve the production build
```

## Production Build

```bash
npm run build
npm run start
```

The app is a standard Next.js App Router project — deploy it to Vercel,
Netlify, Cloudflare (via `@cloudflare/next-on-pages` or the OpenNext
adapter), or any Node-compatible host. No platform-specific code is used,
so the deployment target can change later without restructuring the app.

**Netlify**: [`netlify.toml`](netlify.toml) declares the official
`@netlify/plugin-nextjs` runtime (also in `devDependencies`), which handles
SSR, the Full Route/Data Cache, and `.next/cache` build caching for you —
no further config needed. A "No build cache found" warning on your very
first deploy is expected (there's nothing to restore yet) and should not
reappear on subsequent builds once Netlify has a cache to reuse.

## Directory Structure

```
src/
  app/                      Routes (App Router)
    admin/                  Authenticated admin: overview, login, the
                             sponsorship review queue (admin/sponsorships/),
                             and the WHOOP connection page (admin/whoop/)
    api/inquiries/          General inquiry form submission endpoint
    api/sponsorship-requests/  Sponsorship request submission endpoint
    api/subscribe/          Email signup submission endpoint
    api/whoop/              OAuth authorize + callback routes (admin-only)
    fund-a-mile/            70-mile grid with filtering + detail modal
    miles/[number]/         Permanent, shareable page per mile
    the-mission/ the-race/  Mission and race pages (race page includes the
                             live WHOOP training snapshot, training volume,
                             and a real milestone timeline)
    partners/ sponsors/     Beneficiary orgs, sponsorship levels, and the
                             sponsorship request form (sponsors/request/)
    journal/[slug]/         Campaign journal — articles, training logs, vlogs, milestones
    donate/ contact/        Donation routing and general contact form
    live/                   Provider-neutral race-day status page
    press/                  Press/media kit
    privacy/ terms/         Privacy policy; site terms, sponsorship and
                             charitable-giving disclosures, trademark
                             disclaimer
    sitemap.ts robots.ts    SEO
    opengraph-image.tsx     Generated social share image
  components/
    layout/                 Header, Footer
    campaign/                CampaignProgress, RaceProgress,
                              CampaignAllocation, CampaignByTheNumbers
    miles/                    MileCard, MileGrid, MileDetailModal
    partners/ sponsors/      PartnerCard, SponsorCard, SponsorWall
    updates/                   UpdateCard
    training/                    TrainingSnapshot
    forms/                       SponsorInquiryForm, SponsorshipRequestForm,
                                   EmailSignupForm
    shared/                       Container, SectionHeading, CTASection,
                                    StatCard, Countdown, EmptyState,
                                    MediaPlaceholder, ExternalDonateButton,
                                    ShareButtons
  lib/
    data/                    Supabase reads with seed-data fallback
                              (donations.ts, allocation.ts's
                              getAllocationBreakdown)
    supabase/                Browser / server / admin (service-role) clients,
                              require-admin auth guard
    whoop/                   OAuth token storage/refresh + WHOOP API client
    content/                 Editable narrative copy (Mission, About,
                              Privacy, Terms)
    validation/               zod schemas
    race-day.ts               Provider-neutral race-day status abstraction
    email-list.ts sponsorship.ts notifications.ts constants.ts
    rate-limit.ts utils.ts
  types/                     Hand-authored DB row types + shared UI types
supabase/                   schema.sql, seed.sql, seed-demo.sql
```

## Sponsorship Vetting Workflow

**No sponsorship is ever automatically accepted.** Businesses submit a
proposal at [`/sponsors/request`](src/app/sponsors/request/page.tsx); it's
stored as a `sponsorship_requests` row with `status: 'submitted'` and never
accepts payment, publishes a sponsor, or sends benefits on its own. The form
requires an explicit acknowledgment ("this is only an inquiry, not an
acceptance") enforced both client-side and by a database `check` constraint.

**Status machine**: `submitted` → `under_review` → (optionally
`additional_information_requested` or `ethics_review`) → `approved` /
`declined` / `withdrawn` / `completed`. Every transition is written by an
admin action to `sponsorship_status_history` (append-only — declined
requests keep their history) along with who made the change and, for
approve/decline, a required note.

**Review it**: sign in at `/admin/login`, then open `/admin/sponsorships`
(also linked from `/admin`). Each request's detail page shows the full
proposal, an internal vetting checklist (organization/website/ownership
review, known government or DOJ/FBI relationship, government contractor
status, prohibited-source and official-position concerns, ethics
consultation/approval, free-text notes and final disposition), the status
history, and the review actions. **The system only facilitates human
review — it does not compute a legal or ethics determination.**

**Publishing a sponsor** is a separate, explicit action ("Activate & Publish
Sponsor" on an approved request's detail page) that inserts into
`public.sponsors` — the *only* code path that does. It's blocked server-side
unless the request's status is already `approved`, regardless of what the
form submits. If the request named a specific mile, activation can mark that
mile `reserved` instead of `available`/`requested`; miles never affect
`campaign.amount_raised`, so a reserved/requested mile still doesn't count
toward the public fundraising total until a verified donation exists for it.

**Sponsorship vs. charitable donation** are kept structurally and visually
separate: a mile's detail modal offers "Help Fund Mile N" (an individual
donation via `/donate`, unaffected by any of this) and, separately, "Request
Mile N Sponsorship" (routes into the workflow above) — see
[`MileDetailModal`](src/components/miles/mile-detail-modal.tsx). The general
`/contact` form now points sponsorship-shaped inquiries to the dedicated
form instead of accepting them itself.

**RLS**: `sponsorship_requests` and `sponsorship_status_history` have zero
public policies — same default-deny pattern as `inquiries`. Internal
vetting fields, notes, and history are never queried by any public-facing
page.

Not built yet: real email delivery for the "acknowledge requester / notify
administrator" steps (see [`src/lib/notifications.ts`](src/lib/notifications.ts) —
currently logs only) and a public UI for a requester to withdraw their own
request (an admin can mark one `withdrawn` from the detail page today).

## Donation Tracking Workflow

For The 22 never takes possession of a charitable donation — `/donate`
routes each visitor to a beneficiary organization's own donation platform,
and the athlete/campaign owner only learns about a gift after the fact (a
donor's note, an email, or an export from the partner's platform). The
`donations` table and `/admin/donations` exist to record and verify those
off-site gifts, not to process payment.

**Record it**: sign in at `/admin/login`, then open `/admin/donations`
(also linked from `/admin`, which shows a count of donations awaiting
verification). "Record a Donation" captures donor name, amount, the
beneficiary organization, an optional mile to credit, the date, a free-text
reference note (e.g. a partner platform confirmation number or how the
donor reported it), anonymity, and optional in-honor-of/in-memory-of
dedication fields — mirroring the columns on `DonationRow`.

**Verified is the only thing that makes a donation public.** A donation
starts unverified; nothing about it (including any dedication) appears on
the site — not `/live`'s "Recent Mission Support", not a mile's funded
total, not the campaign total — until an admin checks "Verified" after
confirming the gift actually reached the beneficiary organization. Saving a
donation (create, edit, verify, unverify, or delete) recomputes
`campaign.amount_raised` and every mile's `amount_funded`/`status` from the
full set of verified donations, so those stored totals can never drift from
what's actually been confirmed. A mile's `requested`/`reserved` status
(from the sponsorship workflow above) is preserved rather than reset to
`available` when it has no verified donations yet — only a nonzero verified
total moves a mile to `partially_funded`/`funded`.

**RLS**: unchanged — `donations` still allows public `select` only where
`verified = true` (see `schema.sql`); all writes from `/admin/donations` go
through the service-role client after `requireAdminUser()`, the same
pattern as the sponsorship and training-objectives admin actions.

Not built yet: a donor-facing self-report form (donors currently use the
note field on the partner's own donation page, or email the campaign) and
bulk-import from a partner's donation export.

## WHOOP Training Snapshot

The Race page shows a live "Latest Training" panel (recovery %, sleep
performance %, day strain, and recent workouts) sourced from the athlete's
own [WHOOP](https://developer.whoop.com) account via OAuth 2.0. This is
Cody connecting his own device data for public display — it has nothing to
do with site visitors and doesn't collect anything from them.

**Setup**:

1. Create an app in the [WHOOP Developer Dashboard](https://developer.whoop.com)
   and register `{NEXT_PUBLIC_SITE_URL}/api/whoop/callback` as its exact
   redirect URL (e.g. `http://localhost:3000/api/whoop/callback` locally).
2. Set `WHOOP_CLIENT_ID` and `WHOOP_CLIENT_SECRET` in `.env.local`.
3. Sign in at `/admin/login`, open `/admin/whoop`, and click **Connect WHOOP
   Account** — this starts the OAuth flow and redirects back once
   authorized.

**How it works**: tokens are exchanged and stored server-side in the
`whoop_tokens` table (`src/lib/whoop/tokens.ts`), which has no public RLS
policies at all — same default-deny pattern as `inquiries`. WHOOP rotates
the refresh token on every use, so `getValidAccessToken()` persists the
new one immediately after each refresh. The public page only ever sees the
derived, public-safe snapshot (`WhoopTrainingSnapshot` in
`src/types/whoop.ts`) built by `getTrainingSnapshot()` — raw tokens and API
responses never reach a Client Component or the browser. Snapshot fetches
are cached for 30 minutes (`next: { revalidate }` in `src/lib/whoop/client.ts`)
to stay well under WHOOP's API rate limits.

If `WHOOP_CLIENT_ID`/`WHOOP_CLIENT_SECRET` aren't set, or nothing is
connected yet, the Race page shows a "Live training data is coming soon"
placeholder instead of erroring.

## Analytics (Cloudflare Web Analytics)

Traffic across every public page (both `forthe22.org` and `tri.forthe22.org`)
is measured with [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) —
cookieless, no persistent visitor identifier, no cross-site tracking. It
reports pageviews, unique visits, referrers, landing pages, and geography.
There is **no public visitor counter** anywhere on the site; the only place
these numbers are shown is the admin-only `/admin/analytics` dashboard (see
[Environment Variables](#environment-variables) for what it needs).

**There is no client-side snippet to add.** Cloudflare's own automatic,
zone-level install already injects the beacon for every hostname on the
`forthe22.org` zone — `forthe22.org` and `tri.forthe22.org` alike — as one
Web Analytics "site." A second, manually-added beacon per domain would just
double-count every pageview, so this repo doesn't add one; `/admin/analytics`
instead reads that one site's data back out and splits it by hostname.

**Setup** (all server-only — for the `/admin/analytics` dashboard's live
numbers; traffic is measured either way, this only affects whether it shows
up here):

1. Find the site's tag: Cloudflare dashboard → Analytics & Logs → Web
   Analytics → the `forthe22.org` site (or `GET
   /accounts/{account_id}/rum/site_info/list`). Set
   `CLOUDFLARE_WEB_ANALYTICS_SITE_TAG` to its `site_tag`.
2. Turn on **"Include query string"** in that site's Web Analytics
   settings — this is what lets `/admin/analytics` recover `utm_*`
   parameters from tracked paths for the Campaign Traffic table. Without
   it, UTM-tagged links still work and still count as pageviews, they just
   can't be broken out by campaign.
3. Set `CLOUDFLARE_ACCOUNT_ID` (visible in the dashboard URL/sidebar) and
   `CLOUDFLARE_ANALYTICS_API_TOKEN` — an API token scoped to **Account →
   Account Analytics → Read**. `CLOUDFLARE_WORKERS_API_TOKEN` (used for
   deploys) already happens to carry this scope in this project, so it's
   fine to reuse its value; a separate, narrowly-scoped token is better
   hygiene but not required.

**How it works**: `/admin/analytics` (`src/app/admin/analytics/page.tsx`)
reads Web Analytics data via Cloudflare's GraphQL Analytics API
(`src/lib/analytics/cloudflare.ts`), requesting `requestHost` alongside
every other dimension and splitting the one site's rows into "org"
(`forthe22.org`) vs. "campaign" (`tri.forthe22.org`) using the same
hostname rule as the rest of the app (`isCampaignHost()` in
`src/lib/site-mode.ts`) — not two separate Cloudflare sites. It also parses
`utm_source`/`utm_medium`/`utm_campaign` off tracked paths in application
code, since the GraphQL Analytics API has no native UTM dimension. The
dashboard documents the UTM conventions to use for partner links, QR
codes, sponsorship outreach, and social/fundraising links.

**Custom conversion events** (the `data-analytics-event` markers already on
share buttons, donate/fund-a-mile CTAs, form submissions, etc. — see
`git grep data-analytics-event`) are a separate concern from page-level
traffic and are **not** wired up by this integration: Cloudflare Web
Analytics' beacon only reports pageloads, not arbitrary custom events. That
remains open — see Remaining TODOs.

If neither beacon token is set, the site renders with no analytics script
at all (nothing to disclose, nothing to gate on consent). If a beacon token
is set but the GraphQL API credentials aren't, the site is still tracked —
only the `/admin/analytics` live view is unavailable, and the page says so.

## Eliminating Placeholder Content

No production-facing page shows literal `TODO` text, a fake sample sponsor,
or a made-up email address. Where real content or media doesn't exist yet,
the element is hidden or replaced with a polished empty state instead:

- **[`EmptyState`](src/components/shared/empty-state.tsx)** — the "nothing
  here yet" treatment (title, optional description, optional CTA). Used for
  the sponsor wall (`"We're currently building the first group of
  organizations backing Tri."`), the
  Updates page/homepage teaser, Race page training milestones, and the
  WHOOP training snapshot before anything is connected.
- **[`MediaPlaceholder`](src/components/shared/media-placeholder.tsx)** — a
  silent, on-brand ghosted mark used wherever a real photo is missing (About
  portrait, homepage "Why I'm Doing This" photo, update post images) instead
  of an "Image TODO" label.
- **Partner cards** show a "What They Do" section only when
  `partners.what_they_do` is set (an organization's own approved
  description); "Why It Matters to Me" is always shown because it's Cody's
  own real words, never a placeholder — see
  [`PartnerCard`](src/components/partners/partner-card.tsx). Learn
  More/Donate buttons are omitted entirely (not shown disabled or "coming
  soon") when a partner has no `website_url`/`donation_url` yet — both
  partners now have a real `website_url` (their own homepages), but
  `donation_url` is still `null` pending an approved donation-specific link.
- **`CONTACT_EMAIL`** (`src/lib/constants.ts`) is a real address
  (`seventyforseventy@gmail.com`); the same fallback-to-contact-form
  pattern stays in place in every consumer (footer, Contact/Privacy/Terms/
  Press pages) for whenever it's unset in the future.
- **`SOCIAL_LINKS`** (`src/lib/constants.ts`) is an empty array by default —
  `SocialLinks` (used in the footer's Connect column) renders nothing
  rather than a row of placeholder icons until real profile URLs exist.
- Race page fields with no data (location, goal time, course link) are
  omitted from the definition list entirely rather than rendering
  `"— pending"` text.

This isn't a global `isLaunchReady` flag — it's the same per-field "hide or
replace with a real empty state" rule applied consistently. A flag would add
a layer of indirection without doing anything these direct checks don't
already do.

## Rebrand: For The 22 / Tri

The site was rebranded twice from its original "70 for 70" identity:
first to org **"For The 22"** / campaign **"70 for 22"**, then the
campaign name itself changed again to **"Tri"**. Current state —
**"For The 22" is the organization/site brand** (header, footer, legal
copy, site-wide metadata), and **"Tri" is the specific fundraising
campaign/race effort** (hero, mission copy, share text, mile-funding
language). The two names are deliberately distinct: `SITE_NAME`,
`CAMPAIGN_NAME`, and `ORG_TAGLINE` ("Endurance With A Purpose") are all
separate constants in [`constants.ts`](src/lib/constants.ts) — see each
call site's context for which one applies (org = operating-entity/legal
statements, campaign = race/fundraising-specific statements).

The fundraising math is unchanged throughout: still 70 miles, $70,000,
$1,000/mile. Mighty Oaks Foundation and Project Echelon are still the
actual funding beneficiaries — "For The 22" is Cody's own org/brand for
this and future campaigns, not a new beneficiary.

**Not changed as part of either rebrand pass** (not requested, and not
something to guess at): `CONTACT_EMAIL` is still
`seventyforseventy@gmail.com`, which now reads as a mismatch against the
new brand. Update it in `constants.ts` once a new address exists.

## Campaign Logo

Two brand marks are in place — a colored ring around a bold "For The 22"
wordmark (the org), and a swim/bike/run icon with a "TRI" wordmark (the
campaign). No horizontal lockup exists for either, so nothing invents one.

The org mark has two versions — dark numerals for light backgrounds,
white numerals for dark backgrounds. The Tri campaign mark only has one
(dark-text, light-background) version supplied, so it's placed only where
a light background is available (`/the-race` hero, `/press` downloads) —
not in dark-background contexts like the OG image or footer, where its
dark "TRI" text would be unreadable.

- Source files (full resolution, not publicly served — kept for
  regenerating assets later): [`brand/forthe22-logo-source.png`](brand/forthe22-logo-source.png),
  [`brand/forthe22-logo-white-source.png`](brand/forthe22-logo-white-source.png),
  [`brand/tri-logo-source.png`](brand/tri-logo-source.png). Earlier
  "70 for 70" / "70 for 22" sources are kept alongside them for history.
- [`public/logo.png`](public/logo.png) / [`public/logo-white.png`](public/logo-white.png) —
  1024×1024 optimized **For The 22** org marks used for on-site display
  (header/footer) and the `/press` downloads
- [`public/campaign-logo.png`](public/campaign-logo.png) — the **Tri**
  campaign mark (swim/bike/run icon + "TRI" wordmark), used on the
  `/the-race` hero and offered as a download on `/press`
- `src/app/icon.png` (32×32) and `src/app/apple-icon.png` (180×180,
  flattened onto the off-white brand background since Apple's convention
  doesn't respect transparency) — both regenerated from the **For The 22**
  org mark
- `Header` (light background) uses `logo.png`; `Footer` and
  `opengraph-image.tsx` (both dark) use `logo-white.png` — both pair the
  org icon with visible "For The 22" text (nav/footer) or the "TRI"
  campaign headline (OG image, still plain text since the Tri image file
  has no dark-background version). The icon images themselves are
  `alt=""`/`aria-hidden` since the adjacent text already gives screen
  readers the accessible name, avoiding a duplicate announcement — this
  satisfies "navigation should still include readable text" without
  relying on alt text alone.
- [`opengraph-image.tsx`](src/app/opengraph-image.tsx) composites the
  white org logo (read from disk, base64-encoded) alongside the campaign
  headline/tagline on the existing dark gradient, so it flows through
  automatically to Twitter/OG social cards
- [`/press`](src/app/press/page.tsx)'s "Logo Downloads" section offers all
  three marks for download instead of an `EmptyState`, with an explicit
  note that the horizontal lockup is still pending

If a horizontal lockup is produced later, add it as
`public/logo-horizontal.png` and swap it in wherever a wider format reads
better (the OG image and `/press` are the most likely candidates).

**Partner logos**: Mighty Oaks Foundation's and Project Echelon's own
official logos are also in place now (`brand/mighty-oaks-logo-source.png`
/ `brand/project-echelon-logo-source.png`, optimized into
`public/partners/`), set as `partners.logo_url` in both
[`seed-data.ts`](src/lib/data/seed-data.ts) and
[`seed.sql`](supabase/seed.sql). `PartnerCard` and `SponsorCard` still fall
back to a text wordmark for any partner/sponsor without a `logo_url`, but
neither beneficiary needs that fallback anymore.

## What's Implemented (Milestone 1)

- Responsive nav (sticky, distinct Donate CTA, accessible mobile menu)
- Homepage: hero built around who/why/what before fundraising mechanics —
  headline, supporting sentence, live stats (with a "starting line" empty
  state at $0), a 3-tier CTA hierarchy (dominant "Fund a Mile", secondary
  "Why I'm Doing This" anchor, tertiary "Request to Sponsor" text link) —
  followed immediately by a "Why I'm Doing This" human-story section, *then*
  progress mechanics, the mile teaser, partners, and updates
- Reusable `CampaignProgress` and `RaceProgress` components
  (`milesFunded = totalRaised / 1000`, capped at 70)
- Fund a Mile: 70 mile cards grouped into Swim (Mile 1) / Bike (Miles 2–57)
  / Run (Miles 58–70) segments with distinct accent colors — a fundraising
  visualization, not exact official race-mile boundaries — each showing
  amount + percent funded, status filtering (including sponsorship-pending
  states), and an accessible detail modal with per-donor contributions and
  status-aware CTA copy ("Be the first to fund Mile N" vs. "Help Finish
  This Mile")
- Mission, Race (with timezone-safe countdown + live WHOOP training
  snapshot), Partners, Sponsors, About, Updates (+ post detail), Donate,
  Contact, Privacy Policy pages
- General inquiry and sponsorship request forms: client + server-side (zod)
  validation, honeypot + timing-based bot mitigation, in-memory rate
  limiting, no client-exposed keys
- Full sponsorship request-and-approval workflow (see dedicated section
  above): public request form, status machine, audit trail, admin review
  queue with vetting checklist, and a gated "activate sponsor" action
- Supabase schema with RLS on every table; `inquiries` and the sponsorship
  tables have no public policies at all — only the service-role key (used
  server-side, after an authenticated-session check for admin actions) can
  read/write them
- Mostly-read-only authenticated `/admin` (Supabase Auth) — the exceptions
  are the sponsorship review queue and the WHOOP connect/disconnect flow,
  both fully functional
- Live WHOOP training snapshot on the Race page (see dedicated section
  above), with OAuth tokens stored server-only and zero public RLS access
- Sponsors page leads with a "Put Your Company Behind 70 Miles of Mission"
  value-proposition section before pricing tiers, plus a Custom / In-Kind
  Partnership tier (equipment, apparel, nutrition, travel, lodging, race
  services, media, photography, community events) → "Start a Sponsorship
  Conversation"
- Donate page trust section: per-partner "donation processed by"
  statement, a verified-501(c)(3)/EIN badge (hidden until
  `nonprofit_status_verified` is true), and an explicit "For The 22 does not
  take possession of charitable donations" statement. Donate buttons open
  an `ExternalDonateButton` confirmation dialog ("You're leaving 70 for
  70...") before navigating out, with an external-link icon indicator —
  never a direct outbound `<a>`
- Campaign allocation architecture (`campaign.allocation_policy`,
  `getAllocationBreakdown()`, `CampaignAllocation`): computed from verified
  donations grouped by `organization_benefited`, and renders nothing at all
  while `allocation_policy` is unset — no policy has been decided yet, so
  nothing currently implies donations pool across the two organizations
- Race page: "The Work" training-volume stats (swim/bike/run miles, hours,
  weeks completed/remaining — computed from `RACE_INFO.trainingStartDate`/
  `raceDate` where set) and a real Milestone Timeline sourced from
  published posts in the "Milestones" category, both falling back to
  `EmptyState` until there's real data
- Reusable `CampaignByTheNumbers` stat row (70 miles / $70K goal / 70.3
  race distance / 2 orgs / 1 mission) on the Mission page
- Every mile has a permanent, shareable page at `/miles/[number]` (its own
  OG title, progress, supporters, dedication, segment, and CTA — the
  "fully funded" state links to the next mile); `ShareButtons` (Copy Link,
  Facebook, LinkedIn, X, Email) appear there, on updates, and on the
  homepage
- Optional donation dedications ("In Honor Of" / "In Memory Of" + name +
  message, public/private) render on both the mile detail modal and the
  `/miles/[number]` page whenever `dedication_public` is true
- "Follow the Road to 70.3" email signup (first name + email) on the
  homepage, backed by a provider-abstracted `subscribeToUpdates()` — it
  durably records signups now and is the single place to wire a real
  provider later, per `src/lib/email-list.ts`
- Provider-neutral `/live` race-day page: shows real fundraising progress
  and recent donations always, and a live status panel (discipline,
  current mile, elapsed time, latest split, map) once `getRaceDayStatus()`
  reports `isLive` — currently a static "not live" stub behind a typed
  interface so a GPS/timing provider can be swapped in without touching
  the page
- `/press` media kit (campaign summary, athlete bio, beneficiary links,
  media contact) and `/terms` (Terms of Use, Sponsorship Disclosure,
  Charitable Giving Disclosure, trademark/endorsement disclaimer) —
  logo/photo/press-coverage sections use `EmptyState` until real assets
  exist
- Nav simplified to Mission / My Story / The Race / Fund a Mile / Partners
  / Updates, with right-aligned Sponsor and Donate CTAs ("About" now reads
  "My Story" in the nav — same `/about` route, so no links break)
- Additional `data-analytics-event` markers: `mile_viewed`,
  `beneficiary_selected`, `sponsor_request_started`/`_submitted`,
  `mailing_list_signup`, `share_click` — see Remaining TODOs for what
  still needs a real provider
- Mobile-first pass verified across the homepage, Fund a Mile grid + mile
  modal, sponsorship request form, About, Donate, and `/live` at a 375px
  viewport — nav, forms, and dialogs all confirmed usable with no
  obstruction or overflow issues
- Real campaign logo (icon/mark) in nav, footer, favicon, apple-touch-icon,
  the OpenGraph/social share image, and `/press`'s logo download — see
  [Campaign Logo](#campaign-logo)
- SEO: metadata, OpenGraph/Twitter cards (generated, now with the real
  logo), sitemap (including every `/miles/[number]` URL), robots.txt

## Remaining TODOs

- **Copy**: the About page, the homepage "Why I'm Doing This" section, the
  Mission page's "Why Veterans" / "Why Mighty Oaks" / "Why Project Echelon"
  sections, and each partner card's "Why It Matters to Me" are all Cody's
  real, approved words (see
  [`src/lib/content/about.ts`](src/lib/content/about.ts) and
  [`mission.ts`](src/lib/content/mission.ts)). Each partner's official
  "What They Do" description is still pending — `partners.what_they_do` is
  `null` and hidden until each org supplies approved copy (never a
  placeholder — see
  [Eliminating Placeholder Content](#eliminating-placeholder-content)).
  There are no posts yet, so Updates shows an empty state instead of
  placeholder posts.
- **Media**: hero photography, athlete portrait, sponsor logos, and post
  images are still unset (partner logos are done — see below); the hero
  uses a generated placeholder SVG (`public/hero-placeholder.svg`) and
  every other missing photo uses `MediaPlaceholder` — no "Image TODO"/
  "Portrait TODO" labels anywhere
- **Donation URLs**: `partners.donation_url` is still `null` for both
  organizations pending an approved donation-specific link — `website_url`
  (used for "Learn More") is set to each org's real homepage, but that's a
  distinct field/CTA from "Donate," so it wasn't reused for this
- **Social profiles**: `SOCIAL_LINKS` (`src/lib/constants.ts`) is empty —
  add `{ platform, label, url }` entries once real profile URLs exist and
  `SocialLinks` in the footer will pick them up automatically
- **Race details**: date, location, course info, goal time, and training
  start date are `null` in `src/lib/constants.ts` (`RACE_INFO`);
  `TRAINING_VOLUME` (swim/bike/run miles, hours) is also all `null` pending
  a real data source
- **Trust signals**: `partners.ein` and `partners.nonprofit_status_verified`
  are unset for both organizations — do not populate until independently
  verified
- **Campaign allocation**: `campaign.allocation_policy` is `null` — no
  policy (even split / donor choice / campaign-defined / separate totals)
  has been decided yet; `CampaignAllocation` stays hidden until it is
- **Analytics**: page-level traffic (pageviews, unique visits, referrers,
  landing pages, geography, UTM campaigns) is wired via Cloudflare Web
  Analytics — see [Analytics](#analytics-cloudflare-web-analytics). The
  `data-analytics-event` markers are a separate, still-open concern: Web
  Analytics' beacon only reports pageloads, not custom events
- **Full admin CRUD**: `/admin` is read-only by design for this milestone,
  except the sponsorship review queue; see Recommended Next Milestone below
- **Sponsorship notifications**: acknowledgment/administrator emails are
  stubbed (logged, not sent) — see `src/lib/notifications.ts`, needs a real
  provider (e.g. Resend) before launch
- **Email list provider**: "Follow the Road to 70.3" signups are captured
  in `email_subscribers` but not yet synced anywhere — `subscribeToUpdates()`
  in `src/lib/email-list.ts` is the single place to wire a real provider
  (Mailchimp, ConvertKit, Buttondown, etc.)
- **Press kit assets**: `/press`'s logo download now offers the real icon/
  mark (see [Campaign Logo](#campaign-logo) below); approved photos remain
  an `EmptyState` pending real campaign photography
- **Horizontal logo lockup**: only the compact icon/mark was provided — see
  [Campaign Logo](#campaign-logo)
- **Privacy Policy**: [`/privacy`](src/app/privacy/page.tsx) accurately
  describes current data practices, but two subsections (specific retention
  period, jurisdiction-specific rights language) are marked `TODO` pending
  review by qualified legal counsel — see
  [`src/lib/content/privacy.ts`](src/lib/content/privacy.ts)
- **WHOOP**: not connected until an admin completes the OAuth flow at
  `/admin/whoop` (see [WHOOP Training Snapshot](#whoop-training-snapshot))
- Once real logos/images are supplied, add their domains to
  `images.remotePatterns` in `next.config.ts`

## Known Technical Issues / Decisions Worth Revisiting

- Rate limiting for `/api/inquiries` is in-memory (per Node instance) —
  fine for a single-instance deployment, but resets on redeploy and isn't
  shared across instances. Swap for a durable store (e.g. Upstash Redis)
  before scaling horizontally.
- `/admin` authorizes by "is there a signed-in Supabase user" only; there's
  no role/permission system yet, so any account you create in Supabase Auth
  can sign in. Fine while the team is small; needs `app_metadata`-based
  role checks (and matching RLS policies) before granting broader access.
- Mile "sponsored by" attribution on cards uses the first non-anonymous
  donation for that mile — reasonable for typically one-sponsor-per-mile,
  but the detail modal is the source of truth for miles with multiple
  contributors.
- Admin server actions (`src/app/admin/sponsorships/actions.ts`) redirect
  back to the same page with `?error=` on failure rather than using
  `useActionState` — simple and works without client JS, but a real error
  boundary/toast would be nicer if this admin surface grows.
- There's no requester-facing way to withdraw or check the status of a
  submitted sponsorship request (no unique link/token issued on submit) —
  an admin can mark one `withdrawn` today, but the requester can't self-serve.
- `getValidAccessToken()` (`src/lib/whoop/tokens.ts`) isn't concurrency-safe:
  if two requests both see a near-expired token at once, both may refresh,
  and WHOOP's refresh-token rotation means the loser's refresh technically
  still succeeds (WHOOP just returns a newer pair) but the redundant call is
  wasted. Harmless at this traffic volume; a mutex/lock would be needed at
  scale.

## Recommended Next Development Milestone

1. Replace placeholder copy, photography, and logos as they're approved
2. Supply real partner donation URLs, `what_they_do` descriptions, and race
   logistics (date/location)
3. Wire a real email provider for sponsorship acknowledgment/notification
   (`src/lib/notifications.ts`) and consider a requester-facing status link
4. Donation CRUD and Journal CRUD (`/admin/journal`) are done — see
   [Donation Tracking Workflow](#donation-tracking-workflow). Build
   authenticated CRUD for miles (beyond the sponsorship workflow's reserve
   step and donation-driven recompute) and partner URLs in `/admin`, with
   role-scoped RLS policies for authenticated writes
5. Wire a real analytics/tag-management provider (e.g. Cloudflare Zaraz) to
   the existing `data-analytics-event` conversion markers — Cloudflare Web
   Analytics itself (see [Analytics](#analytics-cloudflare-web-analytics))
   only covers page-level traffic, not custom events
6. Add real sponsor/partner logos and configure `images.remotePatterns`
7. Consider a payments/donation-processing integration if the campaign
   decides to accept donations directly instead of routing to partner
   platforms — any such integration must still honor the sponsorship
   approval gate (generate payment links/invoices only after `approved`)
8. Have legal counsel review the Privacy Policy's and Site Terms' open
   subsections (retention period, jurisdiction-specific rights) before launch
9. Connect the athlete's WHOOP account at `/admin/whoop` to light up the
   Race page's training snapshot
10. Wire a real email list provider (`src/lib/email-list.ts`) and a
    GPS/timing provider for `/live` (`src/lib/race-day.ts`) once chosen
11. Produce a horizontal logo lockup, if wanted, to complement the icon/
    mark already in place (see [Campaign Logo](#campaign-logo))

## Site Improvement Priorities (Backlog)

A larger site-improvement brief prioritized 25 items toward making the site
feel like "a credible, emotionally compelling national fundraising
campaign." Done: 1, 2, 3, 4 (icon/mark; no horizontal lockup was supplied),
5, 6, 7, 8, 9, 10, 11, 12, 13 (mostly), 14, 15, 16, 17, 18, 19, 20, 21
(partly), 22, 25 — see What's Implemented, Eliminating Placeholder Content,
and Campaign Logo above. Genuinely outstanding, in the brief's own priority
order:

- **13 — About page editorial layout**: mostly done — 9 real sections with
  an Isaiah 61:3 pull quote (see `src/app/about/page.tsx`). Alternating
  image/text sections and a visual timeline are still worth doing once real
  photography exists.
- **21 — Conversion tracking, remainder**: page-level traffic is done (see
  [Analytics](#analytics-cloudflare-web-analytics)). Most event markers
  exist now (see What's Implemented); still need a real provider wired to
  them specifically (Cloudflare Web Analytics doesn't cover custom events),
  a `returning_visitor` signal (needs an actual client-side identifier —
  not just a data attribute, so deliberately not faked), and eventually an
  admin conversion dashboard alongside the traffic one at `/admin/analytics`.
- **23 — Empty states, refinement**: the homepage's $0 state ("The
  Starting Line" / "Claim the First Mile") is done (see `hasStarted` in
  `src/app/page.tsx`). Worth refining further once the first mile is
  actually funded — e.g. referencing that specific mile in the copy.
- **24 — Recent activity feed**: the admin CRUD to enter/verify donations
  now exists ([Donation Tracking Workflow](#donation-tracking-workflow));
  `/live`'s "Recent Mission Support" section (`getRecentDonations()`) is
  still empty until real, verified donations are actually recorded there.
  Never expose private donor info when built.

## Second-Pass Site Improvements (P0–P30)

A follow-up brief added 30 more priorities plus a "Definition of Ready for
Public Launch" checklist. Done this pass: P2, P3, P6 (from the earlier
pass), P8, P10, P12, P14, P15, P16, P18, P19, P21, P22, P23, P25, P26, P27,
P29, P30, and a P0 placeholder-text re-audit (clean — see grep pattern in
git history for the exact check).

- **P16 — Training dashboard**: `src/lib/training-stats.ts` is a new
  provider-neutral function (same pattern as `race-day.ts` and the WHOOP
  client) feeding the-race page's "Road to 70.3" section. All fields are
  `null` today — hidden via `EmptyState`, not shown as zeros — until a real
  training-log source is wired in.
- **P18/P30 — Milestone rail**: `src/components/campaign/milestone-rail.tsx`
  is wired into its own "Fundraising Milestones" section on the homepage,
  between Latest Training and Sponsors.
- **P22 — Dedication branch**: `donations.dedication_branch` (optional free
  text, e.g. "U.S. Army") added to the schema, `DonationRow` type, and both
  mile-detail rendering surfaces. No donation intake form exists in this
  app (donations happen off-site through partner platforms), so there's no
  form field to add — this only affects display once verified donations
  carry the field.
- **P27 — Mobile conversion bar**: `src/components/layout/mobile-conversion-bar.tsx`,
  a fixed bottom bar (Fund a Mile / Sponsor) shown on mobile only, hidden on
  `/admin*`, `/fund-a-mile`, `/donate`, `/sponsors*`, and `/miles/[number]`
  since those pages already carry their own primary CTA. A matching spacer
  component reserves space after the footer so the bar never overlaps page
  content.
- **P29 — Logo color meaning**: added as a dedicated "The Brand" section on
  `/about` (not the homepage hero, per the brief) — the six logo ring colors
  mapped to the six U.S. Armed Forces branches.
- **Race date (not in the original brief)**: the user provided the real
  official race page, https://www.ironman.com/races/im703-chattanooga
  (IRONMAN 70.3 Chattanooga), now set as `RACE_INFO.courseInfoUrl`. Web
  search corroborated a May 2027 date but third-party race calendars
  disagreed on the exact day (some said Monday, May 10, which is unusual
  for a triathlon and likely an aggregator error) — `RACE_INFO.raceDate`
  is deliberately left `null` rather than guessed. Set it once the exact
  date/time is confirmed on the official page; the countdown component
  picks it up automatically.

Not done this pass, and why:
- **P5 — Alternating backgrounds/timeline on `/about`**: still blocked on
  real photography for the visual timeline to feel worth building (same
  reasoning as the original brief's item 13).
- **P7 — segment icon polish**: done at the base level (Waves/Bike/
  Footprints icons on `/fund-a-mile` segment headers, "The Swim/Bike/Run"
  labels), but no further icon treatment was added to the individual
  `MileCard`s themselves — the card grid is dense/compact by design and
  adding a third icon there was judged more cluttering than clarifying.
- **P17 real journal posts, P20 real donation momentum data, P11 real
  EIN/501(c)(3) values**: all blocked on content/data the user hasn't
  provided yet, unchanged from the original brief.
