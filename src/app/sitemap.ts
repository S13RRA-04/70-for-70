import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/data/posts";
import { CAMPAIGN_URL, SITE_URL, TOTAL_FUNDRAISING_MILES } from "@/lib/constants";

// Kept in sync with the split enforced in src/middleware.ts.
const ORG_ROUTES = ["", "/about", "/resources", "/join", "/merch", "/contact", "/privacy", "/terms", "/press"];
const CAMPAIGN_ROUTES = [
  "/the-mission",
  "/the-race",
  "/fund-a-mile",
  "/partners",
  "/updates",
  "/sponsors",
  "/donate",
  "/sponsors/request",
  "/live",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  const orgEntries: MetadataRoute.Sitemap = ORG_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const campaignEntries: MetadataRoute.Sitemap = CAMPAIGN_ROUTES.map((path) => ({
    url: `${CAMPAIGN_URL}${path}`,
    lastModified: new Date(),
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${CAMPAIGN_URL}/updates/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : new Date(),
  }));

  const mileEntries: MetadataRoute.Sitemap = Array.from(
    { length: TOTAL_FUNDRAISING_MILES },
    (_, i) => ({
      url: `${CAMPAIGN_URL}/miles/${i + 1}`,
      lastModified: new Date(),
    }),
  );

  return [...orgEntries, ...campaignEntries, ...postEntries, ...mileEntries];
}
