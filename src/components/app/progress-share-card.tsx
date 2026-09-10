"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { Share2, Download, Copy, Check } from "lucide-react";
import { CAMPAIGN_URL } from "@/lib/constants";
import { EVENT_DISCIPLINE_LABELS } from "@/lib/content/22-for-the-22";

const DISTANCE_UNIT_ABBREVIATIONS: Record<string, string> = {
  miles: "mi",
  kilometers: "km",
  yards: "yd",
  meters: "m",
};

interface LastActivity {
  activityType: string;
  durationMinutes: number;
  distance?: number;
  distanceUnit?: string;
}

/** "22-MINUTE RUN" or "22-MINUTE RUN · 2.5 MI" — what the participant just logged, shown in place of the generic total-minutes line when known (see SessionCompleteScreen, the only place this is populated). */
function lastActivityLine(activity: LastActivity): string {
  const label = (EVENT_DISCIPLINE_LABELS[activity.activityType] ?? activity.activityType).toUpperCase();
  const base = `${activity.durationMinutes}-MINUTE ${label}`;
  if (activity.distance && activity.distanceUnit) {
    const unit = DISTANCE_UNIT_ABBREVIATIONS[activity.distanceUnit] ?? activity.distanceUnit;
    return `${base} · ${activity.distance} ${unit}`;
  }
  return base;
}

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1080;

const noopSubscribe = () => () => {};

/** True only after the client has hydrated — same pattern as EventStatusClock/Countdown's useMounted. Needed because `"share" in navigator` is server/client-asymmetric (navigator doesn't exist during SSR), so checking it unguarded on first client render would mismatch the server-rendered HTML. */
function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

interface ProgressShareCardProps {
  firstName: string;
  eventName: string;
  sessionCount: number;
  requiredSessions: number;
  totalMinutes: number;
  lastActivity?: LastActivity;
}

/** Draws the same card shown on-screen onto an offscreen canvas for the PNG download — kept in sync by hand since there's no server-side renderer available. */
function drawCard(canvas: HTMLCanvasElement, props: ProgressShareCardProps) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  ctx.fillStyle = "#15150f";
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  ctx.textAlign = "center";
  ctx.fillStyle = "#c99a6c";
  ctx.font = "600 42px Oswald, sans-serif";
  ctx.fillText(props.firstName.toUpperCase(), CARD_WIDTH / 2, 340);

  ctx.fillStyle = "#f6f3ea";
  ctx.font = "700 84px Oswald, sans-serif";
  ctx.fillText(`${props.sessionCount} OF ${props.requiredSessions} COMPLETE`.length > 26 ? `${props.sessionCount} OF ${props.requiredSessions}` : `${props.sessionCount} OF ${props.requiredSessions} COMPLETE`, CARD_WIDTH / 2, 480);

  ctx.fillStyle = "#f6f3ea";
  ctx.globalAlpha = 0.7;
  ctx.font = "500 32px Oswald, sans-serif";
  ctx.fillText(
    props.lastActivity ? lastActivityLine(props.lastActivity) : `${props.totalMinutes} MINUTES MOVED`,
    CARD_WIDTH / 2,
    550,
  );
  ctx.globalAlpha = 1;

  ctx.strokeStyle = "rgba(246,243,234,0.2)";
  ctx.beginPath();
  ctx.moveTo(CARD_WIDTH / 2 - 120, 620);
  ctx.lineTo(CARD_WIDTH / 2 + 120, 620);
  ctx.stroke();

  ctx.fillStyle = "#f6f3ea";
  ctx.font = "700 56px Oswald, sans-serif";
  ctx.fillText(props.eventName.toUpperCase(), CARD_WIDTH / 2, 720);

  ctx.fillStyle = "#c99a6c";
  ctx.font = "600 40px Oswald, sans-serif";
  ctx.fillText("BECAUSE 22 ≠ 0.", CARD_WIDTH / 2, 800);
}

export function ProgressShareCard(props: ProgressShareCardProps) {
  const mounted = useMounted();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${CAMPAIGN_URL}/22forthe22`;
  const shareText = props.lastActivity
    ? `${props.firstName} just logged a ${lastActivityLine(props.lastActivity).toLowerCase()} session for ${props.eventName} — ${props.sessionCount} of ${props.requiredSessions} complete. Because 22 ≠ 0.`
    : `${props.firstName} is at ${props.sessionCount} of ${props.requiredSessions} sessions for ${props.eventName}. Because 22 ≠ 0.`;
  const canNativeShare = mounted && "share" in navigator;

  async function handleShare() {
    if (!canNativeShare) return;
    try {
      await navigator.share({ title: props.eventName, text: shareText, url: shareUrl });
    } catch {
      // Share cancelled or unsupported for this content — no-op.
    }
  }

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawCard(canvas, props);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `for-the-22-progress-${props.sessionCount}-of-${props.requiredSessions}.png`;
      link.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — no-op; the link is still visible on the event page.
    }
  }

  return (
    <div>
      <div
        aria-label={`Progress card: ${props.sessionCount} of ${props.requiredSessions} sessions complete${props.lastActivity ? `, just logged ${lastActivityLine(props.lastActivity).toLowerCase()}` : `, ${props.totalMinutes} minutes moved`}`}
        className="mx-auto flex aspect-square w-full max-w-sm flex-col items-center justify-center rounded-sm bg-ink p-8 text-center text-off-white"
      >
        <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-bronze-light">
          {props.firstName}
        </p>
        <p className="mt-4 text-balance font-display text-3xl font-bold uppercase tracking-tight">
          {props.sessionCount} of {props.requiredSessions} Complete
        </p>
        <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-off-white/70">
          {props.lastActivity ? lastActivityLine(props.lastActivity) : `${props.totalMinutes} Minutes Moved`}
        </p>
        <div className="mt-6 w-24 border-t border-off-white/20" />
        <p className="mt-6 font-display text-xl font-bold uppercase tracking-tight">{props.eventName}</p>
        <p className="mt-2 font-display text-base font-semibold uppercase tracking-wide text-bronze-light">
          Because 22 &ne; 0.
        </p>
      </div>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {canNativeShare && (
          <button
            type="button"
            onClick={handleShare}
            data-analytics-event="share_clicked"
            className="flex min-h-[44px] items-center gap-2 rounded-sm bg-bronze px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
          >
            <Share2 size={16} aria-hidden />
            Share
          </button>
        )}
        <button
          type="button"
          onClick={handleDownload}
          data-analytics-event="promo_asset_downloaded"
          className="flex min-h-[44px] items-center gap-2 rounded-sm border border-ink/20 px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
        >
          <Download size={16} aria-hidden />
          Download
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex min-h-[44px] items-center gap-2 rounded-sm border border-ink/20 px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
        >
          {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
          {copied ? "Copied" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}
