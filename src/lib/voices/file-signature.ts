/**
 * Magic-byte checks for Voices uploads. The browser-declared MIME type and
 * file extension are attacker-controlled, so after a direct-to-storage upload
 * the server reads the first bytes of the stored object and checks them here.
 * Import-free so tests/voices.test.mjs can exercise it directly.
 */

export type UploadKind = "video" | "headshot" | "release";

export type DetectedType = "mp4" | "mov" | "jpeg" | "png" | "webp" | "pdf";

/** How many leading bytes `detectFileType` needs. */
export const SIGNATURE_BYTES = 32;

function ascii(bytes: Uint8Array, start: number, length: number): string {
  let out = "";
  for (let i = start; i < start + length && i < bytes.length; i++) out += String.fromCharCode(bytes[i]);
  return out;
}

/** ISO-BMFF top-level box types that can legitimately open a QuickTime/MP4 file. */
const QUICKTIME_LEADING_BOXES = new Set(["moov", "mdat", "wide", "free", "skip", "pnot"]);

export function detectFileType(bytes: Uint8Array): DetectedType | null {
  if (bytes.length >= 12 && ascii(bytes, 4, 4) === "ftyp") {
    const brand = ascii(bytes, 8, 4);
    return brand === "qt  " ? "mov" : "mp4";
  }
  if (bytes.length >= 8 && QUICKTIME_LEADING_BOXES.has(ascii(bytes, 4, 4))) return "mov";
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    ascii(bytes, 1, 3) === "PNG" &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "png";
  }
  if (bytes.length >= 12 && ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WEBP") return "webp";
  if (bytes.length >= 5 && ascii(bytes, 0, 5) === "%PDF-") return "pdf";
  return null;
}

const ALLOWED: Record<UploadKind, readonly DetectedType[]> = {
  video: ["mp4", "mov"],
  headshot: ["jpeg", "png", "webp"],
  release: ["pdf", "jpeg", "png"],
};

/** Declared MIME types accepted before upload (the real check is `matchesKind` afterwards). */
export const ACCEPTED_MIME_TYPES: Record<UploadKind, readonly string[]> = {
  video: ["video/mp4", "video/quicktime"],
  headshot: ["image/jpeg", "image/png", "image/webp"],
  release: ["application/pdf", "image/jpeg", "image/png"],
};

export const ACCEPTED_EXTENSIONS: Record<UploadKind, readonly string[]> = {
  video: ["mp4", "mov"],
  headshot: ["jpg", "jpeg", "png", "webp"],
  release: ["pdf", "jpg", "jpeg", "png"],
};

export function matchesKind(kind: UploadKind, bytes: Uint8Array): boolean {
  const detected = detectFileType(bytes);
  return detected !== null && ALLOWED[kind].includes(detected);
}

/** Lower-cased extension of a filename, or "" — used only to pick the stored object's suffix. */
export function fileExtension(name: string): string {
  const match = /\.([A-Za-z0-9]{1,8})$/.exec(name);
  return match ? match[1].toLowerCase() : "";
}
