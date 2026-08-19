import { headers } from "next/headers";

export type SiteMode = "org" | "campaign";

/**
 * Shared by src/middleware.ts (Edge, reads NextRequest directly) and any
 * Server Component that needs to know which domain it's rendering for
 * (reads next/headers instead). Keeping the hostname check in one place
 * avoids the two ever drifting out of sync.
 */
export function isCampaignHost(host: string | null | undefined): boolean {
  if (!host) return false;
  const hostname = host.split(":")[0].toLowerCase();
  return hostname === "tri.forthe22.org" || hostname.startsWith("tri.");
}

/** For Server Components (layout, pages) — Edge middleware uses isCampaignHost directly. */
export async function getSiteMode(): Promise<SiteMode> {
  const headerList = await headers();
  return isCampaignHost(headerList.get("host")) ? "campaign" : "org";
}
