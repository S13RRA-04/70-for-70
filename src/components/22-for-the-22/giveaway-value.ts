import { formatNumber } from "@/lib/utils";

/** "$35" (exact) or "$35–$40" (range) — no trailing qualifier. */
export function formatValueRange(min: number, max: number): string {
  return min === max ? `$${formatNumber(min)}` : `$${formatNumber(min)}–$${formatNumber(max)}`;
}
