/**
 * Fixed compliance/marketing copy for "22 For the 22" that is NOT
 * admin-editable — operational fields (dates, fundraising totals,
 * registration open/closed, winner announcement, a full legal rules
 * override) live in public.event_config instead, see
 * src/lib/data/event-config.ts. Everything here is either verbatim-required
 * text (the no-purchase-necessary disclosures, the safety language, the SEO
 * strings) or the placeholder Official Rules scaffold, which
 * EventConfigRow.official_rules_body can override once real legal copy is
 * approved — see /22forthe22/rules.
 */

import type { TermsSection } from "@/lib/content/terms";

/** The event_config.event_slug this deploy points every public 22-for-the-22 page at. Bump this (and insert a new event_config row) to roll over to a future year. */
export const CURRENT_EVENT_SLUG = "22-for-the-22-2026";

/**
 * The long-form disclosure — required near BOTH the registration section and
 * the giveaway section. Verbatim, do not paraphrase.
 */
export const NO_PURCHASE_NECESSARY_DISCLOSURE =
  "NO PURCHASE OR DONATION NECESSARY TO ENTER OR WIN. A PURCHASE OR DONATION WILL NOT INCREASE YOUR CHANCES OF WINNING.";

/**
 * The shorter variant used inline in the giveaway prize section. Verbatim,
 * do not paraphrase.
 */
export const GIVEAWAY_ODDS_DISCLOSURE =
  "No purchase or donation necessary. Purchases and donations do not improve odds of winning.";

/** Verbatim — must appear on the event page regardless of registration_open. */
export const SAFETY_LANGUAGE =
  "Participants are responsible for choosing activities appropriate for their ability, taking necessary rest, hydration, nutrition, and safety precautions throughout the event.";

/** Verbatim — shown once a registration submits successfully. */
export const REGISTRATION_SUCCESS_MESSAGE =
  "You're in. On November 21, we move for 22 hours — for those who served, those still fighting, and those we refuse to forget.";

export const EVENT_HERO_CONTENT = {
  headline: "22 FOR THE 22",
  subheadline: "22 Hours. One Mission. Keep Moving.",
  dateDisplay: "November 21–22, 2026",
  timeDisplay: "10:00 AM → 8:00 AM",
  durationDisplay: "22 Continuous Hours",
  primaryCta: "Register Free",
  secondaryCta: "Support the Mission",
  tertiaryCta: "Get the Event Shirt",
} as const;

export const EVENT_WHAT_IS_COPY = [
  "22 For the 22 is a 22-hour endurance challenge centered on one simple goal: keep moving.",
  "From 10:00 AM on November 21 through 8:00 AM on November 22, participants can run, ruck, ride, walk, row, swim, hike, or combine disciplines as they work to stay active throughout the full 22-hour window.",
  "The event supports the broader Tri For the 22 mission of raising awareness and support for veteran and first responder mental health, suicide prevention, recovery, and community connection.",
] as const;

export const EVENT_CHALLENGE_FORMAT_COPY = [
  "This is not about speed. It is not about one discipline. It is about continuing to move.",
  "Run for a while.",
  "Switch to a bike.",
  "Ruck.",
  "Walk.",
  "Row.",
  "Swim.",
  "Recover and continue.",
  "However you move, keep the mission moving with you.",
] as const;

export const EVENT_HOW_IT_WORKS_STEPS = [
  {
    id: "register",
    title: "Register",
    description: "Free entry.",
  },
  {
    id: "move",
    title: "Move",
    description: "Choose your discipline or mix several: Run / Ruck / Ride / Walk / Row / Swim / Hike / Other endurance movement.",
  },
  {
    id: "go-for-22",
    title: "Go for 22",
    description: "The challenge runs for 22 hours.",
  },
  {
    id: "support-the-mission",
    title: "Support the Mission",
    description:
      "Optional donations can be made through tri.forthe22.org/donate. Optional event merchandise may be purchased separately.",
  },
  {
    id: "finish",
    title: "Finish",
    description: "At 8:00 AM on Nov. 22, conclude the event and conduct the free giveaway drawing.",
  },
] as const;

export const EVENT_DISCIPLINE_LABELS: Record<string, string> = {
  run: "Run",
  ruck: "Ruck",
  ride: "Ride",
  walk: "Walk",
  row: "Row",
  swim: "Swim",
  hike: "Hike",
  other: "Other",
};

