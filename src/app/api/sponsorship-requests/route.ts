import { NextResponse } from "next/server";

/**
 * Public sponsorship intake is closed pending written federal ethics
 * approval — see /sponsors, which now redirects to /partners. The
 * `sponsorship_requests` table, its history table, and the admin review
 * queue at /admin/sponsorships are untouched; only new public submissions
 * through this endpoint are blocked. Prior implementation (validation,
 * rate limiting, insert, notification) is preserved in git history.
 */
export async function POST() {
  return NextResponse.json(
    { ok: false, error: "Sponsorship intake is currently closed." },
    { status: 410 },
  );
}
