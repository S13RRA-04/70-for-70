/**
 * The Awareness & Action Calendar — every entry transcribed directly from
 * the user's own January-December source list (not invented), covering
 * veteran, first-responder, military-family, mental-health, and remembrance
 * observances throughout the year. Same convention as building-the-bike.ts/
 * resources.ts: typed interface + exported array + derived helpers living
 * alongside the data, not duplicated into components.
 *
 * Date modeling is deliberately simple, matching event_config's explicit
 * starts_at/ends_at over computed recurrence math:
 * - `fixed`: a true every-year month/day (e.g. Oct 28, Dec 7) — "next
 *   occurrence" just rolls the year forward once the date passes.
 * - `month`: a whole-month observance — counts as current through the last
 *   day of the month, not just day 1.
 * - `explicit`: a year-specific date/range for "moving" observances (e.g.
 *   "the week of May 10" shifts every year) — THESE MUST BE RE-DATED EACH
 *   YEAR by hand once they pass; getNextOccurrence returns null for a past
 *   explicit entry rather than guessing a recurrence rule, which is the
 *   intended staleness signal. Entries below are dated for 2026 (or 2026-27
 *   where the user's own list specified it) — refresh before each falls out
 *   of date.
 *
 * `priority: true` marks the 9 entries the user explicitly flagged as "I'd
 * build actual programming around" — everything else is a real, factual,
 * one-sentence entry (not a placeholder) but doesn't get a bespoke
 * description/CTA invented for it.
 *
 * `tone: "remember"` entries skip any hard donate CTA and lead with honoring
 * the fallen/affected, per the user's explicit instruction that remembrance
 * observances shouldn't read as a fundraising pitch.
 */

import { CAMPAIGN_URL } from "@/lib/constants";

export type AwarenessCategoryId =
  | "veterans"
  | "first-responders"
  | "military-families"
  | "mental-health"
  | "remembrance";

export interface AwarenessCategory {
  id: AwarenessCategoryId;
  label: string;
}

export const AWARENESS_CATEGORIES: AwarenessCategory[] = [
  { id: "veterans", label: "Veterans" },
  { id: "first-responders", label: "First Responders" },
  { id: "military-families", label: "Military Families" },
  { id: "mental-health", label: "Mental Health" },
  { id: "remembrance", label: "Remembrance" },
];

export type AwarenessTone = "remember" | "celebrate" | "raise-awareness";

/** Recurs identically forever. */
export interface FixedDateRule {
  type: "fixed";
  /** 1-12 */
  month: number;
  day: number;
}
/** Explicit, year-specific — required for "moving" observances; refresh by hand once past. */
export interface ExplicitDateRule {
  type: "explicit";
  /** ISO date (YYYY-MM-DD) */
  startDate: string;
  /** ISO date (YYYY-MM-DD) — omit for a single day */
  endDate?: string;
}
/** Whole-month observance, every year. */
export interface MonthDateRule {
  type: "month";
  /** 1-12 */
  month: number;
}
export type AwarenessDateRule = FixedDateRule | ExplicitDateRule | MonthDateRule;

export interface AwarenessEntry {
  slug: string;
  name: string;
  /** Human-facing date text exactly as sourced (e.g. "May 10-16, 2026", "All Month", "October 28") — decoupled from dateRule, same split as BikeBuildTimelineEntry's date/displayDate. */
  displayDate: string;
  dateRule: AwarenessDateRule;
  categoryIds: AwarenessCategoryId[];
  tone: AwarenessTone;
  /** One factual sentence — required on every entry. */
  summary: string;
  /** Richer synthesized copy — only the priority entries. */
  description?: string;
  /** One of the 9 curated "build actual programming around this" entries. */
  priority?: true;
  actionCTA?: { label: string; href: string };
  /** Internal routes only — never a guessed external URL. */
  resourceLinks?: { label: string; href: string }[];
  /** Pre-made static PNG under public/awareness/ — omitted (not placeholder'd) until a real asset exists. */
  shareGraphic?: { src: string; width: number; height: number };
  /** Set only on entries that should drive the sitewide banner; days of lead time before the date the banner opens. Omit = no banner. September's Suicide Prevention Month intentionally omits this — it stays on its own bespoke AwarenessBanner (ribbon + accent colors), avoiding a collision. */
  bannerLeadDays?: number;
  /** Hand-written banner copy — only set alongside bannerLeadDays. Falls back to `summary` if unset, but every entry that actually drives a banner gets real copy, not a derived fallback. */
  bannerCopy?: string;
}

