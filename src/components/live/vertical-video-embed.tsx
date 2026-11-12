"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { getVideoEmbedUrl } from "@/lib/video-url";

/**
 * Click-to-play facade for a vertical (9:16) YouTube Short — same approach
 * as JournalVideoEmbed (thumbnail first, player only after a click, never
 * autoplay on load), sized for portrait video instead of 16:9. YouTube's
 * thumbnail for a Short is the vertical frame centered between blurred
 * bars, so a centered object-cover crop shows just the frame.
 */
export function VerticalVideoEmbed({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[4px] bg-jet">
        <iframe
          src={getVideoEmbedUrl("youtube", videoId)}
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
      className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[4px] bg-jet"
      aria-label={`Play video: ${title}`}
    >
      <Image
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt=""
        fill
        className="object-cover"
        sizes="(min-width: 768px) 320px, 80vw"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-jet/25 transition-colors group-hover:bg-jet/40">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-live-red text-white transition-transform group-hover:scale-105">
          <Play size={26} fill="currentColor" aria-hidden />
        </span>
      </div>
    </button>
  );
}
