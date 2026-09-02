import { MERCH_BENEFICIARIES } from "@/lib/constants";
import type { BikeBuildComponentRow } from "@/types/bike-build";

/**
 * Current personal gear and support needs for training and race day —
 * displayed prominently on /sponsors so anyone looking to help can see
 * exactly what's still needed at a glance. Grouped into categories, each
 * rendered as its own collapsible section (see CurrentGearNeeds) so the
 * list stays scannable as it grows. Reuses BikeBuildComponentRow's
 * component/status/statusLabel/notes shape (see types/bike-build.ts) for
 * each row — the same generic "status row" concept the bike-build
 * component board already renders, not literal bike-build content.
 *
 * Informational only, by design — no contact mechanism is attached here.
 * See /sponsors/request's doc comment: public sponsorship intake,
 * including in-kind, is closed pending written federal ethics approval.
 *
 * Update a row's status by hand as an item is actually secured — never
 * mark something confirmed before it happens. Add a new category by
 * appending to GEAR_NEEDS_CATEGORIES; nothing else needs to change.
 */
export interface GearNeedsCategory {
  category: string;
  items: BikeBuildComponentRow[];
}

export const GEAR_NEEDS_CATEGORIES: GearNeedsCategory[] = [
  {
    category: "Apparel & Footwear",
    items: [
      { component: "Tri Suit", status: "needed", statusLabel: "Needed", notes: "Race-day one- or two-piece tri suit." },
      {
        component: "Wetsuit",
        status: "needed",
        statusLabel: "Needed",
        notes: "For open-water training and, if the race permits it, race day.",
      },
      {
        component: "Cycling Shoes",
        status: "needed",
        statusLabel: "Needed",
        notes: "Clipless shoes for the bike leg.",
      },
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
    ],
  },
  {
    category: "Training Technology",
    items: [
      {
        component: "GPS Multisport Watch",
        status: "needed",
        statusLabel: "Needed",
        notes: "Ideally a Garmin — for tracking swim, bike, and run training with real pace, HR, and power data.",
      },
      {
        component: "FORM Smart Swim Goggles",
        status: "needed",
        statusLabel: "Needed",
        notes: "Heads-up display goggles showing real-time pace, distance, and stroke data during swim sets.",
      },
      {
        component: "Oakley Meta Smart Glasses",
        status: "needed",
        statusLabel: "Needed",
        notes: "AI-enabled smart glasses with a heads-up display for real-time workout data during training.",
      },
      {
        component: "Smart Bike Trainer",
        status: "needed",
        statusLabel: "Needed",
        notes: "Indoor smart trainer for structured, weather-proof bike sessions.",
      },
      {
        component: "Power Meter Pedals",
        status: "needed",
        statusLabel: "Needed",
        notes: "For accurate power-based bike training and pacing.",
      },
      {
        component: "Wahoo Training Devices",
        status: "needed",
        statusLabel: "Needed",
        notes: "Bike computer, sensors, and other Wahoo ecosystem training gear.",
      },
    ],
  },
  {
    category: "Support & Campaign Needs",
    items: [
      {
        component: "Coaching Support",
        status: "needed",
        statusLabel: "Needed",
        notes: "Structured coaching guidance for the training blocks ahead.",
      },
      {
        component: "Training Camera (GoPro)",
        status: "needed",
        statusLabel: "Needed",
        notes: "For documenting training and racing to share with the campaign.",
      },
      {
        component: "Campaign Tent",
        status: "needed",
        statusLabel: "Needed",
        notes: "Pop-up canopy tent for setting up at races, community events, and race weekend in Chattanooga.",
      },
      {
        component: "In-Kind Promotional Items",
        status: "needed",
        statusLabel: "Needed",
        notes: `Challenge coins, patches, stickers, and similar campaign merchandise. If sold, proceeds first repay the providing supporter's direct costs, with any remaining profit split evenly between ${MERCH_BENEFICIARIES[0]} and ${MERCH_BENEFICIARIES[1]}.`,
      },
    ],
  },
];
