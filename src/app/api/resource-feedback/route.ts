import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { handlePublicForm, insertionFailed, skipWhenSupabaseUnconfigured } from "@/lib/public-write";
import { resourceFeedbackSchema } from "@/lib/validation/resource-support";

export async function POST(request: Request) {
  return handlePublicForm(request, { rateLimitKey: "resource-feedback", binding: "RATE_LIMITER_FORMS", schema: resourceFeedbackSchema, turnstileAction: "resource_feedback", limit: 10 }, "resource feedback", async (payload) => {
    const row = { resource_name: payload.resourceName, helpful: payload.helpful === "yes", contacted: payload.contacted, connection: payload.connection, note: payload.note || null };
    const unconfigured = skipWhenSupabaseUnconfigured("resource feedback", row);
    if (unconfigured) return unconfigured;
    const { error } = await createAdminClient().from("resource_feedback").insert(row);
    return insertionFailed("resource feedback", error) ?? NextResponse.json({ ok: true });
  });
}
