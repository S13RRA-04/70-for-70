import { ImageResponse } from "next/og";
import { CAMPAIGN_NAME, ORG_TAGLINE, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { OG_LOGO_DATA_URI } from "@/lib/assets/og-logo";
import { getSiteMode } from "@/lib/site-mode";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The logo is a bundled base64 constant (see og-logo.ts), not read via
 * `node:fs` or `fetch` at request time — both are unreliable for bundled
 * `public/` files on Cloudflare Workers (no real on-disk fs, and fetching
 * the app's own origin doesn't work during static build-time generation).
 *
 * There's one shared opengraph-image route for the whole app (no
 * campaign-specific override exists), so it has to brand itself per
 * request via getSiteMode() — otherwise every forthe22.org link's share
 * card would show Tri For The 22's campaign branding, which is exactly
 * the bug this file used to have (hardcoded CAMPAIGN_NAME/SITE_TAGLINE
 * regardless of which domain the link pointed at).
 */
export default async function OpengraphImage() {
  const mode = await getSiteMode();
  const isCampaign = mode === "campaign";
  const title = isCampaign ? CAMPAIGN_NAME : SITE_NAME;
  const tagline = isCampaign ? SITE_TAGLINE : ORG_TAGLINE;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 64,
          background: "linear-gradient(135deg, #15150f 0%, #232620 55%, #313823 100%)",
          color: "#f6f3ea",
          fontFamily: "Arial, sans-serif",
          padding: 80,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={OG_LOGO_DATA_URI} width={340} height={340} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: -2,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 32,
              color: "#d8cdac",
              display: "flex",
            }}
          >
            {tagline}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
