import Image from "next/image";
import Link from "next/link";
import { isSuicidePreventionMonth } from "@/lib/awareness-month";

/**
 * Shown on every route, both domains — National Suicide Prevention Month
 * isn't campaign- or org-specific, and /crisis (this banner's destination)
 * already renders identically on both hosts. Self-gating on the date check
 * rather than requiring a caller to remember to render it means nothing
 * needs to change when September rolls around next year, or the year after.
 */
export function AwarenessBanner() {
  if (!isSuicidePreventionMonth()) return null;

  return (
    <div className="relative border-b border-off-white/10 bg-ink text-off-white">
      <div
        aria-hidden="true"
        className="h-[3px] w-full"
        style={{
          background: "linear-gradient(90deg, var(--color-awareness-teal), var(--color-awareness-purple))",
        }}
      />
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-4 py-2.5 text-center sm:px-6 lg:px-8">
        <Image src="/spm-ribbon.png" alt="" aria-hidden="true" width={18} height={18} className="shrink-0" />
        <p className="text-xs font-medium leading-snug text-off-white/90 sm:text-sm">
          <span className="font-semibold uppercase tracking-wide">September is National Suicide Prevention Month.</span>{" "}
          Help is available 24/7.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="tel:988"
            className="text-xs font-semibold uppercase tracking-widest text-off-white underline decoration-2 underline-offset-4 hover:text-off-white/80 sm:text-sm"
            style={{ textDecorationColor: "var(--color-awareness-teal)" }}
          >
            Call or Text 988
          </a>
          <Link
            href="/crisis"
            className="text-xs font-semibold uppercase tracking-widest text-off-white underline decoration-2 underline-offset-4 hover:text-off-white/80 sm:text-sm"
            style={{ textDecorationColor: "var(--color-awareness-purple)" }}
          >
            Find Resources
          </Link>
        </div>
      </div>
    </div>
  );
}
