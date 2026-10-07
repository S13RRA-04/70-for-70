"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { FORM_CONTROL_CLASS_COMPACT, FormError, HoneypotField } from "@/components/forms/form-parts";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { useFormSubmit } from "@/components/forms/use-form-submit";

/** Ignore an immediate refocus (e.g. an accidental click-away) — only prompt after a real trip out. */
const MIN_AWAY_MS = 5_000;

/**
 * Donate CTA that confirms the outbound trip before leaving the site — see
 * README's Priority 9 trust-signal notes. Never navigates directly; always
 * shows "You're leaving this site..." first, so it's clear this site isn't
 * processing the donation itself. Deliberately generic ("this site" rather
 * than a named brand) since this button is shared across campaign hosts.
 *
 * Also watches for the tab regaining focus after that trip out and offers a
 * one-time, skippable self-report prompt ("did you complete your gift, and
 * how much?"). Submissions land as unverified rows in `donations`, credited
 * the same way a phoned/emailed-in gift is — see /admin/donations.
 */
export function ExternalDonateButton({
  href,
  orgName,
  mileNumber,
  label = "Donate",
  className,
}: {
  href: string;
  orgName: string;
  mileNumber?: number;
  label?: string;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reportDialogRef = useRef<HTMLDialogElement>(null);
  const awaitingReturnRef = useRef(false);
  const clickedAtRef = useRef(0);
  // This button can appear many times per page, so the honeypot's id has to be
  // per-instance rather than the fixed prefix every other form uses.
  const honeypotId = useId();

  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const parsedAmount = Number(amount);
  const amountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;

  const { status, errorMessage, setTurnstileToken, turnstileRef, handleSubmit, reset, submitDisabled } = useFormSubmit({
    endpoint: "/api/donations",
    // The fields here are controlled, so the payload is built from component
    // state rather than the FormData the other forms read.
    buildPayload: () => ({
      amount: parsedAmount,
      donorName,
      donorEmail,
      anonymous,
      organizationBenefited: orgName,
      mileNumber,
    }),
    onSuccess: () => {
      setTimeout(closeReportDialog, 2_500);
    },
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    function onCancel(e: Event) {
      e.preventDefault();
      dialog?.close();
    }
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, []);

  useEffect(() => {
    function onVisibilityChange() {
      if (
        document.visibilityState === "visible" &&
        awaitingReturnRef.current &&
        Date.now() - clickedAtRef.current > MIN_AWAY_MS
      ) {
        awaitingReturnRef.current = false;
        reset();
        setAmount("");
        setDonorName("");
        setDonorEmail("");
        setAnonymous(false);
        // Mount the widget only once the dialog is open — the button can
        // appear many times per page, and Turnstile in a closed <dialog>
        // (display:none) is both unreliable and wasteful.
        setReportOpen(true);
        reportDialogRef.current?.showModal();
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [reset]);

  function closeReportDialog() {
    setReportOpen(false);
    reportDialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        data-analytics-event="donate_click"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-sm bg-bronze-text px-4 py-2 text-xs font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-dark",
          className,
        )}
      >
        {label}
        {!label.includes("→") && <ExternalLink size={13} aria-hidden />}
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        aria-labelledby="donate-confirm-heading"
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-sm border border-ink/10 bg-off-white p-0 text-ink shadow-xl backdrop:bg-ink/60"
      >
        <div className="p-6">
          <h3
            id="donate-confirm-heading"
            className="font-display text-lg font-semibold uppercase tracking-wide"
          >
            Leaving This Site
          </h3>
          <p className="mt-3 text-sm text-charcoal-light">
            You&apos;re leaving this site to donate securely through {orgName}&apos;s authorized
            platform. This site does not process or take possession of this donation.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                awaitingReturnRef.current = true;
                clickedAtRef.current = Date.now();
                dialogRef.current?.close();
              }}
              data-analytics-event="beneficiary_selected"
              className="inline-flex items-center gap-1.5 rounded-sm bg-bronze-text px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-dark"
            >
              Continue to {orgName}
              <ExternalLink size={13} aria-hidden />
            </a>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-sm border border-ink/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>

      <dialog
        ref={reportDialogRef}
        onClose={() => setReportOpen(false)}
        onClick={(e) => {
          if (e.target === reportDialogRef.current) closeReportDialog();
        }}
        aria-labelledby="donate-report-heading"
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-sm border border-ink/10 bg-off-white p-0 text-ink shadow-xl backdrop:bg-ink/60"
      >
        <div className="p-6">
          {status === "success" ? (
            <p className="text-sm font-medium text-ink">
              Thanks — we&apos;ll verify and credit this gift shortly.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <HoneypotField id={honeypotId} />
              <h3
                id="donate-report-heading"
                className="font-display text-lg font-semibold uppercase tracking-wide"
              >
                Welcome Back
              </h3>
              <p className="mt-3 text-sm text-charcoal-light">
                Did you complete your gift to {orgName}? Let us know how much so we can verify and
                credit it.
              </p>

              <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-charcoal-light">
                Amount
                <input
                  type="number"
                  inputMode="decimal"
                  min="1"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={FORM_CONTROL_CLASS_COMPACT}
                />
              </label>

              <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-charcoal-light">
                Your Name (optional)
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  disabled={anonymous}
                  className={cn(FORM_CONTROL_CLASS_COMPACT, "disabled:opacity-50")}
                />
              </label>

              <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-charcoal-light">
                Email (optional — only used to credit your total giving)
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className={FORM_CONTROL_CLASS_COMPACT}
                />
              </label>

              <label className="mt-3 flex items-center gap-2 text-sm text-charcoal-light">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                />
                Give anonymously
              </label>

              {reportOpen && (
                <TurnstileWidget
                  ref={turnstileRef}
                  action="donation_report"
                  onToken={setTurnstileToken}
                  className="mt-4"
                />
              )}

              <FormError message={status === "error" ? errorMessage : null} />

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={submitDisabled || !amountValid}
                  data-analytics-event="donation_reported"
                  className="inline-flex items-center gap-1.5 rounded-sm bg-bronze-text px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-dark disabled:opacity-60"
                >
                  {status === "submitting" ? "Submitting..." : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={closeReportDialog}
                  className="rounded-sm border border-ink/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
                >
                  Skip
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
