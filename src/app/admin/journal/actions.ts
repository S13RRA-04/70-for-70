"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseVideoUrl } from "@/lib/video-url";
import type { JournalGalleryImage } from "@/types/database";

const LIST_PATH = "/admin/journal";
const GALLERY_SLOTS = 6;

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function optionalStr(formData: FormData, key: string): string | null {
  const value = str(formData, key);
  return value.length > 0 ? value : null;
}

function optionalNumber(formData: FormData, key: string): number | null {
  const value = str(formData, key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function optionalInt(formData: FormData, key: string): number | null {
  const value = optionalNumber(formData, key);
  return value === null ? null : Math.round(value);
}

function parseGallery(formData: FormData): JournalGalleryImage[] | null {
  const images: JournalGalleryImage[] = [];
  for (let i = 1; i <= GALLERY_SLOTS; i++) {
    const url = str(formData, `gallery_url_${i}`);
    if (!url) continue;
    images.push({ url, alt: str(formData, `gallery_alt_${i}`) });
  }
  return images.length > 0 ? images : null;
}

function parseMentionIds(formData: FormData, key: string): string[] {
  return formData.getAll(key).map(String).filter(Boolean);
}

function buildEntryPatch(formData: FormData) {
  const videoUrl = optionalStr(formData, "video_url");
  const parsedVideo = videoUrl ? parseVideoUrl(videoUrl) : null;

  const tags = str(formData, "tags")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    post_type: str(formData, "post_type"),
    primary_category: str(formData, "primary_category"),
    tags,
    title: str(formData, "title"),
    slug: str(formData, "slug"),
    summary: str(formData, "summary"),
    body: str(formData, "body"),
    featured: formData.get("featured") === "on",
    image_url: optionalStr(formData, "image_url"),
    gallery: parseGallery(formData),
    video_url: videoUrl,
    video_provider: parsedVideo?.provider ?? null,
    training_discipline: optionalStr(formData, "training_discipline"),
    training_distance: optionalNumber(formData, "training_distance"),
    training_duration_minutes: optionalInt(formData, "training_duration_minutes"),
    training_pace: optionalStr(formData, "training_pace"),
    training_elevation_ft: optionalInt(formData, "training_elevation_ft"),
    training_swim_pace: optionalStr(formData, "training_swim_pace"),
    training_bike_power_watts: optionalInt(formData, "training_bike_power_watts"),
    training_avg_hr: optionalInt(formData, "training_avg_hr"),
    training_rpe: optionalInt(formData, "training_rpe"),
    training_phase: optionalStr(formData, "training_phase"),
    milestone_kind: optionalStr(formData, "milestone_kind"),
    milestone_value: optionalStr(formData, "milestone_value"),
    sponsor_disclosure: optionalStr(formData, "sponsor_disclosure"),
  };
}

async function syncMentions(
  admin: ReturnType<typeof createAdminClient>,
  table: "journal_entry_partner_mentions" | "journal_entry_beneficiary_mentions",
  journalEntryId: string,
  partnerIds: string[],
) {
  await admin.from(table).delete().eq("journal_entry_id", journalEntryId);
  if (partnerIds.length > 0) {
    await admin.from(table).insert(partnerIds.map((partner_id) => ({ journal_entry_id: journalEntryId, partner_id })));
  }
}

export async function saveJournalEntryAction(formData: FormData) {
  await requireAdminUser();
  const admin = createAdminClient();

  const id = optionalStr(formData, "id");
  const intent = str(formData, "intent") as "draft" | "publish" | "schedule";
  const scheduledFor = optionalStr(formData, "scheduled_for");

  const existing = id
    ? (await admin.from("journal_entries").select("published_at").eq("id", id).single()).data
    : null;

  const status = intent === "draft" ? "draft" : intent === "schedule" ? "scheduled" : "published";

  // A title/stats/image alone isn't a journal entry — see AGENTS.md's
  // Journal spec. Draft freely; publishing or scheduling requires a body.
  if (status !== "draft" && str(formData, "body").trim().length === 0) {
    throw new Error("Add a body before publishing or scheduling this entry — save it as a draft instead.");
  }

  // Preserve the original publish date on edits — only stamp it the first
  // time an entry becomes published. See supabase/schema.sql's comment on
  // journal_entries.published_at.
  const publishedAt =
    intent === "publish" ? ((existing as { published_at: string | null } | null)?.published_at ?? new Date().toISOString())
    : ((existing as { published_at: string | null } | null)?.published_at ?? null);

  const patch = {
    ...buildEntryPatch(formData),
    status,
    scheduled_for: intent === "schedule" ? scheduledFor : null,
    published_at: publishedAt,
    updated_at: new Date().toISOString(),
  };

  let entryId = id;

  if (id) {
    const { error } = await admin.from("journal_entries").update(patch).eq("id", id);
    if (error) throw error;
  } else {
    const { data, error } = await admin.from("journal_entries").insert(patch).select("id").single();
    if (error) throw error;
    entryId = (data as { id: string }).id;
  }

  if (entryId) {
    await Promise.all([
      syncMentions(admin, "journal_entry_partner_mentions", entryId, parseMentionIds(formData, "partner_mentions")),
      syncMentions(
        admin,
        "journal_entry_beneficiary_mentions",
        entryId,
        parseMentionIds(formData, "beneficiary_mentions"),
      ),
    ]);
  }

  revalidatePath(LIST_PATH);
  revalidatePath("/journal");
  revalidatePath("/campaign-home");
  redirect(LIST_PATH);
}

export async function deleteJournalEntryAction(formData: FormData) {
  await requireAdminUser();
  const id = str(formData, "id");
  if (!id) redirect(LIST_PATH);

  const admin = createAdminClient();
  await admin.from("journal_entries").delete().eq("id", id);

  revalidatePath(LIST_PATH);
  revalidatePath("/journal");
  revalidatePath("/campaign-home");
  redirect(LIST_PATH);
}

export async function uploadJournalImageAction(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  await requireAdminUser();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file provided." };
  }

  const admin = createAdminClient();
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `journal/${crypto.randomUUID()}.${extension}`;

  const { error } = await admin.storage.from("journal-media").upload(path, file, { contentType: file.type });
  if (error) return { error: error.message };

  const { data } = admin.storage.from("journal-media").getPublicUrl(path);
  return { url: data.publicUrl };
}
