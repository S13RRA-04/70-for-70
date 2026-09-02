import type { BikeBuildComponentRow } from "@/types/bike-build";

/**
 * Current personal gear needs for training and race day — displayed
 * prominently on /sponsors so anyone looking to help can see exactly
 * what's still needed at a glance. Reuses BikeBuildComponentRow's
 * component/status/statusLabel/notes shape (see types/bike-build.ts) since
 * it's the same generic "status row" concept the bike-build component
 * board already renders — not literal bike-build content.
 *
 * Informational only, by design — no contact mechanism is attached here.
 * See /sponsors/request's doc comment: public sponsorship intake,
 * including in-kind, is closed pending written federal ethics approval.
 *
 * Update a row's status by hand as an item is actually secured — never
 * mark something confirmed before it happens.
 */
export const GEAR_NEEDS: BikeBuildComponentRow[] = [
  { component: "Tri Suit", status: "needed", statusLabel: "Needed", notes: "Race-day one- or two-piece tri suit." },
  {
    component: "Wetsuit",
    status: "needed",
    statusLabel: "Needed",
    notes: "For open-water training and, if the race permits it, race day.",
  },
  { component: "Cycling Shoes", status: "needed", statusLabel: "Needed", notes: "Clipless shoes for the bike leg." },
  {
    component: "Running Shoes — Training",
    status: "needed",
    statusLabel: "Needed",
    notes: "Durable daily trainer for ongoing run miles.",
  },
  {
    component: "Running Shoes — Racing",
    status: "needed",
    statusLabel: "Needed",
    notes: "Lighter shoe for the 13.1-mile race-day run leg.",
  },
  {
    component: "Cycling Apparel",
    status: "needed",
    statusLabel: "Needed",
    notes: "Jerseys, bibs, and cold/wet-weather kit for training and race day.",
  },
  {
    component: "Running Apparel",
    status: "needed",
    statusLabel: "Needed",
    notes: "Training and race-day running kit.",
  },
];
