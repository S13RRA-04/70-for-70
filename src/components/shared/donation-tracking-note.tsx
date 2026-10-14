"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { DONATION_TRACKING_CODE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Shown only on a partner card whose donation platform can't attribute a
 * gift to this campaign on its own — see PartnerRow.requires_donation_note.
 * The donor copies this note into that platform's own note/message field so
 * the gift can be matched back to this campaign (and mile, if applicable)
 * during periodic reconciliation with the beneficiary.
 */
export function DonationTrackingNote({
  partnerName,
  mileNumber,
  trackingCode = DONATION_TRACKING_CODE,
}: {
  partnerName: string;
  mileNumber?: number;
  /** Defaults to Tri's code — pass RUCK_DONATION_TRACKING_CODE (or another campaign's) so a beneficiary shared across campaigns reconciles gifts to the right one. */
  trackingCode?: string;
}) {
  const [copied, setCopied] = useState(false);
  const note =
    mileNumber !== undefined
      ? `${trackingCode} · Mile ${String(mileNumber).padStart(2, "0")}`
      : trackingCode;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(note);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — no-op; the note text is still visible/selectable.
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-bronze/40 bg-bronze/10 px-4 py-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-bronze">
          Add This Note To Your Gift
        </p>
        <p className="mt-0.5 text-sm text-charcoal-light">
          So your gift to {partnerName} can be verified and credited:{" "}
          <span className="font-medium text-ink">{note}</span>
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "action-control inline-flex items-center justify-center font-bold shrink-0 gap-1.5 border-2 border-navy px-3 py-1.5 text-[15px] text-navy transition-colors hover:bg-white",
        )}
      >
        {copied ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
        {copied ? "Copied" : "Copy Note"}
      </button>
    </div>
  );
}
