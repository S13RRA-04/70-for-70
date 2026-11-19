import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { logServerError } from "@/lib/log";
import type { GateInput } from "./publication-gate";
import type { VoicesAuditEventRow, VoicesPermissionRow, VoicesPublicationRow } from "@/types/voices";

type AuditInput = Pick<VoicesAuditEventRow, "entity_type" | "action"> & {
  actorEmail: string | null | undefined;
  entityId?: string | null;
  talentId?: string | null;
  details?: Record<string, unknown>;
};

/**
 * Appends to voices_audit_events. Never throws — a failed audit write is
 * logged, not allowed to undo the admin action that already happened.
 */
export async function recordAudit(admin: SupabaseClient, input: AuditInput): Promise<void> {
  const { error } = await admin.from("voices_audit_events").insert({
    actor_email: input.actorEmail ?? null,
    entity_type: input.entity_type,
    entity_id: input.entityId ?? null,
    talent_id: input.talentId ?? null,
    action: input.action,
    details: input.details ?? {},
  });
  if (error) logServerError("voices: audit insert failed", error);
}

/**
 * Unpublishes every live publication matching `column = value` (a talent,
 * permission or submission). Used for withdrawals and revocations, so pulling
 * consent can never leave a video up.
 */
export async function unpublishWhere(
  admin: SupabaseClient,
  column: "talent_id" | "permission_id" | "submission_id",
  value: string,
  reason: string,
  actorEmail: string | null | undefined,
): Promise<number> {
  const { data, error } = await admin
    .from("voices_publications")
    .update({ status: "unpublished", unpublished_at: new Date().toISOString(), unpublish_reason: reason, is_featured: false })
    .eq(column, value)
    .eq("status", "published")
    .select("id, talent_id, slug");
  if (error) {
    logServerError("voices: cascade unpublish failed", error);
    throw error;
  }
  for (const row of data ?? []) {
    await recordAudit(admin, {
      actorEmail,
      entity_type: "publication",
      entityId: row.id,
      talentId: row.talent_id,
      action: "unpublished",
      details: { reason, slug: row.slug, cascade: column },
    });
  }
  return data?.length ?? 0;
}

// ---- FormData parsing helpers for server actions -------------------------

export function text(form: FormData, name: string, max = 4000): string | null {
  const value = String(form.get(name) ?? "").trim();
  return value ? value.slice(0, max) : null;
}

export function requiredText(form: FormData, name: string, max = 200): string {
  return text(form, name, max) ?? "";
}

export function date(form: FormData, name: string): string | null {
  const value = String(form.get(name) ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

/** datetime-local input ("YYYY-MM-DDTHH:mm", interpreted as UTC) → ISO. */
export function dateTime(form: FormData, name: string): string | null {
  const value = String(form.get(name) ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const parsed = Date.parse(`${value}:00Z`);
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
}

export function oneOf<T extends string>(form: FormData, name: string, allowed: readonly T[], fallback: T): T {
  const value = String(form.get(name) ?? "");
  return (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

export function many<T extends string>(form: FormData, name: string, allowed: readonly T[]): T[] {
  return form
    .getAll(name)
    .map(String)
    .filter((v): v is T => (allowed as readonly string[]).includes(v));
}

export function uuid(form: FormData, name: string): string | null {
  const value = String(form.get(name) ?? "").trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value) ? value : null;
}

/** https:// links only; anything else is dropped. */
export function httpsUrl(form: FormData, name: string): string | null {
  const value = text(form, name, 2000);
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

/** A public media URL a publication may point at: a site-relative path or an https URL. */
export function mediaUrl(form: FormData, name: string): string | null {
  const value = text(form, name, 2000);
  if (!value) return null;
  if (/^\/[A-Za-z0-9/_.-]+$/.test(value) && !value.includes("..")) return value;
  return httpsUrl(form, name);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}


/**
 * Loads everything the publication gate needs for one publication. Used by
 * both the publish action (enforcement) and the publication page (preview),
 * so the two can never disagree. A permission belonging to a different
 * talent is treated as missing.
 */
export async function loadPublicationGate(
  admin: SupabaseClient,
  id: string,
): Promise<{ admin: SupabaseClient; publication: VoicesPublicationRow; input: Omit<GateInput, "now"> } | null> {
  const { data: pub } = await admin.from("voices_publications").select("*").eq("id", id).maybeSingle();
  const publication = pub as VoicesPublicationRow | null;
  if (!publication) return null;
  const [{ data: submission }, { data: permission }, { data: talent }] = await Promise.all([
    publication.submission_id
      ? admin.from("voices_submissions").select("review_status, embargo_until, talent_id").eq("id", publication.submission_id).maybeSingle()
      : Promise.resolve({ data: null }),
    publication.permission_id
      ? admin.from("voices_permission_agreements").select("*").eq("id", publication.permission_id).maybeSingle()
      : Promise.resolve({ data: null }),
    admin.from("voices_talent").select("outreach_status").eq("id", publication.talent_id).maybeSingle(),
  ]);
  const perm = permission as VoicesPermissionRow | null;
  const sameTalentPermission = perm && perm.talent_id === publication.talent_id ? perm : null;
  const sameTalentSubmission = submission && submission.talent_id === publication.talent_id ? submission : null;
  return {
    admin,
    publication,
    input: {
      publication: {
        publishAt: publication.publish_at,
        channels: publication.channels,
        videoUrl: publication.video_url,
        participantApprovedAt: publication.participant_approved_at,
      },
      submission: sameTalentSubmission
        ? { reviewStatus: sameTalentSubmission.review_status, embargoUntil: sameTalentSubmission.embargo_until }
        : null,
      permission: sameTalentPermission
        ? {
            status: sameTalentPermission.status,
            permittedChannels: sameTalentPermission.permitted_channels,
            requiresParticipantApproval: sameTalentPermission.requires_participant_approval,
            usageStartsOn: sameTalentPermission.usage_starts_on,
            usageEndsOn: sameTalentPermission.usage_ends_on,
            revokedAt: sameTalentPermission.revoked_at,
          }
        : null,
      talentOutreachStatus: (talent?.outreach_status as string | undefined) ?? null,
    },
  };
}
