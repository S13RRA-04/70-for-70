import { PartnerLogo } from "@/components/shared/partner-logo";
import type { MissionPartnerRow } from "@/types/database";

/**
 * Compact, homepage-appropriate partner recognition — a Presenting Partner
 * called out at larger size, then a responsive logo grid for everyone
 * else. Distinct from /sponsors' full tier-by-tier sections (SponsorSection,
 * MissionPartnerCard): those are full-page-section weight with benefits
 * copy per tier; this is just "who's behind this," built from the same
 * PartnerLogo primitive those use.
 */
export function PartnerLogoWall({
  presentingPartners,
  otherPartners,
}: {
  presentingPartners: MissionPartnerRow[];
  otherPartners: MissionPartnerRow[];
}) {
  return (
    <div>
      {presentingPartners.length > 0 && (
        <div className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bronze">Presenting Partner</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {presentingPartners.map((partner) => (
              <PartnerLogo
                key={partner.id}
                name={partner.name}
                logoUrl={partner.logo_url}
                logoLightUrl={partner.logo_light_url}
                logoDarkUrl={partner.logo_dark_url}
                background={partner.logo_background}
                className="h-24"
              />
            ))}
          </div>
        </div>
      )}

      {otherPartners.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {otherPartners.map((partner) => (
            <PartnerLogo
              key={partner.id}
              name={partner.name}
              logoUrl={partner.logo_url}
              logoLightUrl={partner.logo_light_url}
              logoDarkUrl={partner.logo_dark_url}
              background={partner.logo_background}
              className="h-16"
            />
          ))}
        </div>
      )}
    </div>
  );
}
