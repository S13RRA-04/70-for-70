import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/client-ip";
import { notifyVoicesSubmissionReceived } from "@/lib/notifications";
import { serverError } from "@/lib/public-write";
import { isRateLimited } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { voicesFinalizeSchema } from "@/lib/validation/voices-submission";
import { PRIVATE_BUCKET, removeObjects, safeEqual, sha256Hex, verifyStoredFile, type FileCheck } from "@/lib/voices/storage";
import type { UploadKind } from "@/lib/voices/file-signature";
import type { VoicesSubmissionRow } from "@/types/voices";

const NOT_FOUND = { ok: false, error: "We couldn't find that submission. Please submit the form again." };

/**
 * Step 2 of a Voices submission: the browser finished its direct uploads.
 * Requires the one-time finalize token from step 1 (stored only as a
 * SHA-256 hash), then reads the first bytes of each stored object and checks
 * its real file signature — the declared MIME type is never trusted.
 *
 *  - A file that isn't there yet → 409, token kept, so the browser can retry.
 *  - An invalid optional file (headshot/release) → deleted, noted for admins.
 *  - An invalid video with no fallback link → deleted, submission rejected, 422.
 *  - Otherwise → `received`, token burned, founder + submitter emailed.
 */
export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (await isRateLimited(`voices-complete:${ip}`, { limit: 20, windowMs: 10 * 60_000, binding: "RATE_LIMITER_FORMS" })) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429 });
  }
  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  const parsed = voicesFinalizeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json(NOT_FOUND, { status: 404 });

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("voices_submissions")
      .select("*")
      .eq("id", parsed.data.submissionId)
      .maybeSingle();
    if (error) return serverError("voices-complete: lookup failed", error);

    const row = data as VoicesSubmissionRow | null;
    const tokenHash = await sha256Hex(parsed.data.finalizeToken);
    if (
      !row ||
      row.review_status !== "awaiting_upload" ||
      !row.finalize_token_hash ||
      !safeEqual(row.finalize_token_hash, tokenHash) ||
      !row.finalize_expires_at ||
      Date.parse(row.finalize_expires_at) < Date.now()
    ) {
      return NextResponse.json(NOT_FOUND, { status: 404 });
    }

    const targets: { kind: UploadKind; column: "video_path" | "headshot_path" | "release_path"; path: string | null }[] = [
      { kind: "video", column: "video_path", path: row.video_path },
      { kind: "headshot", column: "headshot_path", path: row.headshot_path },
      { kind: "release", column: "release_path", path: row.release_path },
    ];

    const fileCheck: Record<string, FileCheck> = { ...(row.file_check as Record<string, FileCheck>) };
    const updates: Record<string, unknown> = {};
    const invalidPaths: string[] = [];

    for (const target of targets) {
      if (!target.path) continue;
      const result = await verifyStoredFile(PRIVATE_BUCKET, target.path, target.kind);
      if (result === "missing") {
        return NextResponse.json(
          { ok: false, retry: true, error: `Your ${target.kind} upload didn't finish. Please try again.` },
          { status: 409 },
        );
      }
      fileCheck[target.kind] = result.ok ? result : { ...result, error: "File signature did not match an accepted type; file deleted." };
      if (!result.ok) {
        invalidPaths.push(target.path);
        updates[target.column] = null;
      }
    }

    await removeObjects(PRIVATE_BUCKET, invalidPaths);

    const videoRejected = Boolean(row.video_path) && updates.video_path === null;
    if (videoRejected && !row.video_link) {
      await admin
        .from("voices_submissions")
        .update({
          ...updates,
          review_status: "rejected",
          reviewer_notes: "Automatically rejected: uploaded video was not a valid MP4/MOV file.",
          file_check: fileCheck,
          finalize_token_hash: null,
          finalize_expires_at: null,
        })
        .eq("id", row.id);
      return NextResponse.json(
        { ok: false, error: "That file doesn't appear to be an MP4 or MOV video. Please export it as MP4 or MOV and submit again, or share a secure link." },
        { status: 422 },
      );
    }

    const { error: updateError } = await admin
      .from("voices_submissions")
      .update({
        ...updates,
        file_check: fileCheck,
        review_status: "received",
        submitted_at: new Date().toISOString(),
        finalize_token_hash: null,
        finalize_expires_at: null,
      })
      .eq("id", row.id);
    if (updateError) return serverError("voices-complete: update failed", updateError);

    await notifyVoicesSubmissionReceived({
      submissionId: row.id,
      reference: row.reference_code,
      participantName: row.participant_name,
      submitterName: row.submitter_name,
      submitterEmail: row.submitter_email,
      relationship: row.relationship,
      delivery: videoRejected ? "link" : "upload",
    });

    return NextResponse.json({ ok: true, reference: row.reference_code });
  } catch (error) {
    return serverError("voices-complete: failed", error);
  }
}
