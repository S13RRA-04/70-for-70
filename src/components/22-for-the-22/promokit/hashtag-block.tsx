import { CopyButton } from "./copy-button";
import { PROMO_KIT_HASHTAGS, PROMO_KIT_HASHTAGS_TEXT } from "@/lib/content/22-for-the-22-promokit";

export function HashtagBlock() {
  return (
    <div className="rounded-sm border border-ink/10 bg-off-white p-5">
      <div className="flex flex-wrap gap-2">
        {PROMO_KIT_HASHTAGS.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-bronze/30 bg-bronze/10 px-3 py-1 text-sm font-medium text-ink"
          >
            {tag}
          </span>
        ))}
      </div>
      <CopyButton
        text={PROMO_KIT_HASHTAGS_TEXT}
        label="Copy Hashtags"
        analyticsEvent="promokit_hashtags_copy"
        className="mt-4"
      />
    </div>
  );
}
