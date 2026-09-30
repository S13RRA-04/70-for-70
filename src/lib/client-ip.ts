import "server-only";

/**
 * The caller's IP, for use as a rate-limit key only — never for authorization
 * or anything else that a spoofed value could be used to influence.
 *
 * `CF-Connecting-IP` is the only header trusted here: Cloudflare sets it from
 * the actual TCP connection and overwrites any client-supplied value on every
 * request, so it can't be forged. `x-forwarded-for` deliberately is NOT the
 * primary source — Cloudflare *appends* the real address to whatever the
 * visitor already sent, so its leftmost entry is attacker-controlled. Keying
 * limits off that let any caller mint a fresh bucket per request, which is how
 * the previous per-route `getClientIp` copies silently stopped limiting
 * anything.
 *
 * Falls back to X-Forwarded-For only where Cloudflare isn't in front (local
 * `next dev`), then to a single shared bucket, which fails closed — a burst
 * from many unidentified callers gets throttled together rather than not at all.
 */
export function getClientIp(request: Request): string {
  const cloudflareIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cloudflareIp) return cloudflareIp;

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwardedFor) return forwardedFor;

  return "unknown";
}