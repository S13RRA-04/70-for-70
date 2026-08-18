import { NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rate-limit";
import { subscribeToUpdates } from "@/lib/email-list";
import { emailSignupSchema } from "@/lib/validation/email-signup";

const MIN_FILL_TIME_MS = 1_500;

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (isRateLimited(`subscribe:${ip}`, { limit: 5, windowMs: 10 * 60_000 })) {
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

  const { companyWebsite, renderedAt, firstName, email } = parsed.data;
  const isBot = Boolean(companyWebsite) || Date.now() - renderedAt < MIN_FILL_TIME_MS;

  if (isBot) {
    return NextResponse.json({ ok: true });
  }

  try {
    await subscribeToUpdates(firstName, email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Email signup failed:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
