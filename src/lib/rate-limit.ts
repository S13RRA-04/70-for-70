import "server-only";

/**
 * Minimal in-memory fixed-window rate limiter, keyed by caller-supplied
 * identifier (e.g. IP). Good enough for a single-instance deployment; state
 * resets on redeploy/restart and isn't shared across instances. Swap for a
 * durable store (e.g. Upstash Redis) before scaling past one instance.
 */
const hits = new Map<string, { count: number; windowStart: number }>();

export function isRateLimited(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    hits.set(key, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  return entry.count > limit;
}
