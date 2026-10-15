"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/components/shared/use-media-query";

/**
 * The muted concert-footage loop behind the Live show lineup. Purely
 * decorative (aria-hidden, no controls, no audio track in the file).
 *
 * Deliberately no `autoPlay` attribute: that would start playback before
 * hydration, even for visitors who asked for reduced motion. Instead the
 * poster frame is what renders server-side and without JS, and playback
 * starts from the effect below only when motion is allowed. Served through
 * /video/[file] for the 206 Range responses Safari/iOS require.
 */
export function StageLoopVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reducedMotion) {
      video.pause();
      return;
    }
    // play() rejects when the browser blocks autoplay (e.g. Low Power Mode) — the poster stays up, which is fine.
    video.play().catch(() => {});
  }, [reducedMotion]);

  return (
    <video
      ref={ref}
      aria-hidden="true"
      tabIndex={-1}
      muted
      loop
      playsInline
      preload="metadata"
      poster="/media/live-stage-loop-v2-poster.webp"
      className={className}
    >
      <source src="/video/live-stage-loop-v2.webm" type='video/webm; codecs="vp9"' />
      <source src="/video/live-stage-loop-v2.mp4" type='video/mp4; codecs="avc1.64001f"' />
    </video>
  );
}
