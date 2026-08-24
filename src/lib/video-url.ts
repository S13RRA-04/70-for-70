import type { VideoProvider } from "@/types/database";

const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
  /(?:youtube\.com\/embed\/)([\w-]{11})/,
  /(?:youtu\.be\/)([\w-]{11})/,
];

const VIMEO_PATTERN = /vimeo\.com\/(?:video\/)?(\d+)/;

/** Parses a pasted YouTube/Vimeo URL into a provider + embeddable id, or null if unrecognized. */
export function parseVideoUrl(url: string): { provider: VideoProvider; id: string } | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match) return { provider: "youtube", id: match[1] };
  }

  const vimeoMatch = url.match(VIMEO_PATTERN);
  if (vimeoMatch) return { provider: "vimeo", id: vimeoMatch[1] };

  return null;
}

export function getVideoThumbnailUrl(provider: VideoProvider, id: string): string | null {
  // Vimeo has no unauthenticated thumbnail-by-id URL — callers fall back to
  // the entry's own image_url/MediaPlaceholder for Vimeo videos.
  return provider === "youtube" ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
}

export function getVideoEmbedUrl(provider: VideoProvider, id: string): string {
  return provider === "youtube"
    ? `https://www.youtube.com/embed/${id}?autoplay=1`
    : `https://player.vimeo.com/video/${id}?autoplay=1`;
}
