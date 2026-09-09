import { formatNumber } from "@/lib/utils";

/** "$35" (exact) or "$35–$40" (range) — no trailing qualifier. Used for a single item/card's own value. */
export function formatValueRange(min: number, max: number): string {
  return min === max ? `$${formatNumber(min)}` : `$${formatNumber(min)}–$${formatNumber(max)}`;
}

/** Same as formatValueRange, plus a trailing "+" — for the section-wide running total only, which is always a floor while the prize package is still growing. */
export function formatGrowingValueRange(min: number, max: number): string {
  return `${formatValueRange(min, max)}+`;
}
