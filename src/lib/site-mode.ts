import { headers } from "next/headers";

export type SiteMode = "org" | "campaign";

/** Every live campaign subdomain. Adding a new one is a two-step change: add its slug/hostname pair to CAMPAIGN_HOSTS below, then add its branding to CAMPAIGNS in constants.ts. */
export type CampaignSlug = "tri" | "ruck";

const CAMPAIGN_HOSTS: Record<CampaignSlug, string> = {
  tri: "tri.forthe22.org",
  ruck: "ruck.forthe22.org",
};

/**
 * Shared by src/middleware.ts (Edge, reads NextRequest directly) and any
 * Server Component that needs to know which domain it's rendering for
 * (reads next/headers instead). Keeping the hostname check in one place
 * avoids the two ever drifting out of sync.
 */
export function getCampaignSlug(host: string | null | undefined): CampaignSlug | null {
  if (!host) return null;
  const hostname = host.split(":")[0].toLowerCase();
  const match = (Object.entries(CAMPAIGN_HOSTS) as [CampaignSlug, string][]).find(
    ([, campaignHost]) => hostname === campaignHost || hostname.startsWith(`${campaignHost.split(".")[0]}.`),
  );
  return match ? match[0] : null;
}

/** True for any campaign host (Tri, Ruck, ...) — most call sites only need "org vs. some campaign," not which one. */
export function isCampaignHost(host: string | null | undefined): boolean {
  return getCampaignSlug(host) !== null;
}

/** For Server Components (layout, pages) — Edge middleware uses isCampaignHost/getCampaignSlug directly on the request. */
export async function getSiteMode(): Promise<SiteMode> {
  const headerList = await headers();
  return isCampaignHost(headerList.get("host")) ? "campaign" : "org";
}

/** For Server Components that need to know *which* campaign — null on the org host. */
export async function getActiveCampaignSlug(): Promise<CampaignSlug | null> {
  const headerList = await headers();
  return getCampaignSlug(headerList.get("host"));
}
