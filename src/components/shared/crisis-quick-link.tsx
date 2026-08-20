import { Phone, MessageSquare } from "lucide-react";
import { Container } from "@/components/shared/container";
import { CTAButton } from "@/components/shared/cta-button";

/**
 * Homepage-only crisis utility strip — not the Resources directory, not the
 * footer. Kept intentionally compact: a label, a one-line non-affiliation
 * disclaimer, and three tap targets (Veteran / First Responder / Call-or-text
 * 988). The 988 action is the only guaranteed one-tap dial on this component
 * — Veteran/First Responder route to /crisis, where org-specific numbers are
 * only tel:-linked once verified (see Resource.phone in resources.ts).
 */
export function CrisisQuickLink() {
  return (
    <section className="border-y-4 border-bronze bg-off-white py-5 sm:py-6" aria-label="Crisis support">
      <Container>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="lg:max-w-xs">
            <p className="text-xs font-bold uppercase tracking-widest text-bronze">Need Help Now?</p>
            <p className="mt-1 text-xs leading-relaxed text-charcoal-light">
              For The 22 is not a crisis-response service. These links connect you with
              organizations equipped to provide immediate support.
            </p>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-3 lg:flex lg:items-center">
            <CTAButton
              href="/crisis#veterans"
              variant="secondary"
              className="w-full justify-center lg:w-auto"
            >
              Veteran Crisis Support
            </CTAButton>
            <CTAButton
              href="/crisis#first-responders"
              variant="secondary"
              className="w-full justify-center lg:w-auto"
            >
              First Responder Crisis Support
            </CTAButton>
            <div className="flex items-center gap-2">
              <a
                href="tel:988"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-bronze px-4 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light lg:flex-none"
              >
                <Phone size={14} aria-hidden="true" />
                Call 988
              </a>
              <a
                href="sms:988"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-ink/20 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-ink/5 lg:flex-none"
              >
                <MessageSquare size={14} aria-hidden="true" />
                Text 988
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
