import { ExternalLink } from "lucide-react";
import { PartnerLogo } from "@/components/shared/partner-logo";
import type { MissionPartnerRow } from "@/types/database";

/**
 * Compact partner grid for contexts with too many partners for full
 * MissionPartnerCards (e.g. /network's "Also Backing the Mission") — logos
 * only at rest, but each tile is a native <details>/<summary> disclosure
 * revealing relationship, contribution, campaign tie-in, and a website link
 * on click/tap/Enter. Native <details> needs no client-side JS and is
 * keyboard-operable by default, so this stays a Server Component. Distinct
 * from PartnerLogoWall (pure static logos, used on campaign-home where a
 * lighter, non-interactive treatment is the better fit) — not a replacement
 * for it.
 */
export function PartnerLogoDisclosure({ partners }: { partners: MissionPartnerRow[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {partners.map((partner) => (
        <details key={partner.id} className="group rounded-sm border border-ink/10 bg-off-white open:bg-sand-light/50">
          <summary className="flex cursor-pointer list-none items-center justify-center p-2 marker:content-none">
            <PartnerLogo
              name={partner.name}
              logoUrl={partner.logo_url}
              logoLightUrl={partner.logo_light_url}
              logoDarkUrl={partner.logo_dark_url}
              background={partner.logo_background}
              className="h-16 w-full border-0 p-3 shadow-none"
            />
          </summary>
          <div className="space-y-1.5 border-t border-ink/10 p-4 text-sm">
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-ink">{partner.name}</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-bronze">{partner.relationship_label}</p>
            {partner.support_type && <p className="text-xs text-charcoal-light">{partner.support_type}</p>}
            {partner.associated_campaigns && partner.associated_campaigns.length > 0 && (
              <p className="text-xs text-charcoal-light">Supports: {partner.associated_campaigns.join(", ")}</p>
            )}
            {partner.website_url && (
              <a
                href={partner.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
              >
                Visit Partner
                <ExternalLink size={11} aria-hidden="true" />
              </a>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
