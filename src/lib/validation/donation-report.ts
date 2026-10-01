import { z } from "zod";
import { botCheckFields } from "./bot-check";

/**
 * Self-reported donation submitted from ExternalDonateButton's on-return
 * prompt. Inserted as an unverified `donations` row — see
 * src/app/api/donations/route.ts — and only counts toward public totals
 * once an admin verifies it at /admin/donations, same as a phoned/emailed-in gift.
 */
export const donationReportSchema = z
  .object({
    amount: z.number().positive("Enter an amount greater than $0").max(1_000_000),
    donorName: z.string().trim().max(200).optional().or(z.literal("")),
    // Optional — only used to sum cumulative giving across gifts for tier
    // recognition (see src/lib/donor-tiers.ts). Never displayed publicly.
    donorEmail: z.string().trim().email().max(320).optional().or(z.literal("")),
    anonymous: z.boolean(),
    organizationBenefited: z.string().trim().min(1).max(200),
    mileNumber: z.number().int().positive().optional(),
  })
  .extend(botCheckFields);

export type DonationReportInput = z.infer<typeof donationReportSchema>;
