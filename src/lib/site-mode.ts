import { headers } from "next/headers";

export type SiteMode = "org" | "app";

/** Campaign identifiers remain useful for campaign content and branding data. */
export type CampaignSlug = "ruck" | "live" | "seen" | "22";

/**
 * The campaigns' former subdomains. Retired: every campaign now lives on the
 * org site under /campaigns, so src/middleware.ts 308s every page request on
 * these hosts to its org equivalent (applyRetiredCampaignHostRedirect). None
 * of them renders a page of its own — only /api and /admin still serve there
 * (the WHOOP and Strava OAuth callbacks are registered on the Tri host).
 */
export type RetiredCampaignHost = "tri" | "ruck" | "live" | "seen" | "22";

const RETIRED_CAMPAIGN_HOSTS: Record<RetiredCampaignHost, string> = {
  tri: "tri.forthe22.org",
  ruck: "ruck.forthe22.org",
  live: "live.forthe22.org",
  seen: "seen.forthe22.org",
  "22": "22.forthe22.org",
};

/**
 * The "For the 22" participant app — app.forthe22.org. A different kind of
 * surface entirely from the org site (authenticated, not a marketing site):
 * the cross-campaign platform that "22 For the 22" (and later challenges)
 * register/track progress inside — see supabase/schema.sql's "For the 22
 * app" section.
 */
const APP_HOST = "app.forthe22.org";

function normalizeHostname(host: string | null | undefined): string | null {
  if (!host) return null;
  return host.split(":")[0].toLowerCase();
}

/**
 * Which retired campaign host `host` is, or null. Matches the real hostname
 * or its local-dev alias ("ruck.localhost", ...).
 */
export function getRetiredCampaignHost(host: string | null | undefined): RetiredCampaignHost | null {
  const hostname = normalizeHostname(host);
  if (!hostname) return null;
  const match = (Object.entries(RETIRED_CAMPAIGN_HOSTS) as [RetiredCampaignHost, string][]).find(
    ([, campaignHost]) => hostname === campaignHost || hostname.startsWith(`${campaignHost.split(".")[0]}.localhost`),
  );
  return match ? match[0] : null;
}

/** True for app.forthe22.org (and its local-dev alias, "app.localhost"). */
export function isAppHost(host: string | null | undefined): boolean {
  const hostname = normalizeHostname(host);
  if (!hostname) return false;
  return hostname === APP_HOST || hostname.startsWith("app.localhost");
}

/** For Server Components (layout, pages) — Edge middleware uses isAppHost/getRetiredCampaignHost directly on the request. */
export async function getSiteMode(): Promise<SiteMode> {
  const headerList = await headers();
  return isAppHost(headerList.get("host")) ? "app" : "org";
}
