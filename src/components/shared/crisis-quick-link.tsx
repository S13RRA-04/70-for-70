import Link from "next/link";

/**
 * Homepage-only crisis utility — embedded as a compact dark card inside the
 * Resources composition (not a full-bleed section of its own), so "Need
 * Help Now" reads as integrated with resource-finding rather than another
 * independent band in the page's vertical stack. The 988 tile is a direct
 * tel: link — the one number safe to one-tap dial everywhere (see
 * resources.ts); texting 988 and the org-specific numbers live one click
 * away on /crisis.
 */
export function CrisisQuickLink() {
  return (
    <div
      id="crisis"
      aria-label="Crisis support"
      className="flex h-full scroll-mt-24 flex-col border border-off-white/15 bg-ink p-6 text-off-white sm:p-8"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-bronze-light">
        Need Help Now?
      </p>
      <p className="mt-2 text-xs leading-relaxed text-off-white/60">
        For The 22 is not a crisis-response service. These connect you with organizations
        equipped to provide immediate support.
      </p>

      <div className="mt-5 flex flex-1 flex-col gap-px overflow-hidden rounded-sm border border-off-white/15 bg-off-white/15">
        <Link
          href="/crisis#veterans"
          className="flex flex-1 flex-col justify-center gap-0.5 bg-ink px-5 py-4 transition-colors hover:bg-charcoal"
        >
          <span className="text-sm font-semibold uppercase tracking-wide">Veterans</span>
          <span className="text-xs text-off-white/60">Crisis support &rarr;</span>
        </Link>
        <Link
          href="/crisis#first-responders"
          className="flex flex-1 flex-col justify-center gap-0.5 bg-ink px-5 py-4 transition-colors hover:bg-charcoal"
        >
          <span className="text-sm font-semibold uppercase tracking-wide">First Responders</span>
          <span className="text-xs text-off-white/60">Peer &amp; crisis support &rarr;</span>
        </Link>
        <a
          href="tel:988"
          className="flex flex-1 flex-col justify-center gap-0.5 bg-bronze px-5 py-4 transition-colors hover:bg-bronze-light"
        >
          <span className="text-sm font-semibold uppercase tracking-wide">988</span>
          <span className="text-xs text-off-white/80">Call or text &rarr;</span>
        </a>
      </div>
    </div>
  );
}
