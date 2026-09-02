import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ShoppingBag } from "lucide-react";
import { getCampaign } from "@/lib/data/campaign";
import { getAllocationBreakdown } from "@/lib/data/allocation";
import { getPartners } from "@/lib/data/partners";
import { findAboutSubsection } from "@/lib/content/about";
import { CampaignProgress } from "@/components/campaign/campaign-progress";
import { MerchTicker } from "@/components/campaign/merch-ticker";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { Countdown } from "@/components/shared/countdown";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  CAMPAIGN_NAME,
  CAMPAIGN_URL,
  CURRENT_CAMPAIGN,
  DONATE_LINK,
  MERCH_STORE_URL,
  RACE_INFO,
  RACE_TOTAL_DISTANCE,
  SHOP_CATEGORIES,
} from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { pageMetadata } from "@/lib/metadata";

const HERO_EXPLAINER = `One athlete's ${RACE_TOTAL_DISTANCE}-mile race, paired with a ${formatCurrency(70_000)} fundraising goal for veterans.`;

/**
 * Brand-first, bypassing the root layout's "%s | {CAMPAIGN_NAME}" title
 * template (see generateMetadata in src/app/layout.tsx) via title.absolute —
 * the homepage is the one place branded searches ("Tri For The 22") should
 * see the campaign name lead the title, unlike every other page where it
 * trails as the site identifier.
 */
const HOMEPAGE_TITLE = `${CAMPAIGN_NAME} | Veteran & First Responder Triathlon Campaign`;
const HOMEPAGE_DESCRIPTION =
  "Tri For The 22 follows Cody Hitson's road to IRONMAN 70.3 Chattanooga while raising awareness and support for veterans and first responders.";

export const metadata: Metadata = {
  ...pageMetadata({
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    canonical: `${CAMPAIGN_URL}/`,
  }),
  title: { absolute: HOMEPAGE_TITLE },
};

/** Identifies the campaign itself to search engines as a distinct WebSite, separate from the ORGANIZATION_JSON_LD (For The 22 the org) rendered on every route in the root layout. */
const CAMPAIGN_WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: CAMPAIGN_NAME,
  url: CAMPAIGN_URL,
  description: HOMEPAGE_DESCRIPTION,
};

/** First sentence of a longer description, for compact summary cards — falls back to the whole string if there's no sentence break. */
function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](?=\s|$)/);
  return match ? match[0] : text;
}

/**
 * The campaign homepage — rendered at "/" on tri.forthe22.org via a
 * transparent middleware rewrite (see src/middleware.ts). The movement
 * homepage at src/app/page.tsx renders at "/" on forthe22.org instead.
 *
 * Five sections, per AGENTS.md's Homepage spec: (1) responsive HTML hero,
 * (2) "Why 22" (the veteran suicide-awareness meaning behind the number),
 * (3) campaign concept, (4) beneficiary summary, (5) shop teaser linking out
 * to the merch store. Follow-along content (training/journal status) lives
 * on /journal, and the donate/share/newsletter block lives on /get-involved
 * — this page only previews and links to them.
 *
 * MerchTicker above the hero is a scrolling promo strip pointing at the same
 * Bonfire store as section 5's teaser — not a sixth content section, just an
 * attention-grabbing pointer to the real pitch further down.
 */
