"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { LAST_RESULTS_KEY } from "@/lib/resources/directory";

function readLastResults(): string {
  try {
    const saved = window.sessionStorage.getItem(LAST_RESULTS_KEY);
    return saved?.startsWith("/resources") ? saved : "/resources";
  } catch {
    return "/resources";
  }
}

const subscribe = () => () => {};

/** Returns to the directory URL (query string included) this visitor last had open, else /resources. */
export function BackToResults() {
  const href = useSyncExternalStore(subscribe, readLastResults, () => "/resources");
  return (
    <Link href={href} className="self-start py-1.5 text-sm font-bold text-help underline-offset-2 hover:text-help-dark hover:underline">
      <span aria-hidden="true">←</span> Back to results
    </Link>
  );
}
