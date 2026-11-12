"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const DAY_MS = 1000 * 60 * 60 * 24;

/**
 * Days/hours/minutes/seconds until a LIVE premiere starts, then a single
 * "out now" line. Same approach as AuctionCountdown: diffs epoch
 * milliseconds so it's right in any time zone, and renders "--" until
 * mounted to avoid an SSR/client clock hydration mismatch.
 */
export function PremiereCountdown({ startsAtIso, releasedLabel }: { startsAtIso: string; releasedLabel: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    function tick() {
      setNow(Date.now());
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const diff = now === null ? null : new Date(startsAtIso).getTime() - now;

  if (diff !== null && diff <= 0) {
    return (
      <p className="label-caps inline-flex items-center gap-2.5 text-sm text-white">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-live-red" />
        {releasedLabel}
      </p>
    );
  }

  const units = [
    { label: "Days", value: diff === null ? null : Math.floor(diff / DAY_MS) },
    { label: "Hours", value: diff === null ? null : Math.floor((diff / (1000 * 60 * 60)) % 24) },
    { label: "Min", value: diff === null ? null : Math.floor((diff / (1000 * 60)) % 60) },
    { label: "Sec", value: diff === null ? null : Math.floor((diff / 1000) % 60) },
  ];

  return (
    <div className="grid w-full max-w-[420px] grid-cols-4 gap-2.5" role="timer" aria-label="Time until the premiere">
      {units.map((unit) => (
        <div key={unit.label} className="rounded-[4px] border border-white/15 bg-white/5 px-1 py-3 text-center">
          <p
            className={cn(
              "font-display text-[40px] leading-none tabular-nums text-white transition-opacity duration-300",
              unit.value === null ? "opacity-50" : "opacity-100",
            )}
          >
            {unit.value === null ? "--" : String(unit.value).padStart(2, "0")}
          </p>
          <p className="label-caps mt-1.5 text-[10px] text-white/55">{unit.label}</p>
        </div>
      ))}
    </div>
  );
}
