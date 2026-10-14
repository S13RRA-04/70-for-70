import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { CTAButton } from "@/components/shared/cta-button";
import {
  CAMPAIGN_NAME,
  MERCH_BENEFICIARIES,
  MERCH_STORE_URL,
  MISSION_STORE_URL,
  SITE_NAME,
} from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Store",
  description: `${SITE_NAME} merchandise from the organization store and the ${CAMPAIGN_NAME} Bonfire fundraiser benefiting veteran-focused nonprofit organizations.`,
  canonical: "/store",
});

export default function StorePage() {
  return (
    <>
    <PageHero
      pillar="mobilization"
      eyebrow="Store"
      title="Shop the mission"
      description={`${SITE_NAME} has two independent merchandise destinations. Choose the store based on where you want your purchase to make an impact.`}
    />
    <section className="py-16 sm:py-20">
      <Container className="max-w-5xl">
        <div className="grid gap-6 md:grid-cols-2">
          <RevealOnScroll className="flex h-full flex-col rounded-xl border border-line bg-white p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-bronze-text">Organization Store</p>
            <h2 className="mt-2 font-display text-3xl uppercase text-ink">
              For The 22 on Exray
            </h2>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-charcoal-light">
              This is not a fundraiser for a named beneficiary. Net proceeds support {SITE_NAME}&apos;s
              mission costs, including equipment, training, and campaign expenses. Exray handles
              orders, sizing, shipping, and payment on its own platform.
            </p>
            <CTAButton href={MISSION_STORE_URL} external size="lg" magnetic className="mt-8 self-start">
              Shop on Exray <span aria-hidden="true">&#8599;</span>
            </CTAButton>
          </RevealOnScroll>

          <RevealOnScroll
            className="flex h-full flex-col rounded-xl border border-line bg-white p-6 sm:p-7"
            delay={80}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-bronze-text">Beneficiary Fundraiser</p>
            <h2 className="mt-2 font-display text-3xl uppercase text-ink">
              {CAMPAIGN_NAME} on Bonfire
            </h2>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-charcoal-light">
              100% of net profit is paid by Bonfire directly to {MERCH_BENEFICIARIES[0]} or{" "}
              {MERCH_BENEFICIARIES[1]}. Each product listing identifies the beneficiary it supports;{" "}
              {CAMPAIGN_NAME} does not take possession of merchandise proceeds.
            </p>
            <CTAButton href={MERCH_STORE_URL} external size="lg" magnetic className="mt-8 self-start">
              Shop Tri on Bonfire <span aria-hidden="true">&#8599;</span>
            </CTAButton>
          </RevealOnScroll>
        </div>
      </Container>
    </section>
    </>
  );
}
