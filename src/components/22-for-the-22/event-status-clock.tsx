"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { computeEventStatus } from "@/lib/22-for-the-22/event-status";
import type { EventLiveStatus } from "@/types/database";

const noopSubscribe = () => () => {};

/** True only after the client has hydrated, without setState-in-effect. Same pattern as Countdown's useMounted. */
function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function diffToParts(diffMs: number): TimeParts {
  const diff = Math.max(diffMs, 0);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const GRID_COLS_CLASS: Record<number, string> = { 3: "grid-cols-3", 4: "grid-cols-4" };

function TimeGrid({ parts, units, label }: { parts: TimeParts | null; units: (keyof TimeParts)[]; label: string }) {
  const UNIT_LABELS: Record<keyof TimeParts, string> = { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" };

  return (
    <div className={`grid ${GRID_COLS_CLASS[units.length]} gap-3`} role="timer" aria-live="polite" aria-label={label}>
      {units.map((unit) => (
        <div key={unit} className="rounded-sm border border-ink/10 bg-off-white px-2 py-3 text-center">
          <p className="font-display text-2xl font-semibold tabular-nums text-ink sm:text-3xl">
            {parts === null ? "--" : String(parts[unit]).padStart(2, "0")}
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-widest text-charcoal-light">
            {UNIT_LABELS[unit]}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Ticks every second and re-derives PRE/LIVE/COMPLETE via computeEventStatus
 * so a page left open across the exact start/end instant swaps copy live —
 * see event-status.ts's doc comment on why only this widget's numbers
 * update reactively, not the page's other server-rendered sections
 * (registration form, live panel, recap). Renders a static placeholder
 * until mounted, same hydration-safety pattern as Countdown.
 */
export function EventStatusClock({
  startsAtIso,
  endsAtIso,
  statusOverride,
  initialStatus,
}: {
  startsAtIso: string;
  endsAtIso: string;
  statusOverride: EventLiveStatus | null;
  initialStatus: EventLiveStatus;
}) {
  const mounted = useMounted();
  const [status, setStatus] = useState<EventLiveStatus>(initialStatus);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    function tick() {
      const nowMs = Date.now();
      setNow(nowMs);
      setStatus(computeEventStatus(nowMs, startsAtIso, endsAtIso, statusOverride));
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startsAtIso, endsAtIso, statusOverride]);

  const start = new Date(startsAtIso).getTime();
  const end = new Date(endsAtIso).getTime();

  if (status === "pre") {
    const parts = mounted && now !== null ? diffToParts(start - now) : null;
    return (
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-off-white/60">
          Countdown to Start
        </p>
        <TimeGrid parts={parts} units={["days", "hours", "minutes", "seconds"]} label="Time remaining until 22 For the 22 begins" />
      </div>
    );
  }

  if (status === "live") {
    const elapsed = mounted && now !== null ? diffToParts(now - start) : null;
    const remaining = mounted && now !== null ? diffToParts(end - now) : null;
    return (
      <div>
        <p className="font-display text-2xl font-bold uppercase tracking-wide text-bronze-light sm:text-3xl">
          We Are Moving
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-off-white/60">Elapsed</p>
            <TimeGrid parts={elapsed} units={["hours", "minutes", "seconds"]} label="Time elapsed since 22 For the 22 began" />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-off-white/60">Remaining</p>
            <TimeGrid parts={remaining} units={["hours", "minutes", "seconds"]} label="Time remaining in the 22-hour challenge" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="font-display text-2xl font-bold uppercase tracking-wide text-bronze-light sm:text-3xl">
        22 Hours Complete
      </p>
      <p className="mt-2 text-sm text-off-white/75">Thank you for moving with the mission.</p>
    </div>
  );
}
