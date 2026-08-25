"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { CAMPAIGN_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Compact highlighted bar shown at the top of /donate?mile=N — the tracking
 * note a donor copies into the beneficiary's own donation-note field so the
 * gift can be matched back to this mile. See the "How mile credit works"
 * details below it for the full explanation.
 */
export function MileTrackingNote({ mileNumber }: { mileNumber: number }) {
  const [copied, setCopied] = useState(false);
  const note = `${CAMPAIGN_NAME} — Mile ${String(mileNumber).padStart(2, "0")}`;

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
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-bronze/40 bg-bronze/10 px-4 py-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
          You&apos;re Helping Fund Mile {mileNumber}
        </p>
        <p className="mt-0.5 text-sm text-off-white/90">
          Tracking note: <span className="font-medium">{note}</span>
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-off-white/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-off-white/10",
        )}
      >
        {copied ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
        {copied ? "Copied" : "Copy Note"}
      </button>
    </div>
  );
}
