"use client";

import { useEffect, useState } from "react";

/**
 * False on the first paint, true one frame later. Pair with a resting state
 * (e.g. 0% width) rendered while this is false, and the real target state
 * once it flips true — a CSS transition never plays on the very first
 * paint otherwise, since there's no prior value to transition *from*. Used
 * by every progress-bar fill (CampaignProgress, CampaignStatusBar,
 * MilestoneRail, TrainingObjectivesChecklist) so the bar visibly grows in
 * on mount instead of appearing already at its final width.
 *
 * `prefers-reduced-motion` is handled globally in globals.css (collapses
 * transition-duration to ~0), so this still resolves correctly — just
 * without the visible grow-in — for reduced-motion users.
 */
export function useMountedTransition(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return mounted;
}
