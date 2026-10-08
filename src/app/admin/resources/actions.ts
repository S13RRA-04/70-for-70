"use server";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { RESOURCES } from "@/lib/content/resources";
import { enrichFlagship, FLAGSHIP_RESOURCE_NAMES } from "@/lib/resources/flagships";
import { resourceKey } from "@/lib/resources/navigator";

export async function importFlagshipsAction() {
  await requireAdminUser();
  const rows = RESOURCES.filter((r) => FLAGSHIP_RESOURCE_NAMES.has(r.name)).map(enrichFlagship).map((r) => ({
    resource_key: resourceKey(r), name: r.name, url: r.url, description: r.description,
    need_category_ids: r.needCategoryIds, audience_tags: r.audienceTags, cost: r.cost,
    geographic_scope: r.geographicScope, state: r.state ?? null, eligibility: r.eligibility ?? null,
    availability: r.availability ?? null, verification_status: r.verificationStatus,
    why_included: r.whyIncluded, faith_based: r.faithBased ?? null,
    last_verified_at: r.verifiedDate ?? null, is_active: true,
  }));
  const { error } = await createAdminClient().from("resource_records").upsert(rows, { onConflict: "resource_key" });
  if (error) throw error;
  revalidatePath("/resources"); revalidatePath("/admin/resources");
}

export async function updateNavigationRequestAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? ""); const status = String(formData.get("status") ?? "");
  if (!id || !["new","in-progress","resolved","closed"].includes(status)) return;
  const { error } = await createAdminClient().from("resource_navigation_requests").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error; revalidatePath("/admin/resources");
}

export async function updateResourceAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  const verificationStatus = String(formData.get("verification_status") ?? "");
  const allowed = ["verified","reviewed","community-recommended","pending-review","information-incomplete"];
  if (!id || !allowed.includes(verificationStatus)) return;
  const { error } = await createAdminClient().from("resource_records").update({
    verification_status: verificationStatus,
    why_included: String(formData.get("why_included") ?? "").trim() || null,
    faith_based: formData.get("faith_based") === "unknown" ? null : formData.get("faith_based") === "yes",
    is_active: formData.get("is_active") === "on",
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) throw error;
  revalidatePath("/resources"); revalidatePath("/admin/resources");
}

export async function markFeedbackReviewedAction(formData: FormData) {
  await requireAdminUser(); const id = String(formData.get("id") ?? ""); if (!id) return;
  const { error } = await createAdminClient().from("resource_feedback").update({ reviewed: true }).eq("id", id);
  if (error) throw error; revalidatePath("/admin/resources");
}
