"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Keeps whichever section sits nearest the viewport center at full
 * opacity/scale and dims the rest slightly as the user scrolls past them —
 * a persistent scroll-focus cue, distinct from RevealOnScroll's one-time
 * fade-in. Defaults to focused (not dimmed) so there's no flash-of-dimmed
 * content before the observer attaches, and so it degrades gracefully
 * without JS. Respects prefers-reduced-motion via the global CSS override
 * in globals.css, which collapses transition duration to ~0.
 */
export function FocusScrollSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setFocused(entry.isIntersecting), {
      rootMargin: "-35% 0px -35% 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-500 ease-out",
        focused ? "scale-100 opacity-100" : "scale-[0.97] opacity-40",
        className,
      )}
    >
      {children}
    </div>
  );
}
