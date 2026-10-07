import { ExternalLink } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { LIVE_AUCTION } from "@/lib/content/live-auction";
import { SITE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: `Online Silent Auction | ${LIVE_AUCTION.title}`,
  description: `${LIVE_AUCTION.description} Bidding opens ${LIVE_AUCTION.opensOn}.`,
  canonical: "/campaigns/live/auction",
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Campaigns", url: `${SITE_URL}/campaigns` },
  { name: "For The 22: Live", url: `${SITE_URL}/campaigns/live` },
  { name: "Online Silent Auction", url: `${SITE_URL}/campaigns/live/auction` },
]);

export default function LiveAuctionPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />

      <section className="border-b border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading
            as="h1"
            tone="dark"
            eyebrow="For The 22 Online Silent Auction"
            title={LIVE_AUCTION.title}
          />
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-off-white/80">
            {LIVE_AUCTION.description}
          </p>
          <CTAButton href={LIVE_AUCTION.biddingUrl} external tone="dark" size="lg" magnetic className="mt-8">
            View the Auction <ExternalLink size={16} aria-hidden="true" />
          </CTAButton>
        </Container>
      </section>

      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="grid gap-4 sm:grid-cols-3">
            <AuctionDate label="Bidding Opens" value={LIVE_AUCTION.opensOn} />
            <AuctionDate label="Auction Platform" value="32auctions" />
            <AuctionDate label="Winner Announced" value={LIVE_AUCTION.winnerAnnouncement} />
          </div>
        </Container>
      </section>

      <section className="bg-sand-light py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="How to Participate"
            title="Bid Through 32auctions"
            description="32auctions is the system of record for registration, bids, auction timing, payment, and the winning bidder."
          />
          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["01", "Open the Auction", "Visit the For The 22 auction page on 32auctions."],
              ["02", "Register and Bid", "Follow 32auctions' instructions to create an account and place your bid."],
              ["03", "Watch for Updates", "32auctions handles bid activity and winner communications under the published auction terms."],
            ].map(([number, title, description]) => (
              <li key={number} className="border border-ink/10 bg-off-white p-6">
                <p className="font-display text-2xl font-bold text-bronze/50">{number}</p>
                <h2 className="mt-3 font-display text-lg font-semibold uppercase tracking-tight text-ink">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-light">{description}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm leading-relaxed text-charcoal-light">
            Item specifications, eligible 2027 show details, fulfillment, shipping or pickup, payment deadlines,
            and all final bidding terms are governed by the listing published on 32auctions.
          </p>
          <CTAButton href={LIVE_AUCTION.biddingUrl} external size="lg" className="mt-6">
            Go to 32auctions <ExternalLink size={16} aria-hidden="true" />
          </CTAButton>
        </Container>
      </section>
    </>
  );
}

function AuctionDate({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-ink/10 bg-off-white p-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-bronze-text">{label}</p>
      <p className="mt-2 font-display text-xl font-semibold uppercase tracking-tight text-ink">{value}</p>
    </div>
  );
}