export const AWARENESS_CALENDAR: AwarenessEntry[] = [
  // ---- January ----
  {
    slug: "national-law-enforcement-appreciation-day",
    name: "National Law Enforcement Appreciation Day",
    displayDate: "January 9",
    dateRule: { type: "fixed", month: 1, day: 9 },
    categoryIds: ["first-responders"],
    tone: "celebrate",
    summary: "A day to recognize the police officers who serve their communities.",
  },
  {
    slug: "persian-gulf-war-anniversary",
    name: "Persian Gulf War Anniversary",
    displayDate: "January 17",
    dateRule: { type: "fixed", month: 1, day: 17 },
    categoryIds: ["veterans", "remembrance"],
    tone: "remember",
    summary: "Marks the anniversary of the start of the Persian Gulf War (1991).",
  },
  {
    slug: "international-holocaust-remembrance-day",
    name: "International Holocaust Remembrance Day",
    displayDate: "January 27",
    dateRule: { type: "fixed", month: 1, day: 27 },
    categoryIds: ["remembrance"],
    tone: "remember",
    summary: "A global remembrance day that includes recognition of the military liberators of Nazi concentration camps.",
  },

  // ---- February ----
  {
    slug: "four-chaplains-day",
    name: "Four Chaplains Day",
    displayDate: "February 3",
    dateRule: { type: "fixed", month: 2, day: 3 },
    categoryIds: ["veterans", "remembrance"],
    tone: "remember",
    summary: "Honors the Four Chaplains who gave their life jackets to save others aboard the sinking USAT Dorchester in 1943.",
  },
  {
    slug: "national-salute-to-veteran-patients-week",
    name: "National Salute to Veteran Patients Week",
    displayDate: "Week of February 14, 2026",
    dateRule: { type: "explicit", startDate: "2026-02-09", endDate: "2026-02-15" },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "A week recognizing veterans receiving care in VA medical facilities, often marked with volunteer visits.",
  },
  {
    slug: "coast-guard-reserve-birthday",
    name: "U.S. Coast Guard Reserve Birthday",
    displayDate: "February 19",
    dateRule: { type: "fixed", month: 2, day: 19 },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "Marks the founding of the U.S. Coast Guard Reserve.",
  },

  // ---- March ----
  {
    slug: "brain-injury-awareness-month",
    name: "Brain Injury Awareness Month",
    displayDate: "All Month",
    dateRule: { type: "month", month: 3 },
    categoryIds: ["veterans", "mental-health"],
    tone: "raise-awareness",
    summary: "Raises awareness of traumatic brain injury, a common invisible wound among combat veterans.",
  },
  {
    slug: "national-social-work-month",
    name: "National Social Work Month",
    displayDate: "All Month",
    dateRule: { type: "month", month: 3 },
    categoryIds: ["mental-health"],
    tone: "raise-awareness",
    summary: "Recognizes social workers, many of whom support veterans and first responders through recovery and reintegration.",
  },
  {
    slug: "national-hug-a-gi-day",
    name: "National Hug a G.I. Day",
    displayDate: "March 4",
    dateRule: { type: "fixed", month: 3, day: 4 },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "An informal day of appreciation for service members and veterans.",
  },
  {
    slug: "k9-veterans-day",
    name: "K9 Veterans Day",
    displayDate: "March 13",
    dateRule: { type: "fixed", month: 3, day: 13 },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "Honors military and working dogs that have served alongside service members.",
  },
  {
    slug: "national-medal-of-honor-day",
    name: "National Medal of Honor Day",
    displayDate: "March 25",
    dateRule: { type: "fixed", month: 3, day: 25 },
    categoryIds: ["veterans", "remembrance"],
    tone: "remember",
    summary: "Honors recipients of the Medal of Honor, the nation's highest military decoration.",
  },
  {
    slug: "national-vietnam-war-veterans-day",
    name: "National Vietnam War Veterans Day",
    displayDate: "March 29",
    dateRule: { type: "fixed", month: 3, day: 29 },
    categoryIds: ["veterans", "remembrance"],
    tone: "remember",
    summary: "A federally recognized day honoring Vietnam War veterans and their families.",
  },

  // ---- April ----
  {
    slug: "month-of-the-military-child",
    name: "Month of the Military Child",
    displayDate: "All Month",
    dateRule: { type: "month", month: 4 },
    categoryIds: ["military-families"],
    tone: "raise-awareness",
    priority: true,
    summary: "Recognizes the children of military families and the unique challenges they face.",
    description:
      "Highlight the children and spouses who carry the weight of military service — the sacrifices made at home are part of the same story as the sacrifices made in uniform.",
    actionCTA: { label: "Meet Our Beneficiary Organizations", href: `${CAMPAIGN_URL}/beneficiaries` },
    resourceLinks: [
      { label: "Get Involved", href: `${CAMPAIGN_URL}/get-involved` },
      { label: "Support the Mission", href: `${CAMPAIGN_URL}/donate` },
    ],
    bannerLeadDays: 0,
    bannerCopy: "April is the Month of the Military Child — honoring the kids who carry the weight of military service too.",
  },
  {
    slug: "national-volunteer-month",
    name: "National Volunteer Month",
    displayDate: "All Month",
    dateRule: { type: "month", month: 4 },
    categoryIds: [],
    tone: "celebrate",
    summary: "Recognizes volunteers nationwide, including those who support veteran and first-responder organizations.",
  },
  {
    slug: "gold-star-spouses-day",
    name: "Gold Star Spouses Day",
    displayDate: "April 5",
    dateRule: { type: "fixed", month: 4, day: 5 },
    categoryIds: ["military-families", "remembrance"],
    tone: "remember",
    summary: "Honors surviving spouses of service members who died while serving.",
  },
  {
    slug: "air-force-reserve-birthday",
    name: "Air Force Reserve Birthday",
    displayDate: "April 14",
    dateRule: { type: "fixed", month: 4, day: 14 },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "Marks the founding of the Air Force Reserve.",
  },
  {
    slug: "purple-up-day",
    name: "Purple Up! Day",
    displayDate: "April 15 (widely observed; dates can vary)",
    dateRule: { type: "fixed", month: 4, day: 15 },
    categoryIds: ["military-families"],
    tone: "celebrate",
    summary: "Communities wear purple to show support for military children — the color that represents all branches combined.",
  },
  {
    slug: "national-public-safety-telecommunicators-week",
    name: "National Public Safety Telecommunicators Week",
    displayDate: "April 19-25, 2026",
    dateRule: { type: "explicit", startDate: "2026-04-19", endDate: "2026-04-25" },
    categoryIds: ["first-responders"],
    tone: "celebrate",
    summary: "Honors 911 dispatchers and telecommunicators, often the first and least-recognized point of contact in an emergency.",
  },
  {
    slug: "army-reserve-birthday",
    name: "Army Reserve Birthday",
    displayDate: "April 23",
    dateRule: { type: "fixed", month: 4, day: 23 },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "Marks the founding of the Army Reserve.",
  },

  // ---- May ----
  {
    slug: "national-military-appreciation-month",
    name: "National Military Appreciation Month",
    displayDate: "All Month",
    dateRule: { type: "month", month: 5 },
    categoryIds: ["veterans"],
    tone: "celebrate",
    priority: true,
    summary: "A month recognizing active-duty service members, veterans, and military families.",
    description:
      "Build a monthlong campaign around the Chattanooga 70.3 race and the $70K Mission — military appreciation, fallen officers, EMS, mental health, and Memorial Day all converge in May.",
    actionCTA: { label: "Follow the Race Journey", href: `${CAMPAIGN_URL}/the-race` },
    resourceLinks: [
      { label: "Explore the $70K Mission", href: "/70k" },
      { label: "Donate", href: `${CAMPAIGN_URL}/donate` },
    ],
    bannerLeadDays: 0,
    bannerCopy: "May is National Military Appreciation Month — a season honoring service members, veterans, and the families behind them.",
  },
  {
    slug: "mental-health-awareness-month",
    name: "Mental Health Awareness Month",
    displayDate: "All Month",
    dateRule: { type: "month", month: 5 },
    categoryIds: ["mental-health"],
    tone: "raise-awareness",
    priority: true,
    summary: "A national month raising awareness of mental health, including the toll of service-related trauma.",
    description:
      "Mental health converges with Military Appreciation Month in May — pair storytelling with a direct path to vetted resources for anyone struggling.",
    actionCTA: { label: "Find Mental Health Resources", href: "/resources" },
    resourceLinks: [{ label: "Crisis Resources", href: "/crisis" }],
  },
  {
    slug: "silver-star-service-banner-day",
    name: "Silver Star Service Banner Day",
    displayDate: "May 1",
    dateRule: { type: "fixed", month: 5, day: 1 },
    categoryIds: ["military-families"],
    tone: "celebrate",
    summary: "Honors families of service members wounded in combat, represented by the Silver Star Service Banner.",
  },
  {
    slug: "international-firefighters-day",
    name: "International Firefighters' Day",
    displayDate: "May 4",
    dateRule: { type: "fixed", month: 5, day: 4 },
    categoryIds: ["first-responders"],
    tone: "celebrate",
    summary: "An international day recognizing firefighters' service and sacrifice.",
  },
  {
    slug: "military-spouse-appreciation-day",
    name: "Military Spouse Appreciation Day",
    displayDate: "May 8, 2026",
    dateRule: { type: "explicit", startDate: "2026-05-08" },
    categoryIds: ["military-families"],
    tone: "celebrate",
    summary: "Recognizes the spouses who support service members through deployments, relocations, and reintegration.",
  },
  {
    slug: "national-police-week",
    name: "National Police Week",
    displayDate: "May 10-16, 2026",
    dateRule: { type: "explicit", startDate: "2026-05-10", endDate: "2026-05-16" },
    categoryIds: ["first-responders"],
    tone: "raise-awareness",
    summary: "A week honoring law enforcement officers, including those killed in the line of duty.",
  },
  {
    slug: "peace-officers-memorial-day",
    name: "Peace Officers Memorial Day",
    displayDate: "May 15",
    dateRule: { type: "fixed", month: 5, day: 15 },
    categoryIds: ["first-responders", "remembrance"],
    tone: "remember",
    summary: "Honors law enforcement officers killed or disabled in the line of duty.",
  },
  {
    slug: "armed-forces-day",
    name: "Armed Forces Day",
    displayDate: "May 16, 2026",
    dateRule: { type: "explicit", startDate: "2026-05-16" },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "Honors men and women currently serving in the U.S. Armed Forces.",
  },
  {
    slug: "national-ems-week",
    name: "National EMS Week",
    displayDate: "May 17-23, 2026",
    dateRule: { type: "explicit", startDate: "2026-05-17", endDate: "2026-05-23" },
    categoryIds: ["first-responders"],
    tone: "celebrate",
    summary: "A week recognizing EMS personnel and the critical, often overlooked care they provide.",
  },
  {
    slug: "memorial-day",
    name: "Memorial Day",
    displayDate: "May 25, 2026",
    dateRule: { type: "explicit", startDate: "2026-05-25" },
    categoryIds: ["veterans", "remembrance"],
    tone: "remember",
    summary: "Honors service members who died while serving in the U.S. military — a day to lead with remembrance, not a fundraising pitch.",
  },

  // ---- June ----
  {
    slug: "ptsd-awareness-month",
    name: "PTSD Awareness Month",
    displayDate: "All Month",
    dateRule: { type: "month", month: 6 },
    categoryIds: ["mental-health", "veterans"],
    tone: "raise-awareness",
    priority: true,
    summary: "A national month raising awareness of post-traumatic stress and its treatment.",
    description:
      "Share recovery stories and vetted resources, including support from beneficiary organizations working directly with veterans and first responders managing PTSD.",
    actionCTA: { label: "Find PTSD Resources", href: "/resources" },
    resourceLinks: [{ label: "Meet Our Beneficiaries", href: `${CAMPAIGN_URL}/beneficiaries` }],
    bannerLeadDays: 0,
    bannerCopy: "June is PTSD Awareness Month — recovery is possible, and real resources are available.",
  },
  {
    slug: "d-day-anniversary",
    name: "D-Day Anniversary",
    displayDate: "June 6",
    dateRule: { type: "fixed", month: 6, day: 6 },
    categoryIds: ["veterans", "remembrance"],
    tone: "remember",
    summary: "Marks the anniversary of the Allied invasion of Normandy in 1944.",
  },
  {
    slug: "women-veterans-recognition-day",
    name: "Women Veterans Recognition Day",
    displayDate: "June 12",
    dateRule: { type: "fixed", month: 6, day: 12 },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "Recognizes the service and sacrifice of women veterans.",
  },
  {
    slug: "army-birthday-flag-day",
    name: "U.S. Army Birthday and Flag Day",
    displayDate: "June 14",
    dateRule: { type: "fixed", month: 6, day: 14 },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "Marks the founding of the U.S. Army, shared with Flag Day.",
  },
  {
    slug: "coast-guard-auxiliary-birthday",
    name: "Coast Guard Auxiliary Birthday",
    displayDate: "June 23",
    dateRule: { type: "fixed", month: 6, day: 23 },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "Marks the founding of the U.S. Coast Guard Auxiliary.",
  },
  {
    slug: "national-ptsd-awareness-day",
    name: "National PTSD Awareness Day",
    displayDate: "June 27",
    dateRule: { type: "fixed", month: 6, day: 27 },
    categoryIds: ["mental-health", "veterans"],
    tone: "raise-awareness",
    summary: "A dedicated day within PTSD Awareness Month highlighting treatment and support options.",
  },

  // ---- July ----
  {
    slug: "independence-day",
    name: "Independence Day",
    displayDate: "July 4",
    dateRule: { type: "fixed", month: 7, day: 4 },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "Marks the nation's founding and is widely observed alongside military and veteran communities.",
  },
  {
    slug: "national-hire-a-veteran-day",
    name: "National Hire a Veteran Day",
    displayDate: "July 25",
    dateRule: { type: "fixed", month: 7, day: 25 },
    categoryIds: ["veterans"],
    tone: "raise-awareness",
    summary: "Encourages employers to recruit and hire veterans transitioning to civilian careers.",
  },
  {
    slug: "korean-war-veterans-armistice-day",
    name: "Korean War Veterans Armistice Day",
    displayDate: "July 27",
    dateRule: { type: "fixed", month: 7, day: 27 },
    categoryIds: ["veterans", "remembrance"],
    tone: "remember",
    summary: "Marks the anniversary of the armistice that ended active fighting in the Korean War.",
  },
  {
    slug: "army-chaplain-corps-anniversary",
    name: "Army Chaplain Corps Anniversary",
    displayDate: "July 29",
    dateRule: { type: "fixed", month: 7, day: 29 },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "Marks the founding of the U.S. Army Chaplain Corps.",
  },

  // ---- August ----
  {
    slug: "coast-guard-birthday",
    name: "U.S. Coast Guard Birthday",
    displayDate: "August 4",
    dateRule: { type: "fixed", month: 8, day: 4 },
    categoryIds: ["veterans", "first-responders"],
    tone: "celebrate",
    summary: "Marks the founding of the U.S. Coast Guard.",
  },
  {
    slug: "purple-heart-day",
    name: "Purple Heart Day",
    displayDate: "August 7",
    dateRule: { type: "fixed", month: 8, day: 7 },
    categoryIds: ["veterans", "remembrance"],
    tone: "remember",
    summary: "Honors service members wounded or killed in combat, represented by the Purple Heart medal.",
  },
  {
    slug: "agent-orange-awareness-day",
    name: "Agent Orange Awareness Day",
    displayDate: "August 10",
    dateRule: { type: "fixed", month: 8, day: 10 },
    categoryIds: ["veterans", "mental-health"],
    tone: "raise-awareness",
    summary: "Raises awareness of the lasting health effects of Agent Orange exposure on Vietnam-era veterans.",
  },
  {
    slug: "navajo-code-talkers-day",
    name: "Navajo Code Talkers Day",
    displayDate: "August 14",
    dateRule: { type: "fixed", month: 8, day: 14 },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "Honors the Navajo Code Talkers whose unbreakable code supported U.S. operations in World War II.",
  },
  {
    slug: "national-airborne-day",
    name: "National Airborne Day",
    displayDate: "August 16",
    dateRule: { type: "fixed", month: 8, day: 16 },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "Honors the history and service of U.S. Army Airborne forces.",
  },
  {
    slug: "marine-corps-reserve-birthday",
    name: "Marine Corps Reserve Birthday",
    displayDate: "August 29",
    dateRule: { type: "fixed", month: 8, day: 29 },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "Marks the founding of the Marine Corps Reserve.",
  },

  // ---- September ----
  {
    slug: "national-suicide-prevention-month",
    name: "National Suicide Prevention Month",
    displayDate: "All Month",
    dateRule: { type: "month", month: 9 },
    categoryIds: ["mental-health"],
    tone: "raise-awareness",
    priority: true,
    summary: "A national month focused on suicide prevention, directly on-mission for an organization built around veteran and first-responder suicide prevention.",
    description:
      "Coordinate a monthlong resource and storytelling campaign focused on connection and getting help. The site's existing sitewide awareness banner already covers this month on its own — this calendar entry is for the directory listing, not a second banner.",
    actionCTA: { label: "Find Crisis Resources", href: "/crisis" },
    resourceLinks: [
      { label: "Call or Text 988", href: "tel:988" },
      { label: "Meet Our Beneficiaries", href: `${CAMPAIGN_URL}/beneficiaries` },
    ],
  },
  {
    slug: "national-recovery-month",
    name: "National Recovery Month",
    displayDate: "All Month",
    dateRule: { type: "month", month: 9 },
    categoryIds: ["mental-health"],
    tone: "raise-awareness",
    summary: "Raises awareness of mental health and substance use recovery, including recovery resources for veterans and first responders.",
  },
  {
    slug: "world-suicide-prevention-day",
    name: "World Suicide Prevention Day",
    displayDate: "September 10",
    dateRule: { type: "fixed", month: 9, day: 10 },
    categoryIds: ["mental-health"],
    tone: "raise-awareness",
    summary: "A global day raising awareness of suicide prevention and available support.",
  },
  {
    slug: "patriot-day",
    name: "Patriot Day / National Day of Service and Remembrance",
    displayDate: "September 11",
    dateRule: { type: "fixed", month: 9, day: 11 },
    categoryIds: ["first-responders", "veterans", "remembrance"],
    tone: "remember",
    summary: "Honors those killed in the September 11, 2001 attacks, including the first responders who answered the call.",
  },
  {
    slug: "air-force-birthday",
    name: "U.S. Air Force Birthday",
    displayDate: "September 18",
    dateRule: { type: "fixed", month: 9, day: 18 },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "Marks the founding of the U.S. Air Force.",
  },
  {
    slug: "national-pow-mia-recognition-day",
    name: "National POW/MIA Recognition Day",
    displayDate: "September 18, 2026",
    dateRule: { type: "explicit", startDate: "2026-09-18" },
    categoryIds: ["veterans", "remembrance"],
    tone: "remember",
    summary: "Honors American prisoners of war and those still missing in action.",
  },
  {
    slug: "gold-star-mothers-and-familys-day",
    name: "Gold Star Mother's and Family's Day",
    displayDate: "September 20, 2026",
    dateRule: { type: "explicit", startDate: "2026-09-20" },
    categoryIds: ["military-families", "remembrance"],
    tone: "remember",
    summary: "Honors mothers and families who have lost a child in military service.",
  },
  {
    slug: "national-day-of-remembrance-for-murder-victims",
    name: "National Day of Remembrance for Murder Victims",
    displayDate: "September 25",
    dateRule: { type: "fixed", month: 9, day: 25 },
    categoryIds: ["first-responders", "remembrance"],
    tone: "remember",
    summary: "A remembrance day relevant to surviving public safety families who have lost a loved one to violence.",
  },

  // ---- October ----
  {
    slug: "fire-prevention-week",
    name: "Fire Prevention Week",
    displayDate: "October 4-10, 2026",
    dateRule: { type: "explicit", startDate: "2026-10-04", endDate: "2026-10-10" },
    categoryIds: ["first-responders"],
    tone: "raise-awareness",
    summary: "A national week promoting fire safety, led by local fire departments.",
  },
  {
    slug: "world-mental-health-day",
    name: "World Mental Health Day",
    displayDate: "October 10",
    dateRule: { type: "fixed", month: 10, day: 10 },
    categoryIds: ["mental-health"],
    tone: "raise-awareness",
    summary: "A global day raising awareness of mental health and advocating against stigma.",
  },
  {
    slug: "navy-birthday",
    name: "U.S. Navy Birthday",
    displayDate: "October 13",
    dateRule: { type: "fixed", month: 10, day: 13 },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "Marks the founding of the U.S. Navy.",
  },
  {
    slug: "national-day-of-the-deployed",
    name: "National Day of the Deployed",
    displayDate: "October 26",
    dateRule: { type: "fixed", month: 10, day: 26 },
    categoryIds: ["veterans", "military-families"],
    tone: "celebrate",
    summary: "Recognizes service members currently deployed and the families supporting them at home.",
  },
  {
    slug: "national-first-responders-day",
    name: "National First Responders Day",
    displayDate: "October 28",
    dateRule: { type: "fixed", month: 10, day: 28 },
    categoryIds: ["first-responders"],
    tone: "celebrate",
    priority: true,
    summary: "A particularly strong opportunity to recognize firefighters, law enforcement, EMS, and dispatch personnel.",
    description:
      "Feature first responder stories and announce outreach to police, fire, EMS, and dispatch organizations.",
    actionCTA: { label: "Find First Responder Resources", href: "/resources" },
    resourceLinks: [{ label: "Support the Mission", href: `${CAMPAIGN_URL}/donate` }],
    bannerLeadDays: 6,
    bannerCopy: "October 28 is National First Responder Day. Thank you to the police officers, firefighters, paramedics, and dispatchers who show up for everyone else.",
  },

  // ---- November ----
  {
    slug: "national-veterans-and-military-families-month",
    name: "National Veterans and Military Families Month",
    displayDate: "All Month",
    dateRule: { type: "month", month: 11 },
    categoryIds: ["veterans", "military-families"],
    tone: "celebrate",
    priority: true,
    summary: "A national month honoring veterans, service members, and the families who support them.",
    description:
      "Publish veteran and family stories, spotlight Mighty Oaks and Veterans and Athletes United, and recruit supporters for the mission.",
    actionCTA: { label: "Meet Our Beneficiary Organizations", href: `${CAMPAIGN_URL}/beneficiaries` },
    resourceLinks: [
      { label: "Read Veteran Stories", href: `${CAMPAIGN_URL}/journal` },
      { label: "Get Involved", href: `${CAMPAIGN_URL}/get-involved` },
    ],
    bannerLeadDays: 0,
    bannerCopy: "November is National Veterans and Military Families Month — honoring everyone who serves, and everyone who serves alongside them.",
  },
  {
    slug: "national-family-caregivers-month",
    name: "National Family Caregivers Month",
    displayDate: "All Month",
    dateRule: { type: "month", month: 11 },
    categoryIds: ["military-families"],
    tone: "raise-awareness",
    summary: "Recognizes family caregivers, including those caring for wounded or ill veterans.",
  },
  {
    slug: "marine-corps-birthday",
    name: "U.S. Marine Corps Birthday",
    displayDate: "November 10",
    dateRule: { type: "fixed", month: 11, day: 10 },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "Marks the founding of the U.S. Marine Corps.",
  },
  {
    slug: "veterans-day",
    name: "Veterans Day",
    displayDate: "November 11, 2026",
    dateRule: { type: "explicit", startDate: "2026-11-11" },
    categoryIds: ["veterans"],
    tone: "celebrate",
    priority: true,
    summary: "Honors all who have served in the U.S. Armed Forces.",
    description:
      "Run a coordinated campaign featuring veteran stories, resource links, and donation opportunities.",
    actionCTA: { label: "Support Veterans Through the Mission", href: `${CAMPAIGN_URL}/donate` },
    resourceLinks: [
      { label: "Read Veteran Stories", href: `${CAMPAIGN_URL}/journal` },
      { label: "Meet Our Beneficiaries", href: `${CAMPAIGN_URL}/beneficiaries` },
    ],
    bannerLeadDays: 7,
    bannerCopy: "November 11 is Veterans Day. Thank you to everyone who has served in the U.S. Armed Forces.",
  },
  {
    slug: "world-day-of-remembrance-for-road-traffic-victims",
    name: "World Day of Remembrance for Road Traffic Victims",
    displayDate: "November 21, 2026",
    dateRule: { type: "explicit", startDate: "2026-11-21" },
    categoryIds: ["first-responders", "remembrance"],
    tone: "remember",
    summary: "A remembrance day relevant to roadway first-responder safety and the families of road traffic victims.",
  },

  // ---- December ----
  {
    slug: "givingtuesday",
    name: "GivingTuesday",
    displayDate: "December 1, 2026",
    dateRule: { type: "explicit", startDate: "2026-12-01" },
    categoryIds: [],
    tone: "celebrate",
    priority: true,
    summary: "A global day of generosity — the date moves every year (the Tuesday after Thanksgiving), so this entry is refreshed annually.",
    description: "Seek a matching donor or sponsor and run a concentrated 24-hour fundraising appeal.",
    actionCTA: { label: "Donate Now", href: `${CAMPAIGN_URL}/donate` },
    resourceLinks: [{ label: "See the $70K Mission", href: "/70k" }],
    bannerLeadDays: 5,
    bannerCopy: "GivingTuesday is here — a day of generosity for the organizations behind the mission.",
  },
  {
    slug: "pearl-harbor-remembrance-day",
    name: "Pearl Harbor Remembrance Day",
    displayDate: "December 7",
    dateRule: { type: "fixed", month: 12, day: 7 },
    categoryIds: ["veterans", "remembrance"],
    tone: "remember",
    summary: "Honors those killed in the attack on Pearl Harbor on December 7, 1941.",
  },
  {
    slug: "national-guard-birthday",
    name: "U.S. National Guard Birthday",
    displayDate: "December 13",
    dateRule: { type: "fixed", month: 12, day: 13 },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "Marks the founding of the U.S. National Guard.",
  },
  {
    slug: "national-wreaths-across-america-day",
    name: "National Wreaths Across America Day",
    displayDate: "December 19, 2026",
    dateRule: { type: "explicit", startDate: "2026-12-19" },
    categoryIds: ["veterans", "remembrance"],
    tone: "remember",
    summary: "A day when volunteers lay wreaths at veterans' graves to honor the fallen.",
  },
  {
    slug: "space-force-birthday",
    name: "U.S. Space Force Birthday",
    displayDate: "December 20",
    dateRule: { type: "fixed", month: 12, day: 20 },
    categoryIds: ["veterans"],
    tone: "celebrate",
    summary: "Marks the founding of the U.S. Space Force.",
  },
];

function toDateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function lastDayOfMonth(year: number, month0: number): Date {
  return new Date(year, month0 + 1, 0);
}

/**
 * Next occurrence of this entry on/after `now`, or null once a (necessarily
 * year-specific) `explicit` entry has passed — the intended signal that it
 * needs a manual re-date for the following year, same convention the doc
 * comment above describes. `fixed`/`month` entries never go stale since
 * they roll forward automatically.
 */
export function getNextOccurrence(
  entry: AwarenessEntry,
  now: Date = new Date(),
): { date: Date; endDate?: Date } | null {
  const today = toDateOnly(now);
  const rule = entry.dateRule;

  if (rule.type === "fixed") {
    let date = new Date(today.getFullYear(), rule.month - 1, rule.day);
    if (date.getTime() < today.getTime()) date = new Date(today.getFullYear() + 1, rule.month - 1, rule.day);
    return { date };
  }

  if (rule.type === "month") {
    let year = today.getFullYear();
    let end = lastDayOfMonth(year, rule.month - 1);
    if (end.getTime() < today.getTime()) {
      year += 1;
      end = lastDayOfMonth(year, rule.month - 1);
    }
    return { date: new Date(year, rule.month - 1, 1), endDate: end };
  }

  // explicit
  const end = rule.endDate ? toDateOnly(new Date(rule.endDate)) : toDateOnly(new Date(rule.startDate));
  if (end.getTime() < today.getTime()) return null;
  return { date: toDateOnly(new Date(rule.startDate)), endDate: rule.endDate ? end : undefined };
}

