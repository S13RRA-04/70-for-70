import { Container } from "@/components/shared/container";
import { CAMPAIGN_NAME, MERCH_BENEFICIARIES, MERCH_STORE_URL, MISSION_STORE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Shop",
  description: `${CAMPAIGN_NAME} merchandise — two separate stores: Bonfire (100% of net profit to ${MERCH_BENEFICIARIES[0]} or ${MERCH_BENEFICIARIES[1]}) and Exray (100% to the campaign mission).`,
  canonical: "/shop",
});

export default function ShopPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-ink py-16 text-off-white sm:py-24">
        <Container className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bronze-light">
            Store
          </p>
          <h1 className="mt-3 text-balance font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
            {CAMPAIGN_NAME} Shop
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-off-white/80">
            Two separate stores support this campaign, and they support it in two different ways —
            see the split below before you buy.
          </p>
        </Container>
      </section>

      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
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

      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
            Mission Store — Not a Fundraiser
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
            Exray
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-charcoal-light">
            A second, separate store, sold through Exray. This one isn&apos;t a fundraiser for{" "}
            {MERCH_BENEFICIARIES[0]} or {MERCH_BENEFICIARIES[1]} — 100% of net proceeds go
            directly toward the campaign&apos;s own mission costs instead: equipment, training,
            and race expenses.
          </p>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-charcoal-light">
            {CAMPAIGN_NAME} does not take possession of merchandise proceeds; Exray handles all
            orders, sizing, shipping, and payment on its own platform.
          </p>
          <a
            href={MISSION_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-sm border border-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-bronze transition-colors hover:bg-bronze hover:text-off-white"
          >
            Shop on Exray <span aria-hidden="true">&#8599;</span>
          </a>
        </Container>
      </section>
    </>
  );
}
