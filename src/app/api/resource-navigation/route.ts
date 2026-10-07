import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { handlePublicForm, insertionFailed, skipWhenSupabaseUnconfigured } from "@/lib/public-write";
import { resourceNavigationSchema } from "@/lib/validation/resource-support";

export async function POST(request: Request) {
  return handlePublicForm(request, { rateLimitKey: "resource-navigation", binding: "RATE_LIMITER_FORMS", schema: resourceNavigationSchema, turnstileAction: "resource_navigation" }, "resource navigation", async (payload) => {
    const row = { ...payload, state: payload.state || null, priorities: payload.priorities || null, privacyConcerns: payload.privacyConcerns || null, avoid: payload.avoid || null, status: "new" };
    const unconfigured = skipWhenSupabaseUnconfigured("resource navigation", row);
    if (unconfigured) return unconfigured;
    const { error } = await createAdminClient().from("resource_navigation_requests").insert({ seeking_for: row.seekingFor, population: row.population, state: row.state, need: row.need, priorities: row.priorities, privacy_concerns: row.privacyConcerns, avoid: row.avoid, email: row.email, status: row.status });
    return insertionFailed("resource navigation", error) ?? NextResponse.json({ ok: true });
  });
}
