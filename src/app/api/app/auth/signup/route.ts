import { NextResponse } from "next/server";
import { readRateLimitedJson } from "@/lib/api-request";
import { APP_URL } from "@/lib/constants";
import { logServerError } from "@/lib/log";
import { createClient } from "@/lib/supabase/server";
import { signupSchema } from "@/lib/validation/app-auth";

/**
 * Creates the auth.users row via Supabase Auth — public.profiles is
 * auto-created by the handle_new_user() trigger (see schema.sql), reading
 * first_name/last_name/city/state/phone out of the `data` passed here as
 * user_metadata. Whether the returned session is immediately usable
 * depends on the Supabase project's "Confirm email" setting, which this
 * app has no visibility into from here — both outcomes are handled below.
 */
export async function POST(request: Request) {
  const outcome = await readRateLimitedJson(
    request,
    {
      rateLimitKey: "signup",
      schema: signupSchema,
      invalidError: (error) => error.issues[0]?.message ?? "Please check the form and try again.",
    },
    () => NextResponse.json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429 }),
  );
  if ("response" in outcome) return outcome.response;

  const data = outcome.data;
  const supabase = await createClient();

  const { data: signUpData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${APP_URL}/app/auth/callback`,
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        city: data.city,
        state: data.state,
        phone: data.phone || null,
        marketing_consent: data.marketingConsent,
      },
    },
  });

  if (error) {
    logServerError("app-signup: failed", {
      status: error.status,
      message: error.message,
      code: error.code,
    });
    const message = error.message.toLowerCase().includes("already registered")
      ? "An account with this email already exists. Try logging in instead."
      : "Something went wrong creating your account. Please try again.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }

  // A null session with a user present means email confirmation is
  // required before the account can sign in.
  const needsEmailConfirmation = Boolean(signUpData.user) && !signUpData.session;

  return NextResponse.json({ ok: true, needsEmailConfirmation });
}
