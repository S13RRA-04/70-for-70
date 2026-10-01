import { NextResponse } from "next/server";
import { handlePublicForm, insertionFailed, skipWhenSupabaseUnconfigured } from "@/lib/public-write";
import { createAdminClient } from "@/lib/supabase/admin";
import { donationReportSchema } from "@/lib/validation/donation-report";

/** Marks a row as self-reported rather than reconciled against a payment processor. */
const SELF_REPORTED_REFERENCE = "Self-reported on site";

export async function POST(request: Request) {
  return handlePublicForm(
    request,
    {
      rateLimitKey: "donation-report",
      binding: "RATE_LIMITER_FORMS",
      schema: donationReportSchema,
      turnstileAction: "donation_report",
    },
    "donations",
    async ({ donorName, donorEmail, anonymous, organizationBenefited, mileNumber, amount }) => {
      const unconfigured = skipWhenSupabaseUnconfigured("donations");
      if (unconfigured) return unconfigured;

      const admin = createAdminClient();
      let mileId: string | null = null;

      if (mileNumber) {
        const { data: mile } = await admin
          .from("miles")
          .select("id")
          .eq("mile_number", mileNumber)
          .single();
        mileId = mile?.id ?? null;
      }

      // Unverified until an admin confirms it at /admin/donations — the same
      // gate a phoned/emailed-in gift goes through.
      const { error } = await admin.from("donations").insert({
        donor_name: donorName || "Anonymous",
        donor_email: donorEmail || null,
        amount,
        organization_benefited: organizationBenefited,
        anonymous,
        mile_id: mileId,
        verified: false,
        external_reference: SELF_REPORTED_REFERENCE,
      });

      return insertionFailed("donations", error) ?? NextResponse.json({ ok: true });
    },
  );
}
