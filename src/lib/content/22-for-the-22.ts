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
 *
 * Format: 22 sessions of at least 22 minutes each (484 minutes total),
 * completed at the participant's own pace within the same overall event
 * window (still Nov 21-22 — see event_config.starts_at/ends_at). This is
 * deliberately NOT a continuous-endurance event — never write copy implying
 * participants should stay awake overnight, avoid rest, or exercise without
 * stopping. See src/lib/content/22-for-the-22-tracker.ts for the
 * session-tracker and milestone-share copy.
 */

import type { TermsSection } from "@/lib/content/terms";
import { CAMPAIGN_URL, ORG_SUPPORTING_STATEMENT, SITE_URL } from "@/lib/constants";

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

/**
 * Verbatim, in order — the full safety callout at the bottom of
 * /22forthe22. SAFETY_LANGUAGE (a single joined string) exists for the
 * handful of inline call sites (Official Rules page, Make the 22 Your Own
 * footer) that only have room for one line.
 */
export const SAFETY_LANGUAGE_PARAGRAPHS = [
  "Participants are responsible for selecting activities appropriate for their health, fitness, experience, environment, and abilities.",
  "Take appropriate rest and recovery between sessions.",
  "Use appropriate hydration, nutrition, equipment, visibility, weather precautions, and supervision when applicable.",
  "The event does not require participants to remain awake, exercise continuously, or complete sessions when doing so would be unsafe.",
] as const;

export const SAFETY_LANGUAGE = SAFETY_LANGUAGE_PARAGRAPHS.join(" ");

export const EVENT_HERO_CONTENT = {
  headline: "22 Minutes. 22 Times. One Mission.",
  supportingLine:
    "484 minutes of movement for veterans, first responders, and the communities that stand behind them.",
  dateDisplay: "November 21–22, 2026",
  secondaryCopy:
    "Complete twenty-two 22-minute movement sessions during the event window. Walk, run, ride, ruck, swim, row, hike, lift, stretch, or choose another activity appropriate for you.",
  differentLine: "Different activities. Different abilities. Same mission.",
  primaryCta: "Register Free",
  secondaryCta: "How It Works",
  tertiaryCta: "Get the Event Shirt",
} as const;

export const EVENT_WHAT_IS_CONTENT = {
  intro: "22 For the 22 is a movement challenge built around one number and one mission.",
  statLine: "22 minutes of intentional activity, 22 times.",
  tagline: "Movement Creates Momentum.",
  paragraphs: [
    "The challenge unfolds across a single 22-hour event window, putting participants out in their own communities with a shared purpose: raising public awareness of the veteran and first responder mental health crisis.",
    "That adds up to 484 minutes — just over eight hours of movement — completed at your own pace, with rest between sessions, across that 22-hour window.",
    "How you complete those sessions is up to you.",
    "Run. Walk. Ruck. Ride. Swim. Row. Hike. Lift. Stretch. Use adaptive exercise. Mix disciplines.",
    "The goal is not speed, distance, or competition.",
    "The goal is to move with purpose while helping raise awareness and support for veteran and first responder mental health, suicide prevention, recovery, and community connection.",
  ],
} as const;

/**
 * Explains the relationship between this event and the fundraiser it
 * promotes — 22 For the 22 doubles as an awareness campaign for Tri For
 * The 22, which is itself one campaign under the broader For The 22
 * umbrella (forthe22.org). ORG_SUPPORTING_STATEMENT is reused verbatim
 * (see its doc comment in constants.ts) rather than paraphrased. Two links,
 * not one — since this event moved to its own subdomain
 * (22.forthe22.org), this section is the page's most explicit backlink to
 * the fundraiser it promotes, alongside the org-level link it already had.
 */
export const EVENT_TRI_CONNECTION_CONTENT = {
  eyebrow: "The Bigger Picture",
  heading: "How This Supports Tri For the 22",
  paragraphs: [
    "22 For the 22 doubles as an awareness campaign for Tri For The 22 — Cody's 70.3-mile triathlon fundraiser in support of confirmed veteran- and first-responder-focused nonprofit beneficiaries.",
    "Every session logged and every story shared during the event window carries that fundraiser's mission further into the community.",
    "Tri For The 22 is, in turn, one campaign under the broader For The 22 umbrella.",
    ORG_SUPPORTING_STATEMENT,
  ],
  links: [
    { label: "Visit Tri For The 22", href: CAMPAIGN_URL },
    { label: "Learn More About For The 22", href: SITE_URL },
  ],
} as const;

export const EVENT_CHALLENGE_FORMAT_CONTENT = {
  intro: [
    "There is no required pace, distance, or discipline.",
    "Each of your 22 sessions simply needs to include at least 22 minutes of intentional movement.",
    "Participants may complete more than one session in a day and may take breaks between sessions.",
  ],
  examples: [
    "22-minute walk",
    "22-minute run",
    "22-minute ride",
    "22-minute ruck",
    "22-minute swim",
    "22-minute row",
    "22-minute strength session",
    "22-minute yoga or mobility session",
    "22-minute adaptive workout",
    "any other intentional activity appropriate for the participant",
  ],
  closing: "Participants may combine disciplines throughout the event.",
} as const;

export const EVENT_ACCESSIBILITY_CONTENT = {
  title: "Movement Looks Different for Everyone",
  paragraphs: [
    "22 For the 22 is designed to be adaptable.",
    "Participants should choose activities, intensity, and duration appropriate for their abilities and circumstances.",
    "Adaptive movement counts.",
    "Walking counts.",
    "Mobility work counts.",
    "The mission matters more than pace.",
  ],
} as const;

export const EVENT_HOW_IT_WORKS_STEPS = [
  {
    id: "register",
    title: "Register",
    description: "Registration is free.",
  },
  {
    id: "choose-movement",
    title: "Choose Your Movement",
    description:
      "Pick one activity or mix several: Run / Walk / Ruck / Ride / Swim / Row / Hike / Strength / Mobility / Adaptive Exercise / Other.",
  },
  {
    id: "complete-sessions",
    title: "Complete 22 Sessions",
    description:
      "Complete 22 separate activity sessions of at least 22 minutes each. Sessions may be scheduled however you choose within the official event period.",
  },
  {
    id: "track-progress",
    title: "Track Your Progress",
    description: "Mark off each completed session as you work toward 22.",
  },
  {
    id: "carry-mission",
    title: "Carry the Mission",
    description:
      "Share your progress if you choose, invite others to participate, and support the broader mission. Social sharing and donations remain optional.",
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
  strength: "Strength Training",
  mobility: "Yoga / Mobility",
  adaptive: "Adaptive Exercise",
  other: "Other",
};

export const EVENT_SEO = {
  title: "22 For the 22 | 22-Minute Movement Challenge for Veterans & First Responders",
  description:
    "Join 22 For the 22: complete 22 sessions of 22 minutes of movement while raising awareness and support for veterans, first responders, and suicide prevention.",
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
