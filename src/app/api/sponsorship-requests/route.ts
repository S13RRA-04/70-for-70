import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isRateLimited } from "@/lib/rate-limit";
import { notifySponsorshipRequestSubmitted } from "@/lib/notifications";
import { sponsorshipRequestSchema } from "@/lib/validation/sponsorship-request";

const MIN_FILL_TIME_MS = 1_500;

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (isRateLimited(`sponsorship-request:${ip}`, { limit: 5, windowMs: 10 * 60_000 })) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = sponsorshipRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again." },
      { status: 400 },
    );
  }

  const {
    companyWebsite,
    renderedAt,
    phone,
    website,
    industry,
    proposedTier,
    cashValue,
    inKindValue,
    requestedBenefits,
    requestedMileNumber,
    referralSource,
    message,
    ...rest
  } = parsed.data;

  const isBot = Boolean(companyWebsite) || Date.now() - renderedAt < MIN_FILL_TIME_MS;

  if (isBot) {
    // Respond as if successful so bots don't learn which check tripped.
    return NextResponse.json({ ok: true });
  }

  if (!isSupabaseConfigured()) {
    console.warn(
      "Sponsorship request received but Supabase is not configured; not persisted:",
      rest,
    );
    return NextResponse.json({ ok: true });
  }

  try {
    const supabase = createAdminClient();

    // No sponsorship is ever accepted here — this only records the proposal
    // as `status: 'submitted'`. See supabase/schema.sql and README for the
    // full approval workflow; nothing in this route can publish a sponsor
    // or accept payment.
    const { data: inserted, error } = await supabase
      .from("sponsorship_requests")
      .insert({
        ...rest,
        phone: phone || null,
        website: website || null,
        industry: industry || null,
        proposed_tier: proposedTier ?? null,
        cash_value: cashValue ?? null,
        in_kind_value: inKindValue ?? null,
        requested_benefits: requestedBenefits || null,
        requested_mile_number: requestedMileNumber ?? null,
        referral_source: referralSource || null,
        message: message || null,
        status: "submitted",
      })
      .select("id, contact_name, organization_name, email")
      .single();

    if (error || !inserted) {
      console.error("Failed to insert sponsorship request:", error);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }

    await supabase.from("sponsorship_status_history").insert({
      request_id: inserted.id,
      previous_status: null,
      new_status: "submitted",
      administrator: null,
      note: "Submitted via public sponsorship request form.",
    });

    await notifySponsorshipRequestSubmitted({
      requestId: inserted.id,
      contactName: inserted.contact_name,
      organizationName: inserted.organization_name,
      email: inserted.email,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Sponsorship request submission failed:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
