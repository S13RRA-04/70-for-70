import { BIKE_BUILD_TIMELINE } from "@/lib/content/building-the-bike";
import { getCampaignPhase } from "@/lib/campaign-phase";
import { RACE_INFO } from "@/lib/constants";
import type { JournalEntryRow } from "@/types/database";

export type JournalMilestoneStatus = "complete" | "current" | "upcoming";

export interface JournalMilestone {
  id: string;
  title: string;
  description: string;
  /** ISO date, only when the milestone has a fixed real-world date (e.g. race day) — most don't. */
  date?: string;
}

/**
 * "Road So Far" strip config — a plain array so a sixth/seventh milestone
 * is just another object. Nothing downstream (RoadSoFar) assumes exactly
 * five. The final "chattanooga" entry is the one true terminal step —
 * getJournalMilestonesWithStatus's elimination logic below treats every
 * other entry as an ordered build-up toward it.
 */
export const JOURNAL_MILESTONES: JournalMilestone[] = [
  {
    id: "training-begins",
    title: "Training Begins",
    description: "First swim. First bike work. Chattanooga becomes real.",
  },
  {
    id: "support-arrives",
    title: "Support Arrives",
    description: "Organizations and individuals begin stepping behind the mission.",
  },
  {
    id: "bike-build-begins",
    title: "Bike Build Begins",
    description: "A frame becomes a community-built race machine.",
  },
  {
    id: "race-specific-build",
    title: "Race-Specific Build",
    description: "The work ahead.",
  },
  {
    id: "chattanooga",
    title: "IRONMAN 70.3 Chattanooga",
    // Description is deliberately not the race date again — RoadSoFar
    // already renders `date` as its own <time> element below this text,
    // so repeating it here just duplicated the same date twice on the card.
    description: "The finish line.",
    date: RACE_INFO.raceDate ?? undefined,
  },
];

/**
 * Attaches a status to each configured milestone, derived from real signals
 * already present elsewhere on the site — never hand-flagged.
 *
 * The middle four rungs (everything but the terminal race milestone) each
 * get a real completion signal below. Among whichever of those aren't yet
 * complete, the first one in array order becomes "current" by elimination
 * — that's always the honest next step (everything before it is done,
 * nothing after it can be current until it is), not a guess.
 */
export function getJournalMilestonesWithStatus(
  entries: JournalEntryRow[],
): (JournalMilestone & { status: JournalMilestoneStatus })[] {
  const phase = getCampaignPhase();
  const raceStatus: JournalMilestoneStatus =
    phase === "completed" ? "complete" : phase === "race-week" || phase === "race-day" ? "current" : "upcoming";

  const isComplete: Record<string, boolean> = {
    "training-begins": entries.some((e) => e.primary_category === "Training"),
    "support-arrives": entries.some((e) => e.primary_category === "Support"),
    "bike-build-begins": BIKE_BUILD_TIMELINE.length > 0,
    "race-specific-build": entries.some((e) => e.primary_category === "Race Prep"),
  };

  const buildUpIds = ["training-begins", "support-arrives", "bike-build-begins", "race-specific-build"];
  const firstIncompleteId = buildUpIds.find((id) => !isComplete[id]);

  const statusById: Record<string, JournalMilestoneStatus> = {
    ...Object.fromEntries(
      buildUpIds.map((id) => [
        id,
        isComplete[id] ? "complete" : id === firstIncompleteId ? "current" : "upcoming",
      ]),
    ),
    chattanooga: raceStatus,
  };

  return JOURNAL_MILESTONES.map((milestone) => ({
    ...milestone,
    status: statusById[milestone.id] ?? "upcoming",
  }));
}
