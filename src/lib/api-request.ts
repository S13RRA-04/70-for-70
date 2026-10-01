import "server-only";

import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/client-ip";
import { isRateLimited } from "@/lib/rate-limit";
import type { ZodError, ZodType } from "zod";

/**
 * Rate limit + JSON parse + zod validation for the app's session-bound API
 * routes — the part of the public-write pipeline that does *not* apply here,
 * since none of them take a browser form (no honeypot, no fill-time, no
 * Turnstile). Bucket keys stay `app-<name>:<ip>` under RATE_LIMITER_AUTH.
 *
 * `onRateLimited` is a callback because these routes deliberately don't agree
 * on what a throttle looks like: /api/app/auth/reset-password answers
 * `{ ok: true }` to everyone, throttled or not, so a caller can't learn
 * anything about the address they guessed.
 */
export async function readRateLimitedJson<T>(
  request: Request,
  {
    rateLimitKey,
    schema,
    invalidError,
  }: {
    rateLimitKey: string;
    schema: ZodType<T>;
    /** A fixed message, or a function of the parse error to surface its first issue. */
    invalidError: string | ((error: ZodError) => string);
  },
  onRateLimited: () => NextResponse,
): Promise<{ data: T } | { response: NextResponse }> {
  const ip = getClientIp(request);

  if (
    await isRateLimited(`app-${rateLimitKey}:${ip}`, {
      limit: 5,
      windowMs: 10 * 60_000,
      binding: "RATE_LIMITER_AUTH",
    })
  ) {
    return { response: onRateLimited() };
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { response: NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 }) };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const error = typeof invalidError === "function" ? invalidError(parsed.error) : invalidError;
    return { response: NextResponse.json({ ok: false, error }, { status: 400 }) };
  }

  return { data: parsed.data };
}
