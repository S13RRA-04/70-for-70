import type { MissionPartnerTier } from "@/types/database";

/**
 * Full visual identity per sponsorship tier — card AND section level —
 * shared by SponsorSection/MissionPartnerCard (the confirmed-partner grid)
 * and SponsorshipProgression (the recruitment ladder) so a tier reads the
 * same way everywhere it appears. Every dimension a visitor uses to judge
 * "how big a deal is this sponsor" (grid density, logo size, padding,
 * border weight, heading size, section spacing) is controlled from here,
 * not hand-tuned per tier in JSX — see the redesign spec this was built
 * from for the full rationale.
 *
 * Built only from the existing distressed/military palette
 * (bronze/olive/sand/ink) rather than a gold/silver/bronze medal scheme —
 * the escalation is opacity/weight/scale within that palette, plus a
 * deliberate color shift to olive at Mission Partner and a shift to dark
 * ink at Mission Sponsor, not a rainbow of tier colors. Presenting Partner
 * isn't here: it already gets a fully bespoke dark treatment via
 * PresentingPartnerFeature, the natural next step up from Mission
 * Sponsor's ink-badge accent below.
 */
export interface TierTheme {
  /** Card border color/weight. */
  border: string;
  /** Card background. */
  background: string;
  /** Card padding. */
  padding: string;
  /** Logo container height — the primary lever for "this sponsor is bigger." */
  logoHeight: string;
  /** Sponsor-name text size. */
  nameSize: string;
  /** Tier-name pill background. */
  badgeBg: string;
  /** Tier-name pill text color. */
  badgeText: string;
  /** Extra top accent stripe for the tier just below Presenting Partner. */
  accentBar?: string;
  /** Grid column classes for this tier's card grid, mobile-first. */
  gridCols: string;
  /** This tier's section heading size. */
  headingSize: string;
  /** This tier's section vertical padding. */
  sectionPadding: string;
  /** This tier's section background, if it should stand apart from the page's default. */
  sectionBackground?: string;
}

export const TIER_THEME: Record<Exclude<MissionPartnerTier, "presenting-partner">, TierTheme> = {
  "mission-sponsor": {
    border: "border-2 border-bronze",
    background: "bg-off-white",
    padding: "p-8",
    logoHeight: "h-32",
    nameSize: "text-2xl",
    badgeBg: "bg-ink",
    badgeText: "text-bronze-light",
    accentBar: "border-t-4 border-t-bronze",
    gridCols: "grid-cols-1 sm:grid-cols-2",
    headingSize: "text-3xl sm:text-4xl",
    sectionPadding: "py-16 sm:py-20",
    sectionBackground: "bg-sand-light",
  },
  "mission-partner": {
    border: "border border-olive/60",
    background: "bg-off-white",
    padding: "p-7",
    logoHeight: "h-28",
    nameSize: "text-xl",
    badgeBg: "bg-olive",
    badgeText: "text-off-white",
    gridCols: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    headingSize: "text-2xl sm:text-3xl",
    sectionPadding: "py-14 sm:py-16",
  },
  advocate: {
    border: "border border-bronze/60",
    background: "bg-off-white",
    padding: "p-6",
    logoHeight: "h-24",
    nameSize: "text-lg",
    badgeBg: "bg-bronze",
    badgeText: "text-off-white",
    gridCols: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    headingSize: "text-2xl",
    sectionPadding: "py-12 sm:py-14",
  },
  ally: {
    border: "border border-bronze/25",
    background: "bg-off-white",
    padding: "p-5",
    logoHeight: "h-20",
    nameSize: "text-base",
    badgeBg: "bg-bronze/10",
    badgeText: "text-bronze",
    gridCols: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    headingSize: "text-xl",
    sectionPadding: "py-10 sm:py-12",
  },
  "campaign-supporter": {
    border: "border border-ink/10",
    background: "bg-off-white",
    padding: "p-4",
    logoHeight: "h-16",
    nameSize: "text-sm",
    badgeBg: "bg-ink/5",
    badgeText: "text-charcoal-light",
    gridCols: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5",
    headingSize: "text-lg",
    sectionPadding: "py-10 sm:py-12",
    sectionBackground: "bg-sand-light/50",
  },
};
