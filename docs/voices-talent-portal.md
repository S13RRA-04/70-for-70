# Voices For The 22 — Talent Portal

Talent-relations portal plus admin CRM for Voices For The 22. This doc covers setup, configuration
and how the workflow runs day to day.

## Routes

| Route | Purpose |
|---|---|
| `/voices` | Public gallery: featured message, cards, category filter, 988 / Veterans Crisis Line support, link to the portal |
| `/voices/[slug]` | Shareable page for one published contributor (VideoObject JSON-LD). Unpublished slugs return 404 |
| `/voices/talent` | Talent portal overview, with kit downloads |
| `/voices/talent/recording-guide` | Recording guide |
| `/voices/talent/submit` | Secure submission form (`noindex`) |
| `/voices/talent/permissions` | Distribution, editing limits, prohibited uses, withdrawal |
| `/admin/voices` | Dashboard: pipeline, directory, review queue, follow-ups, delivery failures, permissions pending, calendar, published, activity |
| `/admin/voices/talent/*`, `submissions/*`, `permissions/*`, `publications/*` | Record pages |
| `/admin/voices/export` | Talent CSV export (accepts the directory filters) |
| `/api/voices/submissions`, `/api/voices/submissions/complete` | Submission API (two steps) |

The `/voices/talent*` routes hide the header Donate button, the mobile-menu Donate link and the
mobile conversion bar. The portal carries no fundraising CTAs.

## One-time setup (manual)

1. **Apply the migration.** Run `supabase/2026-11-19-voices-talent-portal.sql` in the SQL Editor
   (or `supabase db query`). It is idempotent and creates the 7 tables, RLS, the column-level anon
   grant, and both storage buckets. The same SQL is mirrored in `schema.sql`.
2. **Check the upload limits.** Dashboard → Storage → Settings → global file size limit must be at
   least the bucket limit (500 MB). On the **Free plan the cap is 50 MB**. If you're on Free, lower
   the buckets' `file_size_limit` and set `NEXT_PUBLIC_VOICES_UPLOAD_MAX_MB` to `50` in
   `wrangler.jsonc` (and in the build env), or rely on secure links for large files.
3. **Email.** Confirmations and founder notifications use the existing Resend setup
   (`RESEND_API_KEY`, `CONTACT_EMAIL` = cody@forthe22.org). Without Resend, submissions still save
   and appear in the queue, but no email is sent.
4. **Admin access** uses the existing `ADMIN_EMAILS` allowlist. Nothing new is needed.
5. **Turnstile:** a new action, `voices_submission`. It works with the existing site key/secret and
   needs no dashboard change.

There are no new secrets. One new non-secret var: `NEXT_PUBLIC_VOICES_UPLOAD_MAX_MB` (wrangler `vars`).

## Submission flow and security

1. The browser POSTs metadata to `/api/voices/submissions`. That route runs the standard
   public-write pipeline: rate limit, zod, honeypot, minimum fill time, Turnstile. It creates an
   `awaiting_upload` row and returns 2-hour **signed upload URLs** for the private bucket, plus a
   one-time finalize token. Only the SHA-256 of the token is stored.
2. The browser PUTs each file **directly to Supabase Storage** with a progress bar. File bytes never
   pass through the Worker. If an upload is interrupted, "Retry upload" reuses the same URLs, which
   have upsert enabled.
3. `/complete` checks the token, then reads the **first 32 bytes** of each stored object over HTTP
   Range and checks the real file signature (MP4/MOV; JPEG/PNG/WebP; PDF). Invalid files are
   deleted. A submission whose only video is invalid is rejected. If everything passes, the status
   becomes `received` and the founder and submitter are emailed.

Other protections:
- Object names are random UUIDs and never come from user input.
- The private bucket has no storage policies. Admins download through 10-minute signed URLs.
- External video links are stored as untrusted text and never fetched server-side.
- **There is no malware scanning.** Supabase Storage doesn't offer it. Files are signature-checked,
  never executed, and download with `Content-Disposition: attachment`.
- Admin mutations are server actions, so Next's built-in Origin check covers CSRF. Every action
  calls `requireAdminUser()` and writes `voices_audit_events`.
- The CSV export guards against formula injection.
- The public read path only returns rows where `status = 'published' AND publish_at <= now()`
  (RLS), and only the granted public columns.

## Publication workflow

There are four separate statuses: outreach (talent), review (submission), agreement (permission)
and visibility (publication). Logging an email reply never changes permission or publication state.

1. Add the talent and contacts, then log outreach. The portal never sends email itself; "Compose in
   mail app" opens your own client.
2. Recording arrives through the portal, or you add it with **Log a recording** for things like
   emailed links or the existing Jon Stewart video.
3. Review it. Approve only once it's linked to a talent record.
4. **Record a permission agreement:** channels, edits, attribution, usage window, whether final-cut
   approval is required, and the signed document (stored privately).
5. Create a **publication** draft and upload the *prepared* video, poster and captions to the
   public bucket, or point it at a site path such as `/video/voices-jon-stewart.mp4`.
6. **Publish.** The button is blocked by `src/lib/voices/publication-gate.ts` unless all of these
   hold:
   - the submission is approved
   - the agreement is signed and not revoked
   - the agreement permits the channels, including the website
   - participant approval is recorded, when the agreement requires it
   - the go-live time is on or after the embargo and inside the usage window
   - the participant hasn't withdrawn

   Setting a future go-live time schedules the publication, and RLS reveals it automatically when
   that time arrives.
7. **Withdrawal:**
   - **Unpublish** takes the publication down and can optionally delete its public files.
   - **Revoke** on an agreement, Withdrawn on a talent record, or Withdrawn/Rejected on a
     submission all automatically unpublish every dependent publication.
   - **Delete files** on a submission purges the private copies and keeps a minimal record.

## Downloadable kit

`npm run voices:kit` rebuilds the files in `public/voices/kit/` from
`src/lib/content/voices-talent.ts`, which is the same copy the website uses. It renders the PDFs
with headless Chrome (set `CHROME_PATH` if it isn't found automatically) and builds a dependency-free
ZIP with the official logos and a README. When the copy changes, bump `KIT_VERSION`/`KIT_UPDATED`
(or `RELEASE_VERSION`) and re-run. Commit the regenerated files.

## Tests

Run `npm test`. It uses Node's built-in runner and covers the publication gate, file-signature
detection, CSV escaping, and the pipeline/status mapping. CI doesn't run it yet. To include it, add
`npm test` to `.github/workflows/deploy.yml`.
