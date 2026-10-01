import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/client-ip";
import { isRateLimited } from "@/lib/rate-limit";
import { subscribeToUpdates } from "@/lib/email-list";
import { emailSignupSchema } from "@/lib/validation/email-signup";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { logServerError } from "@/lib/log";

const MIN_FILL_TIME_MS = 1_500;

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (await isRateLimited(`subscribe:${ip}`, { limit: 5, windowMs: 10 * 60_000, binding: "RATE_LIMITER_FORMS" })) {
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

  const parsed = emailSignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again." },
      { status: 400 },
    );
  }

  const { companyWebsite, renderedAt, firstName, email, turnstileToken } = parsed.data;
  const isBot =
    Boolean(companyWebsite) ||
    Date.now() - renderedAt < MIN_FILL_TIME_MS ||
    !(await verifyTurnstileToken(turnstileToken, "email_signup", ip));

  if (isBot) {
    return NextResponse.json({ ok: true });
  }

  try {
    await subscribeToUpdates(firstName, email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    logServerError("subscribe: failed", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
