"use client";

import { useEffect, useRef, useState } from "react";

const ANIMATION_DURATION_MS = 1200;

/**
 * Animates a numeric value counting up to `value` on mount/change, via
 * requestAnimationFrame. Skips the animation entirely for
 * prefers-reduced-motion — checked in JS (not just CSS) since this drives
 * the number itself, not a style property; the raw `value` is rendered
 * directly in that case rather than syncing it into state, so a later
 * prop change is never stale. `formatter` lets callers reuse existing
 * formatters (formatCurrency, formatNumber, a miles label, etc.).
 */
export function CountUpNumber({
  value,
  formatter = (n: number) => String(n),
  className,
}: {
  value: number;
  formatter?: (value: number) => string;
  className?: string;
}) {
  const [reducedMotion] = useState(
    () => typeof window !== "undefined" && (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false),
  );
  const [displayValue, setDisplayValue] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;

    const from = fromRef.current;
    const delta = value - from;
    if (delta === 0) return;

    let frameId: number;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(from + delta * eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
      }
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value, reducedMotion]);

  const shown = reducedMotion ? value : displayValue;

  return (
    <span className={className} aria-label={formatter(value)}>
      <span aria-hidden="true">{formatter(shown)}</span>
    </span>
  );
}
