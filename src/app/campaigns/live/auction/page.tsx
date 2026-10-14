import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { AuctionItemCard } from "@/components/live/auction-item-card";
import { LIVE_AUCTION_ITEMS } from "@/lib/content/live-auction";
import { LIVE_FUNDS_DISCLOSURE } from "@/lib/content/live-campaign";
import { LIVE_CAMPAIGN_URL, SITE_URL } from "@/lib/constants";
import { RevealOnScroll, RevealGrid } from "@/components/shared/reveal-on-scroll";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "Online Silent Auction | For The 22: Live",
  description:
    "Bid on a Gibson guitar donated through Gibson Gives and signed by Muscadine Bloodline, benefiting Mighty Oaks Warrior Programs through For the 22 — plus other donated items in the For The 22: Live online silent auction.",
  canonical: "/auction",
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "For The 22: Live", url: LIVE_CAMPAIGN_URL },
  { name: "Online Silent Auction", url: `${LIVE_CAMPAIGN_URL}/auction` },
]);

export default function LiveAuctionPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />

      <section data-analytics-event="auction_view" className="border-b border-off-white/10 bg-ink py-16 text-off-white sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading
            as="h1"
            tone="dark"
            eyebrow="For The 22 Online Silent Auction"
            title="Bid on Something That Matters"
            description="Every item below is donated to directly support veterans, first responders, and their families through For The 22."
          />
        </Container>
      </section>

      <section className="border-b border-off-white/10 bg-charcoal py-16 sm:py-20">
        <Container>
          <RevealGrid>
            <div className="grid gap-6 sm:grid-cols-2">
              {LIVE_AUCTION_ITEMS.map((item) => (
                <AuctionItemCard key={item.slug} item={item} />
              ))}
            </div>
          </RevealGrid>
        </Container>
      </section>

      <section className="bg-sand-light py-16 sm:py-20">
        <Container className="max-w-3xl">
          <RevealOnScroll>
            <SectionHeading
              eyebrow="How to Participate"
              title="Bid Through 32auctions"
              description="32auctions is the system of record for registration, bids, auction timing, payment, and the winning bidder for every item above."
            />
            <ol className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["01", "Open an Item's Auction", "Visit that item's listing on 32auctions from the card above."],
                ["02", "Register and Bid", "Follow 32auctions' instructions to create an account and place your bid."],
                ["03", "Watch for Updates", "32auctions handles bid activity and winner communications under the published auction terms."],
              ].map(([number, title, description]) => (
                <li key={number} className="rounded-xl border border-line bg-white p-6">
                  <p className="font-display text-3xl text-bronze/50">{number}</p>
                  <h2 className="mt-3 font-display text-xl uppercase text-ink">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-light">{description}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm leading-relaxed text-charcoal-light">
              Item specifications, fulfillment, shipping or pickup, payment deadlines, and all final bidding terms
              are governed by each item&apos;s own listing on 32auctions.
            </p>
          </RevealOnScroll>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <RevealOnScroll>
            <SectionHeading eyebrow="Financial Transparency" title="Where the Winning Bid Goes" />
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-charcoal-light">
              {LIVE_FUNDS_DISCLOSURE} Where an item&apos;s listing names a specific beneficiary (as noted on its
              card above), that item&apos;s proceeds go to that organization directly rather than the general pooled
              split. 32auctions is the system of record for the winning payment itself.
            </p>
            <a
              href={`${SITE_URL}/beneficiaries`}
              className="mt-4 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
            >
              See Beneficiaries &rarr;
            </a>
          </RevealOnScroll>
        </Container>
      </section>
    </>
  );
}
