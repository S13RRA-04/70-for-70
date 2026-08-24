import { Container } from "@/components/shared/container";
import { CAMPAIGN_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Store Paused",
  description: "The Tri For The 22 merchandise store is not currently available.",
  canonical: "/merch",
});

/**
 * The store itself (MERCH_STORE_URL, MERCH_BENEFICIARY in constants.ts,
 * and the underlying Bonfire integration) is preserved, not deleted —
 * only the public link and this page's content are disabled, pending
 * resolution of outside-activity/ethics requirements. See
 * src/lib/constants.ts.
 */
export default function MerchPage() {
  return (
    <section className="border-b border-ink/10 bg-ink py-16 text-off-white sm:py-24">
      <Container className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bronze-light">
          Store
        </p>
        <h1 className="mt-3 text-balance font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
          Merchandise Store Paused
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-off-white/80">
          Merchandise is not currently available. For The 22 does not receive merchandise
          proceeds at this time.
        </p>
        <p className="mt-3 max-w-lg text-base leading-relaxed text-off-white/80">
          If you would like to support the mission, please donate directly to one of the
          independent beneficiary organizations.
        </p>
        <a
          href={`${CAMPAIGN_URL}/beneficiaries`}
          className="mt-8 inline-flex items-center gap-2 rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
        >
          Support a Beneficiary
        </a>
      </Container>
    </section>
  );
}
