"use client";

import { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Donate CTA that confirms the outbound trip before leaving the site — see
 * README's Priority 9 trust-signal notes. Never navigates directly; always
 * shows "You're leaving For The 22..." first, so it's clear For The 22 isn't
 * processing the donation itself.
 */
export function ExternalDonateButton({
  href,
  orgName,
  label = "Donate",
  className,
}: {
  href: string;
  orgName: string;
  label?: string;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

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

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        data-analytics-event="donate_click"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-sm bg-bronze px-4 py-2 text-xs font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light",
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
        className="w-[min(28rem,calc(100vw-2rem))] rounded-sm border border-ink/10 bg-off-white p-0 text-ink shadow-xl backdrop:bg-ink/60"
      >
        <div className="p-6">
          <h3
            id="donate-confirm-heading"
            className="font-display text-lg font-semibold uppercase tracking-wide"
          >
            Leaving For The 22
          </h3>
          <p className="mt-3 text-sm text-charcoal-light">
            You&apos;re leaving For The 22 to donate securely through {orgName}&apos;s authorized
            platform. For The 22 does not process or take possession of this donation.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => dialogRef.current?.close()}
              data-analytics-event="beneficiary_selected"
              className="inline-flex items-center gap-1.5 rounded-sm bg-bronze px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
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
    </>
  );
}
