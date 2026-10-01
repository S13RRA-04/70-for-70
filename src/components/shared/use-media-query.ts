"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Reactive media query. Backed by useSyncExternalStore so there's no
 * setState-in-effect (the pattern react-hooks lint rejects) and no
 * hydration mismatch — the server snapshot is always `false`, and the client
 * re-reads the real value on the first commit before paint.
 *
 * Used by the pointer/reduced-motion-gated interaction components
 * (Magnetic, TiltCard, JourneyMap) to decide whether an effect should attach
 * at all, rather than attaching and then bailing.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => {};
      const list = window.matchMedia(query);
      // addEventListener is the modern API; the deprecated addListener is only
      // needed for Safari < 14, which is below this project's floor.
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  }, [query]);

  // Server render and the hydration pass both report false; useSyncExternalStore
  // then immediately re-reads the client value once hydrated.
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** True when the user has asked the OS to reduce motion. Gates every animation. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * True only for a mouse/trackpad. Guards effects that need a real hover
 * position — a touch tap has no cursor, and a synthetic mousemove after touch
 * can strand a button visibly offset.
 */
export function useFinePointer(): boolean {
  return useMediaQuery("(pointer: fine)");
}

/** Convenience: both gates satisfied, i.e. pointer-driven motion is safe. */
export function usePointerMotionEnabled(): boolean {
  const fine = useFinePointer();
  const reduce = usePrefersReducedMotion();
  return fine && !reduce;
}
