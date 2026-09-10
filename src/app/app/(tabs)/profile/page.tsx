import type { Metadata } from "next";
import { requireParticipant } from "@/lib/supabase/require-participant";
import { getMyProfile } from "@/lib/data/app/profiles";
import { ProfileForm } from "@/components/app/profile-form";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await requireParticipant();
  const profile = await getMyProfile();

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-sm text-charcoal-light">
          We couldn&apos;t load your profile. Try refreshing, or contact support if this keeps happening.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-ink">Profile</h1>
      <div className="mt-6">
        <ProfileForm profile={profile} email={user.email} />
      </div>
    </div>
  );
}
