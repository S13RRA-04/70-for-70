import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isRateLimited } from "@/lib/rate-limit";
import { messageSchema } from "@/lib/validation/message";

const MIN_FILL_TIME_MS = 1_500;

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (isRateLimited(`message:${ip}`, { limit: 5, windowMs: 10 * 60_000 })) {
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

  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 });
  }

  const { companyWebsite, renderedAt, ...rest } = parsed.data;
  const isBot = Boolean(companyWebsite) || Date.now() - renderedAt < MIN_FILL_TIME_MS;
  if (isBot) {
    // Respond as if successful so bots don't learn which check tripped.
    return NextResponse.json({ ok: true });
  }

  if (!isSupabaseConfigured()) {
    console.warn("Message received but Supabase is not configured; not persisted:", rest);
    return NextResponse.json({ ok: true });
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("messages").insert({ ...rest, approved: false });
    if (error) {
      console.error("Failed to insert message:", error);
      return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Message submission failed:", error);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
