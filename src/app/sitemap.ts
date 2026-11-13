import type { MetadataRoute } from "next";
import { US_STATES_GRID } from "@/lib/content/us-states";
import { slugifyResourceName } from "@/lib/content/resources";
import { getResources } from "@/lib/data/resources";
import { getPublishedLiveEvents } from "@/lib/data/live-events";
import { LIVE_PREMIERES } from "@/lib/content/live-premieres";
import { HAS_LISTED_AUCTION_ITEMS } from "@/lib/content/live-auction";
import { COMPLETED_RUCK_MISSIONS } from "@/lib/content/ruck-missions";
import { SITE_URL, TRI_PAGE_PATH } from "@/lib/constants";
import { isOrgLive } from "@/lib/launch-gate";

const ORG_ROUTES = [
  "", "/about", "/mission", "/resources", "/veteran-brands", "/crisis",
  "/campaigns", TRI_PAGE_PATH, "/campaigns/ruck", "/campaigns/live",
  "/campaigns/live/events", "/campaigns/seen", "/campaigns/22-for-the-22",
  "/campaigns/22-for-the-22/promokit", "/campaigns/22-for-the-22/rules",
  "/network", "/impact", "/standards", "/transparency", "/70k", "/donate",
  "/contact", "/privacy", "/terms", "/press",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isOrgLive()) return [{ url: `${SITE_URL}/`, lastModified: new Date() }];

  const orgEntries: MetadataRoute.Sitemap = ORG_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));
  const stateEntries: MetadataRoute.Sitemap = US_STATES_GRID.map((state) => ({
    url: `${SITE_URL}/resources/${state.code.toLowerCase()}`,
    lastModified: new Date(),
  }));
  const resources = await getResources();
  const resourceEntries: MetadataRoute.Sitemap = resources.map((resource) => ({
    url: `${SITE_URL}/resources/${slugifyResourceName(resource.name)}`,
    lastModified: resource.verifiedDate ? new Date(resource.verifiedDate) : new Date(),
  }));
  const liveEvents = await getPublishedLiveEvents();
  const campaignEntries: MetadataRoute.Sitemap = [
    ...COMPLETED_RUCK_MISSIONS.map((mission) => ({
      url: `${SITE_URL}/campaigns/ruck/missions/${mission.slug}`,
      lastModified: new Date(mission.date),
    })),
    ...(HAS_LISTED_AUCTION_ITEMS ? [{ url: `${SITE_URL}/campaigns/live/auction`, lastModified: new Date() }] : []),
    ...LIVE_PREMIERES.map((premiere) => ({ url: `${SITE_URL}/campaigns/live/${premiere.slug}`, lastModified: new Date() })),
    ...liveEvents.map((event) => ({
      url: `${SITE_URL}/campaigns/live/${event.slug}`,
      lastModified: new Date(event.updated_at),
    })),
  ];

  return [...orgEntries, ...campaignEntries, ...stateEntries, ...resourceEntries];
}
