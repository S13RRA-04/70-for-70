import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PartnerLogo } from "@/components/shared/partner-logo";
import type { MissionPartnerRow } from "@/types/database";

/**
 * Full-width, premium treatment for Presenting Partner tier — deliberately
 * distinct from the grid cards other tiers use (see MissionPartnerCard).
 * Renders nothing when there are no Presenting Partners yet; the page never
 * shows an empty tier heading (see src/app/sponsors/page.tsx).
 */
export function PresentingPartnerFeature({ partner }: { partner: MissionPartnerRow }) {
  return (
    <div className="overflow-hidden rounded-sm border-2 border-bronze bg-ink text-off-white">
      <div className="flex flex-col gap-8 p-8 sm:p-12 md:flex-row md:items-center">
        <PartnerLogo
          name={partner.name}
          logoUrl={partner.logo_url}
          logoLightUrl={partner.logo_light_url}
          logoDarkUrl={partner.logo_dark_url}
          background="dark"
          className="h-40 w-full shrink-0 md:w-72"
        />

        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">Presenting Partner</p>
          <h3 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-off-white sm:text-4xl">
            {partner.name}
          </h3>

          {partner.support_type && (
            <p className="mt-4 max-w-xl text-base leading-relaxed text-off-white/80">{partner.support_type}</p>
          )}

          {partner.website_url && (
            <Link
              href={partner.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-bronze-light hover:text-bronze"
            >
              Visit {partner.name}
              <ExternalLink size={14} aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
