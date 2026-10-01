import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/client-ip";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isRateLimited } from "@/lib/rate-limit";
import { inquirySchema } from "@/lib/validation/inquiry";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { logServerError, logServerWarn } from "@/lib/log";

const MIN_FILL_TIME_MS = 1_500;

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (await isRateLimited(`inquiry:${ip}`, { limit: 5, windowMs: 10 * 60_000, binding: "RATE_LIMITER_FORMS" })) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.data ? "Invalid submission." : "Please check the form and try again." },
      { status: 400 },
    );
  }

  const { companyWebsite, renderedAt, organization, phone, website, turnstileToken, ...rest } =
    parsed.data;

  const isBot =
    Boolean(companyWebsite) ||
    Date.now() - renderedAt < MIN_FILL_TIME_MS ||
    !(await verifyTurnstileToken(turnstileToken, "inquiry", ip));

  if (isBot) {
    // Respond as if successful so bots don't learn which check tripped.
    return NextResponse.json({ ok: true });
  }

  if (!isSupabaseConfigured()) {
    logServerWarn("inquiries: not persisted (Supabase not configured)", rest);
    return NextResponse.json({ ok: true });
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("inquiries").insert({
      ...rest,
      organization: organization || null,
      phone: phone || null,
      website: website || null,
      status: "new",
    });

    if (error) {
      logServerError("inquiries: insert failed", error);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    logServerError("inquiries: submission failed", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
