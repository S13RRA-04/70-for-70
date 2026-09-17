import type { MissionPartnerTier } from "@/types/database";

/**
 * Visual identity per sponsorship tier — shared by MissionPartnerCard (the
 * confirmed-partner grid) and SponsorshipProgression (the recruitment
 * ladder) so a tier reads the same way in both places. Deliberately built
 * only from the existing distressed/military palette (bronze/olive/sand/
 * ink) rather than introducing new colors — the progression from quiet
 * sand tones up through bronze and into olive is what signals "higher
 * tier," not an arbitrary color-per-tier scheme. Presenting Partner isn't
 * here: it already gets a fully bespoke dark treatment via
 * PresentingPartnerFeature, the natural next step up from Mission
 * Sponsor's ink-badge accent below.
 */
export interface TierTheme {
  /** Card border color/weight. */
  border: string;
  /** Card background. */
  background: string;
  /** Tier-name pill background. */
  badgeBg: string;
  /** Tier-name pill text color. */
  badgeText: string;
  /** Extra top accent stripe for the two tiers just below Presenting Partner. */
  accentBar?: string;
}

export const TIER_THEME: Record<Exclude<MissionPartnerTier, "presenting-partner">, TierTheme> = {
  "mission-sponsor": {
    border: "border-bronze",
    background: "bg-off-white",
    badgeBg: "bg-ink",
    badgeText: "text-bronze-light",
    accentBar: "border-t-4 border-t-bronze",
  },
  "mission-partner": {
    border: "border-olive/50",
    background: "bg-off-white",
    badgeBg: "bg-olive",
    badgeText: "text-off-white",
  },
  advocate: {
    border: "border-bronze/50",
    background: "bg-off-white",
    badgeBg: "bg-bronze",
    badgeText: "text-off-white",
  },
  ally: {
    border: "border-bronze/20",
    background: "bg-off-white",
    badgeBg: "bg-bronze/10",
    badgeText: "text-bronze",
  },
  "campaign-supporter": {
    border: "border-ink/10",
    background: "bg-sand-light",
    badgeBg: "bg-ink/5",
    badgeText: "text-charcoal-light",
  },
};
