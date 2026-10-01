"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePointerMotionEnabled } from "@/components/shared/use-media-query";

/**
 * Pointer-tracked 3D tilt for cards. Reads as physical depth — a card lifting
 * toward you as you approach — which is the "immersion" layer that makes a
 * static grid feel like a set of objects rather than a table.
 *
 * Notes:
 *
 * - `rotate` is deliberately small (3–6deg default). Anything past ~8deg
 *   makes a grid of cards look broken rather than dimensional.
 *
 * - The glow highlight is a separate pseudo-element driven by --mx/--my custom
 *   properties, so the light source tracks the cursor across the card surface.
 *
 * - Inert on coarse pointers (no hover) and under prefers-reduced-motion, and
 *   it never moves anything on keyboard focus — the reveal is pointer-only so
 *   tabbing stays calm.
 *
 * - The card must not contain anything that relies on `position: fixed`
 *   children (menus, tooltips) — a transformed ancestor becomes their
 *   containing block and they'd be positioned against the card instead of the
 *   viewport.
 *
 * - rx/ry/mx/my glide toward the pointer-derived target by a fraction each
 *   frame (lerp) rather than snapping straight to it. Raw mousemove samples
 *   are noisy enough on their own, and the 900px perspective amplifies that
 *   noise into visible rotation jitter — easing toward the target is what
 *   makes this read as a card gliding rather than twitching.
 */
export function TiltCard({
  children,
  className,
  rotate = 4,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees on each axis. */
  rotate?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const enabled = usePointerMotionEnabled();

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    // Current (eased) values the element actually renders at.
    let rx = 0;
    let ry = 0;
    let mx = 50;
    let my = 50;
    // Where the pointer wants rx/ry/mx/my to be — `settle` chases this each
    // frame instead of jumping straight to it.
    let targetRx = 0;
    let targetRy = 0;
    let targetMx = 50;
    let targetMy = 50;

    const settle = () => {
      // Fraction of the remaining distance closed per frame. Low enough to
      // smooth out raw mousemove noise, high enough that it still reads as
      // responsive rather than laggy.
      const ease = 0.18;
      rx += (targetRx - rx) * ease;
      ry += (targetRy - ry) * ease;
      mx += (targetMx - mx) * ease;
      my += (targetMy - my) * ease;

      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      el.style.setProperty("--mx", `${mx}%`);
      el.style.setProperty("--my", `${my}%`);

      // Keep gliding until close enough to the target that another frame
      // wouldn't be visible — otherwise this would run forever at a
      // vanishingly small distance.
      const settled =
        Math.abs(targetRx - rx) < 0.01 &&
        Math.abs(targetRy - ry) < 0.01 &&
        Math.abs(targetMx - mx) < 0.05 &&
        Math.abs(targetMy - my) < 0.05;
      frame = settled ? 0 : requestAnimationFrame(settle);
    };

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      // Normalize to -0.5..0.5 from the card's centre.
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      targetMx = px * 100;
      targetMy = py * 100;
      // Invert Y so moving the cursor up tips the top of the card away.
      targetRy = (px - 0.5) * rotate * 2;
      targetRx = -(py - 0.5) * rotate * 2;
      if (!frame) frame = requestAnimationFrame(settle);
    };

    const onEnter = () => setActive(true);
    const onLeave = () => {
      setActive(false);
      targetRx = 0;
      targetRy = 0;
      targetMx = 50;
      targetMy = 50;
      if (!frame) frame = requestAnimationFrame(settle);
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.style.transform = "";
    };
  }, [enabled, rotate]);

  return (
    <div className={cn("h-full", className)} style={{ transformStyle: "preserve-3d" }}>
      {/* Tilt lives on the inner element, not this one. This outer div is the
          grid child, so RevealGrid's stagger also sets `transform` on it
          (see globals.css [data-reveal-group]) — an inline transform here
          would override the reveal and the card would pop in without its
          rise. Nesting lets the two transforms compose. */}
      <div
        ref={ref}
        className={cn(
          "relative h-full transition-[box-shadow] duration-300 ease-out",
          active && "shadow-xl",
        )}
      >
        {children}
        {glare && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
            style={{
              opacity: active ? 1 : 0,
              background:
                "radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), rgb(255 255 255 / 0.14), transparent 60%)",
            }}
          />
        )}
      </div>
    </div>
  );
}
