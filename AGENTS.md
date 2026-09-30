<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# For The 22 — agent notes

Fundraising campaign site (Next.js 16 / React 19 / Tailwind v4 / Supabase) deployed as a
single Cloudflare Worker via `@opennextjs/cloudflare`. `README.md` is a long, changelog-style
historical doc — useful for recipes and rationale, but several sections have drifted from the
code. **Trust `wrangler.jsonc`, `.github/workflows/deploy.yml`, and the source over README prose.**

## Commands

- `npm run dev` (Turbopack) · `lint` · `typecheck` · `build` · `start` · `preview` · `deploy` · `cf-typegen`
- **There is no test framework** — no `test` script, no `*.test.*`/`*.spec.*`, and CI has no test step.
  Verification is `npm run lint && npm run typecheck && npm run build`. `npm run build` is the only
  way to see every route and whether it's static (`○`) or dynamic (`ƒ`) — check it after middleware/
  host changes. Focus a single check with `npx eslint <path>` / `npx tsc --noEmit`.
- `preview`/`deploy` emit "OpenNext is not fully compatible with Windows… use WSL" (from
  `@opennextjs/aws`); CI deploys anyway, so prefer pushing to `master` over local deploys.

## Deploy

- Push to `master` → `.github/workflows/deploy.yml` builds + deploys + syncs Worker secrets.
  **Merging to master is a production deploy**, not an incidental git operation.
- `wrangler.jsonc` `vars` = committed non-secret runtime config. Anything set only in the Cloudflare
  dashboard is wiped by the next deploy (this has silently broken `SITE_URL`/`WHOOP_CLIENT_ID`/
  Supabase config three times — see the long comment above `vars`). Secrets live in GitHub repo
  secrets and are pushed by the "Sync Worker secrets" step; add each one there **and** in that step's
  name list. Never only in the dashboard.
- `netlify.toml` and the `@netlify/plugin-nextjs` devDependency are dead leftovers — Cloudflare is the target.

## Framework quirks that bite

- **`src/middleware.ts` must stay `middleware.ts`, not Next 16's `proxy.ts`** — `proxy.ts` is
  Node-runtime-only, which OpenNext-for-Cloudflare doesn't support. Don't "modernize" it.
- Workers have no real on-disk filesystem at request time: never `node:fs` a `public/` file in route
  code (see `src/lib/assets/og-logo.ts` for the base64-constant pattern).
- Public reads use the cookie-free `createPublicClient()` (`src/lib/supabase/public.ts`).
  `supabase/server.ts` calls `cookies()`, so it breaks `generateStaticParams`/build-time contexts —
  reserve it for genuinely session-bound code (admin, participant app).
- The root layout reads the request host, so every route is dynamically rendered. Expected, not a bug.

## Multi-domain architecture (read this before touching routing)

One app, host-driven. `src/lib/site-mode.ts` is the single source of truth for host → mode
(`getCampaignSlug`, `isAppHost`); never re-implement host checks inline.

- Hosts: `forthe22.org` (org) · `tri.` / `ruck.` / `22.forthe22.org` (campaigns) ·
  `app.forthe22.org` (authenticated participant app, routes live in `src/app/app/*`, never gated) ·
  `forthe22.com` (308 only, squatting defense). `*.localhost` aliases (`tri.localhost`,
  `app.localhost`, …) satisfy the prefix match for local host testing.
- Adding a campaign = slug/hostname in `CAMPAIGN_HOSTS` + branding in `CAMPAIGNS`
  (`src/lib/constants.ts`), then its path guards/rewrites in `src/middleware.ts`.
- `src/middleware.ts` owns, in order: stray-domain 308 · `/22forthe22` legacy 308 · app-host
  `/app/*` rewrite · per-domain launch gate · org↔campaign 308s and shared-path rewrites ·
  Ruck/22 single-home guards. Org-only prefixes are `ORG_PATH_PREFIXES`; Tri's are
  `CAMPAIGN_PATH_PREFIXES`. API routes, `/admin`, and `/crisis` intentionally work on every host.