/** Whole calendar days from `now` to an entry's next occurrence — same date-only diffing as campaign-phase.ts's getDaysToRace, so there's no disagreement at a day boundary. */
export function getDaysUntil(entry: AwarenessEntry, now: Date = new Date()): number | null {
  const next = getNextOccurrence(entry, now);
  if (!next) return null;
  return Math.round((next.date.getTime() - toDateOnly(now).getTime()) / 86_400_000);
}

/** Next N entries, soonest-first — powers the homepage teaser and the directory's default sort. Entries with no valid next occurrence (a stale explicit date) are dropped rather than sorted arbitrarily. */
export function getUpcomingEntries(
  entries: AwarenessEntry[],
  count: number,
  now: Date = new Date(),
): (AwarenessEntry & { daysUntil: number })[] {
  return entries
    .map((entry) => {
      const next = getNextOccurrence(entry, now);
      return next ? { entry, daysUntil: getDaysUntil(entry, now)! } : null;
    })
    .filter((x): x is { entry: AwarenessEntry; daysUntil: number } => x !== null)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, count)
    .map(({ entry, daysUntil }) => ({ ...entry, daysUntil }));
}

/**
 * True when `now` falls inside an entry's banner window — its next
 * occurrence (or occurrence range) minus `bannerLeadDays`, through the end
 * of the occurrence. Only called for entries with bannerLeadDays set; see
 * AwarenessEntryBanner.
 */
