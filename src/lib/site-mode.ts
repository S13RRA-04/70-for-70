import { headers } from "next/headers";

export type SiteMode = "org" | "campaign" | "app";

/** Every live campaign subdomain. Adding a new one is a two-step change: add its slug/hostname pair to CAMPAIGN_HOSTS below, then add its branding to CAMPAIGNS in constants.ts. */
export type CampaignSlug = "tri" | "ruck";

const CAMPAIGN_HOSTS: Record<CampaignSlug, string> = {
  tri: "tri.forthe22.org",
  ruck: "ruck.forthe22.org",
};

/**
 * The "For the 22" participant app — app.forthe22.org. A different kind of
 * surface entirely from org/campaign (authenticated, not a marketing site),
 * so it's a third SiteMode rather than a CampaignSlug: the app isn't itself
 * one campaign's content, it's the cross-campaign platform that "22 For the
 * 22" (and later challenges) register/track progress inside — see
 * supabase/schema.sql's "For the 22 app" section. Already provisioned as a
 * Cloudflare Workers Custom Domain on this same Worker; no DNS/routing
 * change needed to add it here.
 */
const APP_HOST = "app.forthe22.org";

function normalizeHostname(host: string | null | undefined): string | null {
  if (!host) return null;
  return host.split(":")[0].toLowerCase();
}

/**
 * Shared by src/middleware.ts (Edge, reads NextRequest directly) and any
 * Server Component that needs to know which domain it's rendering for
 * (reads next/headers instead). Keeping the hostname check in one place
 * avoids the two ever drifting out of sync.
 */
export function getCampaignSlug(host: string | null | undefined): CampaignSlug | null {
  const hostname = normalizeHostname(host);
  if (!hostname) return null;
  const match = (Object.entries(CAMPAIGN_HOSTS) as [CampaignSlug, string][]).find(
    ([, campaignHost]) => hostname === campaignHost || hostname.startsWith(`${campaignHost.split(".")[0]}.`),
  );
  return match ? match[0] : null;
}

/** True for any campaign host (Tri, Ruck, ...) — most call sites only need "org vs. some campaign," not which one. */
export function isCampaignHost(host: string | null | undefined): boolean {
  return getCampaignSlug(host) !== null;
}

/** True for app.forthe22.org (and its local-dev alias, "app.localhost"). */
export function isAppHost(host: string | null | undefined): boolean {
  const hostname = normalizeHostname(host);
  if (!hostname) return false;
  return hostname === APP_HOST || hostname.startsWith("app.localhost");
}

/** For Server Components (layout, pages) — Edge middleware uses isCampaignHost/getCampaignSlug/isAppHost directly on the request. */
export async function getSiteMode(): Promise<SiteMode> {
  const headerList = await headers();
  const host = headerList.get("host");
  if (isAppHost(host)) return "app";
  return isCampaignHost(host) ? "campaign" : "org";
}

/** For Server Components that need to know *which* campaign — null on the org and app hosts. */
export async function getActiveCampaignSlug(): Promise<CampaignSlug | null> {
  const headerList = await headers();
  return getCampaignSlug(headerList.get("host"));
}
