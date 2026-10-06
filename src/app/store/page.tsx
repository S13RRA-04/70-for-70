import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { CTAButton } from "@/components/shared/cta-button";
import { MISSION_STORE_URL, SITE_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Store",
  description: `${SITE_NAME} merchandise, sold through Exray — 100% of net proceeds go directly toward the mission's costs.`,
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
          description={`Merchandise is sold through Exray, an independent third-party store. This isn't a fundraiser for a named beneficiary — it's a separate way to support ${SITE_NAME}'s own mission costs through everyday purchases.`}
        />

        <RevealOnScroll className="mt-10 border border-ink/10 bg-sand-light/40 p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            How Proceeds Are Used
          </p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-charcoal-light">
            100% of net proceeds go directly toward {SITE_NAME}&apos;s mission costs — equipment,
            training, and campaign expenses — instead of to a named charitable beneficiary.
          </p>
        </RevealOnScroll>

        <p className="mt-6 max-w-lg text-sm leading-relaxed text-charcoal-light">
          Exray handles all orders, sizing, shipping, and payment on its own platform;{" "}
          {SITE_NAME} does not take possession of merchandise proceeds directly.
        </p>

        <CTAButton href={MISSION_STORE_URL} external size="lg" magnetic className="mt-8">
          Shop on Exray <span aria-hidden="true">&#8599;</span>
        </CTAButton>
      </Container>
    </section>
  );
}
