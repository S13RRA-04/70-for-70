import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import {
  CONTACT_EMAIL,
  ORG_SUPPORTING_STATEMENT,
  ORG_TAGLINE,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
} from "@/lib/constants";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CampaignUtilityBar } from "@/components/layout/campaign-utility-bar";
import {
  MobileConversionBar,
  MobileConversionBarSpacer,
} from "@/components/layout/mobile-conversion-bar";
import { getSiteMode } from "@/lib/site-mode";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${ORG_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: ORG_SUPPORTING_STATEMENT,
  openGraph: {
    title: `${SITE_NAME} | ${ORG_TAGLINE}`,
    description: ORG_SUPPORTING_STATEMENT,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${ORG_TAGLINE}`,
    description: ORG_SUPPORTING_STATEMENT,
  },
  alternates: {
    canonical: "/",
  },
};

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
        <CampaignUtilityBar mode={mode} />
        <Header mode={mode} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer mode={mode} />
        <MobileConversionBarSpacer mode={mode} />
        <MobileConversionBar mode={mode} />
      </body>
    </html>
  );
}
