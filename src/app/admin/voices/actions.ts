"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  date,
  dateTime,
  httpsUrl,
  many,
  mediaUrl,
  oneOf,
  recordAudit,
  requiredText,
  slugify,
  text,
  unpublishWhere,
  uuid,
  loadPublicationGate,
} from "@/lib/voices/admin";
import { publicationBlockers } from "@/lib/voices/publication-gate";
import {
  CONTACT_ROLES,
  DELIVERY_STATUSES,
  DISTRIBUTION_CHANNELS,
  FAILED_DELIVERY_STATUSES,
  OUTREACH_CHANNELS,
  OUTREACH_DIRECTIONS,
  OUTREACH_STATUSES,
  PERMISSION_STATUSES,
  PERMITTED_EDITS,
  SUBMISSION_STATUSES,
  SUBMITTER_RELATIONSHIPS,
  TALENT_CATEGORIES,
} from "@/lib/voices/model";
import {
  PRIVATE_BUCKET,
  PUBLIC_BUCKET,
  createUploadUrl,
  newObjectPath,
  newReferenceCode,
  publicAssetUrl,
  removeObjects,
  verifyStoredFile,
} from "@/lib/voices/storage";
import { RELEASE_VERSION } from "@/lib/content/voices-talent";
import type { VoicesPermissionRow, VoicesSubmissionRow } from "@/types/voices";

const BASE = "/admin/voices";

function go(path: string, params: { error?: string; saved?: string } = {}): never {
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]).toString();
  redirect(qs ? `${path}?${qs}` : path);
}

function refresh(...paths: string[]) {
  revalidatePath(BASE);
  revalidatePath("/voices");
  for (const p of paths) revalidatePath(p);
}

// ---------------------------------------------------------------------------
// Uploads (admin-only signed URLs)
// ---------------------------------------------------------------------------

const UPLOAD_SCOPES = {
  submission: { bucket: PRIVATE_BUCKET, folder: "admin-intake", fallback: "mp4" },
  release: { bucket: PRIVATE_BUCKET, folder: "releases", fallback: "pdf" },
  publication: { bucket: PUBLIC_BUCKET, folder: "publications", fallback: "mp4" },
} as const;

export async function createAdminUploadAction(
  scope: keyof typeof UPLOAD_SCOPES,
  fileName: string,
): Promise<{ signedUrl: string; path: string; publicUrl: string | null } | { error: string }> {
  await requireAdminUser();
  const config = UPLOAD_SCOPES[scope];
  if (!config) return { error: "Unknown upload scope." };
  const path = newObjectPath(`${config.folder}/${crypto.randomUUID()}`, fileName.slice(0, 255), config.fallback);
  try {
    const signedUrl = await createUploadUrl(config.bucket, path);
    return { signedUrl, path, publicUrl: config.bucket === PUBLIC_BUCKET ? publicAssetUrl(path) : null };
  } catch {
    return { error: "Storage is unavailable — check that the voices buckets exist." };
  }
}

/** Private paths the admin forms may submit — anything else is ignored. */
function privatePath(form: FormData, name: string, folder: "admin-intake" | "releases"): string | null {
  const value = text(form, name, 400);
  return value && new RegExp(`^${folder}/[0-9a-f-]{36}/[0-9a-f-]{36}\\.[a-z0-9]{1,8}$`).test(value) ? value : null;
}

// ---------------------------------------------------------------------------
// Talent
// ---------------------------------------------------------------------------

function talentFields(form: FormData) {
  return {
    name: requiredText(form, "name"),
    category: oneOf(form, "category", TALENT_CATEGORIES, "other"),
    professional_title: text(form, "professional_title", 200),
    public_attribution: text(form, "public_attribution", 300),
    outreach_status: oneOf(form, "outreach_status", OUTREACH_STATUSES, "identified"),
    contact_source: text(form, "contact_source", 500),
    source_verified_on: date(form, "source_verified_on"),
    outreach_on: date(form, "outreach_on"),
    last_contact_on: date(form, "last_contact_on"),
    follow_up_on: date(form, "follow_up_on"),
    response_summary: text(form, "response_summary"),
    internal_notes: text(form, "internal_notes", 10000),
  };
}

