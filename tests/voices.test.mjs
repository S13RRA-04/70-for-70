// Voices For The 22 — unit tests for the pure, security-relevant rules.
// Run: npm test  (Node's built-in test runner; Node ≥ 22.18 strips TS types natively)
import { test } from "node:test";
import assert from "node:assert/strict";
import { publicationBlockers, canPublish } from "../src/lib/voices/publication-gate.ts";
import { detectFileType, matchesKind, fileExtension } from "../src/lib/voices/file-signature.ts";
import { csvCell } from "../src/lib/voices/csv.ts";
import { OUTREACH_STATUSES, PIPELINE_STAGES } from "../src/lib/voices/model.ts";

const NOW = new Date("2026-12-01T12:00:00Z");

function ready(overrides = {}) {
  return {
    now: NOW,
    publication: { publishAt: null, channels: ["website"], videoUrl: "/video/x.mp4", participantApprovedAt: null, ...overrides.publication },
    submission: overrides.submission === null ? null : { reviewStatus: "approved", embargoUntil: null, ...overrides.submission },
    permission:
      overrides.permission === null
        ? null
        : {
            status: "signed",
            permittedChannels: ["website", "organic_social"],
            requiresParticipantApproval: false,
            usageStartsOn: null,
            usageEndsOn: null,
            revokedAt: null,
            ...overrides.permission,
          },
    talentOutreachStatus: overrides.talentOutreachStatus ?? "approved",
  };
}

test("gate: fully cleared publication is publishable", () => {
  assert.deepEqual(publicationBlockers(ready()), []);
  assert.equal(canPublish(ready()), true);
});

test("gate: blocks without an approved submission", () => {
  assert.equal(canPublish(ready({ submission: null })), false);
  for (const status of ["received", "under_review", "needs_changes", "rejected", "withdrawn"]) {
    assert.equal(canPublish(ready({ submission: { reviewStatus: status } })), false, status);
  }
});

test("gate: an email reply / unsigned agreement is never permission", () => {
  assert.equal(canPublish(ready({ permission: null })), false);
  for (const status of ["draft", "sent", "expired", "revoked"]) {
    assert.equal(canPublish(ready({ permission: { status } })), false, status);
  }
  assert.equal(canPublish(ready({ permission: { revokedAt: "2026-11-30T00:00:00Z" } })), false);
});

test("gate: channels must be permitted, and the website always", () => {
  assert.equal(canPublish(ready({ publication: { channels: ["website", "approved_mission_channel"] } })), false);
  assert.equal(canPublish(ready({ permission: { permittedChannels: ["organic_social"] }, publication: { channels: [] } })), false);
  assert.equal(canPublish(ready({ publication: { channels: ["website", "organic_social"] } })), true);
});

test("gate: participant approval required when the agreement says so", () => {
  const needs = { permission: { requiresParticipantApproval: true } };
  assert.equal(canPublish(ready(needs)), false);
  assert.equal(canPublish(ready({ ...needs, publication: { participantApprovedAt: "2026-11-30T00:00:00Z" } })), true);
});

test("gate: embargo — go-live must not precede it", () => {
  assert.equal(canPublish(ready({ submission: { embargoUntil: "2026-12-15" } })), false);
  assert.equal(canPublish(ready({ submission: { embargoUntil: "2026-12-15" }, publication: { publishAt: "2026-12-14T23:59:00Z" } })), false);
  assert.equal(canPublish(ready({ submission: { embargoUntil: "2026-12-15" }, publication: { publishAt: "2026-12-15T00:00:00Z" } })), true);
  assert.equal(canPublish(ready({ submission: { embargoUntil: "2026-11-01" } })), true);
});

test("gate: usage window is enforced", () => {
  assert.equal(canPublish(ready({ permission: { usageEndsOn: "2026-11-30" } })), false);
  assert.equal(canPublish(ready({ permission: { usageEndsOn: "2026-12-01" } })), true, "end date covers the whole day");
  assert.equal(canPublish(ready({ permission: { usageStartsOn: "2026-12-10" } })), false);
});

test("gate: withdrawn participant or missing video blocks", () => {
  assert.equal(canPublish(ready({ talentOutreachStatus: "withdrawn" })), false);
  assert.equal(canPublish(ready({ publication: { videoUrl: null } })), false);
});

const bytes = (...parts) => {
  const out = [];
  for (const p of parts) {
    if (typeof p === "string") out.push(...[...p].map((c) => c.charCodeAt(0)));
    else out.push(...p);
  }
  return new Uint8Array(out);
};

test("signatures: MP4 and MOV detected from ftyp brand", () => {
  assert.equal(detectFileType(bytes([0, 0, 0, 0x20], "ftypisom", [0, 0, 2, 0])), "mp4");
  assert.equal(detectFileType(bytes([0, 0, 0, 0x14], "ftypqt  ", [0, 0, 0, 0])), "mov");
  assert.equal(detectFileType(bytes([0, 0, 0, 8], "wide", [0, 0, 0, 0])), "mov");
  assert.equal(matchesKind("video", bytes([0, 0, 0, 0x20], "ftypmp42")), true);
});

test("signatures: spoofed files are rejected regardless of extension", () => {
  assert.equal(matchesKind("video", bytes("<html><script>alert(1)</script>")), false);
  assert.equal(matchesKind("video", bytes("%PDF-1.7")), false);
  assert.equal(matchesKind("video", bytes("MZ", [0x90, 0, 3, 0, 0, 0, 4, 0, 0, 0])), false, "Windows executable");
  assert.equal(matchesKind("headshot", bytes([0, 0, 0, 0x20], "ftypisom")), false);
  assert.equal(matchesKind("video", new Uint8Array()), false);
});

test("signatures: images and PDFs", () => {
  assert.equal(matchesKind("headshot", bytes([0xff, 0xd8, 0xff, 0xe0])), true);
  assert.equal(matchesKind("headshot", bytes([0x89], "PNG", [0x0d, 0x0a, 0x1a, 0x0a])), true);
  assert.equal(matchesKind("headshot", bytes("RIFF", [0, 0, 0, 0], "WEBP")), true);
  assert.equal(matchesKind("release", bytes("%PDF-1.4")), true);
  assert.equal(matchesKind("headshot", bytes("%PDF-1.4")), false);
});

test("fileExtension", () => {
  assert.equal(fileExtension("Message FINAL.MOV"), "mov");
  assert.equal(fileExtension("noext"), "");
  assert.equal(fileExtension("../../etc/passwd"), "");
});

test("csv: neutralizes formula injection and quotes", () => {
  assert.equal(csvCell("=HYPERLINK(\"x\")"), '"\'=HYPERLINK(""x"")"');
  assert.equal(csvCell("+1"), "\"'+1\"");
  assert.equal(csvCell("@cmd"), "\"'@cmd\"");
  assert.equal(csvCell(null), '""');
  assert.equal(csvCell(["a", "b"]), '"a; b"');
});

test("model: every outreach status appears in exactly one pipeline column", () => {
  const placed = PIPELINE_STAGES.flatMap((s) => s.statuses);
  assert.equal(placed.length, OUTREACH_STATUSES.length);
  assert.deepEqual([...placed].sort(), [...OUTREACH_STATUSES].sort());
});
