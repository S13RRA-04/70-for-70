import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter, Oswald } from "next/font/google";
import {
  CAMPAIGNS,
  CONTACT_EMAIL,
  ORG_SUPPORTING_STATEMENT,
  ORG_TAGLINE,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
} from "@/lib/constants";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AwarenessBanner } from "@/components/layout/awareness-banner";
import { EventAnnouncementBanner } from "@/components/layout/event-announcement-banner";
import { MissionRelationshipBanner } from "@/components/layout/mission-relationship-banner";
import {
  MobileConversionBar,
  MobileConversionBarSpacer,
} from "@/components/layout/mobile-conversion-bar";
import { AnalyticsEventListener } from "@/components/shared/analytics-event-listener";
import { getSiteMode, getActiveCampaignSlug } from "@/lib/site-mode";
import { isSuicidePreventionMonth } from "@/lib/awareness-month";
import { FOUNDER_PERSON_JSON_LD, jsonLdScriptProps } from "@/lib/json-ld";
import "./globals.css";

/**
 * `display: "swap"` explicitly, rather than relying on next/font's own
 * default — renders text in a fallback font immediately and swaps to the
 * real one once it loads, instead of risking invisible text while the
 * display font is pending (FOIT). The brief flash of a fallback font is a
 * better trade than a blank headline on a slow connection.
 */
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Impact.com publisher/affiliate-partnership domain-ownership proof — tri.forthe22.org only, see generateMetadata below. */
const IMPACT_SITE_VERIFICATION_ID = "e5ccd9f5-f773-4c29-b6ce-4e1fb9b6b356";

/**
 * Mode-aware — a static `export const metadata` can't read the request
 * host, so campaign-domain pages inherited the org's forthe22.org
 * metadataBase, which resolved every campaign page's root-relative
 * canonical (set via pageMetadata()) against the wrong domain. See
 * README's "Movement/Campaign Domain Split".
 */
export async function generateMetadata(): Promise<Metadata> {
  const campaignSlug = await getActiveCampaignSlug();
  const campaign = campaignSlug ? CAMPAIGNS[campaignSlug] : null;
  const baseUrl = campaign?.url ?? SITE_URL;
  const name = campaign?.name ?? SITE_NAME;
  const tagline = campaign?.tagline ?? ORG_TAGLINE;
  const description = campaign?.description ?? ORG_SUPPORTING_STATEMENT;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${name} | ${tagline}`,
      template: `%s | ${name}`,
    },
    description,
    openGraph: {
      title: `${name} | ${tagline}`,
      description,
      url: baseUrl,
      siteName: name,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | ${tagline}`,
      description,
    },
    alternates: {
      canonical: "/",
    },
    ...(campaignSlug === "tri" && {
      verification: { other: { "impact-site-verification": IMPACT_SITE_VERIFICATION_ID } },
    }),
  };
}

/**
 * Describes For The 22 itself, not the current campaign — Tri For The 22
 * is a campaign under this org, not a separate legal entity, so it isn't
 * given its own Organization record (and no @type: NonprofitOrganization,
 * EIN, or taxID here — that status has only ever been confirmed and
 * asserted for the beneficiary orgs, see PartnerRow's nonprofit_status_verified,
 * never for For The 22 itself). Shown on every route, both domains — the
 * organization behind the page doesn't change with the host.
 */
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: ORG_SUPPORTING_STATEMENT,
  logo: `${SITE_URL}/logo.png`,
  founder: FOUNDER_PERSON_JSON_LD,
  ...(SOCIAL_LINKS.length > 0 && { sameAs: SOCIAL_LINKS.map((link) => link.url) }),
  ...(CONTACT_EMAIL && {
    contactPoint: {
      "@type": "ContactPoint",
      email: CONTACT_EMAIL,
      contactType: "customer service",
    },
  }),
};

/**
 * The org's WebSite record, paired with ORGANIZATION_JSON_LD on every route
 * (credibility plan §25). Distinct from campaign-home's own WebSite JSON-LD,
 * which identifies tri.forthe22.org as a separate site — both can coexist in
 * search results. `publisher` ties it back to the org without re-declaring
 * the full Organization object inline.
 */
const ORG_WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const mode = await getSiteMode();
  const campaignSlug = await getActiveCampaignSlug();
  const awarenessMonth = isSuicidePreventionMonth();
  // Set by src/middleware.ts alongside the CSP header itself — required on
  // the inline Plausible bootstrap script below, which has no `src` to
  // allowlist by host the way the external script tag is.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="en"
      data-property={mode === "app" ? "app" : (campaignSlug ?? "org")}
      data-scroll-behavior="smooth"
      className={`${oswald.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-off-white text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(ORGANIZATION_JSON_LD)} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(ORG_WEBSITE_JSON_LD)} />
        {process.env.NODE_ENV === "production" && (
          <>
            {/* Exact snippet from the Plausible dashboard for this site — the
                tagged script URL encodes which registered site this reports
                to, replacing the older generic script.js + data-domain
                pattern. Don't regenerate this from Plausible's general docs;
                if it ever needs to change, re-copy it from the dashboard.
                Plain native <script> tags (matching the JSON-LD scripts just
                above), not next/script's <Script> component: even with
                strategy="beforeInteractive", next/script in the App Router
                injects via a client-side bootstrap queue (`__next_s`), so it
                never appears as a literal <script> in the server-rendered
                HTML — which is what Plausible's own "detect installation"
                check (and the dashboard's "paste in <head>" instruction)
                looks for. No nonce needed on the external-src tag (its host
                is allowlisted in middleware.ts's CSP, same as Turnstile's
                script); the inline bootstrap below has no `src` to allowlist
                by host, so it needs the per-request nonce instead. */}
            <script src="https://plausible.io/js/pa-puXStW8Vosfd1RxpgqxlI.js" async />
            <script
              nonce={nonce}
              dangerouslySetInnerHTML={{
                __html:
                  "window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()",
              }}
            />
          </>
        )}
        <AnalyticsEventListener />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-off-white"
        >
          Skip to content
        </a>
        {mode === "app" ? (
          // app.forthe22.org is a different product surface (authenticated
          // participant app) — none of the marketing chrome below applies.
          // Its own nested layout (src/app/app/layout.tsx) provides bottom
          // navigation and everything else, inside this same <body>.
          <main id="main-content" className="flex min-h-full flex-1 flex-col">
            {children}
          </main>
        ) : (
          <>
            <AwarenessBanner />
            {campaignSlug === "tri" && <MissionRelationshipBanner />}
            <EventAnnouncementBanner campaignSlug={campaignSlug} />
            <Header mode={mode} campaignSlug={campaignSlug} awarenessMonth={awarenessMonth} />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer mode={mode} campaignSlug={campaignSlug} awarenessMonth={awarenessMonth} />
            <MobileConversionBarSpacer mode={mode} campaignSlug={campaignSlug} />
            <MobileConversionBar mode={mode} campaignSlug={campaignSlug} />
          </>
        )}
      </body>
    </html>
  );
}
