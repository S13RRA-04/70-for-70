"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerForChallengeAction } from "@/app/app/(tabs)/challenges/[slug]/actions";

export function RegisterForChallengeButton({ eventId, slug }: { eventId: string; slug: string }) {
  const router = useRouter();
  const [participationType, setParticipationType] = useState<"solo" | "team">("solo");
  const [teamName, setTeamName] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleRegister() {
    setStatus("submitting");
    setErrorMessage(null);
    const result = await registerForChallengeAction(eventId, slug, participationType, teamName);
    if (!result.ok) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="rounded-sm border border-ink/10 bg-sand-light p-6">
      <fieldset>
        <legend className="text-sm font-medium text-ink">Solo or Team</legend>
        <div className="mt-2 flex gap-4">
          {(["solo", "team"] as const).map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm text-ink">
              <input
                type="radio"
                name="participationType"
                checked={participationType === opt}
                onChange={() => setParticipationType(opt)}
                className="h-4 w-4 accent-bronze"
              />
              {opt === "solo" ? "Solo" : "Team"}
            </label>
          ))}
        </div>
      </fieldset>

      {participationType === "team" && (
        <div className="mt-4">
          <label htmlFor="team-name" className="text-sm font-medium text-ink">
            Team Name
          </label>
          <input
            id="team-name"
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-base text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40"
          />
        </div>
      )}

      {status === "error" && errorMessage && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-700">
          {errorMessage}
        </p>
      )}

      <button
        type="button"
        onClick={handleRegister}
        disabled={status === "submitting" || (participationType === "team" && !teamName.trim())}
        data-analytics-event="event_registered"
        className="mt-4 flex min-h-[44px] w-full items-center justify-center rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light disabled:opacity-60"
      >
        {status === "submitting" ? "Registering..." : "Register Free"}
      </button>
    </div>
  );
}
