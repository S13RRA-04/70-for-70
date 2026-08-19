import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { MERCH_STORE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Merch",
  description: "Shop official Tri gear through the Jakroo team store.",
  alternates: { canonical: "/merch" },
};

export default function MerchPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-2xl">
        <SectionHeading
          eyebrow="Merch"
          title="Shop Tri Gear"
          description="Custom cycling and triathlon apparel for the Tri campaign, available through Jakroo's team store platform."
        />

        <div className="mt-8 rounded-sm border border-ink/10 bg-off-white p-6">
          <p className="text-sm text-charcoal-light">
            The team store is operated independently by Jakroo — orders, sizing, shipping, and
            payment are all handled on their platform, not this site.
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
