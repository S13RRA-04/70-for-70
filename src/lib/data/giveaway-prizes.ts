import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_GIVEAWAY_PRIZES } from "./seed-data";
import type { GiveawayPrizeRow } from "@/types/database";

export async function getGiveawayPrizes(eventId: string): Promise<GiveawayPrizeRow[]> {
  if (!isSupabaseConfigured()) {
    return SEED_GIVEAWAY_PRIZES.filter((item) => item.event_id === eventId).sort(
      (a, b) => a.display_order - b.display_order,
    );
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("giveaway_prizes")
    .select("*")
    .eq("event_id", eventId)
    .order("display_order", { ascending: true });

  if (error || !data) {
    console.error("Failed to load giveaway prizes, falling back to seed data:", error);
    return SEED_GIVEAWAY_PRIZES.filter((item) => item.event_id === eventId).sort(
      (a, b) => a.display_order - b.display_order,
    );
  }

  return data;
}

export interface GiveawaySummary {
  prizeCount: number;
  /** Distinct brands with at least one prize. */
  brandCount: number;
  /** Lower-bound total across every prize's retail_value_min (falling back to retail_value_max when only one bound is set) — always a floor, never an estimate rounded up. */
  totalValueMin: number;
  totalValueMax: number;
}

/** Always computed from the prize catalog, never hand-typed — see giveaway_prizes' comment in schema.sql. */
export function getGiveawaySummary(prizes: GiveawayPrizeRow[]): GiveawaySummary {
  let totalValueMin = 0;
  let totalValueMax = 0;

  for (const prize of prizes) {
    const min = prize.retail_value_min ?? prize.retail_value_max ?? 0;
    const max = prize.retail_value_max ?? prize.retail_value_min ?? 0;
    totalValueMin += min * prize.quantity;
    totalValueMax += max * prize.quantity;
  }

  return {
    prizeCount: prizes.length,
    brandCount: new Set(prizes.map((p) => p.brand)).size,
    totalValueMin,
    totalValueMax,
  };
}
