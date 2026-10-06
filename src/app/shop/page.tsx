import { Container } from "@/components/shared/container";
import { RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { CTAButton } from "@/components/shared/cta-button";
import { CAMPAIGN_NAME, CAMPAIGN_URL, MERCH_BENEFICIARIES, MERCH_STORE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, CAMPAIGN_HOME_CRUMB, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "Shop",
  description: `${CAMPAIGN_NAME} merchandise, sold through Bonfire — 100% of net profit goes directly to ${MERCH_BENEFICIARIES[0]} or ${MERCH_BENEFICIARIES[1]}.`,
  canonical: "/shop",
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([CAMPAIGN_HOME_CRUMB, { name: "Shop", url: `${CAMPAIGN_URL}/shop` }]);

export default function ShopPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <section className="border-b border-ink/10 bg-ink py-16 text-off-white sm:py-24">
        <Container className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bronze-light">
            Fundraiser
          </p>
          <h1 className="mt-3 text-balance font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
            {CAMPAIGN_NAME} Shop
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-off-white/80">
            Merchandise purchases here directly fundraise for this campaign&apos;s beneficiaries —
            see the disclosure below before you buy.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <RevealOnScroll>
            <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
              Beneficiary Store
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
              Bonfire
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-charcoal-light">
              Merchandise is sold through Bonfire, an independent third-party store. 100% of net
              profit from every sale is paid by Bonfire directly to {MERCH_BENEFICIARIES[0]} or{" "}
              {MERCH_BENEFICIARIES[1]} — Bonfire notes which beneficiary each item supports on its
              product listing.
            </p>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-charcoal-light">
              {CAMPAIGN_NAME} does not take possession of merchandise proceeds; Bonfire handles all
              orders, sizing, shipping, and payment on its own platform.
            </p>
            <CTAButton href={MERCH_STORE_URL} external size="lg" magnetic className="mt-8">
              Shop on Bonfire <span aria-hidden="true">&#8599;</span>
            </CTAButton>
          </RevealOnScroll>
        </Container>
      </section>
    </>
  );
}
