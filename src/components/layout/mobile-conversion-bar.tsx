"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CAMPAIGNS, DONATE_LINK } from "@/lib/constants";
import type { CampaignSlug, SiteMode } from "@/lib/site-mode";

/**
 * Pages that already surface their own prominent Fund/Donate/Sponsor CTA in
 * the page body — showing this bar there would be redundant, not additive.
 * Admin routes never show it at all. Campaign-only: the org domain
 * shouldn't push a persistent fundraising CTA — see README's
 * "Movement/Campaign Domain Split".
 */
const HIDDEN_PREFIXES = ["/admin", "/donate", "/beneficiaries"];

function useHideConversionBar(mode: SiteMode) {
  const pathname = usePathname();
  return mode !== "campaign" || HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
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

  if (campaignSlug === "ruck") {
    const campaign = CAMPAIGNS.ruck;
    return (
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-ink/10 bg-off-white/95 p-3 backdrop-blur-sm sm:hidden">
        <a
          href={campaign.primaryCta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-sm bg-bronze px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-off-white shadow-sm hover:bg-bronze-light"
        >
          {campaign.primaryCta.label}
        </a>
        <Link
          href="/#beneficiaries"
          className="flex-1 rounded-sm border border-ink/20 bg-off-white px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
        >
          Donate
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-off-white/95 p-3 backdrop-blur-sm sm:hidden">
      <Link
        href={DONATE_LINK.href}
        data-analytics-event="donate_click"
        className="block rounded-sm bg-bronze px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-off-white shadow-sm hover:bg-bronze-light"
      >
        {DONATE_LINK.label}
      </Link>
    </div>
  );
}
