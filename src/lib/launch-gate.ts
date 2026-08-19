/**
 * Pre-launch gate — while `SITE_LIVE` isn't exactly "true", every request
 * (except a valid preview link/cookie) is shown a "Coming Soon" page
 * instead of real content. This keeps the whole site, including donate/
 * sponsor/merch links and form submissions, off until launch is approved.
 * Read only from `src/middleware.ts` — never expose `PREVIEW_ACCESS_TOKEN`
 * via a `NEXT_PUBLIC_` var, which would ship it in the client bundle.
 */

export function isSiteLive(): boolean {
  return process.env.SITE_LIVE === "true";
}

export function getPreviewToken(): string | undefined {
  return process.env.PREVIEW_ACCESS_TOKEN;
}

/** Cookie set on a browser that unlocked the site via `?preview=<token>`. */
export const PREVIEW_COOKIE_NAME = "site_preview";
