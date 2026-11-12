/**
 * A vertical (9:16) YouTube Short, presented as a phone-like frame on an
 * offset jet block. Embeds YouTube's privacy-enhanced nocookie player
 * (allowed in middleware.ts's CSP frame-src) with lazy loading, so nothing
 * from YouTube loads until the frame scrolls near the viewport.
 */
export function VerticalVideoEmbed({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute inset-[-18px_-18px_18px_18px] rounded-[22px] bg-jet" />
      <div className="relative aspect-[9/16] overflow-hidden rounded-[18px] border-[3px] border-jet bg-[#161618]">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&playsinline=1`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  );
}