export async function createTalentAction(form: FormData) {
  const user = await requireAdminUser();
  const fields = talentFields(form);
  if (!fields.name) go(`${BASE}/talent/new`, { error: "Name is required." });

  const admin = createAdminClient();
  const { data, error } = await admin.from("voices_talent").insert(fields).select("id").single();
  if (error || !data) go(`${BASE}/talent/new`, { error: "Couldn't create the talent record." });

  await recordAudit(admin, { actorEmail: user.email, entity_type: "talent", entityId: data.id, talentId: data.id, action: "created", details: { name: fields.name } });

  const fromSubmission = uuid(form, "from_submission");
  if (fromSubmission) {
    await admin.from("voices_submissions").update({ talent_id: data.id }).eq("id", fromSubmission);
  }
  refresh();
  go(`${BASE}/talent/${data.id}`, { saved: "Talent created." });
}

export async function updateTalentAction(form: FormData) {
  const user = await requireAdminUser();
  const id = uuid(form, "id");
  if (!id) go(BASE);
  const fields = talentFields(form);
  if (!fields.name) go(`${BASE}/talent/${id}`, { error: "Name is required." });

  const admin = createAdminClient();
  const { data: before } = await admin.from("voices_talent").select("outreach_status").eq("id", id).single();
  const { error } = await admin.from("voices_talent").update(fields).eq("id", id);
  if (error) go(`${BASE}/talent/${id}`, { error: "Couldn't save." });

  const statusChanged = before && before.outreach_status !== fields.outreach_status;
  await recordAudit(admin, {
    actorEmail: user.email,
    entity_type: "talent",
    entityId: id,
    talentId: id,
    action: statusChanged ? "outreach_status_changed" : "updated",
    details: statusChanged ? { from: before.outreach_status, to: fields.outreach_status } : {},
  });

  let note = "Saved.";
  if (fields.outreach_status === "withdrawn") {
    const count = await unpublishWhere(admin, "talent_id", id, "Participant withdrew", user.email);
    if (count) note = `Saved. ${count} publication(s) unpublished because the participant withdrew.`;
  }
  refresh(`${BASE}/talent/${id}`);
  go(`${BASE}/talent/${id}`, { saved: note });
}

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------

export async function addContactAction(form: FormData) {
  const user = await requireAdminUser();
  const talentId = uuid(form, "talent_id");
  if (!talentId) go(BASE);
  const row = {
    talent_id: talentId,
    contact_name: requiredText(form, "contact_name"),
    role: oneOf(form, "role", CONTACT_ROLES, "representative"),
    organization: text(form, "organization", 200),
    email: text(form, "email", 320),
    other_method: text(form, "other_method", 300),
    source: text(form, "source", 500),
    verified_on: date(form, "verified_on"),
    is_primary: form.get("is_primary") === "on",
  };
  if (!row.contact_name) go(`${BASE}/talent/${talentId}`, { error: "Contact name is required." });
  if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) go(`${BASE}/talent/${talentId}`, { error: "That email doesn't look valid." });

  const admin = createAdminClient();
  if (row.is_primary) await admin.from("voices_talent_contacts").update({ is_primary: false }).eq("talent_id", talentId);
  const { data, error } = await admin.from("voices_talent_contacts").insert(row).select("id").single();
  if (error || !data) go(`${BASE}/talent/${talentId}`, { error: "Couldn't add the contact." });
  await recordAudit(admin, { actorEmail: user.email, entity_type: "contact", entityId: data.id, talentId, action: "created", details: { name: row.contact_name, role: row.role } });
  refresh(`${BASE}/talent/${talentId}`);
  go(`${BASE}/talent/${talentId}`, { saved: "Contact added." });
}

export async function deleteContactAction(form: FormData) {
  const user = await requireAdminUser();
  const id = uuid(form, "id");
  const talentId = uuid(form, "talent_id");
  if (!id || !talentId) go(BASE);
  const admin = createAdminClient();
  await admin.from("voices_talent_contacts").delete().eq("id", id).eq("talent_id", talentId);
  await recordAudit(admin, { actorEmail: user.email, entity_type: "contact", entityId: id, talentId, action: "deleted" });
  refresh(`${BASE}/talent/${talentId}`);
  go(`${BASE}/talent/${talentId}`, { saved: "Contact removed." });
}

