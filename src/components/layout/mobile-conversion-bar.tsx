"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DONATE_LINK } from "@/lib/constants";

/**
 * Pages where the bar would only repeat the page's own purpose — /donate and
 * /crisis are the bar's two destinations. Admin routes never show it at all,
 * and neither does the participant app (it has its own tab bar).
 */
const HIDDEN_PREFIXES = ["/admin", "/donate", "/crisis"];

function useHideConversionBar() {
  const pathname = usePathname();
  return HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/** Reserves space at the bottom of the page so the fixed bar below never covers content. */
export function MobileConversionBarSpacer() {
  const hidden = useHideConversionBar();
  if (hidden) return null;
  return <div aria-hidden="true" className="h-20 sm:hidden" />;
}

export function MobileConversionBar() {
  const hidden = useHideConversionBar();

  if (hidden) {
    return null;
  }

  // The org site's two standing calls to action, on every page: Get Help
  // Now (Connection) and Donate (Impact) — the same pair the desktop header
  // carries.
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-ink/10 bg-off-white/95 p-3 backdrop-blur-sm sm:hidden">
      <Link
        href="/crisis"
        data-analytics-event="get_help_click"
        className="flex-1 rounded-sm bg-help px-4 py-3 text-center text-sm font-bold text-white shadow-sm hover:bg-help-dark"
      >
        Get Help Now
      </Link>
      <Link
        href={DONATE_LINK.href}
        data-analytics-event="donate_click"
        className="action-control inline-flex flex-1 items-center justify-center border-2 border-navy bg-white px-4 py-3 text-center text-sm font-bold text-navy hover:bg-paper"
      >
        Donate
      </Link>
    </div>
  );
}
