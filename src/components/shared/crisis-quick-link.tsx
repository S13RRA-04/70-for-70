import Link from "next/link";

/**
 * Homepage-only crisis utility — embedded as a compact dark card inside the
 * Resources composition (not a full-bleed section of its own), so "Need
 * Help Now" reads as integrated with resource-finding rather than another
 * independent band in the page's vertical stack. Bronze is used sparingly
 * (top border, the 988 numeral, the crisis-line tile) rather than filling
 * the whole lower half of the panel, so it stays legible next to the
 * resource cards instead of visually overpowering them.
 */
export function CrisisQuickLink() {
  return (
    <div
      id="crisis"
      aria-label="Crisis support"
      className="flex h-full scroll-mt-24 flex-col border-t-4 border-bronze bg-ink p-6 text-off-white sm:p-8"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-bronze-light">Need Help Now?</p>
      <p className="mt-2 text-sm leading-relaxed text-off-white/70">
        If you or someone you know is in immediate danger, call{" "}
        <a
          href="tel:911"
          className="font-semibold text-off-white underline decoration-off-white/40 underline-offset-2 hover:text-bronze-light"
        >
          911
        </a>
        .
      </p>

      <div className="mt-6 border border-off-white/15 bg-off-white/[0.04] p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-off-white">
            Veterans Crisis Line
          </p>
          <span
            aria-hidden="true"
            className="font-display text-2xl font-bold leading-none text-bronze-light"
          >
            988
          </span>
        </div>
        <div className="mt-3 flex flex-col">
          <a
            href="tel:988"
            className="block py-1 text-sm text-off-white/85 underline decoration-off-white/30 underline-offset-2 transition-colors hover:text-bronze-light"
          >
            Call 988, then press 1
          </a>
          <a
            href="sms:838255"
            className="block py-1 text-sm text-off-white/85 underline decoration-off-white/30 underline-offset-2 transition-colors hover:text-bronze-light"
          >
            Text 838255
          </a>
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col justify-center border border-off-white/15 p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-off-white">
          First Responder Support
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-off-white/60">
          Crisis and peer-support resources for first responders.
        </p>
        <Link
          href="/crisis#first-responders"
          className="mt-3 inline-flex w-fit items-center gap-1 text-xs font-semibold uppercase tracking-wide text-bronze-light transition-colors hover:text-bronze"
        >
          View Support <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