// ---------------------------------------------------------------------------
// Outreach log — records what a human did; never sends anything itself.
// ---------------------------------------------------------------------------

export async function logOutreachAction(form: FormData) {
  const user = await requireAdminUser();
  const talentId = uuid(form, "talent_id");
  if (!talentId) go(BASE);
  const row = {
    talent_id: talentId,
    contact_id: uuid(form, "contact_id"),
    occurred_on: date(form, "occurred_on") ?? new Date().toISOString().slice(0, 10),
    channel: oneOf(form, "channel", OUTREACH_CHANNELS, "email"),
    direction: oneOf(form, "direction", OUTREACH_DIRECTIONS, "outbound"),
    delivery_status: oneOf(form, "delivery_status", DELIVERY_STATUSES, "not_applicable"),
    summary: requiredText(form, "summary", 4000),
    response: text(form, "response"),
    follow_up_on: date(form, "follow_up_on"),
    created_by: user.email ?? null,
  };
  if (!row.summary) go(`${BASE}/talent/${talentId}`, { error: "Add a short summary of the touchpoint." });

  const admin = createAdminClient();
  const { data, error } = await admin.from("voices_outreach_activities").insert(row).select("id").single();
  if (error || !data) go(`${BASE}/talent/${talentId}`, { error: "Couldn't log the activity." });

  // Keep the talent's dates in step with the log. Status changes stay manual,
  // except a failed delivery, which routes the record to the failure queue.
  const { data: talent } = await admin.from("voices_talent").select("outreach_on, outreach_status").eq("id", talentId).single();
  const talentUpdate: Record<string, unknown> = { last_contact_on: row.occurred_on };
  if (row.follow_up_on) talentUpdate.follow_up_on = row.follow_up_on;
  if (!talent?.outreach_on && row.direction === "outbound") talentUpdate.outreach_on = row.occurred_on;
  if ((FAILED_DELIVERY_STATUSES as readonly string[]).includes(row.delivery_status)) talentUpdate.outreach_status = "delivery_failed";
  if (row.response) talentUpdate.response_summary = row.response;
  await admin.from("voices_talent").update(talentUpdate).eq("id", talentId);

  await recordAudit(admin, {
    actorEmail: user.email,
    entity_type: "outreach",
    entityId: data.id,
    talentId,
    action: "logged",
    details: { channel: row.channel, direction: row.direction, delivery: row.delivery_status },
  });
  refresh(`${BASE}/talent/${talentId}`);
  go(`${BASE}/talent/${talentId}`, { saved: "Activity logged." });
}

// ---------------------------------------------------------------------------
// Submissions
// ---------------------------------------------------------------------------

export async function updateSubmissionAction(form: FormData) {
  const user = await requireAdminUser();
  const id = uuid(form, "id");
  if (!id) go(BASE);
  const path = `${BASE}/submissions/${id}`;
  const admin = createAdminClient();
  const { data } = await admin.from("voices_submissions").select("*").eq("id", id).single();
  const before = data as VoicesSubmissionRow | null;
  if (!before) go(BASE, { error: "Submission not found." });

  const status = oneOf(form, "review_status", SUBMISSION_STATUSES, before.review_status);
  const update = {
    review_status: status,
    reviewer_notes: text(form, "reviewer_notes", 10000),
    talent_id: uuid(form, "talent_id"),
    embargo_until: date(form, "embargo_until"),
    usage_restrictions: text(form, "usage_restrictions"),
    ...(status !== before.review_status && { reviewed_at: new Date().toISOString(), reviewed_by: user.email ?? null }),
  };
  if (status === "approved" && !update.talent_id) go(path, { error: "Link this submission to a talent record before approving it." });
  if (status === "approved" && !before.video_path && !before.video_link) go(path, { error: "There's no video to approve." });

  const { error } = await admin.from("voices_submissions").update(update).eq("id", id);
  if (error) go(path, { error: "Couldn't save." });

  await recordAudit(admin, {
    actorEmail: user.email,
    entity_type: "submission",
    entityId: id,
    talentId: update.talent_id,
    action: status !== before.review_status ? "review_status_changed" : "updated",
    details: status !== before.review_status ? { from: before.review_status, to: status } : {},
  });

  let note = "Saved.";
  if (status === "withdrawn" || status === "rejected") {
    const count = await unpublishWhere(admin, "submission_id", id, `Submission ${status}`, user.email);
    if (count) note = `Saved. ${count} publication(s) unpublished.`;
  }
  if (status === "received" || status === "approved") {
    // A received/approved recording moves an earlier-stage talent record forward — never backward.
    if (update.talent_id) {
      const early = ["identified", "researching_contact", "ready_for_outreach", "contacted", "awaiting_response", "referred", "interested", "participation_offered", "follow_up_later"];
      await admin.from("voices_talent").update({ outreach_status: "recording_received" }).eq("id", update.talent_id).in("outreach_status", early);
    }
  }
  refresh(path);
  go(path, { saved: note });
}

