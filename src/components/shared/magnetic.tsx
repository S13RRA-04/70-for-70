"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { usePointerMotionEnabled } from "@/components/shared/use-media-query";

/**
 * Magnetic hover — the button leans toward the cursor while it's nearby, then
 * settles back. Applied to primary calls to action only; on every button it
 * reads as jitter rather than responsiveness.
 *
 * Implementation notes:
 *
 * - The listener is on the *parent* element (the wrapper), not the button, so
 *   the magnet is already engaged while the pointer is still approaching.
 *   Listening on the button itself means the effect only starts after the
 *   cursor is on top of it, which is too late to read as magnetic.
 *
 * - Transform is applied to the inner element, never the outer. The outer
 *   element owns layout and any `hover:*`/`focus-visible` ring — moving it
 *   would drag the focus ring away from where focus actually is.
 *
 * - Pointer only. A touch tap has no hover position, and a synthetic mousemove
 *   after touch can leave a button visibly offset, so we bail on coarse
 *   pointers and reset on scroll.
 *
 * - Fully inert for prefers-reduced-motion and for keyboard users: the
 *   effect only attaches when the pointer is fine, and there's no state-driven
 *   offset, so tabbing through never moves anything.
 */
export function Magnetic({
  children,
  className,
  strength = 0.28,
  radius = 90,
}: {
  children: React.ReactNode;
  className?: string;
  /** Max translation as a fraction of the offset between cursor and centre. */
  strength?: number;
  /** Activation distance from the element's edge, in px. */
  radius?: number;
}) {
  const outerRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const enabled = usePointerMotionEnabled();

  useEffect(() => {
    if (!enabled) return;
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    let frame = 0;
    let tx = 0;
    let ty = 0;

    const apply = () => {
      frame = 0;
      inner.style.transform = tx === 0 && ty === 0 ? "" : `translate3d(${tx}px, ${ty}px, 0)`;
    };

    const onMove = (event: PointerEvent) => {
      const rect = outer.getBoundingClientRect();
      // Distance from the pointer to the element's nearest edge, negative when
      // inside. This is the "how close am I" measure the radius compares to.
      const dx = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right);
      const dy = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
      if (dx > radius || dy > radius) {
        tx = 0;
        ty = 0;
        apply();
        return;
      }
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      tx = (event.clientX - cx) * strength;
      ty = (event.clientY - cy) * strength;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    // Any scroll can move the element out from under a stationary pointer, so
    // the offset has to be released rather than left where it was.
    const onScroll = () => {
      tx = 0;
      ty = 0;
      apply();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled, radius, strength]);

  return (
    <span ref={outerRef} className={cn("inline-block", className)}>
      <span
        ref={innerRef}
        className="inline-block will-change-transform transition-transform duration-300 ease-out motion-reduce:!transform-none"
      >
        {children}
      </span>
    </span>
  );
}
