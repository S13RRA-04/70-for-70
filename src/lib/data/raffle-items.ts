import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_RAFFLE_ITEMS } from "./seed-data";
import type { RaffleItemRow } from "@/types/database";

export async function getRaffleItems(): Promise<RaffleItemRow[]> {
  if (!isSupabaseConfigured()) {
    return [...SEED_RAFFLE_ITEMS].sort((a, b) => a.display_order - b.display_order);
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("raffle_items")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !data) {
    console.error("Failed to load raffle items, falling back to seed data:", error);
    return [...SEED_RAFFLE_ITEMS].sort((a, b) => a.display_order - b.display_order);
  }

  return data;
}

export interface RaffleSummary {
  itemCount: number;
  /** Distinct brands with at least one item — not the same as mission_partners' raffle-supporter count, which also includes a supporter with no item logged yet. */
  brandCount: number;
  /** Lower-bound total across every item's retail_value_min (falling back to retail_value_max when only one bound is set) — always a floor, never an estimate rounded up. */
  totalValueMin: number;
  totalValueMax: number;
}

/**
 * Always computed from the item ledger, never hand-typed — see
 * raffle_items' comment in schema.sql. `totalValueMin`/`Max` sum
 * quantity-adjusted per-item bounds; a range display should append "+"
 * since the package is still actively growing.
 */
export function getRaffleSummary(items: RaffleItemRow[]): RaffleSummary {
  let totalValueMin = 0;
  let totalValueMax = 0;

  for (const item of items) {
    const min = item.retail_value_min ?? item.retail_value_max ?? 0;
    const max = item.retail_value_max ?? item.retail_value_min ?? 0;
    totalValueMin += min * item.quantity;
    totalValueMax += max * item.quantity;
  }

  return {
    itemCount: items.length,
    brandCount: new Set(items.map((i) => i.brand)).size,
    totalValueMin,
    totalValueMax,
  };
}
