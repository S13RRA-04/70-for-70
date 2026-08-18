import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/data/posts";
import { SITE_URL } from "@/lib/constants";

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

  return [...staticEntries, ...postEntries];
}
