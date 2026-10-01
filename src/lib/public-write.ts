import "server-only";

import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/client-ip";
import { logServerError, logServerWarn } from "@/lib/log";
import { isRateLimited, type RateLimitBindingName } from "@/lib/rate-limit";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { verifyTurnstileToken, type TurnstileAction } from "@/lib/turnstile";
import type { BotCheckInput } from "@/lib/validation/bot-check";
import type { ZodType } from "zod";

/**
 * The submission pipeline every public write route used to hand-copy: rate
 * limit → JSON parse → zod validation → honeypot + fill-time + Turnstile →
 * the route's own insert/notification → 500 on an unexpected throw.
 *
 * Two ordering decisions worth preserving:
 *
 *  - Bot checks run *after* validation, so a malformed body is a 400 no matter
 *    who sent it, and a honeypot trip still costs us nothing.
 *  - A tripped bot check answers exactly like a success. Rejecting instead
 *    would tell the sender which of the three checks caught it, and each one is
 *    individually cheap to iterate against.
 *
 * So a 5xx is the only genuine failure a route can report, which is why
 * SERVER_ERROR's wording is fixed here rather than left to each route.
 */

/** A body posted faster than a human could plausibly fill the form is a bot. */
const MIN_FILL_TIME_MS = 1_500;

const TOO_MANY_REQUESTS = { ok: false, error: "Too many requests. Please try again later." };
const INVALID_BODY = { ok: false, error: "Invalid request body." };
const INVALID_FORM = { ok: false, error: "Please check the form and try again." };
const SERVER_ERROR = { ok: false, error: "Something went wrong. Please try again." };

/** The form's own fields, with the bot-check trio already stripped off. */
type Submission<T extends BotCheckInput> = Omit<T, keyof BotCheckInput>;

export interface PublicFormOptions<T> {
  /** Namespaces the per-IP bucket — the rate-limit key is `<rateLimitKey>:<ip>`. */
  rateLimitKey: string;
  binding: RateLimitBindingName;
  schema: ZodType<T>;
  /** Must match the `action` the form's Turnstile widget renders. */
  turnstileAction: TurnstileAction;
  limit?: number;
  windowMs?: number;
}

export async function handlePublicForm<T extends BotCheckInput>(
  request: Request,
  { rateLimitKey, binding, schema, turnstileAction, limit = 5, windowMs = 10 * 60_000 }: PublicFormOptions<T>,
  context: string,
  submit: (data: Submission<T>) => Promise<NextResponse>,
): Promise<NextResponse> {
  const ip = getClientIp(request);

  if (await isRateLimited(`${rateLimitKey}:${ip}`, { limit, windowMs, binding })) {
    return NextResponse.json(TOO_MANY_REQUESTS, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(INVALID_BODY, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(INVALID_FORM, { status: 400 });
  }

  const { companyWebsite, renderedAt, turnstileToken, ...payload } = parsed.data;

  const isBot =
    Boolean(companyWebsite) ||
    Date.now() - renderedAt < MIN_FILL_TIME_MS ||
    !(await verifyTurnstileToken(turnstileToken, turnstileAction, ip));

  if (isBot) {
    return NextResponse.json({ ok: true });
  }

  try {
    return await submit(payload);
  } catch (error) {
    logServerError(`${context}: submission failed`, error);
    return NextResponse.json(SERVER_ERROR, { status: 500 });
  }
}

/** The shared 500, for a route step that failed outside an insert (a lookup, a notification). */
export function serverError(context: string, error: unknown): NextResponse {
  logServerError(context, error);
  return NextResponse.json(SERVER_ERROR, { status: 500 });
}

/**
 * Turns a failed insert into the shared 500, or returns null when the write
 * succeeded. PostgREST reports failures in the result rather than by throwing,
 * so every route needs this — the throw path in handlePublicForm is for the
 * things that *do* throw (a misconfigured admin client, a notification bug).
 */
export function insertionFailed(context: string, error: unknown): NextResponse | null {
  if (error === null || error === undefined) return null;
  return serverError(`${context}: insert failed`, error);
}

/**
 * Public writes are a no-op when Supabase isn't configured (local dev, or a
 * deploy missing the service-role key) rather than a 500 for a human who filled
 * the form in properly. Returns the response to send, or null to persist.
 */
export function skipWhenSupabaseUnconfigured(context: string, payload?: unknown): NextResponse | null {
  if (isSupabaseConfigured()) return null;
  logServerWarn(`${context}: not persisted (Supabase not configured)`, payload);
  return NextResponse.json({ ok: true });
}
