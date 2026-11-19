import { VOICE_MESSAGES } from "@/lib/content/voices";
import { logServerError } from "@/lib/log";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";
import { TALENT_CATEGORY_LABELS, type TalentCategory } from "@/lib/voices/model";
import { PUBLIC_PUBLICATION_COLUMNS, type PublicVoicesPublication } from "@/types/voices";

/**
 * One contributor card on /voices, from either source:
 *  - voices_publications rows the admin workflow published (permission-gated
 *    in /admin/voices; RLS only returns rows that are published AND past
 *    their go-live time), or
 *  - the hand-published entries in src/lib/content/voices.ts.
 * A DB publication with the same slug as a content entry wins.
 */
export interface VoiceGalleryItem {
  slug: string;
  name: string;
  descriptor: string;
  summary: string | null;
  /** YYYY-MM-DD */
  publishedOn: string;
  category: TalentCategory | null;
  featured: boolean;
  video: { src: string; type: string; poster?: string; captions?: string };
  transcript: readonly string[] | null;
  externalUrl: string | null;
}

function fromPublication(row: PublicVoicesPublication): VoiceGalleryItem | null {
  if (!row.video_url || !row.publish_at) return null;
  const category = row.category in TALENT_CATEGORY_LABELS ? (row.category as TalentCategory) : null;
  return {
    slug: row.slug,
    name: row.display_name,
    descriptor: row.attribution ?? "",
    summary: row.summary,
    publishedOn: row.publish_at.slice(0, 10),
    category,
    featured: row.is_featured,
    video: {
      src: row.video_url,
      type: row.video_type,
      poster: row.poster_url ?? undefined,
      captions: row.captions_url ?? undefined,
    },
    transcript: row.transcript ? row.transcript.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) : null,
    externalUrl: row.external_url && row.external_url.startsWith("https://") ? row.external_url : null,
  };
}

function contentItems(): VoiceGalleryItem[] {
  return VOICE_MESSAGES.map((message) => ({
    slug: message.id,
    name: message.name,
    descriptor: message.descriptor,
    summary: message.summary,
    publishedOn: message.publishedOn,
    category: null,
    featured: false,
    video: message.video,
    transcript: message.transcript ?? null,
    externalUrl: null,
  }));
}

async function getPublishedPublications(): Promise<PublicVoicesPublication[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await createPublicClient()
    .from("voices_publications")
    .select(PUBLIC_PUBLICATION_COLUMNS)
    .order("display_order", { ascending: true })
    .order("publish_at", { ascending: false });
  if (error) {
    // Before the migration is applied this table doesn't exist — the gallery falls back to the content file.
    logServerError("data.voices: load failed, using content file only", error);
    return [];
  }
  return (data ?? []) as PublicVoicesPublication[];
}

/** Every public contributor, featured first, then newest first. */
export async function getVoiceGallery(): Promise<VoiceGalleryItem[]> {
  const fromDb = (await getPublishedPublications()).map(fromPublication).filter((i): i is VoiceGalleryItem => i !== null);
  const dbSlugs = new Set(fromDb.map((i) => i.slug));
  const all = [...fromDb, ...contentItems().filter((i) => !dbSlugs.has(i.slug))];
  return all.sort((a, b) => Number(b.featured) - Number(a.featured) || b.publishedOn.localeCompare(a.publishedOn));
}

export async function getVoiceBySlug(slug: string): Promise<VoiceGalleryItem | null> {
  return (await getVoiceGallery()).find((item) => item.slug === slug) ?? null;
}
