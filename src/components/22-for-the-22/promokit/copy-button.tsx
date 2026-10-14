"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Generic clipboard-copy button — used for both caption and hashtag copy actions on the promo kit page. */
export function CopyButton({
  text,
  label,
  analyticsEvent,
  className,
}: {
  text: string;
  label: string;
  analyticsEvent: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — no-op; the text is still visible/selectable on the page.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      data-analytics-event={analyticsEvent}
      className={cn(
        "action-control inline-flex items-center justify-center font-bold min-h-[44px] gap-1.5 border-2 border-navy px-4 py-2.5 text-[15px] text-navy transition-colors hover:bg-white",
        className,
      )}
    >
      {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
      {copied ? "Copied" : label}
    </button>
  );
}