- Campaign roots are rewrites to real routes (`CAMPAIGN_HOME_ROUTES`: `/` → `/campaign-home`,
  `/ruck-home`, `/22forthe22`). Ruck is one page; 22 For the 22 is three (`/`, `/promokit`,
  `/rules`) — their content is data in `constants.ts` / `src/lib/content`, not routes.
- Cross-domain links must be absolute URLs built from `SITE_URL` / `CAMPAIGN_URL` /
  `RUCK_CAMPAIGN_URL` / `APP_URL` / `EVENT22_CAMPAIGN_URL` (`src/lib/constants.ts`), never a
  relative `<Link>` — otherwise the middleware redirect adds a hop.
- **Launch gate**: unless a flag is exactly `"true"`, every route on that host renders
  `/coming-soon` (API routes → 503). `SITE_LIVE` = org, `CAMPAIGN_LIVE` = all campaigns.
  `?preview=<PREVIEW_ACCESS_TOKEN>` sets a 180-day cookie. `/admin`, `/api/whoop`, `/crisis`,
  sitemap/robots/manifest are never gated. `metadataBase` is resolved per-request in
  `src/app/layout.tsx` — don't hardcode it.

## Data / Supabase

- `supabase/schema.sql` is canonical and idempotent; changes ship as **new dated
  `supabase/YYYY-MM-DD-*.sql` files** applied by hand (SQL Editor or `supabase db query`).
  `supabase/.temp` is linked to project `wjwgzphvpulkofvuksko`, and `.mcp.json` configures the
  Supabase MCP server. Repo-local skills at `.claude/skills/supabase*` cover schema/RLS work.
- Every public read falls back to bundled `src/lib/data/seed-data.ts` when
  `isSupabaseConfigured()` is false — and usually on query error too. A broken Supabase query looks
  like "empty site", not an error.
- RLS is default-deny. Writes go through `createAdminClient()` (`src/lib/supabase/admin.ts`) only
  after `requireAdminUser()` (`ADMIN_EMAILS` allowlist — a signed-in session alone is NOT enough;
  non-allowlisted users get signed out) or `requireParticipant()` for `src/app/app/*` (any session).
- Storage uploads are service-role only; public policies are read-only. The `journal-media` bucket
  is a manual dashboard/CLI step, not expressible in SQL.

## Conventions

- Content lives in plain data files under `src/lib/content/*.ts` (bike build, gear journey,
  22-for-the-22, mission, about, terms/privacy). Publishing a new timeline entry is a content-file
  edit — never a component edit. Append at the **end**; last item is "latest", ids become
  `#anchors` and must never change after publishing. Recipes are in README's Bike Build / Gear
  Journey sections.
- All page metadata goes through `pageMetadata()` (`src/lib/metadata.ts`). Next merges
  `openGraph`/`twitter` shallowly per top-level key, so hand-rolled page metadata silently drops
  canonicals and social cards.
- Route handlers under `src/app/api/**` follow one shape: rate limit (`src/lib/rate-limit.ts`,
  in-memory) → zod schema (`src/lib/validation/*`) → honeypot field + min fill time → service-role
  insert → generic success response so bots can't tell which check tripped. Admin mutations are
  server actions in an `actions.ts` beside the route; public pages must never import the admin client.
- Server Components by default; `"use client"` only where interactivity requires it. Raw WHOOP/
  Strava tokens and API responses stay server-side — expose only the derived public snapshots.
- No placeholder content on production-facing pages: hide the element or use `EmptyState` /
  `MediaPlaceholder` instead of `TODO` text, fake sponsors, or made-up emails/links.

## Repo notes

- Branch of record is `master`. Commits use plain imperative subjects (no prefixes).
- Root is littered with brand/photo assets and `Campaign Materials/`; `brand/*-source.png` are the
  master logo files (public ones are generated from them).