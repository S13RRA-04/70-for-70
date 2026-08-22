import type { MetadataRoute } from "next";
import { CAMPAIGN_URL, SITE_URL } from "@/lib/constants";
import { getSiteMode } from "@/lib/site-mode";

/**
 * Reads the request host (via getSiteMode's headers() call) so each domain
 * points crawlers at its own sitemap.xml instead of forthe22.org/robots.txt
 * and tri.forthe22.org/robots.txt both advertising the org sitemap — see
 * sitemap.ts, which is split the same way for the same reason.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const mode = await getSiteMode();
  const baseUrl = mode === "campaign" ? CAMPAIGN_URL : SITE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
