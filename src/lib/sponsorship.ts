import type { SponsorshipRequestRow, SponsorshipStatus } from "@/types/database";

export const SPONSORSHIP_STATUS_LABELS: Record<SponsorshipStatus, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  additional_information_requested: "More Info Requested",
  ethics_review: "Ethics Review",
  approved: "Approved",
  declined: "Declined",
  withdrawn: "Withdrawn",
  completed: "Completed",
};

export const OPEN_SPONSORSHIP_STATUSES: SponsorshipStatus[] = [
  "submitted",
  "under_review",
  "additional_information_requested",
  "ethics_review",
];

/** True if any internal vetting concern flag is set, for the queue's "Review Flags" column. */
export function hasVettingFlags(request: SponsorshipRequestRow): boolean {
  return (
    request.known_government_relationship ||
    request.known_doj_fbi_relationship ||
    request.government_contractor_status ||
    request.prohibited_source_concern ||
    request.official_position_concern ||
    request.ethics_consultation_required
  );
}
