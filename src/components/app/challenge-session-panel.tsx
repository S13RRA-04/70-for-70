"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logSessionAction } from "@/app/app/(tabs)/challenges/[slug]/actions";
import { SessionTrackerGrid } from "./session-tracker-grid";
import { SessionLogForm } from "./session-log-form";
import { SessionCompleteScreen } from "./session-complete-screen";
import type { MilestoneRow } from "@/types/app";

interface JustLoggedActivity {
  activityType: string;
  durationMinutes: number;
  distance?: number;
  distanceUnit?: string;
}

type ViewState =
  | "tracker"
  | "logging"
  | { sessionNumber: number; totalMinutes: number; lastActivity: JustLoggedActivity };

export function ChallengeSessionPanel({
  eventId,
  slug,
  requiredSessions,
  minimumSessionMinutes,
  sessionCount,
  totalMinutes,
  milestones,
}: {
  eventId: string;
  slug: string;
  requiredSessions: number;
  minimumSessionMinutes: number;
  sessionCount: number;
  totalMinutes: number;
  milestones: MilestoneRow[];
}) {
  const router = useRouter();
  const [view, setView] = useState<ViewState>("tracker");

  async function handleSubmit(input: {
    activityType: string;
    durationMinutes: number;
    distance?: number;
    distanceUnit?: string;
    activityDate: string;
    startedAt?: string;
    notes?: string;
  }) {
    const result = await logSessionAction(slug, {
      eventId,
      activityType: input.activityType as never,
      durationMinutes: input.durationMinutes,
      distance: input.distance,
      distanceUnit: input.distanceUnit as never,
      activityDate: input.activityDate,
      startedAt: input.startedAt,
      notes: input.notes,
    });

    if (result.ok) {
      const newSessionCount = sessionCount + 1;
      const newTotalMinutes = totalMinutes + input.durationMinutes;
      setView({
        sessionNumber: newSessionCount,
        totalMinutes: newTotalMinutes,
        lastActivity: {
          activityType: input.activityType,
          durationMinutes: input.durationMinutes,
          distance: input.distance,
          distanceUnit: input.distanceUnit,
        },
      });
      router.refresh();
    }

    return result;
  }

  if (typeof view === "object") {
    const milestone = milestones.find((m) => m.threshold === view.sessionNumber) ?? null;
    return (
      <SessionCompleteScreen
        sessionNumber={view.sessionNumber}
        totalSessions={requiredSessions}
        totalMinutes={view.totalMinutes}
        lastActivity={view.lastActivity}
        milestoneTitle={milestone?.title ?? null}
        milestoneMessage={milestone?.message ?? null}
        isFinished={view.sessionNumber >= requiredSessions}
        onDone={() => setView("tracker")}
      />
    );
  }

  if (view === "logging") {
    return (
      <div className="rounded-sm border border-ink/10 bg-off-white p-6">
        <p className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Log a Session</p>
        <div className="mt-4">
          <SessionLogForm minimumMinutes={minimumSessionMinutes} onSubmit={handleSubmit} onCancel={() => setView("tracker")} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
          {sessionCount} OF {requiredSessions} COMPLETE
        </p>
        <p className="text-sm font-semibold uppercase tracking-wide text-charcoal-light">{totalMinutes} MINUTES</p>
      </div>

      <div className="mt-6">
        <SessionTrackerGrid completed={sessionCount} total={requiredSessions} />
      </div>

      <button
        type="button"
        onClick={() => setView("logging")}
        className="mt-6 flex min-h-[44px] w-full items-center justify-center rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
      >
        Log a Session
      </button>
    </div>
  );
}
