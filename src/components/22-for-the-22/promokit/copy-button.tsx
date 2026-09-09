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
        "inline-flex min-h-[44px] items-center gap-1.5 rounded-sm border border-ink/20 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-ink/5",
        className,
      )}
    >
      {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
      {copied ? "Copied" : label}
    </button>
  );
}
