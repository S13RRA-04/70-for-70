import { NextResponse } from "next/server";
import { readRateLimitedJson } from "@/lib/api-request";
import { logServerError } from "@/lib/log";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validation/app-auth";

export async function POST(request: Request) {
  const outcome = await readRateLimitedJson(
    request,
    { rateLimitKey: "login", schema: loginSchema, invalidError: "Enter your email and password." },
    () => NextResponse.json({ ok: false, error: "Too many attempts. Please try again later." }, { status: 429 }),
  );
  if ("response" in outcome) return outcome.response;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(outcome.data);

  if (error) {
    // Status/code only — never the submitted address, and redact() scrubs any
    // email Supabase echoed back inside the message.
    logServerError("app-login: sign in failed", {
      status: error.status,
      message: error.message,
      code: error.code,
    });
    return NextResponse.json({ ok: false, error: "Incorrect email or password." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
