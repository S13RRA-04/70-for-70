import type { MetadataRoute } from "next";
import { US_STATES_GRID } from "@/lib/content/us-states";
import { slugifyResourceName } from "@/lib/content/resources";
import { getResources } from "@/lib/data/resources";
import { getPublishedLiveEvents } from "@/lib/data/live-events";
import { LIVE_PREMIERES } from "@/lib/content/live-premieres";
import { HAS_LISTED_AUCTION_ITEMS } from "@/lib/content/live-auction";
import { COMPLETED_RUCK_MISSIONS } from "@/lib/content/ruck-missions";
import { CAMPAIGNS, SITE_URL, TRI_PAGE_PATH } from "@/lib/constants";
import { getActiveCampaignSlug } from "@/lib/site-mode";
import { isCampaignLive, isOrgLive } from "@/lib/launch-gate";

// Kept in sync with the split enforced in src/middleware.ts. Retired paths
// (the old Tri site, /athletes, /join, /merch, ...) are excluded so search
// engines follow their permanent redirects rather than indexing them.
const ORG_ROUTES = [
  "",
  "/about",
  "/mission",
  "/resources",
  "/veteran-brands",
  "/crisis",
  "/campaigns",
  TRI_PAGE_PATH,
  "/network",
  "/impact",
  "/standards",
  "/transparency",
  "/70k",
  "/donate",
  "/contact",
  "/privacy",
  "/terms",
  "/press",
];
/**
 * Split per requesting host (via getSiteMode's headers() call) rather than
 * one combined file listing both domains' URLs — Search Console treats
 * sitemap entries for a host other than the one serving the sitemap as
 * invalid, so a single shared sitemap.xml had every campaign-domain URL
 * effectively ignored when fetched from forthe22.org, and vice versa. See
 * robots.ts, split the same way so each domain's Sitemap: line points back
 * at its own file.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const campaignSlug = await getActiveCampaignSlug();

  // While a domain's launch gate is closed, middleware rewrites every path on
  // it to /coming-soon content (200, not a redirect) — so listing the real
  // route set here would get search engines indexing many URLs that all show
  // identical placeholder copy. Fall back to just the root until launch;
  // sitemap.xml itself stays ungated per AGENTS.md, only what it lists here
  // changes. isCampaignLive() covers tri/ruck/22/live alike, matching the
  // same `onCampaignHost ? isCampaignLive() : isOrgLive()` check middleware
  // uses to decide whether to show real content at all.
  const live = campaignSlug ? isCampaignLive() : isOrgLive();

  // Ruck For The 22 is its home plus one page per completed mission (see
  // src/app/ruck-home/page.tsx's doc comment).
  if (campaignSlug === "ruck") {
    const base = CAMPAIGNS.ruck.url;
    if (!live) return [{ url: `${base}/`, lastModified: new Date() }];
    return [
      { url: `${base}/`, lastModified: new Date() },
      ...COMPLETED_RUCK_MISSIONS.map((mission) => ({
        url: `${base}/missions/${mission.slug}`,
        lastModified: new Date(mission.date),
      })),
    ];
  }

  // 22 For the 22 has exactly 3 real pages — see EVENT22_PATH_REWRITES in
  // src/middleware.ts.
  if (campaignSlug === "22") {
    const base = CAMPAIGNS["22"].url;
    if (!live) return [{ url: `${base}/`, lastModified: new Date() }];
    return [
      { url: `${base}/`, lastModified: new Date() },
      { url: `${base}/promokit`, lastModified: new Date() },
      { url: `${base}/rules`, lastModified: new Date() },
    ];
  }

  // For The 22: SEEN is one page so far — see applySeenGuard in src/middleware.ts.
  if (campaignSlug === "seen") {
    return [{ url: `${CAMPAIGNS.seen.url}/`, lastModified: new Date() }];
  }

  if (campaignSlug === "live") {
    const base = CAMPAIGNS.live.url;
    if (!live) return [{ url: `${base}/`, lastModified: new Date() }];
    const liveEvents = await getPublishedLiveEvents();
    return [
      { url: `${base}/`, lastModified: new Date() },
      { url: `${base}/events`, lastModified: new Date() },
      ...(HAS_LISTED_AUCTION_ITEMS ? [{ url: `${base}/auction`, lastModified: new Date() }] : []),
      ...LIVE_PREMIERES.map((premiere) => ({ url: `${base}/${premiere.slug}`, lastModified: new Date() })),
      ...liveEvents.map((event) => ({
        url: `${base}/${event.slug}`,
        lastModified: new Date(event.updated_at),
      })),
    ];
  }

  if (!live) return [{ url: `${SITE_URL}/`, lastModified: new Date() }];

  const orgEntries: MetadataRoute.Sitemap = ORG_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const stateEntries: MetadataRoute.Sitemap = US_STATES_GRID.map((s) => ({
    url: `${SITE_URL}/resources/${s.code.toLowerCase()}`,
    lastModified: new Date(),
  }));

  const resources = await getResources();
  const resourceEntries: MetadataRoute.Sitemap = resources.map((resource) => ({
    url: `${SITE_URL}/resources/${slugifyResourceName(resource.name)}`,
    lastModified: resource.verifiedDate ? new Date(resource.verifiedDate) : new Date(),
  }));

  return [...orgEntries, ...stateEntries, ...resourceEntries];
}
