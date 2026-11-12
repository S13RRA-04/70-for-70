"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const DAY_MS = 1000 * 60 * 60 * 24;

/**
 * The current time, ticking every second — null until mounted, so server
 * and client render the same placeholder and the clock never causes a
 * hydration mismatch. Same approach as AuctionCountdown.
 */
function useNow(): number | null {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    function tick() {
      setNow(Date.now());
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return now;
}

/**
 * Days/hours/minutes/seconds until a LIVE premiere starts, then a single
 * "out now" line. Diffs epoch milliseconds, so it's right in any time zone.
 */
export function PremiereCountdown({ startsAtIso, releasedLabel }: { startsAtIso: string; releasedLabel: string }) {
  const now = useNow();
  const diff = now === null ? null : new Date(startsAtIso).getTime() - now;

  if (diff !== null && diff <= 0) {
    return (
      <p className="label-caps inline-flex items-center gap-2.5 text-sm text-white">
        <span aria-hidden="true" className="live-on-air h-2.5 w-2.5 rounded-full bg-live-red" />
        {releasedLabel}
      </p>
    );
  }

  const units = [
    { label: "Days", value: diff === null ? null : Math.floor(diff / DAY_MS) },
    { label: "Hours", value: diff === null ? null : Math.floor((diff / (1000 * 60 * 60)) % 24) },
    { label: "Min", value: diff === null ? null : Math.floor((diff / (1000 * 60)) % 60) },
    { label: "Sec", value: diff === null ? null : Math.floor((diff / 1000) % 60), accent: true },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2.5" role="timer" aria-label="Time until the premiere">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="min-w-[72px] rounded-md border border-[#3a3a3a] bg-[rgb(17_17_17/0.6)] px-2.5 py-3 text-center sm:min-w-24"
        >
          <p
            className={cn(
              "font-display text-[44px] leading-none tabular-nums transition-opacity duration-300",
              unit.accent ? "text-live-red" : "text-white",
              unit.value === null ? "opacity-50" : "opacity-100",
            )}
          >
            {unit.value === null ? "--" : String(unit.value).padStart(2, "0")}
          </p>
          <p className="label-caps mt-1 text-[11px] text-[#bdbdbd]">{unit.label}</p>
        </div>
      ))}
    </div>
  );
}

/** "Your time: Fri 9:00 PM CST" — the start in the viewer's own zone. Renders nothing server-side or once the premiere has started. */
export function PremiereLocalTime({ startsAtIso, className }: { startsAtIso: string; className?: string }) {
  const now = useNow();
  const start = new Date(startsAtIso);
  if (now === null || start.getTime() <= now) return null;

  const local = start.toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
  return <p className={className}>Your time: {local}</p>;
}

/** A days-remaining callout for the teaser section. Hidden until mounted, and gone once the premiere starts. */
export function PremiereDaysLeft({ startsAtIso }: { startsAtIso: string }) {
  const now = useNow();
  const diff = now === null ? null : new Date(startsAtIso).getTime() - now;
  if (diff === null || diff <= 0) return null;

  const days = Math.floor(diff / DAY_MS);
  const lead = days === 0 ? "Today — the full video premieres tonight." : `${days === 1 ? "day" : "days"} until the full video.`;

  return (
    <div className="flex items-center gap-3.5 rounded-[4px] border-2 border-jet bg-paper px-4.5 py-4">
      {days > 0 && (
        <span className="font-display text-[44px] leading-none tabular-nums text-live-red">
          {String(days).padStart(2, "0")}
        </span>
      )}
      <span className="text-[15px] font-semibold leading-[1.35]">
        {lead}
        <br />
        <span className="font-normal text-[#4a4a4a]">Share the teaser and bring someone with you.</span>
      </span>
    </div>
  );
}
