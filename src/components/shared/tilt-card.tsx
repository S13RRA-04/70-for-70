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
    let rx = 0;
    let ry = 0;
    let mx = 50;
    let my = 50;

    const apply = () => {
      frame = 0;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      el.style.setProperty("--mx", `${mx}%`);
      el.style.setProperty("--my", `${my}%`);
    };

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      // Normalize to -0.5..0.5 from the card's centre.
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      mx = px * 100;
      my = py * 100;
      // Invert Y so moving the cursor up tips the top of the card away.
      ry = (px - 0.5) * rotate * 2;
      rx = -(py - 0.5) * rotate * 2;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onEnter = () => setActive(true);
    const onLeave = () => {
      setActive(false);
      rx = 0;
      ry = 0;
      mx = 50;
      my = 50;
      if (!frame) frame = requestAnimationFrame(apply);
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
