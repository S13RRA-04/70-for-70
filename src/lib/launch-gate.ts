/**
 * Pre-launch gate — gated **per domain**, independently. While the
 * relevant flag isn't exactly "true", every request on that domain
 * (except a valid preview link/cookie) is shown a "Coming Soon" page
 * instead of real content. This is how the org site (www.forthe22.org)
 * can go live while the campaign (tri.forthe22.org) stays closed —
 * see src/middleware.ts, which checks the right flag per host, and
 * README's "Pre-Launch Gate" section. Read only from
 * src/middleware.ts — never expose `PREVIEW_ACCESS_TOKEN` via a
 * `NEXT_PUBLIC_` var, which would ship it in the client bundle.
 */

export function isOrgLive(): boolean {
  return process.env.SITE_LIVE === "true";
}

export function isCampaignLive(): boolean {
  return process.env.CAMPAIGN_LIVE === "true";
}

export function getPreviewToken(): string | undefined {
  return process.env.PREVIEW_ACCESS_TOKEN;
}

/** Cookie set on a browser that unlocked the site via `?preview=<token>`. */
export const PREVIEW_COOKIE_NAME = "site_preview";
