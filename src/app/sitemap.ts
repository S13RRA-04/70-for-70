import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/data/posts";
import { SITE_URL, TOTAL_FUNDRAISING_MILES } from "@/lib/constants";

const STATIC_ROUTES = [
  "",
  "/the-mission",
  "/the-race",
  "/fund-a-mile",
  "/partners",
  "/updates",
  "/sponsors",
  "/about",
  "/donate",
  "/contact",
  "/sponsors/request",
  "/privacy",
  "/terms",
  "/live",
  "/press",
  "/merch",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/updates/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : new Date(),
  }));

  const mileEntries: MetadataRoute.Sitemap = Array.from(
    { length: TOTAL_FUNDRAISING_MILES },
    (_, i) => ({
      url: `${SITE_URL}/miles/${i + 1}`,
      lastModified: new Date(),
    }),
  );

  return [...staticEntries, ...postEntries, ...mileEntries];
}
