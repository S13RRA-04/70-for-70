import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { fileExtension, matchesKind, detectFileType, SIGNATURE_BYTES, type UploadKind } from "./file-signature";

/**
 * Storage for Voices. Two buckets (created by
 * supabase/2026-11-19-voices-talent-portal.sql):
 *
 *  - PRIVATE_BUCKET: raw submissions, headshots, signed releases. No storage
 *    policies exist, so only the service role can touch it. Browsers upload
 *    with 2-hour signed upload URLs; admins download with short-lived signed
 *    URLs. Nothing in it is ever reachable by a public URL.
 *  - PUBLIC_BUCKET: admin-prepared, permission-cleared publication assets.
 *
 * Object names are random UUIDs under a per-record folder — never derived
 * from user input — so paths are unguessable and can't traverse.
 */

export const PRIVATE_BUCKET = "voices-submissions";
export const PUBLIC_BUCKET = "voices-public";

/** How long an admin's download link stays valid. */
const DOWNLOAD_TTL_SECONDS = 10 * 60;

export function newObjectPath(folder: string, originalName: string, fallbackExt: string): string {
  const ext = fileExtension(originalName) || fallbackExt;
  return `${folder}/${crypto.randomUUID()}.${ext}`;
}

/** A signed upload URL the browser PUTs the file to directly (upsert, so an interrupted upload can be retried). */
export async function createUploadUrl(bucket: string, path: string): Promise<string> {
  const { data, error } = await createAdminClient().storage.from(bucket).createSignedUploadUrl(path, { upsert: true });
  if (error || !data) throw error ?? new Error("createSignedUploadUrl returned no data");
  return data.signedUrl;
}

/**
 * Reads only the leading bytes of a stored object (HTTP Range), so a 500 MB
 * video is never pulled into the Worker. Returns null when the object doesn't
 * exist (yet) or can't be read.
 */
export async function readLeadingBytes(bucket: string, path: string, count = SIGNATURE_BYTES): Promise<Uint8Array | null> {
  const { data, error } = await createAdminClient().storage.from(bucket).createSignedUrl(path, 60);
  if (error || !data) return null;

  const res = await fetch(data.signedUrl, {
    headers: { Range: `bytes=0-${count - 1}` },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok || !res.body) return null;

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (total < count) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      chunks.push(value);
      total += value.byteLength;
    }
  } finally {
    // A server that ignored Range would otherwise stream the whole file.
    await reader.cancel().catch(() => {});
  }

  const out = new Uint8Array(Math.min(total, count));
  let offset = 0;
  for (const chunk of chunks) {
    const slice = chunk.subarray(0, out.length - offset);
    out.set(slice, offset);
    offset += slice.byteLength;
    if (offset >= out.length) break;
  }
  return out;
}

export type FileCheck = { ok: boolean; detected: string | null; checkedAt: string; error?: string };

/** "missing" = not uploaded (retryable); otherwise the signature verdict. */
export async function verifyStoredFile(bucket: string, path: string, kind: UploadKind): Promise<FileCheck | "missing"> {
  const bytes = await readLeadingBytes(bucket, path);
  if (!bytes || bytes.length === 0) return "missing";
  return {
    ok: matchesKind(kind, bytes),
    detected: detectFileType(bytes),
    checkedAt: new Date().toISOString(),
  };
}

export async function removeObjects(bucket: string, paths: (string | null | undefined)[]): Promise<void> {
  const real = paths.filter((p): p is string => Boolean(p));
  if (real.length === 0) return;
  await createAdminClient().storage.from(bucket).remove(real);
}

/** Short-lived, download-disposition link for an admin. */
export async function adminDownloadUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  const { data } = await createAdminClient()
    .storage.from(PRIVATE_BUCKET)
    .createSignedUrl(path, DOWNLOAD_TTL_SECONDS, { download: true });
  return data?.signedUrl ?? null;
}

export function publicAssetUrl(path: string): string {
  return createAdminClient().storage.from(PUBLIC_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Unambiguous reference code shown to submitters, e.g. VFT-7KQ2-M9XD. */
export function newReferenceCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const chars = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `VFT-${chars.slice(0, 4)}-${chars.slice(4)}`;
}

export function newFinalizeToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Constant-time string compare for equal-length hex digests. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
