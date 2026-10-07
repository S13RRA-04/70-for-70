"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const noopSubscribe = () => () => {};

/** True only after the client has hydrated, without setState-in-effect. */
function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * `targetIso` must be a full ISO 8601 timestamp with an explicit UTC offset
 * (e.g. "2026-11-08T07:00:00-05:00"). The countdown always diffs epoch
 * milliseconds, so it's correct regardless of the viewer's time zone.
 * Renders a static placeholder until mounted to avoid SSR/client clock
 * hydration mismatches.
 */
export function Countdown({ targetIso }: { targetIso: string | null }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [hasPassed, setHasPassed] = useState(false);
  const mounted = useMounted();

  useEffect(() => {
    if (!targetIso) return;

    const target = new Date(targetIso).getTime();

    function tick() {
      const rawDiff = target - Date.now();
      if (rawDiff <= 0) {
        setHasPassed(true);
        return;
      }
      setTimeLeft({
        days: Math.floor(rawDiff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((rawDiff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((rawDiff / (1000 * 60)) % 60),
        seconds: Math.floor((rawDiff / 1000) % 60),
      });
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetIso]);

  if (!targetIso) {
    return (
      <p className="text-sm font-medium uppercase tracking-wide text-charcoal-light">
        Race date coming soon
      </p>
    );
  }

  if (mounted && hasPassed) {
    return (
      <p className="text-sm font-medium uppercase tracking-wide text-charcoal-light">
        Race day has come and gone — the mission continues
      </p>
    );
  }

  const units: { label: string; value: number | null }[] = [
    { label: "Days", value: mounted ? timeLeft?.days ?? null : null },
    { label: "Hours", value: mounted ? timeLeft?.hours ?? null : null },
    { label: "Minutes", value: mounted ? timeLeft?.minutes ?? null : null },
    { label: "Seconds", value: mounted ? timeLeft?.seconds ?? null : null },
  ];

  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      role="timer"
      aria-live="polite"
      aria-label="Time remaining until race day"
    >
      {units.map((unit) => (
        <div
          key={unit.label}
          className="rounded-sm border border-ink/10 bg-off-white px-2 py-3 text-center"
        >
          <p
            className={cn(
              "font-display text-2xl font-semibold tabular-nums text-ink transition-opacity duration-300 sm:text-3xl",
              // Soft fade once the real value replaces the SSR-safe "--"
              // placeholder on mount, instead of an instant swap that reads
              // as a glitch. Doesn't re-fire on every per-second tick after
              // that — only this one mount transition.
              unit.value === null ? "opacity-50" : "opacity-100",
            )}
          >
            {unit.value === null ? "--" : String(unit.value).padStart(2, "0")}
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-widest text-charcoal-light">
            {unit.label}
          </p>
        </div>
      ))}
    </div>
  );
}
