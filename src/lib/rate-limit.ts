import "server-only";

/**
 * Two-tier rate limiter.
 *
 * Tier 1 — the Cloudflare Rate Limiting binding (`ratelimits` in
 * wrangler.jsonc), reached through `getCloudflareContext()`. Its counters are
 * shared across every isolate in a Cloudflare location, so a caller can't mint
 * a fresh bucket just by landing on a different isolate. The binding's window
 * is fixed by config and can only be 10 or 60 seconds.
 *
 * Tier 2 — the in-memory fixed window below. On Workers this alone is NOT
 * sufficient: module state is per-isolate, so a caller spread across N
 * isolates gets N times the intended limit. It is kept for the longer
 * per-route window the binding can't express (10–15 minutes) and as the sole
 * limiter when no binding is available (plain `next dev`, or a deploy whose
 * wrangler config hasn't been updated yet).
 *
 * Both layers fail open if the binding is missing — the intended tradeoff is
 * that a misconfigured deploy degrades to the old per-isolate behavior rather
 * than blocking every legitimate form submission.
 */

/** Minimal shape of a Workers `RateLimit` binding — avoids pulling in @cloudflare/workers-types. */
interface RateLimitBinding {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

/** Binding names declared under `ratelimits` in wrangler.jsonc. */
export type RateLimitBindingName =
  | "RATE_LIMITER_FORMS"
  | "RATE_LIMITER_AUTH"
  | "RATE_LIMITER_ADMIN";

const hits = new Map<string, { count: number; windowStart: number }>();

function inMemoryExceeded(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    hits.set(key, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  return entry.count > limit;
}

/**
 * Checks the distributed binding if one is bound. Returns false (not limited)
 * whenever the binding is unavailable, so local dev and older deploys fall
 * back to the in-memory tier instead of failing every request.
 */
async function distributedExceeded(binding: RateLimitBindingName, key: string): Promise<boolean> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const limiter = (env as unknown as Record<string, unknown>)[binding] as
      | RateLimitBinding
      | undefined;
    if (!limiter || typeof limiter.limit !== "function") return false;

    const { success } = await limiter.limit({ key });
    return !success;
  } catch {
    // Outside a Cloudflare request context (e.g. a unit test or a bare
    // `next dev` without the OpenNext dev proxy) — rely on the in-memory tier.
    return false;
  }
}

export async function isRateLimited(
  key: string,
  {
    limit = 5,
    windowMs = 60_000,
    binding,
  }: { limit?: number; windowMs?: number; binding?: RateLimitBindingName } = {},
): Promise<boolean> {
  if (binding && (await distributedExceeded(binding, key))) return true;
  return inMemoryExceeded(key, limit, windowMs);
}
