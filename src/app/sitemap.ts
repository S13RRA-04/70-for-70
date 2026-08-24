import type { MetadataRoute } from "next";
import { getJournalEntries } from "@/lib/data/journal";
import { US_STATES_GRID } from "@/lib/content/us-states";
import { CAMPAIGN_URL, SITE_URL, TOTAL_FUNDRAISING_MILES } from "@/lib/constants";
import { getSiteMode } from "@/lib/site-mode";

// Kept in sync with the split enforced in src/middleware.ts. /athletes,
// /join, and /athlete-agreement are retired (redirect to /mission) —
// excluded here so search engines follow the redirect to its target rather
// than indexing the retired URL. /merch stays listed — it's the live
// Bonfire store page, not retired.
const ORG_ROUTES = [
  "",
  "/about",
  "/resources",
  "/crisis",
  "/advocacy",
  "/merch",
  "/contact",
  "/privacy",
  "/terms",
  "/press",
  "/how-funds-work",
];
// /partners, /partners/inquire, /sponsors, and /sponsors/request are
// retired (redirect to /beneficiaries) — excluded for the same reason.
const CAMPAIGN_ROUTES = [
  "",
  "/the-mission",
  "/the-race",
  "/fund-a-mile",
  "/beneficiaries",
  "/journal",
  "/campaign-supporters",
  "/donate",
  "/live",
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
  const mode = await getSiteMode();

  if (mode === "campaign") {
    const entries = await getJournalEntries();

    const campaignEntries: MetadataRoute.Sitemap = CAMPAIGN_ROUTES.map((path) => ({
      url: `${CAMPAIGN_URL}${path}`,
      lastModified: new Date(),
    }));

    const journalEntries: MetadataRoute.Sitemap = entries.map((entry) => ({
      url: `${CAMPAIGN_URL}/journal/${entry.slug}`,
      lastModified: entry.published_at ? new Date(entry.published_at) : new Date(),
    }));

    const mileEntries: MetadataRoute.Sitemap = Array.from(
      { length: TOTAL_FUNDRAISING_MILES },
      (_, i) => ({
        url: `${CAMPAIGN_URL}/miles/${i + 1}`,
        lastModified: new Date(),
      }),
    );

    return [...campaignEntries, ...journalEntries, ...mileEntries];
  }

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
