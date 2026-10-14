"use client";

import { useState } from "react";
import { Copy, Check, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  url: string;
  title: string;
  className?: string;
  /** Overrides the default "share_click" analytics marker — e.g. the promo kit page tracks its own outbound-share events separately. */
  analyticsEvent?: string;
}

/** Copy Link, Facebook, LinkedIn, X, Email — no external SDK, just share-intent URLs. */
export function ShareButtons({ url, title, className, analyticsEvent = "share_click" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — no-op; the link is still visible/selectable on the page.
    }
  }

  const linkButtonClass =
    "action-control inline-flex items-center justify-center font-bold min-h-[44px] gap-1.5 border-2 border-navy px-3 py-1.5 text-[15px] text-navy hover:bg-white";

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <button
        type="button"
        onClick={handleCopy}
        data-analytics-event={analyticsEvent}
        className={linkButtonClass}
      >
        {copied ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
        {copied ? "Copied" : "Copy Link"}
      </button>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics-event={analyticsEvent}
        className={linkButtonClass}
      >
        Facebook
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics-event={analyticsEvent}
        className={linkButtonClass}
      >
        LinkedIn
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics-event={analyticsEvent}
        className={linkButtonClass}
      >
        X
      </a>
      <a
        href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
        data-analytics-event={analyticsEvent}
        className={linkButtonClass}
      >
        <Mail size={13} aria-hidden />
        Email
      </a>
    </div>
  );
}
