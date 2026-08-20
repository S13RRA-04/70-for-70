import Link from "next/link";

/**
 * Homepage-only crisis utility strip — not the Resources directory, not the
 * footer. Dark/high-contrast on purpose (Tier 1 — same visual weight class
 * as the hero and the Black section), but compact, not full-height: three
 * equal tap targets, no card, no clutter. The 988 tile is a direct tel:
 * link — the one number safe to one-tap dial everywhere (see resources.ts);
 * texting 988 and the org-specific numbers live one click away on /crisis.
 */
export function CrisisQuickLink() {
  return (
    <section id="crisis" className="scroll-mt-20 bg-ink py-8 text-off-white sm:py-10" aria-label="Crisis support">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-bronze-light">
          Need Help Now?
        </p>
        <p className="mt-1 max-w-xl text-xs leading-relaxed text-off-white/60">
          For The 22 is not a crisis-response service. These connect you with organizations
          equipped to provide immediate support.
        </p>

        <div className="mt-5 grid gap-px overflow-hidden rounded-sm border border-off-white/15 bg-off-white/15 sm:grid-cols-3">
          <Link
            href="/crisis#veterans"
            className="flex flex-col gap-0.5 bg-ink px-5 py-4 transition-colors hover:bg-charcoal"
          >
            <span className="text-sm font-semibold uppercase tracking-wide">Veterans</span>
            <span className="text-xs text-off-white/60">Crisis support &rarr;</span>
          </Link>
          <Link
            href="/crisis#first-responders"
            className="flex flex-col gap-0.5 bg-ink px-5 py-4 transition-colors hover:bg-charcoal"
          >
            <span className="text-sm font-semibold uppercase tracking-wide">First Responders</span>
            <span className="text-xs text-off-white/60">Peer &amp; crisis support &rarr;</span>
          </Link>
          <a
            href="tel:988"
            className="flex flex-col gap-0.5 bg-bronze px-5 py-4 transition-colors hover:bg-bronze-light"
          >
            <span className="text-sm font-semibold uppercase tracking-wide">988</span>
            <span className="text-xs text-off-white/80">Call or text &rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
