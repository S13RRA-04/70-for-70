import type { Metadata } from "next";

/**
 * robots.ts already disallows /admin from being crawled, but that only
 * stops crawling — it doesn't stop an already-indexed or externally-linked
 * URL from appearing in search results with the public site's branded
 * title/OG card. This meta-robots noindex covers that gap for every
 * /admin route (including admin/login, a client component that can't
 * export its own metadata) without needing it repeated per page.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout(props: LayoutProps<"/admin">) {
  return props.children;
}
