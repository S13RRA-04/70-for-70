import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { TeamBenefitBadge } from "@/components/partners/team-benefit-badge";
import { TIER_THEME } from "@/lib/tier-theme";
import { MISSION_PARTNER_TIERS } from "@/lib/constants";
import type { MissionPartnerRow, MissionPartnerTier } from "@/types/database";

/** Card size, driven by the partner's tier — see mapTierToSize in src/app/sponsors/page.tsx. */
export type MissionPartnerCardSize = "large" | "medium" | "compact";

const LOGO_HEIGHT: Record<MissionPartnerCardSize, string> = {
  large: "h-32",
  medium: "h-24",
  compact: "h-20",
};

const NAME_SIZE: Record<MissionPartnerCardSize, string> = {
  large: "text-2xl",
  medium: "text-xl",
  compact: "text-base",
};

const PADDING: Record<MissionPartnerCardSize, string> = {
  large: "p-8",
  medium: "p-6",
  compact: "p-4",
};

export function MissionPartnerCard({
  partner,
  size = "medium",
  tier,
}: {
  partner: MissionPartnerRow;
  size?: MissionPartnerCardSize;
  /** Drives the card's tier-specific theme (border/background/badge) — see src/lib/tier-theme.ts. Omit for an untiered official/additional partner. */
  tier?: Exclude<MissionPartnerTier, "presenting-partner">;
}) {
  const theme = tier ? TIER_THEME[tier] : undefined;
  const tierName = tier ? MISSION_PARTNER_TIERS.find((t) => t.id === tier)?.name : undefined;

  return (
    <div
      className={`flex flex-col rounded-sm border ${theme?.background ?? "bg-off-white"} ${PADDING[size]} ${
        theme?.border ?? "border-ink/10"
      } ${theme?.accentBar ?? ""}`}
    >
      <PartnerLogo
        name={partner.name}
        logoUrl={partner.logo_url}
        logoLightUrl={partner.logo_light_url}
        logoDarkUrl={partner.logo_dark_url}
        background={partner.logo_background}
        className={`${LOGO_HEIGHT[size]} w-full`}
      />

      <h3 className={`mt-4 font-display ${NAME_SIZE[size]} font-semibold uppercase tracking-wide text-ink`}>
        {partner.name}
      </h3>

      {tierName && theme && (
        <span
          className={`mt-2 inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${theme.badgeBg} ${theme.badgeText}`}
        >
          {tierName}
        </span>
      )}

      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-bronze">
        {partner.relationship_label}
      </p>

      {partner.designation && (
        <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-ink">{partner.designation}</p>
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
          className="mt-5 inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
        >
          Visit Partner
          <ExternalLink size={13} aria-hidden />
        </Link>
      )}
    </div>
  );
}
