/**
 * Cody's personal out-of-pocket spend on the bike build, training gear, and
 * race registration — kept separate from donations, sponsorships, and
 * in-kind support (see /financial-transparency and BIKE_BUILD_COMPONENT_STATUS
 * for those). This is money Cody has spent himself, not money the campaign
 * has raised or received. Update by hand as new receipts come in; each
 * category's subtotal and the grand total are stored directly (not derived)
 * so a typo in one line item can't silently change a public total — verify
 * the arithmetic by hand when editing.
 */
export interface ExpenseItem {
  label: string;
  amount: number;
}

export interface ExpenseCategory {
  category: string;
  items: ExpenseItem[];
  subtotal: number;
}

export const OUT_OF_POCKET_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    category: "Bike & Build",
    items: [
      { label: "Used Stradalli bike/frame", amount: 88.0 },
      { label: "Shimano ST-R7000 brifters", amount: 138.99 },
      { label: "Shimano FD-R7000 clamp-on front derailleur", amount: 59.4 },
      { label: "Shimano RD-R7000 rear derailleur", amount: 38.62 },
      { label: "Shimano CN-HG601 chain", amount: 26.48 },
      { label: "Shimano brake calipers", amount: 62.12 },
      { label: "Brake/shift cable kit", amount: 10.76 },
      { label: "Handlebar tape", amount: 14.4 },
      { label: "Headset spacers", amount: 9.71 },
      { label: "Replacement seatpost clamp", amount: 9.67 },
      { label: "Assembly grease", amount: 14.03 },
      { label: "Vittoria tires", amount: 82.71 },
      { label: "Original tubes", amount: 15.0 },
      { label: "Additional two-pack of tubes", amount: 6.48 },
      { label: "ROCKBROS pedals", amount: 43.19 },
      { label: "Bike lock", amount: 9.71 },
      { label: "Chain repair tool set", amount: 16.3 },
      { label: "Three pairs of quick links", amount: 9.17 },
    ],
    subtotal: 654.74,
  },
  {
    category: "Training & Race Gear",
    items: [
      { label: "Quest Road cycling shoes", amount: 67.19 },
      { label: "Swim jammers", amount: 25.64 },
      { label: "Cycling underwear", amount: 16.19 },
      { label: "Body Glide", amount: 10.27 },
      { label: "Swim conditioner", amount: 6.79 },
      { label: "Swim earplugs", amount: 3.85 },
    ],
    subtotal: 129.93,
  },
];

/** Sum of every category's subtotal above — gear and apparel, before race registration. */
export const EQUIPMENT_EXPENSE_SUBTOTAL = 784.67;

export const RACE_REGISTRATION_EXPENSE: ExpenseItem = {
  label: "IRONMAN 70.3 Chattanooga race registration",
  amount: 570.0,
};

/** EQUIPMENT_EXPENSE_SUBTOTAL + RACE_REGISTRATION_EXPENSE.amount. */
export const TOTAL_OUT_OF_POCKET = 1354.67;
