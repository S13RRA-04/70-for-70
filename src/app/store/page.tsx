import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { ORG_SHOP_ALLOCATION, ORG_SHOP_URL, SITE_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Store",
  description: `${SITE_NAME} merchandise, sold through Fourthwall — see how proceeds are allocated.`,
  canonical: "/store",
});

export default function StorePage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-2xl">
        <SectionHeading
          as="h1"
          eyebrow="Store"
          title={`${SITE_NAME} Store`}
          description={`Merchandise is sold through Fourthwall, an independent third-party store. This shop is not a fundraising campaign — it's a separate way to support ${SITE_NAME}'s work through everyday purchases.`}
        />

        <div className="mt-10 border border-ink/10 bg-sand-light/40 p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            How Proceeds Are Allocated
          </p>
          <ul className="mt-4 space-y-4">
            {ORG_SHOP_ALLOCATION.map((row) => (
              <li key={row.label} className="flex items-baseline gap-4">
                <span className="font-display text-2xl font-bold tabular-nums text-bronze">{row.percent}%</span>
                <span>
                  <span className="block text-sm font-semibold uppercase tracking-wide text-ink">{row.label}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-charcoal-light">{row.description}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 max-w-lg text-sm leading-relaxed text-charcoal-light">
          Fourthwall handles all orders, sizing, shipping, and payment on its own platform;{" "}
          {SITE_NAME} does not take possession of merchandise proceeds directly.
        </p>

        <CTAButton href={ORG_SHOP_URL} external size="lg" className="mt-8">
          Shop on Fourthwall <span aria-hidden="true">&#8599;</span>
        </CTAButton>
      </Container>
    </section>
  );
}
