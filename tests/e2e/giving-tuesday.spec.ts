import { expect, test } from "@playwright/test";
import { formatGivingTuesdayDate, getGivingTuesdayPhase } from "../../src/lib/giving-tuesday";

// GivingTuesday 2026 is Tuesday, December 1 (see the awareness calendar entry).
const at = (iso: string) => getGivingTuesdayPhase(new Date(iso));

test.describe("GivingTuesday phases", () => {
  test("hidden more than a week out", () => {
    expect(at("2026-11-23T12:00:00-06:00")).toBeNull();
  });

  test("counts down during the lead-up week", () => {
    expect(at("2026-11-24T12:00:00-06:00")).toEqual({ phase: "upcoming", date: "2026-12-01", daysUntil: 7 });
    expect(at("2026-11-30T12:00:00-06:00")).toEqual({ phase: "upcoming", date: "2026-12-01", daysUntil: 1 });
  });

  test("goes live at midnight Central, not midnight UTC", () => {
    // 7 PM Central on Nov 30 is already Dec 1 in UTC; it's still the day before here.
    expect(at("2026-12-01T01:00:00Z")?.phase).toBe("upcoming");
    expect(at("2026-12-01T00:00:00-06:00")?.phase).toBe("live");
    expect(at("2026-12-01T23:59:00-06:00")?.phase).toBe("live");
  });

  test("says thank you for three days after, then hides", () => {
    expect(at("2026-12-02T09:00:00-06:00")?.phase).toBe("thanks");
    expect(at("2026-12-04T23:00:00-06:00")?.phase).toBe("thanks");
    expect(at("2026-12-05T09:00:00-06:00")).toBeNull();
  });

  test("formats the date for display", () => {
    expect(formatGivingTuesdayDate("2026-12-01")).toBe("Tuesday, December 1");
  });
});
