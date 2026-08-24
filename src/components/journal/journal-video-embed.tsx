"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { getVideoEmbedUrl, getVideoThumbnailUrl } from "@/lib/video-url";
import type { VideoProvider } from "@/types/database";

interface JournalVideoEmbedProps {
  provider: VideoProvider;
  videoId: string;
  title: string;
  /** Fallback poster for providers (Vimeo) with no public thumbnail-by-id URL. */
  fallbackImageUrl: string | null;
}

/**
 * Lightweight facade: renders a static thumbnail + play button, and only
 * loads the real embed iframe (with autoplay) after the visitor clicks —
 * never autoplays on page load, and never ships the YouTube/Vimeo player
 * script up front.
 */
export function JournalVideoEmbed({ provider, videoId, title, fallbackImageUrl }: JournalVideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const thumbnailUrl = getVideoThumbnailUrl(provider, videoId) ?? fallbackImageUrl;

  if (playing) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-ink">
        <iframe
          src={getVideoEmbedUrl(provider, videoId)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-sm bg-ink"
      aria-label={`Play video: ${title}`}
    >
      {thumbnailUrl ? (
        <Image src={thumbnailUrl} alt="" fill className="object-cover" sizes="(min-width: 768px) 768px, 100vw" />
      ) : (
        <MediaPlaceholder />
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-ink/30 transition-colors group-hover:bg-ink/40">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-off-white/90 text-ink transition-transform group-hover:scale-105">
          <Play size={26} fill="currentColor" aria-hidden />
        </span>
      </div>
    </button>
  );
}
