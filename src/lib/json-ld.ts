import { CAMPAIGN_URL, SITE_URL, SOCIAL_LINKS, STRAVA_PROFILE_URL } from "@/lib/constants";

/**
 * Cody Hitson as a schema.org Person — deliberately without its own
 * "@context" so it can be embedded directly as the `author`/`founder` field
 * of another JSON-LD object (a nested type inherits the parent's context)
 * instead of forcing a second top-level <script> per page. His full bio
 * lives at SITE_URL/about (org domain) regardless of which host a page
 * embedding this is served from. `sameAs` reuses the same real,
 * confirmed-only accounts as SOCIAL_LINKS/STRAVA_PROFILE_URL — never a
 * fabricated profile.
 */
export const FOUNDER_PERSON_JSON_LD = {
  "@type": "Person",
  name: "Cody Hitson",
  url: `${SITE_URL}/about#founders-story`,
  sameAs: [...SOCIAL_LINKS.map((link) => link.url), STRAVA_PROFILE_URL],
};

export interface BreadcrumbItem {
  name: string;
  /** Absolute URL — every call site already has CAMPAIGN_URL/SITE_URL on hand. */
  url: string;
}

/** The campaign home crumb every Tri breadcrumb trail starts from. */
export const CAMPAIGN_HOME_CRUMB: BreadcrumbItem = { name: "Tri For The 22", url: CAMPAIGN_URL };

/** Standard BreadcrumbList — position is 1-based, assigned from array order. */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Every JSON-LD <script> on the site uses this same escape — prevents a "</script>" inside stringified content from breaking out of the tag. */
export function jsonLdScriptProps(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
