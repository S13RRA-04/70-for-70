import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isRateLimited } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation/app-auth";

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(`app-login:${ip}`, { limit: 10, windowMs: 10 * 60_000 })) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Enter your email and password." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return NextResponse.json({ ok: false, error: "Incorrect email or password." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
