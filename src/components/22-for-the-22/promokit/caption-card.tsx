import { CopyButton } from "./copy-button";
import type { PromoKitCaption } from "@/lib/content/22-for-the-22-promokit";

export function CaptionCard({ caption }: { caption: PromoKitCaption }) {
  return (
    <div className="flex flex-col rounded-sm border border-ink/10 bg-off-white p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-bronze">{caption.label}</p>
      <p className="mt-3 flex-1 whitespace-pre-line text-sm leading-relaxed text-charcoal-light">{caption.body}</p>
      <CopyButton
        text={caption.body}
        label="Copy Caption"
        analyticsEvent="promokit_caption_copy"
        className="mt-4 self-start"
      />
    </div>
  );
}
