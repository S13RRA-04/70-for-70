import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getActiveCampaignSlug, getSiteMode } from "@/lib/site-mode";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Static PNGs (public/og-org.png, public/og-campaign.png), not a runtime
 * `next/og` ImageResponse — the two variants below are the only content
 * that route ever rendered (see git history), and `next/og`'s @vercel/og
 * dependency (resvg.wasm + yoga.wasm + the edge/node renderer JS) added
 * roughly 2 MiB to every deploy's Worker bundle just to draw two static
 * cards, which pushed the whole Worker over Cloudflare's free-plan 3 MiB
 * size limit. Regenerate the PNGs with a one-off ImageResponse script
 * (reusing this same layout) if the branding ever changes.
 *
 * There's one shared opengraph-image route for the whole app (no
 * campaign-specific override exists), so it has to brand itself per
 * request via getSiteMode() — otherwise every forthe22.org link's share
 * card would show Tri For The 22's campaign branding, which is exactly
 * the bug this file used to have (hardcoded CAMPAIGN_NAME/SITE_TAGLINE
 * regardless of which domain the link pointed at).
 *
 * live.forthe22.org has its own card (public/og-live.png — the Live v3
 * wordmark on paper; regenerate from public/brand/live/* if it changes).
 * The other campaign hosts still share og-campaign.png.
 */
export default async function OpengraphImage() {
  const mode = await getSiteMode();
  const isCampaign = mode === "campaign";
  const campaignSlug = isCampaign ? await getActiveCampaignSlug() : null;
  const headerList = await headers();
  const origin = `https://${headerList.get("host")}`;
  const image = campaignSlug === "live" ? "/og-live.png" : isCampaign ? "/og-campaign.png" : "/og-org.png";
  return NextResponse.redirect(new URL(image, origin));
}
