"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentEventConfig } from "@/lib/data/event-config";
import type { GiveawayPrizeStatus } from "@/types/database";

const PAGE_PATH = "/admin/22-for-the-22/prizes";
const STATUSES: GiveawayPrizeStatus[] = ["confirmed", "received"];

function numberOrNull(value: FormDataEntryValue | null): number | null {
  const str = String(value ?? "").trim();
  if (!str) return null;
  const num = Number(str);
  return Number.isFinite(num) ? num : null;
}

export async function saveGiveawayPrizesAction(formData: FormData) {
  await requireAdminUser();
  const admin = createAdminClient();

  const { data: prizes, error } = await admin
    .from("giveaway_prizes")
    .select("id, status, brand, prize_name, quantity, winner_count, retail_value_min, retail_value_max, website_url, donor_note, featured, partner_id");

  if (error || !prizes) {
    redirect(PAGE_PATH);
  }

  for (const prize of prizes) {
    const statusValue = formData.get(`status-${prize.id}`);
    const status = STATUSES.includes(statusValue as GiveawayPrizeStatus)
      ? (statusValue as GiveawayPrizeStatus)
      : prize.status;
    const brand = String(formData.get(`brand-${prize.id}`) ?? "").trim() || prize.brand;
    const prizeName = String(formData.get(`prizeName-${prize.id}`) ?? "").trim() || prize.prize_name;
    const quantity = numberOrNull(formData.get(`quantity-${prize.id}`)) ?? prize.quantity;
    const winnerCount = numberOrNull(formData.get(`winnerCount-${prize.id}`)) ?? prize.winner_count;
    const retailValueMin = numberOrNull(formData.get(`retailValueMin-${prize.id}`));
    const retailValueMax = numberOrNull(formData.get(`retailValueMax-${prize.id}`));
    const websiteUrl = String(formData.get(`websiteUrl-${prize.id}`) ?? "").trim();
    const donorNote = String(formData.get(`donorNote-${prize.id}`) ?? "").trim();
    const featured = formData.get(`featured-${prize.id}`) === "on";
    const partnerId = String(formData.get(`partnerId-${prize.id}`) ?? "").trim();

    await admin
      .from("giveaway_prizes")
      .update({
        status,
        brand,
        prize_name: prizeName,
        quantity,
        winner_count: winnerCount,
        retail_value_min: retailValueMin,
        retail_value_max: retailValueMax,
        website_url: websiteUrl || null,
        donor_note: donorNote || null,
        featured,
        partner_id: partnerId || null,
      })
      .eq("id", prize.id);
  }

  revalidatePath(PAGE_PATH);
  revalidatePath("/22forthe22");
  revalidatePath("/sponsors");
  redirect(PAGE_PATH);
}

export async function addGiveawayPrizeAction(formData: FormData) {
  await requireAdminUser();
  const brand = String(formData.get("brand") ?? "").trim();
  const prizeName = String(formData.get("prizeName") ?? "").trim();

  if (!brand || !prizeName) redirect(PAGE_PATH);

  const event = await getCurrentEventConfig();
  if (!event) redirect(PAGE_PATH);

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("giveaway_prizes")
    .select("display_order")
    .eq("event_id", event.id)
    .order("display_order", { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

  await admin.from("giveaway_prizes").insert({
    event_id: event.id,
    display_order: nextOrder,
    brand,
    prize_name: prizeName,
  });

  revalidatePath(PAGE_PATH);
  revalidatePath("/22forthe22");
  revalidatePath("/sponsors");
  redirect(PAGE_PATH);
}

export async function deleteGiveawayPrizeAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(PAGE_PATH);

  const admin = createAdminClient();
  await admin.from("giveaway_prizes").delete().eq("id", id);

  revalidatePath(PAGE_PATH);
  revalidatePath("/22forthe22");
  revalidatePath("/sponsors");
  redirect(PAGE_PATH);
}