/** Retention/withdrawal: delete the stored files, keep a minimal metadata row. */
export async function purgeSubmissionFilesAction(form: FormData) {
  const user = await requireAdminUser();
  const id = uuid(form, "id");
  if (!id) go(BASE);
  const path = `${BASE}/submissions/${id}`;
  if (form.get("confirm") !== "on") go(path, { error: "Tick the confirmation box to delete files." });

  const admin = createAdminClient();
  const { data } = await admin.from("voices_submissions").select("video_path, headshot_path, release_path, talent_id").eq("id", id).single();
  if (!data) go(BASE);
  await removeObjects(PRIVATE_BUCKET, [data.video_path, data.headshot_path, data.release_path]);
  await admin
    .from("voices_submissions")
    .update({ video_path: null, headshot_path: null, release_path: null, files_deleted_at: new Date().toISOString() })
    .eq("id", id);
  await recordAudit(admin, { actorEmail: user.email, entity_type: "submission", entityId: id, talentId: data.talent_id, action: "files_deleted" });
  refresh(path);
  go(path, { saved: "Stored files deleted." });
}

/** Records a recording received outside the portal (e.g. emailed link, existing video). */
export async function createAdminSubmissionAction(form: FormData) {
  const user = await requireAdminUser();
  const talentId = uuid(form, "talent_id");
  const back = `${BASE}/submissions/new${talentId ? `?talent=${talentId}` : ""}`;
  const videoPath = privatePath(form, "video_path", "admin-intake");
  const videoLink = httpsUrl(form, "video_link");
  if (!talentId) go(back, { error: "Choose the talent record this recording belongs to." });
  if (!videoPath && !videoLink) go(back, { error: "Upload the video or enter an https:// link." });

  const fileCheck: Record<string, unknown> = {};
  if (videoPath) {
    const result = await verifyStoredFile(PRIVATE_BUCKET, videoPath, "video");
    if (result === "missing") go(back, { error: "The upload didn't finish — upload the file again." });
    if (!result.ok) {
      await removeObjects(PRIVATE_BUCKET, [videoPath]);
      go(back, { error: "That file isn't a valid MP4/MOV video." });
    }
    fileCheck.video = result;
  }

  const admin = createAdminClient();
  const { data: talent } = await admin.from("voices_talent").select("name").eq("id", talentId).single();
  const row = {
    reference_code: newReferenceCode(),
    source: "admin",
    talent_id: talentId,
    review_status: "received",
    participant_name: talent?.name ?? requiredText(form, "participant_name"),
    submitter_name: requiredText(form, "submitter_name") || "Recorded by admin",
    submitter_email: text(form, "submitter_email", 320) ?? user.email ?? "admin",
    relationship: oneOf(form, "relationship", SUBMITTER_RELATIONSHIPS, "Other authorized representative"),
    video_link: videoLink,
    video_path: videoPath,
    video_original_name: text(form, "video_original_name", 255),
    embargo_until: date(form, "embargo_until"),
    usage_restrictions: text(form, "usage_restrictions"),
    reviewer_notes: text(form, "reviewer_notes", 10000),
    file_check: fileCheck,
    authorized_confirmed: true,
    terms_acknowledged: true,
    submitted_at: new Date().toISOString(),
  };
  const { data, error } = await admin.from("voices_submissions").insert(row).select("id").single();
  if (error || !data) go(back, { error: "Couldn't record the submission." });
  await recordAudit(admin, { actorEmail: user.email, entity_type: "submission", entityId: data.id, talentId, action: "recorded_by_admin" });
  refresh();
  go(`${BASE}/submissions/${data.id}`, { saved: "Recording logged. Review and approve it when ready." });
}

