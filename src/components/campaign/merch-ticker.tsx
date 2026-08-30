import { ShoppingBag } from "lucide-react";
import { MERCH_STORE_URL, SHOP_CATEGORIES } from "@/lib/constants";

const TICKER_ITEMS = [
  "Shop The Store",
  ...SHOP_CATEGORIES.map((category) => category.label),
  "100% of Net Profit Supports Veterans",
];

function TickerTrack({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {TICKER_ITEMS.map((item, i) => (
        <span key={i} className="flex items-center gap-3 whitespace-nowrap px-4 text-xs font-semibold uppercase tracking-widest text-off-white">
          {item}
          <ShoppingBag size={14} className="text-bronze-light" aria-hidden="true" />
        </span>
      ))}
    </div>
  );
}

/**
 * Scrolling promo banner for the Bonfire merch store — tri.forthe22.org
 * campaign homepage only (see CampaignHomePage). The full shop section
 * further down the page has the real pitch and category cards; this is
 * just an attention-grabbing pointer to it. Track is duplicated so the
 * marquee loop is seamless (see .animate-marquee in globals.css); the
 * second copy is aria-hidden so screen readers only hear it once.
 */
export function MerchTicker() {
  return (
    <a
      href={MERCH_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Shop the Tri For The 22 merch store on Bonfire"
      className="group block overflow-hidden border-b border-off-white/10 bg-ink py-2.5"
      style={{ maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)" }}
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        <TickerTrack />
        <TickerTrack hidden />
      </div>
    </a>
  );
}
