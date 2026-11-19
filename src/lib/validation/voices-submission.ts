import { z } from "zod";
import { botCheckFields } from "./bot-check";
import { ACCEPTED_EXTENSIONS, ACCEPTED_MIME_TYPES, fileExtension, type UploadKind } from "@/lib/voices/file-signature";
import { SUBMITTER_RELATIONSHIPS } from "@/lib/voices/model";

/**
 * Configurable per-file limits, in MB. The video limit must not exceed the
 * voices-submissions bucket's file_size_limit or the Supabase project's
 * global upload limit (see supabase/2026-11-19-voices-talent-portal.sql).
 * NEXT_PUBLIC_ so the form can show and pre-check the same number.
 */
export const VOICES_UPLOAD_LIMIT_MB: Record<UploadKind, number> = {
  video: Number(process.env.NEXT_PUBLIC_VOICES_UPLOAD_MAX_MB) || 500,
  headshot: 20,
  release: 20,
};

const MB = 1024 * 1024;

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));
const optionalDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date")
  .optional()
  .or(z.literal(""));

/** https-only, and never fetched server-side — stored and shown to admins as untrusted text. */
const httpsUrl = z
  .string()
  .trim()
  .max(2000)
  .url("Enter a full link starting with https://")
  .refine((value) => value.toLowerCase().startsWith("https://"), "Links must start with https://");

function fileMeta(kind: UploadKind) {
  return z
    .object({
      name: z.string().trim().min(1).max(255),
      size: z.number().int().positive(),
      type: z.string().max(100),
    })
    .superRefine((file, ctx) => {
      const typeOk = ACCEPTED_MIME_TYPES[kind].includes(file.type);
      const extOk = ACCEPTED_EXTENSIONS[kind].includes(fileExtension(file.name));
      // Some browsers report an empty type for .mov — accept a known extension then.
      if (!extOk || (file.type !== "" && !typeOk)) {
        ctx.addIssue({
          code: "custom",
          message: kind === "video" ? "Upload an MP4 or MOV file" : `Unsupported file type (${ACCEPTED_EXTENSIONS[kind].join(", ")})`,
        });
      }
      if (file.size > VOICES_UPLOAD_LIMIT_MB[kind] * MB) {
        ctx.addIssue({ code: "custom", message: `Files must be ${VOICES_UPLOAD_LIMIT_MB[kind]} MB or smaller` });
      }
    });
}

export const voicesSubmissionSchema = z
  .object({
    participantName: z.string().trim().min(1, "Participant name is required").max(200),
    submitterName: z.string().trim().min(1, "Your name is required").max(200),
    submitterEmail: z.string().trim().email("Enter a valid email address").max(320),
    relationship: z.enum(SUBMITTER_RELATIONSHIPS, { message: "Select your relationship to the participant" }),

    video: fileMeta("video").nullable(),
    videoLink: httpsUrl.optional().or(z.literal("")),
    headshot: fileMeta("headshot").nullable(),
    release: fileMeta("release").nullable(),

    professionalTitle: optionalText(200),
    representativeAgency: optionalText(200),
    preferredAttribution: optionalText(300),
    socialHandles: optionalText(500),
    website: httpsUrl.optional().or(z.literal("")),
    suggestedPublicationDate: optionalDate,
    embargoUntil: optionalDate,
    usageRestrictions: optionalText(4000),
    additionalInstructions: optionalText(4000),

    authorized: z.literal(true, { message: "Please confirm you're authorized to provide this recording" }),
    termsAcknowledged: z.literal(true, { message: "Please acknowledge the submission terms" }),
  })
  .extend(botCheckFields)
  .superRefine((data, ctx) => {
    if (!data.video && !data.videoLink) {
      ctx.addIssue({ code: "custom", path: ["video"], message: "Upload a video or share a secure link" });
    }
  });

export type VoicesSubmissionInput = z.infer<typeof voicesSubmissionSchema>;

export const voicesFinalizeSchema = z.object({
  submissionId: z.string().uuid(),
  finalizeToken: z.string().min(20).max(200),
});
