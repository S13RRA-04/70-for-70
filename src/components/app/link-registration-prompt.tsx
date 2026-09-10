"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { linkExistingRegistrationAction } from "@/app/app/(tabs)/challenges/[slug]/actions";

export function LinkRegistrationPrompt({
  eventId,
  slug,
  firstName,
}: {
  eventId: string;
  slug: string;
  firstName: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLink() {
    setStatus("submitting");
    setErrorMessage(null);
    const result = await linkExistingRegistrationAction(eventId, slug);
    if (!result.ok) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="rounded-sm border border-bronze/30 bg-bronze/10 p-6">
      <p className="font-display text-sm font-semibold uppercase tracking-wide text-bronze">
        We Found Your Existing Registration
      </p>
      <p className="mt-2 text-sm text-charcoal-light">
        Looks like {firstName} already registered for 22 For the 22 before the app existed. Link it to this account
        to pick up where you left off.
      </p>

      {status === "error" && errorMessage && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-700">
          {errorMessage}
        </p>
      )}

      <button
        type="button"
        onClick={handleLink}
        disabled={status === "submitting"}
        className="mt-4 flex min-h-[44px] w-full items-center justify-center rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Linking..." : "Link Registration"}
      </button>
    </div>
  );
}
