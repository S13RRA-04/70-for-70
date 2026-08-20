import { CAMPAIGN_NAME, CURRENT_MISSION_NAV_LINK } from "@/lib/constants";
import type { SiteMode } from "@/lib/site-mode";

/**
 * Slim strip above the header pointing org-site visitors at the active
 * campaign, without letting it compete with "Get Involved" for the header's
 * primary-CTA slot. Org mode only — the campaign subdomain already lives
 * there, it doesn't need to advertise itself to itself.
 */
export function CampaignUtilityBar({ mode }: { mode: SiteMode }) {
  if (mode !== "org") return null;

  return (
    <a
      href={CURRENT_MISSION_NAV_LINK.href}
      className="block bg-anchor px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest text-off-white transition-colors hover:bg-anchor-light sm:px-6"
    >
      Current Mission &middot; {CAMPAIGN_NAME} <span aria-hidden="true">&#8599;</span>
    </a>
  );
}
