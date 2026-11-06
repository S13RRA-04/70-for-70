import { NextResponse } from "next/server";
import { notifyInquirySubmitted } from "@/lib/notifications";
import { handlePublicForm, insertionFailed, skipWhenSupabaseUnconfigured } from "@/lib/public-write";
import { createAdminClient } from "@/lib/supabase/admin";
import { inquirySchema } from "@/lib/validation/inquiry";

export async function POST(request: Request) {
  return handlePublicForm(
    request,
    {
      rateLimitKey: "inquiry",
      binding: "RATE_LIMITER_FORMS",
      schema: inquirySchema,
      turnstileAction: "inquiry",
    },
    "inquiries",
    async ({ organization, phone, website, ...rest }) => {
      const row = {
        ...rest,
        organization: organization || null,
        phone: phone || null,
        website: website || null,
        status: "new",
      };

      const unconfigured = skipWhenSupabaseUnconfigured("inquiries", row);
      if (unconfigured) return unconfigured;

      const { error } = await createAdminClient().from("inquiries").insert(row);

      const failed = insertionFailed("inquiries", error);
      if (failed) return failed;

      await notifyInquirySubmitted(row);

      return NextResponse.json({ ok: true });
    },
  );
}