export default async function CampaignHomePage() {
  const [campaign, partners] = await Promise.all([getCampaign(), getPartners()]);
  const allocationBreakdown = await getAllocationBreakdown(campaign);
  const why22 = findAboutSubsection("why-22");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(CAMPAIGN_WEBSITE_JSON_LD).replace(/</g, "\\u003c"),
        }}
      />
      <MerchTicker />

      {/* 1. Hero — real HTML facts (not baked into the banner image), plus the countdown and both primary CTAs. */}
      <section className="relative overflow-hidden bg-ink text-off-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url(/tri-for-the-22-banner.png)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/60" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.08]"
          style={{ backgroundImage: "url(/topo-map.png)" }}
          aria-hidden="true"
        />

        <Container className="relative py-16 sm:py-24">
          <h1 className="text-balance font-display text-[clamp(2.25rem,7vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-tight">
            {CAMPAIGN_NAME}
          </h1>

          <p className="mt-4 text-lg font-semibold uppercase tracking-wide text-bronze-light sm:text-xl">
            {CURRENT_CAMPAIGN.event} &middot; May 16, 2027 &middot; {RACE_INFO.raceLocation}
          </p>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-off-white/80">{HERO_EXPLAINER}</p>

          <div className="mt-8 max-w-sm">
            <CampaignProgress
              totalRaised={campaign.amount_raised}
              goal={campaign.fundraising_goal}
              showStats={false}
              tone="dark"
              breakdown={allocationBreakdown}
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href={DONATE_LINK.href}
              data-analytics-event="donate_click"
              className="rounded-sm bg-bronze px-8 py-4 text-base font-semibold uppercase tracking-wide text-off-white shadow-sm transition-colors hover:bg-bronze-light"
            >
              {DONATE_LINK.label}
            </Link>
          </div>

          {RACE_INFO.raceDate && (
            <div className="mt-10 max-w-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-off-white/60">
                Race Day Countdown
              </p>
              <Countdown targetIso={RACE_INFO.raceDate} />
            </div>
          )}
        </Container>
      </section>

      {/* 2. Why 22 — the veteran suicide-awareness meaning behind the number, for a visitor arriving on the campaign subdomain with no prior context. */}
      {why22 && (
        <section className="border-b border-ink/10 bg-ink py-16 text-off-white sm:py-20">
          <Container className="max-w-2xl">
            <span
              aria-hidden="true"
              className="font-display text-6xl font-bold leading-none text-bronze-light sm:text-7xl"
            >
              22
            </span>
            <div className="mt-6 space-y-4">
              {why22.body.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-off-white/75">
                  {paragraph}
                </p>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 3. Campaign concept — trimmed "why 70 miles", not the full mission page. */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="The Concept" title={`Why ${RACE_TOTAL_DISTANCE} Miles?`} />
          <p className="mt-5 text-base leading-relaxed text-charcoal-light">
            {CAMPAIGN_NAME} pairs a {RACE_TOTAL_DISTANCE}-mile {CURRENT_CAMPAIGN.event} with a{" "}
            {formatCurrency(70_000)} fundraising goal, going to {CURRENT_CAMPAIGN.beneficiaries.join(" and ")}.
          </p>
          <Link
            href="/the-mission"
            className="mt-5 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
          >
            Read the Full Campaign Story &rarr;
          </Link>
        </Container>
      </section>

      {/* 4. Beneficiary summary — compact cards, full bios live on /beneficiaries. */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Who It Supports"
            title="Beneficiary Organizations"
            description={`${CAMPAIGN_NAME} raises funds in support of veteran-focused nonprofit organizations.`}
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {partners.map((partner) => (
              <div key={partner.id} className="flex flex-col rounded-sm border border-ink/10 bg-off-white p-6">
                <PartnerLogo
                  name={partner.name}
                  logoUrl={partner.logo_url}
                  logoLightUrl={partner.logo_light_url}
                  logoDarkUrl={partner.logo_dark_url}
                  background={partner.logo_background}
                  className="h-14 w-fit"
                />
                <p className="mt-4 text-sm leading-relaxed text-charcoal-light">
                  {firstSentence(partner.description)}
                </p>
                <Link
                  href="/beneficiaries"
                  className="mt-4 inline-flex w-fit text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
                >
                  Learn More &rarr;
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Shop teaser — category-level snippet (no per-item catalog exists locally; Bonfire is fully external), linking out to the full store. */}
      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Shop"
            title="Wear The Mission"
            description="Merch is sold through Bonfire — 100% of net profit goes directly to veteran-focused nonprofit organizations."
          />

          <div className="mt-8 grid grid-cols-2 gap-4 sm:max-w-xl">
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-ink/10">
              <Image
                src="/shop/merch-shirt-front.jpg"
                alt="Cody wearing the For The 22 campaign tee"
                fill
                className="object-cover"
                sizes="(min-width: 640px) 300px, 50vw"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-ink/10">
              <Image
                src="/shop/merch-shirt-back.jpg"
                alt="Back of the tee, reading 'Because 22 does not equal 0' above a QR code linking to the campaign"
                fill
                className="object-cover"
                sizes="(min-width: 640px) 300px, 50vw"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {SHOP_CATEGORIES.map((category) => (
              <a
                key={category.label}
                href={MERCH_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-sm border border-ink/10 bg-off-white p-6 transition-colors hover:border-bronze"
              >
                <ShoppingBag size={22} strokeWidth={1.5} className="text-bronze" aria-hidden="true" />
                <p className="mt-4 font-display text-base font-bold uppercase tracking-wide text-ink">
                  {category.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-charcoal-light">{category.description}</p>
              </a>
            ))}
          </div>
          <a
            href={MERCH_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
          >
            Shop on Bonfire <ExternalLink size={14} aria-hidden />
          </a>
        </Container>
      </section>
    </>
  );
}
