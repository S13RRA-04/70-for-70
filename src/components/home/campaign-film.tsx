"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Homepage campaign film. Plays as a silent looping b-roll preview (cropped
 * to a wide 21:9 band); clicking restarts it from the top with sound and
 * native controls at its true aspect ratio. Ending or pressing Escape returns
 * to the preview. With reduced motion the preview never autoplays — the
 * poster frame stands in until someone chooses to play.
 */
export function CampaignFilm({
  sources,
  poster,
  title,
  description,
}: {
  /** In preference order. List H.264 MP4 first (Safari/iOS), then a VP9 WebM for browsers without H.264. */
  sources: { src: string; type: string }[];
  poster: string;
  title: string;
  description: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) video.play().catch(() => {});
  }, []);

  function startFilm() {
    const video = videoRef.current;
    if (!video) return;
    video.loop = false;
    video.muted = false;
    video.currentTime = 0;
    setPlaying(true);
    video.play().catch(() => {});
    video.focus();
  }

  function backToPreview() {
    const video = videoRef.current;
    if (!video) return;
    setPlaying(false);
    video.muted = true;
    video.loop = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) video.pause();
    else video.play().catch(() => {});
  }

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-[#2c3d6b] bg-[#0b1430] transition-[aspect-ratio] duration-motion-ui ease-system"
      style={{ aspectRatio: playing ? "864 / 496" : "21 / 9" }}
    >
      <video
        ref={videoRef}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        controls={playing}
        tabIndex={playing ? 0 : -1}
        aria-hidden={!playing}
        aria-label={playing ? title : undefined}
        onEnded={backToPreview}
        onKeyDown={(e) => {
          if (e.key === "Escape") backToPreview();
        }}
        className="absolute inset-0 h-full w-full object-cover"
      >
        {sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>

      {!playing && (
        <button
          type="button"
          onClick={startFilm}
          className="absolute inset-0 flex flex-col items-center justify-center gap-[18px] bg-[radial-gradient(ellipse_at_center,rgb(18_30_61/0.55)_0%,rgb(18_30_61/0.15)_60%,transparent_100%)] p-6 text-center text-white"
        >
          <span className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform duration-motion-ui ease-system group-hover:scale-[1.08]">
            <svg aria-hidden="true" width="30" height="34" viewBox="0 0 30 34">
              <path d="M4 2 L28 17 L4 32 Z" fill="#121E3D" />
            </svg>
          </span>
          <span className="font-display text-[clamp(28px,3vw,40px)] uppercase leading-none">{title}</span>
          <span className="max-w-[520px] text-[15px] text-mist">{description}</span>
        </button>
      )}
    </div>
  );
}
