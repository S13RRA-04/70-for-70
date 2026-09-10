import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { isAppHost } from "@/lib/site-mode";

/**
 * Reads the request host (a request-time API — this deliberately opts the
 * route out of Next's default manifest caching, since the response must
 * vary per host) so only app.forthe22.org gets the real installable "For
 * the 22" manifest. Every other domain gets a minimal, non-installable
 * manifest — this is the participant app's manifest, not the marketing
 * site's.
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const headerList = await headers();
  const onAppHost = isAppHost(headerList.get("host"));

  if (!onAppHost) {
    return {
      name: "For The 22",
      short_name: "For The 22",
      start_url: "/",
      display: "browser",
      icons: [],
    };
  }

  return {
    name: "For the 22",
    short_name: "For the 22",
    description: "Move with purpose. Track your progress. Carry the mission.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    theme_color: "#15150f",
    background_color: "#f6f3ea",
    icons: [
      { src: "/app-icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/app-icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/app-icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
