import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_DONATIONS, SEED_MILES } from "./seed-data";
import type { MileRow } from "@/types/database";
import type { MileWithDonations } from "@/types/content";

export async function getMiles(): Promise<MileRow[]> {
  if (!isSupabaseConfigured()) {
    return SEED_MILES;
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("miles")
    .select("*")
    .order("mile_number", { ascending: true });

  if (error || !data) {
    console.error("Failed to load miles, falling back to seed data:", error);
    return SEED_MILES;
  }

  return data;
}

export async function getMilesWithDonations(): Promise<MileWithDonations[]> {
  if (!isSupabaseConfigured()) {
    return SEED_MILES.map((mile) => ({
      ...mile,
      donations: SEED_DONATIONS.filter((d) => d.mile_id === mile.id),
    }));
  }

  const supabase = createPublicClient();
  const [{ data: miles, error: milesError }, { data: donations, error: donationsError }] =
    await Promise.all([
      supabase.from("miles").select("*").order("mile_number", { ascending: true }),
      supabase.from("donations").select("*").eq("verified", true),
    ]);

  if (milesError || !miles) {
    console.error("Failed to load miles, falling back to seed data:", milesError);
    return SEED_MILES.map((mile) => ({
      ...mile,
      donations: SEED_DONATIONS.filter((d) => d.mile_id === mile.id),
    }));
  }

  if (donationsError) {
    console.error("Failed to load donations:", donationsError);
  }

  return miles.map((mile) => ({
    ...mile,
    donations: (donations ?? []).filter((d) => d.mile_id === mile.id),
  }));
}

export async function getMileWithDonations(
  mileNumber: number,
): Promise<MileWithDonations | null> {
  if (!isSupabaseConfigured()) {
    const mile = SEED_MILES.find((m) => m.mile_number === mileNumber);
    if (!mile) return null;
    const donations = SEED_DONATIONS.filter((d) => d.mile_id === mile.id);
    return { ...mile, donations };
  }

  const supabase = createPublicClient();
  const { data: mile, error: mileError } = await supabase
    .from("miles")
    .select("*")
    .eq("mile_number", mileNumber)
    .single();

  if (mileError || !mile) return null;

  const { data: donations, error: donationsError } = await supabase
    .from("donations")
    .select("*")
    .eq("mile_id", mile.id)
    .eq("verified", true)
    .order("date", { ascending: false });

  if (donationsError) {
    console.error("Failed to load donations for mile:", donationsError);
  }

  return { ...mile, donations: donations ?? [] };
}
