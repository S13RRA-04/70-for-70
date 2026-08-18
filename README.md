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
    updates/[slug]/         Campaign journal / training updates
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

## Eliminating Placeholder Content

No production-facing page shows literal `TODO` text, a fake sample sponsor,
or a made-up email address. Where real content or media doesn't exist yet,
the element is hidden or replaced with a polished empty state instead:

- **[`EmptyState`](src/components/shared/empty-state.tsx)** — the "nothing
  here yet" treatment (title, optional description, optional CTA). Used for
  the sponsor wall (`"The first 70 for 70 sponsors are coming soon."`), the
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
  soon") when a partner has no `website_url`/`donation_url` yet.
- **`CONTACT_EMAIL`** (`src/lib/constants.ts`) is `null`, not a placeholder
  address — every consumer (footer, Contact page, Privacy page) hides the
  email mention and falls back to linking the contact form instead.
- Race page fields with no data (location, goal time, course link) are
  omitted from the definition list entirely rather than rendering
  `"— pending"` text.

This isn't a global `isLaunchReady` flag — it's the same per-field "hide or
replace with a real empty state" rule applied consistently. A flag would add
a layer of indirection without doing anything these direct checks don't
already do.

## Campaign Logo

The campaign's compact icon/mark is in place — a colored ring around a
bold "70 FOR 70" mark. Only that icon/mark was supplied; **no horizontal
lockup exists yet**, so nothing invents one.

Two versions exist — dark numerals for light backgrounds, white numerals
for dark backgrounds:

- Source files: [`brand/70for70-logo-source.png`](brand/70for70-logo-source.png)
  and [`brand/70for70-logo-white-source.png`](brand/70for70-logo-white-source.png)
  (full resolution, not publicly served — kept for regenerating assets later)
- [`public/logo.png`](public/logo.png) / [`public/logo-white.png`](public/logo-white.png) —
  1024×1024 optimized versions used for on-site display and the `/press` downloads
- `src/app/icon.png` (32×32, light-background version) and
  `src/app/apple-icon.png` (180×180, flattened onto the off-white brand
  background since Apple's convention doesn't respect transparency) replace
  the previous dynamically-generated text-only favicon
- `Header` (light background) uses `logo.png`; `Footer` and
  `opengraph-image.tsx` (both dark) use `logo-white.png` — both pair the
  icon with visible "70 FOR 70" text (nav/footer) or the headline (OG
  image). The icon images themselves are `alt=""`/`aria-hidden` since the
  adjacent text already gives screen readers the accessible name, avoiding
  a duplicate announcement — this satisfies "navigation should still
  include readable text" without relying on alt text alone.
- [`opengraph-image.tsx`](src/app/opengraph-image.tsx) composites the white
  logo (read from disk, base64-encoded) alongside the headline/tagline on
  the existing dark gradient, so it flows through automatically to
  Twitter/OG social cards
- [`/press`](src/app/press/page.tsx)'s "Logo Downloads" section offers both
  versions for download instead of an `EmptyState`, with an explicit note
  that the horizontal lockup is still pending

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
  `nonprofit_status_verified` is true), and an explicit "70 for 70 does not
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
- **Donation URLs**: `partners.donation_url` is `null` for both
  organizations pending approved links — do not invent these
- **Contact email**: `CONTACT_EMAIL` (`src/lib/constants.ts`) is `null` —
  no confirmed public address yet. Every page falls back to the contact
  form; set a real address once one exists and it'll appear automatically
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
- **Analytics**: `data-analytics-event` markers exist but no provider is
  wired up yet (see brief's privacy-respecting analytics requirement)
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
- **21 — Conversion tracking, remainder**: most event markers exist now
  (see What's Implemented); still need a real privacy-respecting analytics
  provider wired to them, a `returning_visitor` signal (needs an actual
  client-side identifier — not just a data attribute, so deliberately not
  faked), and eventually an admin conversion dashboard.
- **23 — Empty states, refinement**: the homepage's $0 state ("The
  starting line." / "Fund the First Mile") is done (see `hasStarted` in
  `src/app/page.tsx`). Worth refining further once the first mile is
  actually funded — e.g. referencing that specific mile in the copy.
- **24 — Recent activity feed**: blocked on real donation data — "Recent
  Mission Support" (e.g. "Mile 4 received $100," "Acme Corp requested Mile
  32 sponsorship") needs either verified donations flowing in or admin
  CRUD to enter them. `/live`'s "Recent Mission Support" section is ready
  to receive that data (`getRecentDonations()`) but is empty today because
  there's nothing to show. Never expose private donor info when built.
