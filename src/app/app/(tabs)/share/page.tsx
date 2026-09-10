import type { Metadata } from "next";

export const metadata: Metadata = { title: "Share" };

/** Honest placeholder — the shareable progress card needs real session data, which session logging (not yet built) will provide. */
export default function SharePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-ink">Share</h1>
      <div className="mt-8 rounded-sm border border-dashed border-ink/20 p-8 text-center">
        <p className="text-sm text-charcoal-light">
          Your shareable progress card will appear here once session logging is live.
        </p>
      </div>

      <div className="mt-6 rounded-sm border border-ink/10 bg-sand-light p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">In the Meantime</p>
        <p className="mt-2 text-sm text-charcoal-light">
          The full Participant Promo Kit — social graphics, photo frames, captions, and hashtags — is ready now.
        </p>
        <a
          href="https://tri.forthe22.org/22forthe22/promokit"
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-event="promo_asset_downloaded"
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
        >
          Open Promo Kit
        </a>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-charcoal-light/80">
        Sharing is optional and does not provide additional giveaway entries or improve odds of winning.
      </p>
    </div>
  );
}
