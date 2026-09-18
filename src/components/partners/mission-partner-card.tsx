import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { PartnerRoleBadge } from "@/components/partners/partner-role-badge";
import { TeamBenefitBadge } from "@/components/partners/team-benefit-badge";
import { TIER_THEME } from "@/lib/tier-theme";
import { MISSION_PARTNER_TIERS } from "@/lib/constants";
import type { MissionPartnerRow, MissionPartnerTier } from "@/types/database";

/** Untiered-card fallback — smaller and quieter than any formal sponsorship tier. See TIER_THEME for the tiered equivalents. */
const UNTIERED_CARD = {
  border: "border border-ink/10",
  background: "bg-off-white",
  padding: "p-4",
  logoHeight: "h-16",
  nameSize: "text-sm",
};

export function MissionPartnerCard({
  partner,
  tier,
  categoryLabel,
}: {
  partner: MissionPartnerRow;
  /** Drives the card's tier-specific theme (border/background/logo size/badge) — see src/lib/tier-theme.ts. Omit for an untiered campaign partner. */
  tier?: Exclude<MissionPartnerTier, "presenting-partner">;
  /** Shown as a small category chip instead of a tier badge — for untiered "Campaign Partners & Services" cards (e.g. "Gear", "Printing"). Ignored when `tier` is set. */
  categoryLabel?: string;
}) {
  const theme = tier ? TIER_THEME[tier] : undefined;
  const tierName = tier ? MISSION_PARTNER_TIERS.find((t) => t.id === tier)?.name : undefined;

  const border = theme?.border ?? UNTIERED_CARD.border;
  const background = theme?.background ?? UNTIERED_CARD.background;
  const padding = theme?.padding ?? UNTIERED_CARD.padding;
  const logoHeight = theme?.logoHeight ?? UNTIERED_CARD.logoHeight;
  const nameSize = theme?.nameSize ?? UNTIERED_CARD.nameSize;

  return (
    <div className={`flex flex-col rounded-sm ${background} ${padding} ${border} ${theme?.accentBar ?? ""}`}>
      <PartnerLogo
        name={partner.name}
        logoUrl={partner.logo_url}
        logoLightUrl={partner.logo_light_url}
        logoDarkUrl={partner.logo_dark_url}
        background={partner.logo_background}
        className={`${logoHeight} w-full`}
      />

      <h3 className={`mt-4 font-display ${nameSize} font-semibold uppercase tracking-wide text-ink`}>
        {partner.name}
      </h3>

      {tierName && theme ? (
        <span
          className={`mt-2 inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${theme.badgeBg} ${theme.badgeText}`}
        >
          {tierName}
        </span>
      ) : (
        categoryLabel && (
          <div className="mt-2">
            <PartnerRoleBadge label={categoryLabel} variant="category" />
          </div>
        )
      )}

      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-bronze">
        {partner.relationship_label}
      </p>

      {partner.designation && (
        <div className="mt-2">
          <PartnerRoleBadge label={partner.designation} />
        </div>
      )}

      {partner.support_type && (
        <p className="mt-3 text-sm leading-snug text-charcoal-light">{partner.support_type}</p>
      )}

      {partner.partner_type === "team-benefit-partner" && (
        <div className="mt-3">
          <TeamBenefitBadge />
        </div>
      )}

      {partner.website_url && (
        <Link
          href={partner.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
        >
          Visit Partner
          <ExternalLink size={13} aria-hidden />
        </Link>
      )}
    </div>
  );
}
