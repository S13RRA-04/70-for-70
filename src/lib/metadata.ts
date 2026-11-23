import type { Metadata } from "next";

/**
 * Every page.tsx across the site sets its own title/description/canonical,
 * but Next.js merges `openGraph` and `twitter` shallowly PER TOP-LEVEL KEY
 * (see Metadata API's "Merging" docs) — a page that sets its own
 * `openGraph`/`twitter` object REPLACES the root layout's whole object,
 * not just the fields it names. Without this, every page's social share
 * (Facebook/LinkedIn/iMessage/Slack preview, Twitter/X card) showed the
 * generic site-wide title/description instead of the page's own, regardless
 * of what that page's <title> actually said. Route every page's metadata
 * through this so title/description stay in sync across all three (plain
 * metadata, openGraph, twitter) instead of just the first — and so `url`,
 * `type`, and the Twitter `card` type (set once on the root layout) don't
 * silently vanish on every page that overrides openGraph/twitter, which is
 * every page that uses this helper.
 */
/**
 * The org-wide share card (also served via src/app/opengraph-image.tsx).
 * Next attaches a file-based opengraph-image only while no page sets its own
 * `openGraph` object, and every page using this helper does, so without an
 * explicit default nearly every page shared with no preview image.
 */
const DEFAULT_SHARE_IMAGE = { url: "/og-org.png", width: 1200, height: 630, alt: "For The 22" };

const BRAND = "For The 22";
/** Search results show roughly 60 characters of a title before cutting it off. */
const TITLE_BUDGET = 60;
/** …and roughly 155–160 characters of a description. */
const DESCRIPTION_BUDGET = 160;

/**
 * Whole sentences up to the budget, else the first sentence cut on a word
 * boundary. Search engines truncate anything longer mid-word.
 */
export function clampDescription(description: string, budget = DESCRIPTION_BUDGET): string {
  const text = description.replace(/\s+/g, " ").trim();
  if (text.length <= budget) return text;
  const sentences = text.match(/[^.!?]+[.!?]+(?=\s|$)/g) ?? [];
  let out = "";
  for (const sentence of sentences) {
    const next = `${out} ${sentence.trim()}`.trim();
    if (next.length > budget) break;
    out = next;
  }
  // Too thin after cutting (e.g. only a short fragment fit): prefer a word-boundary cut.
  if (out.length >= 70) return out;
  return `${text.slice(0, budget - 1).replace(/\s+\S*$/, "").replace(/[,;:—–-]$/, "")}…`;
}

/**
 * The root layout's "%s | For The 22" suffix is skipped when the title
 * already names the brand ("Voices For The 22 — …", "22 For the 22 …") or
 * when the suffix would push it past what search results display.
 */
function shouldSkipSuffix(title: string): boolean {
  return /for the 22/i.test(title) || title.length + ` | ${BRAND}`.length > TITLE_BUDGET;
}

export function pageMetadata({
  title,
  description,
  canonical,
  image,
  type = "website",
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  canonical: string;
  /** Absolute or root-relative social share image — set when a page has its own (e.g. a journal entry's hero image). Defaults to the org card. */
  image?: string;
  /** og:type — "article" for journal/blog-style entries, "website" (default) for everything else. */
  type?: "website" | "article";
  /** Skip the root layout's "%s | For The 22" template — for a title that already carries its own suffix. */
  absoluteTitle?: boolean;
}): Metadata {
  const metaDescription = clampDescription(description);
  const shareImage = image ? { url: image } : DEFAULT_SHARE_IMAGE;
  return {
    title: absoluteTitle || shouldSkipSuffix(title) ? { absolute: title } : title,
    description: metaDescription,
    openGraph: {
      title,
      description: metaDescription,
      url: canonical,
      siteName: BRAND,
      locale: "en_US",
      type,
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDescription,
      images: [shareImage.url],
    },
    alternates: { canonical },
  };
}
