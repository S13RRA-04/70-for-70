# 70 for 70

70 miles. $70,000. One mission for veterans.

A fundraising campaign site pairing an IRONMAN 70.3-distance triathlon with a
$70,000 fundraising goal ($1,000 = one race mile) in support of veteran-focused
nonprofit organizations — initially Mighty Oaks Foundation and Project Echelon.

This is **Milestone 1**: a polished, public-facing campaign site with a
Supabase-backed data model. It does not process donations directly — donate
buttons route to each beneficiary organization's own donation platform.
Sponsorships go through a request-and-approval workflow — see
[Sponsorship Vetting Workflow](#sponsorship-vetting-workflow) below.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack, React 19)
- TypeScript (strict mode)
- Tailwind CSS v4
- [Supabase](https://supabase.com) (Postgres, Auth, Row Level Security)
- Deployable to Vercel, Cloudflare, or any Node-compatible host

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

## Database Initialization

Schema and seed data live in [`supabase/`](supabase):

- [`schema.sql`](supabase/schema.sql) — tables, constraints, indexes, and Row
  Level Security policies
- [`seed.sql`](supabase/seed.sql) — production-accurate seed: campaign at $0
  raised, all 70 miles `available` at $0/$1,000, Mighty Oaks Foundation and
  Project Echelon partner rows with donation URLs left `null` (TODO)
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
Cloudflare (via `@cloudflare/next-on-pages` or the OpenNext adapter), or any
Node-compatible host. No platform-specific code is used, so the deployment
target can change later without restructuring the app.

## Directory Structure

```
src/
  app/                      Routes (App Router)
    admin/                  Authenticated admin: overview, login, the
                             sponsorship review queue (admin/sponsorships/),
                             and the WHOOP connection page (admin/whoop/)
    api/inquiries/          General inquiry form submission endpoint
    api/sponsorship-requests/  Sponsorship request submission endpoint
    api/whoop/              OAuth authorize + callback routes (admin-only)
    fund-a-mile/            70-mile grid with filtering + detail modal
    the-mission/ the-race/  Mission and race pages (race page includes the
                             live WHOOP training snapshot)
    partners/ sponsors/     Beneficiary orgs, sponsorship levels, and the
                             sponsorship request form (sponsors/request/)
    updates/[slug]/         Campaign journal / training updates
    donate/ contact/        Donation routing and general contact form
    privacy/                Privacy policy
    sitemap.ts robots.ts    SEO
    opengraph-image.tsx     Generated social share image
  components/
    layout/                 Header, Footer
    campaign/                CampaignProgress, RaceProgress
    miles/                    MileCard, MileGrid, MileDetailModal
    partners/ sponsors/      PartnerCard, SponsorCard, SponsorWall
    updates/                   UpdateCard
    training/                    TrainingSnapshot
    forms/                       SponsorInquiryForm, SponsorshipRequestForm
    shared/                       Container, SectionHeading, CTASection,
                                    StatCard, Countdown
  lib/
    data/                    Supabase reads with seed-data fallback
    supabase/                Browser / server / admin (service-role) clients,
                              require-admin auth guard
    whoop/                   OAuth token storage/refresh + WHOOP API client
    content/                 Editable narrative copy (Mission, About, Privacy)
    validation/               zod schemas
    sponsorship.ts notifications.ts constants.ts rate-limit.ts utils.ts
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

## What's Implemented (Milestone 1)

- Responsive nav (sticky, distinct Donate CTA, accessible mobile menu)
- Homepage: hero with live stats, fundraising + race-course progress,
  Fund-a-Mile teaser, partners, latest 3 updates
- Reusable `CampaignProgress` and `RaceProgress` components
  (`milesFunded = totalRaised / 1000`, capped at 70)
- Fund a Mile: 70 mile cards, status filtering, accessible detail modal
  showing per-donor contributions and a "Help Fund Mile N" CTA
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
- SEO: metadata, OpenGraph/Twitter cards (generated), sitemap, robots.txt
- `data-analytics-event` attributes on key CTAs, ready to wire into an
  analytics provider (see Remaining TODOs)

## Remaining TODOs

- **Copy**: the About page and the Mission page's "Why Veterans" / "Why
  Mighty Oaks" / "Why Project Echelon" sections are Cody's real, approved
  copy (see [`src/lib/content/about.ts`](src/lib/content/about.ts) and
  [`mission.ts`](src/lib/content/mission.ts)). Partner descriptions and post
  bodies are still placeholder text marked `TODO` pending approved partner
  copy — see [`src/lib/content/`](src/lib/content) and `supabase/seed.sql`
- **Media**: hero photography, athlete portrait, partner/sponsor logos, and
  post images are all unset (`logo_url`/`image_url` = `null`); the hero uses
  a generated placeholder SVG (`public/hero-placeholder.svg`), and the About
  page portrait is `ABOUT_CONTENT.portraitUrl` (`null` — TODO)
- **Donation URLs**: `partners.donation_url` is `null` for both
  organizations pending approved links — do not invent these
- **Race details**: date, location, course info, and goal time are `null`
  in `src/lib/constants.ts` (`RACE_INFO`)
- **Analytics**: `data-analytics-event` markers exist but no provider is
  wired up yet (see brief's privacy-respecting analytics requirement)
- **Full admin CRUD**: `/admin` is read-only by design for this milestone,
  except the sponsorship review queue; see Recommended Next Milestone below
- **Sponsorship notifications**: acknowledgment/administrator emails are
  stubbed (logged, not sent) — see `src/lib/notifications.ts`, needs a real
  provider (e.g. Resend) before launch
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
2. Supply real partner donation URLs and race logistics (date/location)
3. Wire a real email provider for sponsorship acknowledgment/notification
   (`src/lib/notifications.ts`) and consider a requester-facing status link
4. Build authenticated CRUD for donations, miles (beyond the sponsorship
   workflow's reserve step), posts, and partner URLs in `/admin`, with
   role-scoped RLS policies for authenticated writes
5. Wire a privacy-respecting analytics provider to the existing
   `data-analytics-event` markers
6. Add real sponsor/partner logos and configure `images.remotePatterns`
7. Consider a payments/donation-processing integration if the campaign
   decides to accept donations directly instead of routing to partner
   platforms — any such integration must still honor the sponsorship
   approval gate (generate payment links/invoices only after `approved`)
8. Have legal counsel review the Privacy Policy's two `TODO` subsections
   (retention period, jurisdiction-specific rights) before launch
9. Connect the athlete's WHOOP account at `/admin/whoop` to light up the
   Race page's training snapshot
