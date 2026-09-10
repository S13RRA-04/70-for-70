"use client";

import { useState } from "react";
import { ACTIVITY_TYPES, DISTANCE_UNITS } from "@/lib/validation/activity";
import { EVENT_DISCIPLINE_LABELS } from "@/lib/content/22-for-the-22";
import type { ActivityRow } from "@/types/app";

const inputClass =
  "mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-base text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40";

function todayLocalDate(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 10);
}

export function SessionLogForm({
  minimumMinutes,
  onSubmit,
  onCancel,
}: {
  minimumMinutes: number;
  onSubmit: (input: {
    activityType: string;
    durationMinutes: number;
    distance?: number;
    distanceUnit?: string;
    activityDate: string;
    startedAt?: string;
    notes?: string;
  }) => Promise<{ ok: true; activity: ActivityRow } | { ok: false; error: string }>;
  onCancel: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasDistance, setHasDistance] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const data = new FormData(e.currentTarget);
    const distanceRaw = String(data.get("distance") ?? "").trim();

    const result = await onSubmit({
      activityType: String(data.get("activityType") ?? ""),
      durationMinutes: Number(data.get("durationMinutes") ?? 0),
      distance: distanceRaw ? Number(distanceRaw) : undefined,
      distanceUnit: distanceRaw ? String(data.get("distanceUnit") ?? "") : undefined,
      activityDate: String(data.get("activityDate") ?? ""),
      startedAt: String(data.get("startedAt") ?? "").trim() || undefined,
      notes: String(data.get("notes") ?? "").trim() || undefined,
    });

    if (!result.ok) {
      setStatus("error");
      setErrorMessage(result.error);
    }
    // On success, the parent swaps this form out for the completion screen — no local state change needed here.
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-busy={status === "submitting"}>
      <div>
        <label htmlFor="log-activityType" className="text-sm font-medium text-ink">
          Activity Type
        </label>
        <select id="log-activityType" name="activityType" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Choose an activity
          </option>
          {ACTIVITY_TYPES.map((type) => (
            <option key={type} value={type}>
              {EVENT_DISCIPLINE_LABELS[type] ?? type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="log-durationMinutes" className="text-sm font-medium text-ink">
          Duration (minutes)
        </label>
        <input
          id="log-durationMinutes"
          name="durationMinutes"
          type="number"
          required
          min={minimumMinutes}
          defaultValue={minimumMinutes}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-charcoal-light">Minimum {minimumMinutes} minutes. Longer is fine — it still counts as one session.</p>
      </div>

      <div>
        <label htmlFor="log-activityDate" className="text-sm font-medium text-ink">
          Date
        </label>
        <input id="log-activityDate" name="activityDate" type="date" required defaultValue={todayLocalDate()} className={inputClass} />
      </div>

      <div>
        <label htmlFor="log-startedAt" className="text-sm font-medium text-ink">
          Start Time <span className="text-charcoal-light">(optional)</span>
        </label>
        <input id="log-startedAt" name="startedAt" type="time" className={inputClass} />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={hasDistance}
          onChange={(e) => setHasDistance(e.target.checked)}
          className="h-4 w-4 accent-bronze"
        />
        Log a distance
      </label>

      {hasDistance && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="log-distance" className="text-sm font-medium text-ink">
              Distance
            </label>
            <input id="log-distance" name="distance" type="number" step="0.01" min="0" className={inputClass} />
          </div>
          <div>
            <label htmlFor="log-distanceUnit" className="text-sm font-medium text-ink">
              Unit
            </label>
            <select id="log-distanceUnit" name="distanceUnit" defaultValue={DISTANCE_UNITS[0]} className={inputClass}>
              {DISTANCE_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="log-notes" className="text-sm font-medium text-ink">
          Notes <span className="text-charcoal-light">(optional)</span>
        </label>
        <textarea id="log-notes" name="notes" rows={2} className={inputClass} />
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {errorMessage}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex min-h-[44px] flex-1 items-center justify-center rounded-sm border border-ink/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={status === "submitting"}
          data-analytics-event="session_logged"
          className="flex min-h-[44px] flex-1 items-center justify-center rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light disabled:opacity-60"
        >
          {status === "submitting" ? "Saving..." : "Complete Session"}
        </button>
      </div>
    </form>
  );
}
