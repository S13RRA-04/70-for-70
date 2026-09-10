"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteActivityFromProgressAction } from "@/app/app/(tabs)/progress/actions";
import { EVENT_DISCIPLINE_LABELS } from "@/lib/content/22-for-the-22";
import type { ActivityRow } from "@/types/app";

function formatActivityDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Newest first — the raw list is oldest-first from getMyActivities (so session numbering reads naturally elsewhere), reversed just for this view. */
export function ActivityTimeline({ activities }: { activities: ActivityRow[] }) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!window.confirm("Delete this session? This can't be undone.")) return;
    setPendingId(id);
    startTransition(async () => {
      await deleteActivityFromProgressAction(id);
      setPendingId(null);
    });
  }

  if (activities.length === 0) {
    return <p className="rounded-sm border border-dashed border-ink/20 p-6 text-center text-sm text-charcoal-light">No sessions logged yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {[...activities].reverse().map((activity) => (
        <li key={activity.id} className="flex items-center justify-between gap-3 rounded-sm border border-ink/10 bg-off-white p-4">
          <div>
            <p className="text-sm font-semibold text-ink">
              {EVENT_DISCIPLINE_LABELS[activity.activity_type] ?? activity.activity_type} &middot;{" "}
              {activity.duration_minutes} min
            </p>
            <p className="text-xs text-charcoal-light">
              {formatActivityDate(activity.activity_date)}
              {activity.distance && activity.distance_unit ? ` · ${activity.distance} ${activity.distance_unit}` : ""}
            </p>
            {activity.notes && <p className="mt-1 text-xs text-charcoal-light/80">{activity.notes}</p>}
          </div>
          <button
            type="button"
            onClick={() => handleDelete(activity.id)}
            disabled={isPending && pendingId === activity.id}
            aria-label="Delete session"
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center text-charcoal-light hover:text-red-700 disabled:opacity-50"
          >
            <Trash2 size={16} aria-hidden />
          </button>
        </li>
      ))}
    </ul>
  );
}
