import type { MetadataRoute } from "next";
import { getJournalEntries } from "@/lib/data/journal";
import { getBikeBuildLastUpdated } from "@/lib/content/building-the-bike";
import { getGearJourneyLastUpdated } from "@/lib/content/gear-journey";
import { US_STATES_GRID } from "@/lib/content/us-states";
import { getPublishedLiveEvents } from "@/lib/data/live-events";
import { CAMPAIGN_URL, CAMPAIGNS, SITE_URL } from "@/lib/constants";
import { getActiveCampaignSlug } from "@/lib/site-mode";
import { isCampaignLive, isOrgLive } from "@/lib/launch-gate";

// Kept in sync with the split enforced in src/middleware.ts. /athletes,
// /join, and /athlete-agreement are retired (permanent redirect to the
// campaign's /the-mission, see next.config.ts) — excluded here so search
// engines follow the redirect to its target rather than indexing the
// retired URL. /merch and /how-funds-work moved to the campaign domain
// entirely (as /shop and /financial-transparency) — also excluded, with
// their own permanent redirects.
const ORG_ROUTES = [
  "",
  "/about",
  "/mission",
  "/resources",
  "/veteran-brands",
  "/crisis",
  "/advocacy",
  "/campaigns",
  "/network",
  "/impact",
  "/standards",
  "/transparency",
  "/70k",
  "/contact",
  "/privacy",
  "/terms",
  "/press",
];
// /partners, /campaign-supporters, /partners/inquire, and /sponsors/request
// are retired stubs (redirect to /beneficiaries or /sponsors) — excluded so
// search engines follow the redirect rather than indexing the retired URL.
// /beneficiaries and /sponsors are real, indexed pages (see
// src/app/beneficiaries/page.tsx and src/app/sponsors/page.tsx).
const CAMPAIGN_ROUTES = [
  "",
  "/the-mission",
  "/the-race",
  "/the-story",
  "/beneficiaries",
  "/sponsors",
  "/get-involved",
  "/journal",
  "/donate",
  "/live",
  "/shop",
  "/financial-transparency",
  "/press",
  "/terms",
  "/privacy",
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

  // Ruck For The 22 is a single page (see src/app/ruck-home/page.tsx's doc
  // comment) — nothing to enumerate beyond its own root.
  if (campaignSlug === "ruck") {
    return [{ url: `${CAMPAIGNS.ruck.url}/`, lastModified: new Date() }];
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

  if (campaignSlug === "live") {
    const base = CAMPAIGNS.live.url;
    if (!live) return [{ url: `${base}/`, lastModified: new Date() }];
    const liveEvents = await getPublishedLiveEvents();
    return [
      { url: `${base}/`, lastModified: new Date() },
      { url: `${base}/events`, lastModified: new Date() },
      { url: `${base}/auction`, lastModified: new Date() },
      ...liveEvents.map((event) => ({
        url: `${base}/${event.slug}`,
        lastModified: new Date(event.updated_at),
      })),
    ];
  }

  if (campaignSlug === "tri") {
    if (!live) return [{ url: `${CAMPAIGN_URL}/`, lastModified: new Date() }];
    const entries = await getJournalEntries();

    const campaignEntries: MetadataRoute.Sitemap = CAMPAIGN_ROUTES.map((path) => ({
      url: `${CAMPAIGN_URL}${path}`,
      lastModified: new Date(),
    }));

    const journalEntries: MetadataRoute.Sitemap = entries.map((entry) => ({
      url: `${CAMPAIGN_URL}/journal/${entry.slug}`,
      lastModified: entry.published_at ? new Date(entry.published_at) : new Date(),
    }));

    // Static content-module route, not a journal_entries row — see
    // src/app/journal/building-the-bike/page.tsx's doc comment. Its
    // lastModified tracks the newest BIKE_BUILD_TIMELINE entry rather than
    // the CAMPAIGN_ROUTES blanket "now" below.
    const bikeBuildEntry: MetadataRoute.Sitemap = [
      {
        url: `${CAMPAIGN_URL}/journal/building-the-bike`,
        lastModified: new Date(getBikeBuildLastUpdated()),
      },
    ];

    // Same reasoning as bikeBuildEntry above — see
    // src/app/journal/gear-journey/page.tsx's doc comment.
    const gearJourneyEntry: MetadataRoute.Sitemap = [
      {
        url: `${CAMPAIGN_URL}/journal/gear-journey`,
        lastModified: new Date(getGearJourneyLastUpdated()),
      },
    ];

    return [...campaignEntries, ...journalEntries, ...bikeBuildEntry, ...gearJourneyEntry];
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

  return [...orgEntries, ...stateEntries];
}
