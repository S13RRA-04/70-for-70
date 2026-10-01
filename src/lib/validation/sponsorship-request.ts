/**
 * Sponsorship taxonomy shared by the admin review queue
 * (/admin/sponsorships) and its detail pages.
 *
 * There is deliberately no intake schema here: public sponsorship submissions
 * are closed pending written federal ethics approval, /sponsors/request
 * redirects to /sponsors, and /api/sponsorship-requests answers 410. The
 * prior schema, form, and route are preserved in git history. The
 * `sponsorship_requests` table and its history table are untouched.
 */

export const PROPOSED_TIERS = ["mile", "supporting", "mission", "presenting", "unsure"] as const;

export const SUPPORT_TYPES = [
  "cash",
  "goods",
  "services",
  "travel",
  "equipment",
  "race_entry",
  "other",
] as const;

export const SUPPORT_TYPE_LABELS: Record<(typeof SUPPORT_TYPES)[number], string> = {
  cash: "Cash",
  goods: "Goods",
  services: "Services",
  travel: "Travel",
  equipment: "Equipment",
  race_entry: "Race Entry",
  other: "Other",
};

export const PROPOSED_TIER_LABELS: Record<(typeof PROPOSED_TIERS)[number], string> = {
  mile: "Mile Sponsor ($1,000+)",
  supporting: "Supporting Sponsor ($2,500+)",
  mission: "Mission Sponsor ($5,000+)",
  presenting: "Presenting Sponsor ($10,000+)",
  unsure: "Not sure yet",
};
