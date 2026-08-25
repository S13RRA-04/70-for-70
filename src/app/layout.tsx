import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import {
  CAMPAIGN_NAME,
  CAMPAIGN_URL,
  CONTACT_EMAIL,
  ORG_SUPPORTING_STATEMENT,
  ORG_TAGLINE,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  SOCIAL_LINKS,
} from "@/lib/constants";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AwarenessBanner } from "@/components/layout/awareness-banner";
import {
  MobileConversionBar,
  MobileConversionBarSpacer,
} from "@/components/layout/mobile-conversion-bar";
import { getSiteMode } from "@/lib/site-mode";
import { isSuicidePreventionMonth } from "@/lib/awareness-month";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

/**
 * Mode-aware — a static `export const metadata` can't read the request
 * host, so campaign-domain pages inherited the org's forthe22.org
 * metadataBase, which resolved every campaign page's root-relative
 * canonical (set via pageMetadata()) against the wrong domain. See
 * README's "Movement/Campaign Domain Split".
 */
export async function generateMetadata(): Promise<Metadata> {
  const mode = await getSiteMode();
  const isCampaign = mode === "campaign";
  const baseUrl = isCampaign ? CAMPAIGN_URL : SITE_URL;
  const name = isCampaign ? CAMPAIGN_NAME : SITE_NAME;
  const tagline = isCampaign ? SITE_TAGLINE : ORG_TAGLINE;
  const description = isCampaign ? `${CAMPAIGN_NAME} — ${SITE_TAGLINE}` : ORG_SUPPORTING_STATEMENT;

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
  ...(SOCIAL_LINKS.length > 0 && { sameAs: SOCIAL_LINKS.map((link) => link.url) }),
  ...(CONTACT_EMAIL && {
    contactPoint: {
      "@type": "ContactPoint",
      email: CONTACT_EMAIL,
      contactType: "customer service",
    },
  }),
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const mode = await getSiteMode();
  const awarenessMonth = isSuicidePreventionMonth();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${oswald.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-off-white text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_JSON_LD).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-off-white"
        >
          Skip to content
        </a>
        <AwarenessBanner />
        <Header mode={mode} awarenessMonth={awarenessMonth} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer mode={mode} awarenessMonth={awarenessMonth} />
        <MobileConversionBarSpacer mode={mode} />
        <MobileConversionBar mode={mode} />
      </body>
    </html>
  );
}
