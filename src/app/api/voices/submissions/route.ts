import { NextResponse } from "next/server";
import { notifyVoicesSubmissionReceived } from "@/lib/notifications";
import { handlePublicForm, serverError, skipWhenSupabaseUnconfigured } from "@/lib/public-write";
import { createAdminClient } from "@/lib/supabase/admin";
import { voicesSubmissionSchema } from "@/lib/validation/voices-submission";
import {
  PRIVATE_BUCKET,
  createUploadUrl,
  newFinalizeToken,
  newObjectPath,
  newReferenceCode,
  removeObjects,
  sha256Hex,
} from "@/lib/voices/storage";

/** How long the browser has to finish uploading and call /complete. Signed upload URLs last 2 h. */
const FINALIZE_WINDOW_MS = 2 * 60 * 60 * 1000;

/**
 * Step 1 of a Voices talent submission: validate the form, record it as
 * `awaiting_upload`, and hand back signed direct-to-storage upload URLs for
 * the private bucket plus a one-time finalize token. The browser uploads
 * straight to Supabase Storage (no file bytes pass through the Worker), then
 * calls /api/voices/submissions/complete, which verifies file signatures
 * before the submission enters the review queue.
 *
 * A link-only submission skips the upload step and is received immediately.
 * Bot-check trips answer `{ ok: true }` with no reference, like every other
 * public form (src/lib/public-write.ts).
 */
export async function POST(request: Request) {
  return handlePublicForm(
    request,
    {
      rateLimitKey: "voices-submission",
      binding: "RATE_LIMITER_FORMS",
      schema: voicesSubmissionSchema,
      turnstileAction: "voices_submission",
    },
    "voices-submission",
    async (data) => {
      const unconfigured = skipWhenSupabaseUnconfigured("voices-submission", { participant: data.participantName });
      if (unconfigured) return unconfigured;

      const id = crypto.randomUUID();
      const folder = `submissions/${id}`;
      const files = [
        data.video && { kind: "video" as const, meta: data.video, path: newObjectPath(folder, data.video.name, "mp4") },
        data.headshot && { kind: "headshot" as const, meta: data.headshot, path: newObjectPath(folder, data.headshot.name, "jpg") },
        data.release && { kind: "release" as const, meta: data.release, path: newObjectPath(folder, data.release.name, "pdf") },
      ].filter((f): f is NonNullable<typeof f> => Boolean(f));

      const pathFor = (kind: string) => files.find((f) => f.kind === kind)?.path ?? null;
      const hasUploads = files.length > 0;
      const finalizeToken = hasUploads ? newFinalizeToken() : null;
      const reference = newReferenceCode();
      const now = new Date();

      const row = {
        id,
        reference_code: reference,
        source: "portal",
        review_status: hasUploads ? "awaiting_upload" : "received",
        participant_name: data.participantName,
        submitter_name: data.submitterName,
        submitter_email: data.submitterEmail,
        relationship: data.relationship,
        professional_title: data.professionalTitle || null,
        representative_agency: data.representativeAgency || null,
        preferred_attribution: data.preferredAttribution || null,
        social_handles: data.socialHandles || null,
        website: data.website || null,
        suggested_publication_date: data.suggestedPublicationDate || null,
        embargo_until: data.embargoUntil || null,
        usage_restrictions: data.usageRestrictions || null,
        additional_instructions: data.additionalInstructions || null,
        video_link: data.videoLink || null,
        video_path: pathFor("video"),
        video_original_name: data.video?.name ?? null,
        video_size_bytes: data.video?.size ?? null,
        headshot_path: pathFor("headshot"),
        release_path: pathFor("release"),
        authorized_confirmed: data.authorized,
        terms_acknowledged: data.termsAcknowledged,
        finalize_token_hash: finalizeToken ? await sha256Hex(finalizeToken) : null,
        finalize_expires_at: finalizeToken ? new Date(now.getTime() + FINALIZE_WINDOW_MS).toISOString() : null,
        submitted_at: hasUploads ? null : now.toISOString(),
      };

      const admin = createAdminClient();
      const { error } = await admin.from("voices_submissions").insert(row);
      if (error) return serverError("voices-submission: insert failed", error);

      if (!hasUploads) {
        await notifyVoicesSubmissionReceived({
          submissionId: id,
          reference,
          participantName: data.participantName,
          submitterName: data.submitterName,
          submitterEmail: data.submitterEmail,
          relationship: data.relationship,
          delivery: "link",
        });
        return NextResponse.json({ ok: true, reference, submissionId: id, uploads: [] });
      }

      try {
        const uploads = await Promise.all(
          files.map(async (f) => ({
            kind: f.kind,
            signedUrl: await createUploadUrl(PRIVATE_BUCKET, f.path),
            contentType: f.meta.type || (f.kind === "video" ? "video/quicktime" : "application/octet-stream"),
          })),
        );
        return NextResponse.json({ ok: true, reference, submissionId: id, finalizeToken, uploads });
      } catch (uploadError) {
        // Storage unavailable — don't leave a half-made record behind.
        await admin.from("voices_submissions").delete().eq("id", id);
        await removeObjects(PRIVATE_BUCKET, files.map((f) => f.path)).catch(() => {});
        return serverError("voices-submission: signed upload URL failed", uploadError);
      }
    },
  );
}
