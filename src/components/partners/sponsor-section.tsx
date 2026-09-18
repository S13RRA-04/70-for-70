import { Container } from "@/components/shared/container";
import { MissionPartnerCard } from "@/components/partners/mission-partner-card";
import { TIER_THEME } from "@/lib/tier-theme";
import { MISSION_PARTNER_TIERS } from "@/lib/constants";
import type { MissionPartnerRow, MissionPartnerTier } from "@/types/database";

/**
 * One sponsorship-tier section — heading (tier name primary, value range
 * secondary) plus that tier's card grid. Every visual dimension (grid
 * density, logo size, card padding/border, heading size, section spacing)
 * comes from TIER_THEME, so a tier's prominence is controlled in one place
 * rather than hand-tuned per section. Renders nothing for a tier with no
 * current partners — never show an empty sponsorship-level heading.
 */
export function SponsorSection({
  tier,
  partners,
  borderTop = true,
}: {
  tier: Exclude<MissionPartnerTier, "presenting-partner">;
  partners: MissionPartnerRow[];
  borderTop?: boolean;
}) {
  if (partners.length === 0) return null;

  const theme = TIER_THEME[tier];
  const tierInfo = MISSION_PARTNER_TIERS.find((t) => t.id === tier);
  if (!tierInfo) return null;

  return (
    <section
      className={`${theme.sectionPadding} ${theme.sectionBackground ?? ""} ${borderTop ? "border-t border-ink/10" : ""}`}
    >
      <Container>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className={`font-display ${theme.headingSize} font-bold uppercase tracking-tight text-ink`}>
            {tierInfo.name}
          </h2>
          <p className="text-sm text-charcoal-light">{tierInfo.range} in qualifying campaign support</p>
        </div>

        <div className={`mt-6 grid gap-6 ${theme.gridCols}`}>
          {partners.map((partner) => (
            <MissionPartnerCard key={partner.id} partner={partner} tier={tier} />
          ))}
        </div>
      </Container>
    </section>
  );
}
