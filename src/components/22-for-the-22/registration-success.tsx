import Link from "next/link";
import { ListChecks, Download } from "lucide-react";
import { PROMO_KIT_SUCCESS_SHARING_NOTE, REGISTRATION_SUCCESS_CONTENT } from "@/lib/content/22-for-the-22-promokit";

/**
 * Replaces the generic "you're in" message once a registration submits
 * successfully. Points to the 22-session tracker (on the main event page)
 * and the Participant Promo Kit page — neither requires another form or
 * login. Sharing is explicitly optional per PROMO_KIT_SUCCESS_SHARING_NOTE
 * below — never implies it affects giveaway odds or eligibility.
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

      <p className="mt-4 text-base text-charcoal-light">{REGISTRATION_SUCCESS_CONTENT.body}</p>

      <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-charcoal-light">Next</p>
      <ol className="mt-2 space-y-1.5">
        {REGISTRATION_SUCCESS_CONTENT.nextSteps.map((step, i) => (
          <li key={step} className="flex items-start gap-2 text-sm text-charcoal-light">
            <span className="font-display font-semibold text-bronze">{i + 1}.</span>
            {step}
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href="/22forthe22#tracker"
          data-analytics-event="tracker_view_click"
          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm bg-bronze px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light sm:w-auto"
        >
          <ListChecks size={16} aria-hidden />
          {REGISTRATION_SUCCESS_CONTENT.primaryCta}
        </Link>
        <Link
          href="/22forthe22/promokit"
          data-analytics-event="promokit_view_assets_click"
          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm border border-ink/20 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-ink/5 sm:w-auto"
        >
          <Download size={16} aria-hidden />
          {REGISTRATION_SUCCESS_CONTENT.secondaryCta}
        </Link>
      </div>

      <p className="mt-5 max-w-xl text-xs leading-relaxed text-charcoal-light/80">{PROMO_KIT_SUCCESS_SHARING_NOTE}</p>
    </div>
  );
}
