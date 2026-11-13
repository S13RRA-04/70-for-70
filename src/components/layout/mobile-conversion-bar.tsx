"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CAMPAIGNS, DONATE_LINK, DONATE_URL } from "@/lib/constants";
import type { CampaignSlug, SiteMode } from "@/lib/site-mode";

/**
 * Pages where the bar would only repeat the page's own purpose — /donate and
 * /crisis are the bar's two destinations. Admin routes never show it at all,
 * and neither does the participant app (it has its own tab bar).
 */
const HIDDEN_PREFIXES = ["/admin", "/donate", "/crisis"];

function useHideConversionBar(mode: SiteMode) {
  const pathname = usePathname();
  return mode === "app" || HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/** Reserves space at the bottom of the page so the fixed bar below never covers content. */
export function MobileConversionBarSpacer({ mode }: { mode: SiteMode; campaignSlug?: CampaignSlug | null }) {
  const hidden = useHideConversionBar(mode);
  if (hidden) return null;
  return <div aria-hidden="true" className="h-20 sm:hidden" />;
}

export function MobileConversionBar({ mode, campaignSlug }: { mode: SiteMode; campaignSlug?: CampaignSlug | null }) {
  const hidden = useHideConversionBar(mode);

  if (hidden) {
    return null;
  }

  if (campaignSlug === "22") {
    return (
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-off-white/95 p-3 backdrop-blur-sm sm:hidden">
        <Link
          href="/#register"
          data-analytics-event="22_register_click"
          className="block rounded-sm bg-bronze-text px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-off-white shadow-sm hover:bg-bronze-dark"
        >
          Register Free
        </Link>
      </div>
    );
  }

  if (campaignSlug === "seen") {
    return (
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-off-white/95 p-3 backdrop-blur-sm sm:hidden">
        <Link
          href={CAMPAIGNS.seen.primaryCta.href}
          className="block rounded-sm bg-bronze-text px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-off-white shadow-sm hover:bg-bronze-dark"
        >
          {CAMPAIGNS.seen.primaryCta.label}
        </Link>
      </div>
    );
  }

  if (campaignSlug === "ruck") {
    const campaign = CAMPAIGNS.ruck;
    return (
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-ink/10 bg-off-white/95 p-3 backdrop-blur-sm sm:hidden">
        <a
          href={campaign.primaryCta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-sm bg-bronze-text px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-off-white shadow-sm hover:bg-bronze-dark"
        >
          {campaign.primaryCta.label}
        </a>
        <Link
          href="/#beneficiaries"
          className="action-control inline-flex items-center justify-center font-bold flex-1 border-2 border-navy bg-off-white px-4 py-3 text-center text-[15px] text-navy hover:bg-white"
        >
          Donate
        </Link>
      </div>
    );
  }

  // The org site's two standing calls to action, on every page: Get Help
  // Now (Connection) and Donate (Impact) — the same pair the desktop header
  // carries.
  if (mode === "org") {
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

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-off-white/95 p-3 backdrop-blur-sm sm:hidden">
      <a
        href={DONATE_URL}
        data-analytics-event="donate_click"
        className="block rounded-sm bg-bronze-text px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-off-white shadow-sm hover:bg-bronze-dark"
      >
        {DONATE_LINK.label}
      </a>
    </div>
  );
}
