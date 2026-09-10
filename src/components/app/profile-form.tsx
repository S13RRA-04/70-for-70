"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/app/app/(tabs)/profile/actions";
import type { ProfileRow, ProfileVisibility } from "@/types/app";

const inputClass =
  "mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-base text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40";

const VISIBILITY_OPTIONS: { value: ProfileVisibility; label: string; description: string }[] = [
  { value: "private", label: "Private", description: "Only you can see your profile." },
  { value: "participants_only", label: "Participants Only", description: "Visible to other signed-in participants." },
  { value: "public", label: "Public", description: "Visible to anyone." },
];

export function ProfileForm({ profile, email }: { profile: ProfileRow; email: string | undefined }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "saved">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const data = new FormData(e.currentTarget);
    const str = (key: string) => String(data.get(key) ?? "").trim();

    const result = await updateProfileAction({
      firstName: str("firstName"),
      lastName: str("lastName"),
      city: str("city"),
      state: str("state"),
      phone: str("phone"),
      bio: str("bio"),
      visibility: str("visibility") as ProfileVisibility,
    });

    if (!result.ok) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }

    setStatus("saved");
    router.refresh();
  }

  async function handleLogout() {
    await fetch("/api/app/auth/logout", { method: "POST" });
    router.push("/app");
    router.refresh();
  }

  return (
    <div>
      {email && <p className="text-sm text-charcoal-light">{email}</p>}

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4" aria-busy={status === "submitting"}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="pf-firstName" className="text-sm font-medium text-ink">
              First Name
            </label>
            <input id="pf-firstName" name="firstName" defaultValue={profile.first_name} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="pf-lastName" className="text-sm font-medium text-ink">
              Last Name
            </label>
            <input id="pf-lastName" name="lastName" defaultValue={profile.last_name} required className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="pf-city" className="text-sm font-medium text-ink">
              City
            </label>
            <input id="pf-city" name="city" defaultValue={profile.city ?? ""} className={inputClass} />
          </div>
          <div>
            <label htmlFor="pf-state" className="text-sm font-medium text-ink">
              State
            </label>
            <input id="pf-state" name="state" defaultValue={profile.state ?? ""} className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="pf-phone" className="text-sm font-medium text-ink">
            Phone <span className="text-charcoal-light">(optional)</span>
          </label>
          <input id="pf-phone" name="phone" type="tel" defaultValue={profile.phone ?? ""} className={inputClass} />
        </div>

        <div>
          <label htmlFor="pf-bio" className="text-sm font-medium text-ink">
            Bio <span className="text-charcoal-light">(optional)</span>
          </label>
          <textarea id="pf-bio" name="bio" rows={3} defaultValue={profile.bio ?? ""} className={inputClass} />
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-ink">Profile Visibility</legend>
          <div className="mt-2 space-y-2">
            {VISIBILITY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-start gap-3 rounded-sm border border-ink/20 p-3 text-sm has-[:checked]:border-bronze has-[:checked]:bg-bronze/10"
              >
                <input
                  type="radio"
                  name="visibility"
                  value={opt.value}
                  defaultChecked={profile.visibility === opt.value}
                  className="mt-0.5 h-4 w-4 accent-bronze"
                />
                <span>
                  <span className="block font-semibold text-ink">{opt.label}</span>
                  <span className="block text-charcoal-light">{opt.description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {status === "error" && errorMessage && (
          <p role="alert" className="text-sm font-medium text-red-700">
            {errorMessage}
          </p>
        )}
        {status === "saved" && <p className="text-sm font-medium text-olive">Saved.</p>}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex min-h-[44px] w-full items-center justify-center rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light disabled:opacity-60"
        >
          {status === "submitting" ? "Saving..." : "Save Profile"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-6 flex min-h-[44px] w-full items-center justify-center rounded-sm border border-ink/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
      >
        Log Out
      </button>
    </div>
  );
}
