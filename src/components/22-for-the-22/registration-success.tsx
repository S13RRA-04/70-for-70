import Link from "next/link";
import { Download } from "lucide-react";
import { REGISTRATION_SUCCESS_MESSAGE } from "@/lib/content/22-for-the-22";
import {
  PROMO_KIT_SUCCESS_SHARING_NOTE,
  PROMO_KIT_ZIP_FILENAME,
  PROMO_KIT_ZIP_PATH,
  REGISTRATION_SUCCESS_CONTENT,
} from "@/lib/content/22-for-the-22-promokit";

/**
 * Replaces the generic "you're in" message once a registration submits
 * successfully — hands the participant the Participant Promo Kit
 * immediately, no extra form or login required (the ZIP is a static
 * public asset). Sharing is explicitly optional per
 * PROMO_KIT_SUCCESS_SHARING_NOTE below — never implies it affects
 * giveaway odds or eligibility.
 */
export function RegistrationSuccess() {
  return (
    <div
      role="status"
      data-analytics-event="22_registration_complete"
      className="rounded-sm border border-olive/30 bg-olive/10 p-8"
    >
      <p className="font-display text-2xl font-semibold uppercase tracking-wide text-ink">
        {REGISTRATION_SUCCESS_CONTENT.headline}
      </p>
      <p className="mt-1 font-display text-base font-semibold uppercase tracking-wide text-bronze">
        {REGISTRATION_SUCCESS_CONTENT.subheadline}
      </p>

      <p className="mt-4 text-base text-charcoal-light">{REGISTRATION_SUCCESS_MESSAGE}</p>
      <p className="mt-3 text-base text-charcoal-light">{REGISTRATION_SUCCESS_CONTENT.body}</p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <a
          href={PROMO_KIT_ZIP_PATH}
          download={PROMO_KIT_ZIP_FILENAME}
          data-analytics-event="promokit_zip_download"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-bronze px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
        >
          <Download size={16} aria-hidden />
          {REGISTRATION_SUCCESS_CONTENT.primaryCta}
        </a>
        <Link
          href="/22forthe22/promokit"
          data-analytics-event="promokit_view_assets_click"
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-sm border border-ink/20 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-ink/5"
        >
          {REGISTRATION_SUCCESS_CONTENT.secondaryCta}
        </Link>
      </div>

      <p className="mt-5 max-w-xl text-xs leading-relaxed text-charcoal-light/80">{PROMO_KIT_SUCCESS_SHARING_NOTE}</p>
    </div>
  );
}
