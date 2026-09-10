import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow, ProfileVisibility } from "@/types/app";

export async function getMyProfile(): Promise<ProfileRow | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (error) {
    console.error("Failed to load profile:", error);
    return null;
  }
  return data;
}

export async function updateMyProfile(input: {
  firstName: string;
  lastName: string;
  city?: string;
  state?: string;
  phone?: string;
  bio?: string;
  visibility: ProfileVisibility;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to update your profile." };

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: input.firstName,
      last_name: input.lastName,
      city: input.city || null,
      state: input.state || null,
      phone: input.phone || null,
      bio: input.bio || null,
      visibility: input.visibility,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Failed to update profile:", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  return { ok: true };
}