// ---------------------------------------------------------------------------
// Permission agreements
// ---------------------------------------------------------------------------

export async function savePermissionAction(form: FormData) {
  const user = await requireAdminUser();
  const id = uuid(form, "id");
  const talentId = uuid(form, "talent_id");
  if (!talentId) go(BASE);
  const back = id ? `${BASE}/permissions/${id}` : `${BASE}/permissions/new?talent=${talentId}`;

  const status = oneOf(form, "status", PERMISSION_STATUSES.filter((s) => s !== "revoked"), "draft");
  const signedDoc = privatePath(form, "signed_document_path", "releases");
  if (signedDoc) {
    const check = await verifyStoredFile(PRIVATE_BUCKET, signedDoc, "release");
    if (check === "missing" || !check.ok) {
      if (check !== "missing") await removeObjects(PRIVATE_BUCKET, [signedDoc]);
      go(back, { error: "The signed document must be a PDF, JPG or PNG." });
    }
  }

  const row = {
    talent_id: talentId,
    submission_id: uuid(form, "submission_id"),
    release_version: text(form, "release_version", 50) ?? RELEASE_VERSION,
    status,
    signatory_name: text(form, "signatory_name", 200),
    signatory_capacity: oneOf(form, "signatory_capacity", ["participant", "authorized_representative", ""] as const, ""),
    representative_authority: text(form, "representative_authority", 2000),
    permitted_channels: many(form, "permitted_channels", DISTRIBUTION_CHANNELS),
    approved_mission_channels: text(form, "approved_mission_channels", 2000),
    permitted_edits: many(form, "permitted_edits", PERMITTED_EDITS),
    approved_attribution: text(form, "approved_attribution", 300),
    restrictions: text(form, "restrictions"),
    requires_participant_approval: form.get("requires_participant_approval") === "on",
    usage_starts_on: date(form, "usage_starts_on"),
    usage_ends_on: date(form, "usage_ends_on"),
    signed_on: date(form, "signed_on"),
    ...(signedDoc && { signed_document_path: signedDoc }),
  };
  const normalized = { ...row, signatory_capacity: row.signatory_capacity || null };

  if (status === "signed" && (!row.signatory_name || !row.signed_on || !row.signatory_capacity)) {
    go(back, { error: "A signed agreement needs the signatory's name, capacity and signing date." });
  }
  if (row.usage_starts_on && row.usage_ends_on && row.usage_ends_on < row.usage_starts_on) {
    go(back, { error: "The usage end date is before the start date." });
  }

  const admin = createAdminClient();
  let savedId = id;
  let before: VoicesPermissionRow | null = null;
  if (id) {
    const { data } = await admin.from("voices_permission_agreements").select("*").eq("id", id).single();
    before = data as VoicesPermissionRow | null;
    if (before?.status === "revoked") go(back, { error: "A revoked agreement can't be edited — record a new one." });
    const { error } = await admin.from("voices_permission_agreements").update(normalized).eq("id", id);
    if (error) go(back, { error: "Couldn't save the agreement." });
  } else {
    const { data, error } = await admin.from("voices_permission_agreements").insert(normalized).select("id").single();
    if (error || !data) go(back, { error: "Couldn't save the agreement." });
    savedId = data.id;
  }

  await recordAudit(admin, {
    actorEmail: user.email,
    entity_type: "permission",
    entityId: savedId,
    talentId,
    action: id ? (before && before.status !== status ? "status_changed" : "updated") : "created",
    details: {
      status,
      ...(before && before.status !== status && { from: before.status }),
      channels: row.permitted_channels,
      requires_participant_approval: row.requires_participant_approval,
      usage_ends_on: row.usage_ends_on,
    },
  });
  if (status === "signed") {
    await admin.from("voices_talent").update({ outreach_status: "approved" }).eq("id", talentId).in("outreach_status", ["recording_received", "permissions_pending"]);
  }
  if (status === "expired") {
    await unpublishWhere(admin, "permission_id", savedId!, "Permission expired", user.email);
  }
  refresh(`${BASE}/talent/${talentId}`);
  go(`${BASE}/permissions/${savedId}`, { saved: "Agreement saved." });
}

