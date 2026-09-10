"use client";

import { useEffect } from "react";

/** Registers /sw.js once on mount — only rendered inside src/app/app's layout, so this never runs on the marketing domains. */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registration failure (unsupported browser, blocked storage) — the
      // app still works fully online, just without offline caching.
    });
  }, []);

  return null;
}
