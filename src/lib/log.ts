import "server-only";

/**
 * Server-side logging with PII/secret scrubbing.
 *
 * Route handlers and data loaders previously logged raw request bodies,
 * Supabase `error` objects, and config values straight to the Worker logs.
 * Those logs are retained and greppable, and the payloads routinely contained
 * submitter emails, phone numbers, auth tokens, and service-role keys. This
 * module is the single place that formats them: strings get email/bearer
 * scrubbing, and object keys that name a secret are dropped entirely.
 *
 * Nothing here should throw — a logger that fails is worse than one that
 * over-redacts. All entry points swallow their own errors.
 */

const REDACTED = "[redacted]";

// Key names whose VALUE is never safe to log (matched case-insensitively as a
// substring, so `access_token`, `SUPABASE_SERVICE_ROLE_KEY`, etc. all hit).
const SENSITIVE_KEY =
  /(pass(word)?|secret|token|authorization|auth|cookie|api[-_]?key|service[-_]?role|credential|session|otp|pin)/i;

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const BEARER = /\b(bearer|basic)\s+[A-Za-z0-9._~+/=-]+/gi;

/** Scrubs emails and auth headers out of a free-text string. */
function scrubString(value: string): string {
  return value.replace(EMAIL, "[email redacted]").replace(BEARER, "$1 [redacted]");
}

/**
 * Returns a structured, log-safe clone of `value`. Handles cycles, Errors, and
 * non-plain objects without ever calling user getters that might throw.
 */
export function redact(value: unknown, seen = new WeakSet<object>()): unknown {
  if (typeof value === "string") return scrubString(value);
  if (value === null || typeof value !== "object") return value;

  if (value instanceof Error) {
    return { name: value.name, message: scrubString(value.message) };
  }

  if (value instanceof Date) return value.toISOString();

  if (seen.has(value)) return "[circular]";
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => redact(item, seen));
  }

  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    out[key] = SENSITIVE_KEY.test(key) ? REDACTED : redact(val, seen);
  }
  return out;
}

/** Logs a server error with a stable, greppable context tag. */
export function logServerError(context: string, error: unknown, meta?: unknown): void {
  try {
    if (meta === undefined) {
      console.error(`[${context}]`, redact(error));
    } else {
      console.error(`[${context}]`, redact(error), redact(meta));
    }
  } catch {
    console.error(`[${context}] (error could not be redacted)`);
  }
}

/**
 * Logs a warning. Use for degraded-but-recoverable paths (e.g. "Supabase not
 * configured, falling back to seed data") where the payload may still carry
 * submitter PII. Pass any payload as `meta` — it is scrubbed.
 */
export function logServerWarn(context: string, meta?: unknown): void {
  try {
    if (meta === undefined) {
      console.warn(`[${context}]`);
    } else {
      console.warn(`[${context}]`, redact(meta));
    }
  } catch {
    console.warn(`[${context}]`);
  }
}
