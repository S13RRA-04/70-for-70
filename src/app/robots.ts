import type { MetadataRoute } from "next";
import { CAMPAIGNS, SITE_URL } from "@/lib/constants";
import { getActiveCampaignSlug } from "@/lib/site-mode";

/**
 * Reads the request host (via getActiveCampaignSlug's headers() call) so
 * each domain points crawlers at its own sitemap.xml instead of every host
 * advertising the org (or a sibling campaign's) sitemap — see sitemap.ts,
 * which is split the same way for the same reason.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const campaignSlug = await getActiveCampaignSlug();
  const baseUrl = campaignSlug ? CAMPAIGNS[campaignSlug].url : SITE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
      // Explicit Googlebot entry for the tri.forthe22.org campaign domain,
      // kept separate from the "*" rule above per the campaign team's
      // request — same allow/disallow, but named so it can diverge from
      // the wildcard rule later without touching the org domain's rules.
      ...(campaignSlug === "tri"
        ? [
            {
              userAgent: "Googlebot",
              allow: "/",
              disallow: ["/admin", "/api"],
            },
          ]
        : []),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
