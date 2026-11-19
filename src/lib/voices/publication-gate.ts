/**
 * The single rule for whether a Voices contribution may be published.
 * Pure and import-free so tests/voices.test.mjs can exercise it directly.
 *
 * Publication is blocked unless:
 *  - the linked submission is approved,
 *  - a signed, unrevoked permission agreement is recorded for this talent,
 *  - every channel the publication targets is one the agreement permits
 *    (and the website itself is always one of them, since publishing here
 *    means appearing on forthe22.org),
 *  - participant approval is recorded when the agreement requires it,
 *  - the go-live time is on/after any embargo and inside the agreement's
 *    usage window,
 *  - the participant hasn't withdrawn, and a prepared video exists.
 *
 * Returns human-readable blockers; an empty array means publishable.
 */

export interface GatePublication {
  /** ISO timestamp the video goes live. Null = "now". */
  publishAt: string | null;
  channels: readonly string[];
  videoUrl: string | null;
  participantApprovedAt: string | null;
}

export interface GateSubmission {
  reviewStatus: string;
  /** YYYY-MM-DD or ISO. */
  embargoUntil: string | null;
}

export interface GatePermission {
  status: string;
  permittedChannels: readonly string[];
  requiresParticipantApproval: boolean;
  usageStartsOn: string | null;
  usageEndsOn: string | null;
  revokedAt: string | null;
}

export interface GateInput {
  now: Date;
  publication: GatePublication;
  submission: GateSubmission | null;
  permission: GatePermission | null;
  talentOutreachStatus: string | null;
}

/** Date-only strings mean the start of that day (UTC); an end date covers the whole day. */
function parseDate(value: string, endOfDay = false): number {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return Date.parse(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`);
  }
  return Date.parse(value);
}

export function publicationBlockers(input: GateInput): string[] {
  const { now, publication, submission, permission, talentOutreachStatus } = input;
  const blockers: string[] = [];
  const goLive = publication.publishAt ? parseDate(publication.publishAt) : now.getTime();

  if (Number.isNaN(goLive)) blockers.push("The publish date is not a valid date.");

  if (talentOutreachStatus === "withdrawn") {
    blockers.push("The participant has withdrawn.");
  }

  if (!publication.videoUrl) {
    blockers.push("No prepared video is attached to this publication.");
  }

  if (!submission) {
    blockers.push("No submission is linked to this publication.");
  } else {
    if (submission.reviewStatus !== "approved") {
      blockers.push("The linked submission has not been approved.");
    }
    if (submission.embargoUntil) {
      const embargo = parseDate(submission.embargoUntil);
      if (!Number.isNaN(embargo) && goLive < embargo) {
        blockers.push(`The go-live date is before the embargo (${submission.embargoUntil}).`);
      }
    }
  }

  if (!permission) {
    blockers.push("No permission agreement is linked to this publication.");
  } else {
    if (permission.revokedAt || permission.status === "revoked") {
      blockers.push("The permission agreement has been revoked.");
    } else if (permission.status !== "signed") {
      blockers.push("The permission agreement has not been signed.");
    }

    const permitted = new Set(permission.permittedChannels);
    if (!permitted.has("website")) {
      blockers.push("The agreement does not permit publication on the For The 22 website.");
    }
    const notPermitted = publication.channels.filter((channel) => !permitted.has(channel));
    if (notPermitted.length > 0) {
      blockers.push(`The agreement does not permit: ${notPermitted.join(", ")}.`);
    }

    if (permission.requiresParticipantApproval && !publication.participantApprovedAt) {
      blockers.push("The agreement requires participant approval of the final video, and none is recorded.");
    }

    if (permission.usageStartsOn) {
      const start = parseDate(permission.usageStartsOn);
      if (!Number.isNaN(start) && goLive < start) {
        blockers.push(`The agreement's usage period starts ${permission.usageStartsOn}.`);
      }
    }
    if (permission.usageEndsOn) {
      const end = parseDate(permission.usageEndsOn, true);
      if (!Number.isNaN(end) && (goLive > end || now.getTime() > end)) {
        blockers.push(`The agreement's usage period ended ${permission.usageEndsOn}.`);
      }
    }
  }

  return blockers;
}

export function canPublish(input: GateInput): boolean {
  return publicationBlockers(input).length === 0;
}
