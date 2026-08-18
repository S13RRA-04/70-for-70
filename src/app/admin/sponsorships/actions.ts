"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SponsorTier, SponsorshipStatus } from "@/types/database";

const STATUSES: SponsorshipStatus[] = [
  "submitted",
  "under_review",
  "additional_information_requested",
  "ethics_review",
  "approved",
  "declined",
  "withdrawn",
  "completed",
];

const NOTE_REQUIRED_STATUSES: SponsorshipStatus[] = ["approved", "declined"];

const SPONSOR_TIERS: SponsorTier[] = ["presenting", "mission", "supporting", "mile", "community"];

function detailPath(id: string) {
  return `/admin/sponsorships/${id}`;
}

function withError(path: string, message: string) {
  return `${path}?error=${encodeURIComponent(message)}`;
}

/**
 * Moves a sponsorship request to a new status and appends an audit trail
 * row. This — not the public form — is the only place status changes.
 * Approve/decline require a note. Nothing here can insert into
 * public.sponsors; see activateSponsorAction for that, separately gated.
 */
export async function changeStatusAction(formData: FormData) {
  const user = await requireAdminUser();
  const requestId = String(formData.get("requestId") ?? "");
  const newStatus = String(formData.get("newStatus") ?? "") as SponsorshipStatus;
  const note = String(formData.get("note") ?? "").trim();

  if (!requestId) redirect("/admin/sponsorships");

  if (!STATUSES.includes(newStatus)) {
    redirect(withError(detailPath(requestId), "Invalid status."));
  }

  if (NOTE_REQUIRED_STATUSES.includes(newStatus) && !note) {
    redirect(
      withError(
        detailPath(requestId),
        "An internal note is required to approve or decline a request.",
      ),
    );
  }

  const admin = createAdminClient();

  const { data: current, error: fetchError } = await admin
    .from("sponsorship_requests")
    .select("status")
    .eq("id", requestId)
    .single();

  if (fetchError || !current) {
    redirect(withError("/admin/sponsorships", "Request not found."));
  }

  const now = new Date().toISOString();
  const updates: Record<string, unknown> = { status: newStatus, reviewed_at: now };
  if (newStatus === "approved") updates.approved_at = now;
  if (newStatus === "declined") updates.declined_at = now;

  const { error: updateError } = await admin
    .from("sponsorship_requests")
    .update(updates)
    .eq("id", requestId);

  if (updateError) {
    redirect(withError(detailPath(requestId), "Failed to update status."));
  }

  await admin.from("sponsorship_status_history").insert({
    request_id: requestId,
    previous_status: current.status,
    new_status: newStatus,
    administrator: user.email,
    note: note || null,
  });

  revalidatePath(detailPath(requestId));
  revalidatePath("/admin/sponsorships");
  redirect(detailPath(requestId));
}

/** Saves internal vetting fields. Never changes status or is publicly visible. */
export async function saveVettingAction(formData: FormData) {
  await requireAdminUser();
  const requestId = String(formData.get("requestId") ?? "");
  if (!requestId) redirect("/admin/sponsorships");

  const admin = createAdminClient();
  const bool = (name: string) => formData.get(name) === "on";
  const text = (name: string) => String(formData.get(name) ?? "").trim() || null;

  const { error } = await admin
    .from("sponsorship_requests")
    .update({
      internal_notes: text("internal_notes"),
      organization_researched: bool("organization_researched"),
      website_reviewed: bool("website_reviewed"),
      ownership_reviewed: bool("ownership_reviewed"),
      relationship_to_campaign_owner: text("relationship_to_campaign_owner"),
      known_government_relationship: bool("known_government_relationship"),
      known_doj_fbi_relationship: bool("known_doj_fbi_relationship"),
      government_contractor_status: bool("government_contractor_status"),
      prohibited_source_concern: bool("prohibited_source_concern"),
      official_position_concern: bool("official_position_concern"),
      ethics_consultation_required: bool("ethics_consultation_required"),
      ethics_approval_received: bool("ethics_approval_received"),
      ethics_reference: text("ethics_reference"),
      final_disposition: text("final_disposition"),
    })
    .eq("id", requestId);

  if (error) {
    redirect(withError(detailPath(requestId), "Failed to save vetting notes."));
  }

  revalidatePath(detailPath(requestId));
  redirect(detailPath(requestId));
}

/**
 * The only code path that inserts into public.sponsors. Re-checks status
 * server-side (never trusts the client) — only an `approved` request can be
 * activated, enforcing "no automatic acceptance" structurally.
 */
export async function activateSponsorAction(formData: FormData) {
  await requireAdminUser();
  const requestId = String(formData.get("requestId") ?? "");
  const tier = String(formData.get("tier") ?? "") as SponsorTier;
  const name = String(formData.get("name") ?? "").trim();
  const displayOrder = Number(formData.get("displayOrder") ?? 0) || 0;
  const logoUrl = String(formData.get("logoUrl") ?? "").trim();
  const websiteUrl = String(formData.get("websiteUrl") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const contributionValueRaw = formData.get("contributionValue");
  const contributionValue = contributionValueRaw ? Number(contributionValueRaw) : null;
  const reserveMile = formData.get("reserveMile") === "on";

  if (!requestId) redirect("/admin/sponsorships");

  if (!SPONSOR_TIERS.includes(tier) || !name) {
    redirect(withError(detailPath(requestId), "Sponsor name and tier are required."));
  }

  const admin = createAdminClient();

  const { data: request, error: fetchError } = await admin
    .from("sponsorship_requests")
    .select("status, requested_mile_number")
    .eq("id", requestId)
    .single();

  if (fetchError || !request) {
    redirect(withError("/admin/sponsorships", "Request not found."));
  }

  if (request.status !== "approved") {
    redirect(
      withError(detailPath(requestId), "Only an approved request can be activated as a sponsor."),
    );
  }

  const { error: insertError } = await admin.from("sponsors").insert({
    name,
    tier,
    contribution_value: contributionValue,
    logo_url: logoUrl || null,
    website_url: websiteUrl || null,
    description: description || null,
    active: true,
    display_order: displayOrder,
    sponsorship_request_id: requestId,
  });

  if (insertError) {
    redirect(withError(detailPath(requestId), "Failed to activate sponsor."));
  }

  if (reserveMile && request.requested_mile_number) {
    await admin
      .from("miles")
      .update({ status: "reserved" })
      .eq("mile_number", request.requested_mile_number)
      .in("status", ["available", "requested"]);
  }

  revalidatePath(detailPath(requestId));
  revalidatePath("/sponsors");
  revalidatePath("/fund-a-mile");
  revalidatePath("/");
  redirect(detailPath(requestId));
}
