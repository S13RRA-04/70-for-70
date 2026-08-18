import { z } from "zod";

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

export const sponsorshipRequestSchema = z.object({
  contactName: z.string().trim().min(1, "Contact name is required").max(200),
  organizationName: z.string().trim().min(1, "Organization name is required").max(200),
  email: z.string().trim().email("Enter a valid email address").max(320),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  website: z.string().trim().max(300).optional().or(z.literal("")),
  industry: z.string().trim().max(200).optional().or(z.literal("")),

  proposedTier: z.enum(PROPOSED_TIERS).optional(),
  cashValue: z.coerce.number().min(0).optional(),
  inKindValue: z.coerce.number().min(0).optional(),
  supportType: z.array(z.enum(SUPPORT_TYPES)).min(1, "Select at least one type of support"),
  description: z.string().trim().min(1, "Please describe the proposed support").max(5000),
  requestedBenefits: z.string().trim().max(2000).optional().or(z.literal("")),
  requestedMileNumber: z.coerce.number().int().min(1).max(70).optional(),
  referralSource: z.string().trim().max(300).optional().or(z.literal("")),
  message: z.string().trim().max(5000).optional().or(z.literal("")),

  acknowledgedPendingReview: z.literal(true, {
    message: "You must acknowledge that this is a request, not an acceptance.",
  }),

  // Honeypot + timing bot mitigation, same pattern as the general inquiry form.
  companyWebsite: z.string().max(0, "").optional().or(z.literal("")),
  renderedAt: z.number(),
});

export type SponsorshipRequestInput = z.infer<typeof sponsorshipRequestSchema>;
