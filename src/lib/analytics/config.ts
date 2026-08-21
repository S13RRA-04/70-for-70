/**
 * Cloudflare Web Analytics — Cloudflare's own zone-level automatic install
 * already injects the beacon for every hostname on the forthe22.org zone
 * (forthe22.org and tri.forthe22.org alike), so there's no client-side
 * snippet to wire up here. This module only holds the server-only
 * credentials /admin/analytics uses to read that data back out via
 * Cloudflare's GraphQL Analytics API — see src/lib/analytics/cloudflare.ts.
 */

/** The one Web Analytics "site" covering the whole forthe22.org zone. Find it under Analytics & Logs -> Web Analytics in the Cloudflare dashboard, or via GET /accounts/{account_id}/rum/site_info/list. */
export const CLOUDFLARE_WEB_ANALYTICS_SITE_TAG = process.env.CLOUDFLARE_WEB_ANALYTICS_SITE_TAG;

/**
 * Deliberately separate names from CLOUDFLARE_WORKERS_API_TOKEN
 * (wrangler.jsonc/deploy) even though that token happens to already carry
 * enough scope for this — narrower, purpose-named credentials over reusing
 * one broad one, so a future scope change to the deploy token doesn't
 * silently break analytics or vice versa.
 */
export const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
export const CLOUDFLARE_ANALYTICS_API_TOKEN = process.env.CLOUDFLARE_ANALYTICS_API_TOKEN;

export function isCloudflareAnalyticsApiConfigured(): boolean {
  return Boolean(CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_ANALYTICS_API_TOKEN);
}
