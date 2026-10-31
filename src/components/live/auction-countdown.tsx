"use client";

import { useEffect, useState } from "react";
import { computeAuctionStatus } from "@/lib/live-auction-status";
import { cn } from "@/lib/utils";

const DAY_MS = 1000 * 60 * 60 * 24;

/**
 * Days/hours/minutes/seconds to the next auction boundary: time until bidding
 * opens, then time until it closes. Client-side so it keeps ticking and flips
 * phase without a reload. Diffs epoch milliseconds, so it's correct in any
 * viewer's time zone, and renders "--" until mounted to avoid SSR/client clock
 * hydration mismatches — same pattern as the shared Countdown, which is
 * hardcoded to race-day copy and light surfaces.
 */
export function AuctionCountdown({ opensAtIso, closesAtIso }: { opensAtIso: string; closesAtIso: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    function tick() {
      setNow(Date.now());
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const status = now === null ? null : computeAuctionStatus(now, opensAtIso, closesAtIso);

  if (status === "closed") {
    return <p className="text-sm font-semibold uppercase tracking-wide text-off-white/60">Bidding has ended</p>;
  }

  const target = new Date(status === "coming-soon" ? opensAtIso : closesAtIso).getTime();
  const diff = now === null ? null : Math.max(target - now, 0);
  const units = [
    { label: "Days", value: diff === null ? null : Math.floor(diff / DAY_MS) },
    { label: "Hours", value: diff === null ? null : Math.floor((diff / (1000 * 60 * 60)) % 24) },
    { label: "Min", value: diff === null ? null : Math.floor((diff / (1000 * 60)) % 60) },
    { label: "Sec", value: diff === null ? null : Math.floor((diff / 1000) % 60) },
  ];
  const label = status === "coming-soon" ? "Bidding opens in" : "Time left to bid";

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-off-white/50">{label}</p>
      <div className="mt-2 grid grid-cols-4 gap-2" role="timer" aria-label={label}>
        {units.map((unit) => (
          <div key={unit.label} className="rounded-lg border border-off-white/10 bg-ink px-1 py-2 text-center">
            <p
              className={cn(
                "font-display text-2xl tabular-nums text-off-white transition-opacity duration-300",
                unit.value === null ? "opacity-50" : "opacity-100",
              )}
            >
              {unit.value === null ? "--" : String(unit.value).padStart(2, "0")}
            </p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-off-white/50">{unit.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
