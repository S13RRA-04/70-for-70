import { Container } from "@/components/shared/container";
import { CAMPAIGN_NAME, MERCH_BENEFICIARY, MERCH_STORE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Shop",
  description: `${CAMPAIGN_NAME} merchandise — 100% of net profit goes directly to ${MERCH_BENEFICIARY}.`,
  canonical: "/shop",
});

export default function ShopPage() {
  return (
    <section className="border-b border-ink/10 bg-ink py-16 text-off-white sm:py-24">
      <Container className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bronze-light">
          Store
        </p>
        <h1 className="mt-3 text-balance font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
          {CAMPAIGN_NAME} Shop
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-off-white/80">
          Merchandise is sold through Bonfire, an independent third-party store. 100% of net
          profit from every sale is paid by Bonfire directly to {MERCH_BENEFICIARY}.
        </p>
        <p className="mt-3 max-w-lg text-base leading-relaxed text-off-white/80">
          For The 22 does not take possession of merchandise proceeds; Bonfire handles all
          orders, sizing, shipping, and payment on its own platform.
        </p>
        <a
          href={MERCH_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
        >
          Shop on Bonfire <span aria-hidden="true">&#8599;</span>
        </a>
      </Container>
    </section>
  );
}
