"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { DedicationType, MileStatus } from "@/types/database";

const LIST_PATH = "/admin/donations";

function detailPath(id: string) {
  return `${LIST_PATH}/${id}`;
}

function withError(path: string, message: string) {
  return `${path}?error=${encodeURIComponent(message)}`;
}

const DEDICATION_TYPES: DedicationType[] = ["in_honor_of", "in_memory_of"];

/** Fields shared by create/update, parsed from FormData and validated. */
function parseDonationFields(formData: FormData) {
  const donorName = String(formData.get("donor_name") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const dateRaw = String(formData.get("date") ?? "");
  const organizationBenefited = String(formData.get("organization_benefited") ?? "").trim() || null;
  const mileNumberRaw = String(formData.get("mile_number") ?? "").trim();
  const externalReference = String(formData.get("external_reference") ?? "").trim() || null;
  const anonymous = formData.get("anonymous") === "on";
  const dedicationTypeRaw = String(formData.get("dedication_type") ?? "").trim();
  const dedicationType = DEDICATION_TYPES.includes(dedicationTypeRaw as DedicationType)
    ? (dedicationTypeRaw as DedicationType)
    : null;
  const dedicationName = String(formData.get("dedication_name") ?? "").trim() || null;
  const dedicationBranch = String(formData.get("dedication_branch") ?? "").trim() || null;
  const dedicationMessage = String(formData.get("dedication_message") ?? "").trim() || null;
  const dedicationPublic = formData.get("dedication_public") === "on";
  const verified = formData.get("verified") === "on";

  if (!donorName || !Number.isFinite(amount) || amount <= 0 || !dateRaw) {
    return { ok: false, error: "Donor name, a positive amount, and a date are required." } as const;
  }

  const date = new Date(dateRaw);
  if (Number.isNaN(date.getTime())) {
    return { ok: false, error: "Invalid donation date." } as const;
  }

  const mileNumber = mileNumberRaw ? Number.parseInt(mileNumberRaw, 10) : null;

  return {
    ok: true as const,
    fields: {
      donor_name: donorName,
      amount,
      organization_benefited: organizationBenefited,
      anonymous,
      dedication_type: dedicationType,
      dedication_name: dedicationName,
      dedication_branch: dedicationBranch,
      dedication_message: dedicationMessage,
      dedication_public: dedicationPublic,
      date: date.toISOString(),
      external_reference: externalReference,
      verified,
    },
    mileNumber,
  } as const;
}

/**
 * Recomputes campaign.amount_raised and every mile's amount_funded/status
 * from the current set of verified donations — the single source of truth,
 * so nothing has to keep those stored totals in sync by hand. Mile status
 * is only ever driven toward available/partially_funded/funded here; a
 * mile sitting at requested/reserved with $0 verified stays put rather
 * than being reset to available (see schema.sql's comment on miles.status).
 */
async function recomputeFundingTotals(admin: ReturnType<typeof createAdminClient>) {
  const [{ data: donations }, { data: miles }, { data: campaignRow }] = await Promise.all([
    admin.from("donations").select("amount, mile_id").eq("verified", true),
    admin.from("miles").select("id, goal_amount, amount_funded, status"),
    admin.from("campaign").select("id").limit(1).single(),
  ]);

  if (!donations || !miles) return;

  const totalRaised = donations.reduce((sum, d) => sum + Number(d.amount), 0);

  const fundedByMile = new Map<string, number>();
  for (const d of donations) {
    if (!d.mile_id) continue;
    fundedByMile.set(d.mile_id, (fundedByMile.get(d.mile_id) ?? 0) + Number(d.amount));
  }

  if (campaignRow) {
    await admin
      .from("campaign")
      .update({ amount_raised: totalRaised, updated_at: new Date().toISOString() })
      .eq("id", campaignRow.id);
  }

  await Promise.all(
    miles.map((mile) => {
      const amountFunded = fundedByMile.get(mile.id) ?? 0;
      const status = deriveMileStatus(mile.status as MileStatus, amountFunded, mile.goal_amount);
      if (amountFunded === mile.amount_funded && status === mile.status) return null;
      return admin
        .from("miles")
        .update({ amount_funded: amountFunded, status, updated_at: new Date().toISOString() })
        .eq("id", mile.id);
    }),
  );
}

function deriveMileStatus(current: MileStatus, amountFunded: number, goalAmount: number): MileStatus {
  if (amountFunded >= goalAmount) return "funded";
  if (amountFunded > 0) return "partially_funded";
  return current === "requested" || current === "reserved" ? current : "available";
}

function revalidateFundingPaths(mileNumber?: number | null) {
  revalidatePath(LIST_PATH);
  revalidatePath("/");
  revalidatePath("/live");
  revalidatePath("/fund-a-mile");
  revalidatePath("/donate");
  if (mileNumber) revalidatePath(`/miles/${mileNumber}`);
}

export async function createDonationAction(formData: FormData) {
  await requireAdminUser();
  const parsed = parseDonationFields(formData);
  if (!parsed.ok) {
    redirect(withError(LIST_PATH, parsed.error));
  }

  const admin = createAdminClient();
  let mileId: string | null = null;

  if (parsed.mileNumber) {
    const { data: mile } = await admin
      .from("miles")
      .select("id")
      .eq("mile_number", parsed.mileNumber)
      .single();
    if (!mile) {
      redirect(withError(LIST_PATH, `Mile ${parsed.mileNumber} not found.`));
    }
    mileId = mile.id;
  }

  const { error } = await admin.from("donations").insert({ ...parsed.fields, mile_id: mileId });

  if (error) {
    redirect(withError(LIST_PATH, "Failed to record donation."));
  }

  await recomputeFundingTotals(admin);
  revalidateFundingPaths(parsed.mileNumber);
  redirect(LIST_PATH);
}

export async function updateDonationAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(LIST_PATH);

  const parsed = parseDonationFields(formData);
  if (!parsed.ok) {
    redirect(withError(detailPath(id), parsed.error));
  }

  const admin = createAdminClient();
  let mileId: string | null = null;

  if (parsed.mileNumber) {
    const { data: mile } = await admin
      .from("miles")
      .select("id")
      .eq("mile_number", parsed.mileNumber)
      .single();
    if (!mile) {
      redirect(withError(detailPath(id), `Mile ${parsed.mileNumber} not found.`));
    }
    mileId = mile.id;
  }

  const { error } = await admin
    .from("donations")
    .update({ ...parsed.fields, mile_id: mileId })
    .eq("id", id);

  if (error) {
    redirect(withError(detailPath(id), "Failed to save donation."));
  }

  await recomputeFundingTotals(admin);
  revalidateFundingPaths(parsed.mileNumber);
  revalidatePath(detailPath(id));
  redirect(detailPath(id));
}

export async function deleteDonationAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(LIST_PATH);

  const admin = createAdminClient();
  const { data: existing } = await admin.from("donations").select("mile_id").eq("id", id).single();

  const { error } = await admin.from("donations").delete().eq("id", id);
  if (error) {
    redirect(withError(detailPath(id), "Failed to delete donation."));
  }

  let mileNumber: number | null = null;
  if (existing?.mile_id) {
    const { data: mile } = await admin
      .from("miles")
      .select("mile_number")
      .eq("id", existing.mile_id)
      .single();
    mileNumber = mile?.mile_number ?? null;
  }

  await recomputeFundingTotals(admin);
  revalidateFundingPaths(mileNumber);
  redirect(LIST_PATH);
}