export async function revokePermissionAction(form: FormData) {
  const user = await requireAdminUser();
  const id = uuid(form, "id");
  if (!id) go(BASE);
  const reason = text(form, "revocation_reason", 2000);
  if (!reason) go(`${BASE}/permissions/${id}`, { error: "Record why the permission was revoked." });

  const admin = createAdminClient();
  const { data } = await admin
    .from("voices_permission_agreements")
    .update({ status: "revoked", revoked_at: new Date().toISOString(), revocation_reason: reason })
    .eq("id", id)
    .select("talent_id")
    .single();
  if (!data) go(BASE, { error: "Agreement not found." });
  const count = await unpublishWhere(admin, "permission_id", id, `Permission revoked: ${reason}`, user.email);
  await recordAudit(admin, { actorEmail: user.email, entity_type: "permission", entityId: id, talentId: data.talent_id, action: "revoked", details: { reason, unpublished: count } });
  refresh(`${BASE}/talent/${data.talent_id}`);
  go(`${BASE}/permissions/${id}`, { saved: `Permission revoked.${count ? ` ${count} publication(s) unpublished.` : ""}` });
}

// ---------------------------------------------------------------------------
// Publications
// ---------------------------------------------------------------------------

export async function savePublicationAction(form: FormData) {
  const user = await requireAdminUser();
  const id = uuid(form, "id");
  const talentId = uuid(form, "talent_id");
  if (!talentId) go(BASE);
  const back = id ? `${BASE}/publications/${id}` : `${BASE}/publications/new?talent=${talentId}`;

  const displayName = requiredText(form, "display_name");
  const slug = slugify(text(form, "slug", 80) ?? displayName);
  if (!displayName || !slug) go(back, { error: "Display name is required." });
  if (slug === "talent") go(back, { error: "That slug is reserved." });

  const row = {
    talent_id: talentId,
    submission_id: uuid(form, "submission_id"),
    permission_id: uuid(form, "permission_id"),
    slug,
    display_name: displayName,
    attribution: text(form, "attribution", 300),
    category: oneOf(form, "category", TALENT_CATEGORIES, "other"),
    summary: text(form, "summary", 1000),
    transcript: text(form, "transcript", 20000),
    video_url: mediaUrl(form, "video_upload") ?? mediaUrl(form, "video_url"),
    video_type: oneOf(form, "video_type", ["video/mp4", "video/quicktime"] as const, "video/mp4"),
    poster_url: mediaUrl(form, "poster_upload") ?? mediaUrl(form, "poster_url"),
    captions_url: mediaUrl(form, "captions_upload") ?? mediaUrl(form, "captions_url"),
    external_url: httpsUrl(form, "external_url"),
    channels: many(form, "channels", DISTRIBUTION_CHANNELS),
    publish_at: dateTime(form, "publish_at"),
    display_order: Number.parseInt(String(form.get("display_order") ?? "0"), 10) || 0,
  };
  if (!row.channels.includes("website")) row.channels.unshift("website");

  const admin = createAdminClient();
  let savedId = id;
  if (id) {
    const { data: existing } = await admin.from("voices_publications").select("status").eq("id", id).single();
    // Editing a live publication would bypass the gate — take it down first.
    if (existing?.status === "published") go(back, { error: "Unpublish before editing a live publication." });
    const { error } = await admin.from("voices_publications").update(row).eq("id", id);
    if (error) go(back, { error: error.code === "23505" ? "That slug is already in use." : "Couldn't save." });
  } else {
    const { data, error } = await admin.from("voices_publications").insert(row).select("id").single();
    if (error || !data) go(back, { error: error?.code === "23505" ? "That slug is already in use." : "Couldn't save." });
    savedId = data.id;
  }
  await recordAudit(admin, { actorEmail: user.email, entity_type: "publication", entityId: savedId, talentId, action: id ? "updated" : "created", details: { slug } });
  refresh(`${BASE}/publications/${savedId}`);
  go(`${BASE}/publications/${savedId}`, { saved: "Draft saved." });
}

