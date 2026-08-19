import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProceedsBreakdown } from "@/components/shared/proceeds-breakdown";
import { CAMPAIGN_URL, MERCH_STORE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop official Tri For The 22 gear through the Jakroo team store.",
  alternates: { canonical: "/merch" },
};

export default function MerchPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-2xl">
        <SectionHeading
          eyebrow="Shop — Commercial Merchandise"
          title="Shop Tri For The 22 Gear"
          description="Custom cycling and triathlon apparel for the Tri For The 22 campaign, available through Jakroo's team store platform."
        />

        <div className="mt-6 rounded-sm border border-bronze/40 bg-bronze/10 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-bronze">
            Merchandise purchases are retail transactions, not charitable donations
          </p>
          <p className="mt-2 text-sm text-charcoal-light">
            For The 22 does not manufacture, fulfill, ship, or process merchandise sales — our
            team store is operated by a third-party provider, Jakroo. For The 22 receives only
            the net proceeds actually paid to us by Jakroo after it deducts production,
            fulfillment, platform, transaction, refund, and related costs. After the merchandise
            provider deducts those costs, For The 22 allocates the net proceeds it receives
            according to its 22/58/20 model below.
          </p>
          <p className="mt-3 text-sm text-charcoal-light">
            Merchandise purchases are not tax-deductible charitable contributions, and For The 22
            does not issue charitable donation receipts for them. Looking to make a charitable
            gift instead?{" "}
            <a href={`${CAMPAIGN_URL}/donate`} className="font-semibold text-bronze hover:underline">
              Donate directly
            </a>{" "}
            or{" "}
            <a href={`${CAMPAIGN_URL}/fund-a-mile`} className="font-semibold text-bronze hover:underline">
              fund a mile
            </a>
            .
          </p>
        </div>

        <div className="mt-6">
          <ProceedsBreakdown />
        </div>

        <div className="mt-6 rounded-sm border border-ink/10 bg-off-white p-6">
          <p className="text-sm text-charcoal-light">
            The team store is operated independently by Jakroo — orders, sizing, shipping, and
            payment are all handled on their platform, not this site. Jakroo&apos;s own terms
            and privacy practices govern the transaction.
          </p>
          <a
            href={MERCH_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics-event="merch_store_click"
            className="mt-5 inline-flex items-center gap-2 rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
          >
            Shop the Team Store
            <ExternalLink size={15} aria-hidden />
          </a>
        </div>
      </Container>
    </section>
  );
}
