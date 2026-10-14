import Image from "next/image";
import { Gavel } from "lucide-react";
import { CTAButton } from "@/components/shared/cta-button";
import { getCurrentAuctionStatus, type AuctionStatus } from "@/lib/live-auction-status";
import type { LiveAuctionItem } from "@/lib/content/live-auction";
import { cn } from "@/lib/utils";

const STATUS_BADGE: Record<AuctionStatus, { label: string; className: string }> = {
  "coming-soon": { label: "Coming Soon", className: "border border-bronze-light/40 bg-bronze-light/10 text-bronze-light" },
  "bidding-open": { label: "Bidding Open", className: "bg-impact text-white" },
  closed: { label: "Auction Closed", className: "border border-off-white/20 text-off-white/50" },
};

const STATUS_CTA_LABEL: Record<AuctionStatus, string> = {
  "coming-soon": "Preview Auction",
  "bidding-open": "Bid Now",
  closed: "View Auction",
};

/**
 * One silent-auction listing — status (coming soon / bidding open / closed)
 * is derived from the item's bidding window (see live-auction-status.ts),
 * never hand-written, so the card can't go stale once bidding opens or
 * closes. Always a dark card: the entire For The 22: Live property renders
 * on a dark/cinematic surface (see globals.css's `data-property="live"`
 * rules and every section on this page), so this intentionally hardcodes
 * that treatment rather than trying to stay surface-agnostic for a card
 * that, in practice, never renders anywhere else.
 */
export function AuctionItemCard({ item }: { item: LiveAuctionItem }) {
  const status = getCurrentAuctionStatus(item.opensAtIso, item.closesAtIso);
  const badge = STATUS_BADGE[status];
  const ctaLabel = STATUS_CTA_LABEL[status];

  return (
    <article
      id={item.slug}
      className={cn(
        "scroll-mt-28 overflow-hidden rounded-xl border border-off-white/10 bg-charcoal",
        item.featured && "border-t-4 border-t-bronze-light sm:col-span-2",
      )}
    >
      <div className="grid gap-0 sm:grid-cols-[0.9fr_1.1fr]">
        <div className="relative aspect-[4/3] sm:aspect-auto">
          {item.image ? (
            <Image src={item.image.src} alt={item.image.alt} fill className="object-cover" sizes="(min-width: 640px) 40vw, 100vw" />
          ) : (
            <div className="flex h-full min-h-48 flex-col items-center justify-center gap-3 border-b border-off-white/10 bg-ink p-6 text-center sm:border-b-0 sm:border-r">
              <Gavel className="h-10 w-10 text-bronze-light" aria-hidden="true" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-off-white/40">
                Official {item.title.toLowerCase().includes("guitar") ? "guitar " : ""}image coming soon
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          {item.featured && (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-bronze-light">Featured Item</p>
          )}
          <h2 className={cn("font-display uppercase text-off-white", item.featured ? "mt-2 text-3xl sm:text-4xl" : "mt-2 text-2xl")}>
            {item.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-off-white/50">{item.provenanceLine}</p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-off-white/75">{item.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              className={cn("inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest", badge.className)}
            >
              {badge.label}
            </span>
            {status === "coming-soon" && (
              <span className="text-xs text-off-white/50">Bidding opens {item.opensShortLabel}</span>
            )}
            {status === "bidding-open" && (
              <span className="text-xs text-off-white/50">Closes {item.closesShortLabel}</span>
            )}
            {status === "closed" && <span className="text-xs text-off-white/50">Bidding has ended</span>}
          </div>

          <div className="mt-6">
            <CTAButton
              href={item.biddingUrl}
              external
              newTab
              tone="dark"
              variant={status === "closed" ? "secondary" : "primary"}
              data-analytics-event="auction_bid_click"
            >
              {ctaLabel}
              <span className="sr-only"> on 32auctions for {item.title}</span>
            </CTAButton>
          </div>
        </div>
      </div>
    </article>
  );
}