export const EVENT_SEO = {
  title: "22 For the 22 | 22-Hour Veteran & First Responder Endurance Challenge",
  description:
    "Join Tri For the 22 for a free 22-hour endurance challenge on November 21–22, 2026. Run, ruck, ride, walk, row, swim, or keep moving your way in support of veteran and first responder mental health.",
} as const;

/**
 * Hardcoded placeholder Official Rules scaffold — every field the brief
 * requires, clearly marked as not-yet-reviewed legal language. Overridden
 * wholesale by EventConfigRow.official_rules_body (rendered as markdown)
 * once real counsel-approved copy exists — see /22forthe22/rules. Do not
 * invent legal terms here beyond clearly-labeled placeholders.
 */
export const EVENT_RULES_PLACEHOLDER_SECTIONS: TermsSection[] = [
  {
    id: "sponsor-administrator",
    heading: "Sponsor / Administrator",
    body: ["[PLACEHOLDER — legal name and contact information of the event sponsor/administrator to be inserted here.]"],
  },
  {
    id: "eligibility",
    heading: "Eligibility",
    body: ["[PLACEHOLDER — who may participate and enter the giveaway to be inserted here.]"],
  },
  {
    id: "age-requirement",
    heading: "Age Requirement",
    body: ["[PLACEHOLDER — minimum age to register/enter, and any minor/guardian consent terms, to be inserted here.]"],
  },
  {
    id: "geographic-eligibility",
    heading: "Geographic Eligibility",
    body: ["[PLACEHOLDER — where entrants must reside/participate from to be inserted here.]"],
  },
  {
    id: "entry-period",
    heading: "Entry Period",
    body: ["[PLACEHOLDER — exact registration open/close dates and times to be inserted here.]"],
  },
  {
    id: "free-method-of-entry",
    heading: "Free Method of Entry",
    body: [
      NO_PURCHASE_NECESSARY_DISCLOSURE,
      "[PLACEHOLDER — the exact free entry mechanism (completing registration) to be described in full here.]",
    ],
  },
  {
    id: "entry-limit",
    heading: "One-Entry-Per-Person / Final Entry Rules",
    body: ["[PLACEHOLDER — entry limits per person and how a final/eligible entry list is determined to be inserted here.]"],
  },
  {
    id: "winner-selection",
    heading: "Winner Selection Process",
    body: ["[PLACEHOLDER — how winner(s) are selected (e.g. random drawing) and by whom to be inserted here.]"],
  },
  {
    id: "prize-descriptions",
    heading: "Prize Descriptions",
    body: ["[PLACEHOLDER — see the Giveaway section for the current prize list; full legal prize descriptions to be inserted here.]"],
  },
  {
    id: "odds",
    heading: "Odds",
    body: ["[PLACEHOLDER — odds of winning, dependent on number of eligible entries, to be inserted here.]"],
  },
  {
    id: "winner-notification",
    heading: "Winner Notification",
    body: ["[PLACEHOLDER — how and when a winner will be notified to be inserted here.]"],
  },
  {
    id: "alternate-winner",
    heading: "Alternate Winner Process",
    body: ["[PLACEHOLDER — process for selecting an alternate winner if a selected winner cannot be reached or declines to be inserted here.]"],
  },
  {
    id: "publicity",
    heading: "Publicity Permissions",
    body: ["[PLACEHOLDER — any publicity release terms for winners to be inserted here.]"],
  },
  {
    id: "liability",
    heading: "Liability Limitations",
    body: ["[PLACEHOLDER — liability and release language to be inserted here.]"],
  },
  {
    id: "platform-disclaimers",
    heading: "Platform Disclaimers",
    body: ["[PLACEHOLDER — disclaimers regarding any third-party platform used for registration/promotion to be inserted here.]"],
  },
  {
    id: "no-purchase-necessary",
    heading: "No Purchase or Donation Necessary",
    body: [NO_PURCHASE_NECESSARY_DISCLOSURE, GIVEAWAY_ODDS_DISCLOSURE],
  },
  {
    id: "void-where-prohibited",
    heading: "Void Where Prohibited",
    body: ["[PLACEHOLDER — \"Void where prohibited by law\" and any related jurisdictional exclusions to be inserted here.]"],
  },
];