export async function recordParticipantApprovalAction(form: FormData) {
  const user = await requireAdminUser();
  const id = uuid(form, "id");
  if (!id) go(BASE);
  const note = text(form, "approval_note", 2000);
  if (!note) go(`${BASE}/publications/${id}`, { error: "Note how and when the participant approved the final video." });
  const admin = createAdminClient();
  const { data } = await admin
    .from("voices_publications")
    .update({ participant_approved_at: new Date().toISOString() })
    .eq("id", id)
    .select("talent_id")
    .single();
  await recordAudit(admin, { actorEmail: user.email, entity_type: "publication", entityId: id, talentId: data?.talent_id, action: "participant_approval_recorded", details: { note } });
  refresh(`${BASE}/publications/${id}`);
  go(`${BASE}/publications/${id}`, { saved: "Participant approval recorded." });
}

export async function publishPublicationAction(form: FormData) {
  const user = await requireAdminUser();
  const id = uuid(form, "id");
  if (!id) go(BASE);
  const back = `${BASE}/publications/${id}`;
  if (form.get("confirm") !== "on") go(back, { error: "Confirm that permissions have been checked." });

  const gate = await loadPublicationGate(createAdminClient(), id);
  if (!gate) go(BASE, { error: "Publication not found." });
  const publishAt = gate.publication.publish_at ?? new Date().toISOString();
  const blockers = publicationBlockers({ now: new Date(), ...gate.input, publication: { ...gate.input.publication, publishAt } });
  if (blockers.length > 0) go(back, { error: `Publishing is blocked: ${blockers.join(" ")}` });

  const featured = form.get("is_featured") === "on";
  if (featured) await gate.admin.from("voices_publications").update({ is_featured: false }).neq("id", id);
  const { error } = await gate.admin
    .from("voices_publications")
    .update({ status: "published", publish_at: publishAt, published_by: user.email ?? null, is_featured: featured, unpublished_at: null, unpublish_reason: null })
    .eq("id", id);
  if (error) go(back, { error: "Couldn't publish." });

  await gate.admin.from("voices_talent").update({ outreach_status: "published" }).eq("id", gate.publication.talent_id).neq("outreach_status", "withdrawn");
  await recordAudit(gate.admin, {
    actorEmail: user.email,
    entity_type: "publication",
    entityId: id,
    talentId: gate.publication.talent_id,
    action: Date.parse(publishAt) > Date.now() ? "scheduled" : "published",
    details: { publish_at: publishAt, channels: gate.publication.channels, permission_id: gate.publication.permission_id, featured },
  });
  refresh(back, `/voices/${gate.publication.slug}`);
  go(back, { saved: Date.parse(publishAt) > Date.now() ? "Scheduled — it goes live automatically at the publish time." : "Published." });
}

export async function unpublishPublicationAction(form: FormData) {
  const user = await requireAdminUser();
  const id = uuid(form, "id");
  if (!id) go(BASE);
  const back = `${BASE}/publications/${id}`;
  const reason = text(form, "unpublish_reason", 2000);
  if (!reason) go(back, { error: "Record why it's being unpublished (e.g. withdrawal request)." });

  const admin = createAdminClient();
  const { data } = await admin
    .from("voices_publications")
    .update({ status: "unpublished", unpublished_at: new Date().toISOString(), unpublish_reason: reason, is_featured: false })
    .eq("id", id)
    .select("talent_id, slug, video_url, poster_url, captions_url")
    .single();
  if (!data) go(BASE, { error: "Publication not found." });

  let removed = 0;
  if (form.get("delete_assets") === "on") {
    const prefix = publicAssetUrl("");
    const paths = [data.video_url, data.poster_url, data.captions_url]
      .filter((u): u is string => Boolean(u && u.startsWith(prefix)))
      .map((u) => u.slice(prefix.length));
    await removeObjects(PUBLIC_BUCKET, paths);
    removed = paths.length;
    await admin.from("voices_publications").update({ video_url: null, poster_url: null, captions_url: null }).eq("id", id);
  }
  await recordAudit(admin, { actorEmail: user.email, entity_type: "publication", entityId: id, talentId: data.talent_id, action: "unpublished", details: { reason, public_files_deleted: removed } });
  refresh(back, `/voices/${data.slug}`);
  go(back, { saved: `Unpublished.${removed ? ` ${removed} public file(s) deleted.` : ""}` });
}
