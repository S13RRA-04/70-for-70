import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updatePasswordSchema } from "@/lib/validation/app-auth";

/** Requires an active session — reached only via the reset-password email link's callback exchange, or while already logged in. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = updatePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Your reset link has expired. Request a new one." }, { status: 401 });
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
