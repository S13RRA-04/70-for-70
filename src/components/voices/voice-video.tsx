import type { VoiceMessage } from "@/lib/content/voices";

/**
 * A Voices For The 22 message as a vertical (9:16) phone-like frame — same
 * offset jet block as VerticalVideoEmbed. Self-hosted through /video/<file>
 * (Range support for Safari/iOS); never autoplays or preloads, so the poster
 * stands in until someone presses play.
 */
export function VoiceVideo({ message }: { message: VoiceMessage }) {
  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <div aria-hidden="true" className="absolute inset-[-14px_-14px_14px_14px] rounded-[22px] bg-jet" />
      <video
        controls
        playsInline
        preload="none"
        poster={message.video.poster}
        aria-label={`Video message from ${message.name}`}
        className="relative aspect-[9/16] w-full rounded-[18px] border-[3px] border-jet bg-[#161618] object-cover"
      >
        <source src={message.video.src} type={message.video.type} />
        {message.video.captions && (
          <track kind="captions" src={message.video.captions} srcLang="en" label="English" default />
        )}
      </video>
    </div>
  );
}