export function isInBannerWindow(entry: AwarenessEntry, now: Date = new Date()): boolean {
  if (entry.bannerLeadDays === undefined) return false;
  const rule = entry.dateRule;
  const today = toDateOnly(now);

  if (rule.type === "month") {
    // A month-long entry is "in window" for its entire span, every year —
    // there's no not-yet-started lead-in to compute, unlike a dated entry.
    return today.getMonth() + 1 === rule.month;
  }

  const next = getNextOccurrence(entry, now);
  if (!next) return false;
  const windowStart = new Date(next.date);
  windowStart.setDate(windowStart.getDate() - entry.bannerLeadDays);
  const windowEnd = next.endDate ?? next.date;
  return today.getTime() >= windowStart.getTime() && today.getTime() <= windowEnd.getTime();
}

/** Ranks other entries by shared categories — same approach as resources.ts's findSimilarResources. Ties broken alphabetically for a stable order. */
export function findRelatedEntries(entry: AwarenessEntry, all: AwarenessEntry[], limit = 4): AwarenessEntry[] {
  return all
    .filter((e) => e.slug !== entry.slug)
    .map((e) => ({ e, shared: e.categoryIds.filter((id) => entry.categoryIds.includes(id)).length }))
    .filter((x) => x.shared > 0)
    .sort((a, b) => b.shared - a.shared || a.e.name.localeCompare(b.e.name))
    .slice(0, limit)
    .map((x) => x.e);
}
