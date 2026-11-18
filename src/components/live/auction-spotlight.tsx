import Image from "next/image";
import { CTAButton } from "@/components/shared/cta-button";
import { Container } from "@/components/shared/container";
import { RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { LISTED_LIVE_AUCTION_ITEMS } from "@/lib/content/live-auction";
import { LIVE_CAMPAIGN_URL } from "@/lib/constants";
import { getCurrentAuctionStatus } from "@/lib/live-auction-status";

/**
 * Org-site banner for the silent auction (home, Tri, The $70K Mission), so the
 * auction isn't only discoverable from the Live campaign page. Lists every
 * listed item whose bidding window hasn't closed — featured items first —
 * and renders nothing once there aren't any, so it can't go stale.
 */
export function AuctionSpotlight() {
  const items = LISTED_LIVE_AUCTION_ITEMS.map((item) => ({
    item,
    status: getCurrentAuctionStatus(item.opensAtIso, item.closesAtIso),
  }))
    .filter(({ status }) => status !== "closed")
    .sort((a, b) => Number(Boolean(b.item.featured)) - Number(Boolean(a.item.featured)));
  if (items.length === 0) return null;

  const closesLabels = new Set(items.map(({ item }) => item.closesOnLabel));
  const sharedClose = closesLabels.size === 1 ? items[0].item.closesOnLabel : null;

  return (
    <section
      id="auction"
      aria-labelledby="auction-spotlight-heading"
      className="scroll-mt-28 border-b border-line bg-jet py-14 text-white sm:py-16"
    >
      <Container>
        <RevealOnScroll>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label-caps text-xs text-bronze-light">Online Silent Auction</p>
              <h2 id="auction-spotlight-heading" className="mt-3 font-display text-4xl uppercase leading-none sm:text-5xl">
                Bid on Signed Guitars
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-mist">
                Artist-signed guitars supporting Tri For The 22 and The $70K Mission.
                {sharedClose && ` Bidding closes ${sharedClose}.`}
              </p>
            </div>
            <CTAButton href={`${LIVE_CAMPAIGN_URL}/auction`} tone="dark" variant="secondary">
              All Auction Details
            </CTAButton>
          </div>

          <ul className={`mt-8 grid gap-6 ${items.length > 1 ? "md:grid-cols-2" : ""}`}>
            {items.map(({ item, status }) => {
              const isOpen = status === "bidding-open";
              return (
                <li
                  key={item.slug}
                  className="grid grid-cols-[7rem_1fr] gap-5 rounded-xl border border-white/10 bg-white/5 p-4 sm:grid-cols-[9rem_1fr] sm:p-5"
                >
                  <div className="relative aspect-[1/2] overflow-hidden rounded-lg bg-[#0b0c0d]">
                    {item.image && (
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        fill
                        sizes="(min-width: 640px) 9rem, 7rem"
                        className={item.image.contain ? "object-contain" : "object-cover"}
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="label-caps text-[11px] text-bronze-light">
                      {isOpen ? `Bidding open · Closes ${item.closesShortLabel}` : `Bidding opens ${item.opensShortLabel}`}
                    </p>
                    <h3 className="mt-2 font-display text-2xl uppercase leading-tight">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-mist">{item.provenanceLine}</p>
                    <div className="mt-auto pt-4">
                      <CTAButton href={item.biddingUrl} external newTab tone="dark" data-analytics-event="auction_bid_click">
                        {isOpen ? "Bid Now" : "Preview Auction"}
                        <span className="sr-only"> on {item.platform} for {item.title}</span>
                      </CTAButton>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
