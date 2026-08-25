import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isRateLimited } from "@/lib/rate-limit";
import { donationReportSchema } from "@/lib/validation/donation-report";

const MIN_FILL_TIME_MS = 1_500;
const SELF_REPORTED_REFERENCE = "Self-reported on site";

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (isRateLimited(`donation-report:${ip}`, { limit: 5, windowMs: 10 * 60_000 })) {
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

  const parsed = donationReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again." },
      { status: 400 },
    );
  }

  const {
    companyWebsite,
    renderedAt,
    donorName,
    donorEmail,
    anonymous,
    organizationBenefited,
    mileNumber,
    amount,
  } = parsed.data;

  const isBot = Boolean(companyWebsite) || Date.now() - renderedAt < MIN_FILL_TIME_MS;

  if (isBot) {
    // Respond as if successful so bots don't learn which check tripped.
    return NextResponse.json({ ok: true });
  }

  if (!isSupabaseConfigured()) {
    console.warn("Donation report received but Supabase is not configured; not persisted.");
    return NextResponse.json({ ok: true });
  }

  try {
    const admin = createAdminClient();
    let mileId: string | null = null;

    if (mileNumber) {
      const { data: mile } = await admin
        .from("miles")
        .select("id")
        .eq("mile_number", mileNumber)
        .single();
      mileId = mile?.id ?? null;
    }

    const { error } = await admin.from("donations").insert({
      donor_name: donorName || "Anonymous",
      donor_email: donorEmail || null,
      amount,
      organization_benefited: organizationBenefited,
      anonymous,
      mile_id: mileId,
      verified: false,
      external_reference: SELF_REPORTED_REFERENCE,
    });

    if (error) {
      console.error("Failed to insert donation report:", error);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Donation report submission failed:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
