import { BIKE_BUILD_TIMELINE } from "@/lib/content/building-the-bike";
import { getCampaignPhase } from "@/lib/campaign-phase";
import { RACE_INFO } from "@/lib/constants";
import { formatDateLong } from "@/lib/utils";
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
 * "Road So Far" strip config — a plain array so a fifth/sixth milestone is
 * just another object. Nothing downstream (RoadSoFar) assumes exactly four.
 */
export const JOURNAL_MILESTONES: JournalMilestone[] = [
  { id: "training-begins", title: "Training Begins", description: "The work starts." },
  { id: "first-support-arrives", title: "First Support Arrives", description: "Partners begin joining the campaign." },
  { id: "bike-build-begins", title: "Bike Build Begins", description: "The community starts assembling the race machine." },
  {
    id: "chattanooga",
    title: "Chattanooga",
    description: RACE_INFO.raceDate ? formatDateLong(RACE_INFO.raceDate) : "The finish line.",
    date: RACE_INFO.raceDate ?? undefined,
  },
];

/**
 * Attaches a status to each configured milestone, derived from real signals
 * already present elsewhere on the site — never hand-flagged. See each
 * branch below for the specific signal.
 */
export function getJournalMilestonesWithStatus(
  entries: JournalEntryRow[],
): (JournalMilestone & { status: JournalMilestoneStatus })[] {
  const phase = getCampaignPhase();
  const raceStatus: JournalMilestoneStatus =
    phase === "completed" ? "complete" : phase === "race-week" || phase === "race-day" ? "current" : "upcoming";

  const statusById: Record<string, JournalMilestoneStatus> = {
    "training-begins": entries.some((e) => e.primary_category === "Training") ? "complete" : "upcoming",
    "first-support-arrives": entries.some((e) => e.primary_category === "Sponsors") ? "complete" : "upcoming",
    "bike-build-begins": BIKE_BUILD_TIMELINE.length > 0 ? "complete" : "upcoming",
    chattanooga: raceStatus,
  };

  return JOURNAL_MILESTONES.map((milestone) => ({
    ...milestone,
    status: statusById[milestone.id] ?? "upcoming",
  }));
}
