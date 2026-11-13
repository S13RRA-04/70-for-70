import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * A static PNG (public/og-org.png), not a runtime `next/og` ImageResponse
 * — static cards are the only content this route ever rendered (see git history), and `next/og`'s @vercel/og
 * dependency (resvg.wasm + yoga.wasm + the edge/node renderer JS) added
 * roughly 2 MiB to every deploy's Worker bundle just to draw two static
 * cards, which pushed the whole Worker over Cloudflare's free-plan 3 MiB
 * size limit. Regenerate the PNGs with a one-off ImageResponse script
 * (reusing this same layout) if the branding ever changes.
 *
 * The org-wide default card. Pages with their own card (Live's
 * public/og-live.png, the campaign pages' og-campaign.png) set it through
 * pageMetadata's `image`.
 */
export default async function OpengraphImage() {
  const headerList = await headers();
  const origin = `https://${headerList.get("host")}`;
  return NextResponse.redirect(new URL("/og-org.png", origin));
}
