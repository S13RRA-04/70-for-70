import { ExternalLink } from "lucide-react";
import { Container } from "@/components/shared/container";
import { CAMPAIGN_URL, MERCH_BENEFICIARY, MERCH_STORE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Shop",
  description: `Shop the For The 22 store on Bonfire — 100% of profit goes directly to ${MERCH_BENEFICIARY}.`,
  canonical: "/merch",
});

export default function MerchPage() {
  return (
    <section className="border-b border-ink/10 bg-ink py-16 text-off-white sm:py-24">
      <Container className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bronze-light">
          Store
        </p>
        <h1 className="mt-3 text-balance font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
          Shop
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-off-white/80">
          Custom apparel, available through Bonfire&apos;s print-on-demand store. 100% of net
          profit from every purchase goes directly to {MERCH_BENEFICIARY}.
        </p>
        <a
          href={MERCH_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-event="merch_store_click"
          className="mt-8 inline-flex items-center gap-2 rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
        >
          Shop on Bonfire
          <ExternalLink size={15} aria-hidden />
        </a>

        <div className="mt-10 max-w-lg space-y-3 border-t border-off-white/15 pt-8 text-sm leading-relaxed text-off-white/70">
          <p>
            The store is operated independently by Bonfire, a third-party print-on-demand
            platform — production, fulfillment, payment processing, and order support are all
            handled on Bonfire&apos;s platform, not this site. For The 22 does not process,
            collect, or take possession of merchandise proceeds.
          </p>
          <p>
            Merchandise purchases are retail transactions, not tax-deductible charitable
            contributions, and For The 22 does not issue donation receipts for them. Looking to
            make a tax-deductible gift instead?{" "}
            <a
              href={`${CAMPAIGN_URL}/beneficiaries`}
              className="font-semibold text-bronze-light hover:underline"
            >
              Donate directly
            </a>{" "}
            to a beneficiary organization.
          </p>
        </div>
      </Container>
    </section>
  );
}
