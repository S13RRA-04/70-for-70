import type { NavLink } from "@/types/content";

export const SITE_NAME = "70 for 70";
export const SITE_TAGLINE = "70 miles. $70,000. One mission for veterans.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Simplified primary nav — "About" reads as "My Story" since it's the more
 * emotionally meaningful framing (still the same /about route, so existing
 * links/SEO aren't disturbed). "Home" and "Sponsors" were dropped from the
 * link list: the logo already goes home, and Sponsor/Donate are
 * right-aligned CTAs instead (see SPONSOR_LINK/DONATE_LINK below).
 */
export const NAV_LINKS: NavLink[] = [
  { label: "The Mission", href: "/the-mission" },
  { label: "My Story", href: "/about" },
  { label: "The Race", href: "/the-race" },
  { label: "Fund a Mile", href: "/fund-a-mile" },
  { label: "Partners", href: "/partners" },
  { label: "Updates", href: "/updates" },
];

export const SPONSOR_LINK: NavLink = { label: "Sponsor", href: "/sponsors" };
export const DONATE_LINK: NavLink = { label: "Donate", href: "/donate" };

export const FUNDRAISING_GOAL = 70_000;
export const DOLLARS_PER_MILE = 1_000;
export const TOTAL_FUNDRAISING_MILES = 70;

/** Official IRONMAN 70.3 leg distances, in miles. */
export const RACE_LEGS = {
  swim: 1.2,
  bike: 56,
  run: 13.1,
} as const;

export const RACE_TOTAL_DISTANCE = 70.3;

/**
 * Groups the 70 fundraising miles into race segments for the Fund a Mile
 * visualization. This is a fundraising visualization, not an exact
 * official race-mile boundary — the swim/bike/run split of the actual
 * 70.3-mile course (1.2 / 56 / 13.1) doesn't land on whole-mile lines.
 */
export const MILE_SEGMENTS = [
  { key: "swim", label: "Swim", start: 1, end: 1, accent: "charcoal" },
  { key: "bike", label: "Bike", start: 2, end: 57, accent: "olive" },
  { key: "run", label: "Run", start: 58, end: 70, accent: "bronze" },
] as const;

export const SPONSORSHIP_LEVELS = [
  {
    id: "mile",
    name: "Mile Sponsor",
    minimumContribution: 1_000,
    perks: [
      "A designated funded mile bearing your name or company",
      "Name/logo listed on the website",
      "Campaign social media recognition",
    ],
  },
  {
    id: "supporting",
    name: "Supporting Sponsor",
    minimumContribution: 2_500,
    perks: [
      "Everything in Mile Sponsor",
      "Logo placement in the sponsor wall's Supporting tier",
      "Mention in a campaign update post",
    ],
  },
  {
    id: "mission",
    name: "Mission Sponsor",
    minimumContribution: 5_000,
    perks: [
      "Everything in Supporting Sponsor",
      "Featured placement in the Mission tier of the sponsor wall",
      "Direct link-out from the Partners page",
    ],
  },
  {
    id: "presenting",
    name: "Presenting Sponsor",
    minimumContribution: 10_000,
    perks: [
      "Top-tier logo placement across the site",
      "Dedicated recognition in race-day communications",
      "First right of refusal for future 70 for 70 campaigns",
    ],
  },
] as const;

/** Why sponsor 70 for 70 — shown before pricing tiers on the Sponsors page. */
export const SPONSOR_VALUE_PROPS = [
  {
    id: "veteran-impact",
    title: "Veteran Impact",
    body: "Every dollar raised supports organizations helping veterans rebuild purpose, community, and a path forward after service.",
  },
  {
    id: "endurance-story",
    title: "An Endurance Story Worth Telling",
    body: "70.3 miles of swimming, biking, and running gives your brand a real, ongoing story to be part of — not just a logo on a page.",
  },
  {
    id: "community-visibility",
    title: "Community Visibility",
    body: "Training updates, campaign milestones, and race day all carry your name forward to a community that shows up for veterans.",
  },
  {
    id: "tangible-impact",
    title: "A Tangible Way to Give",
    body: "The $1,000-per-mile model makes your contribution concrete — you can point to the exact mile your company helped fund.",
  },
  {
    id: "sponsor-recognition",
    title: "Recognition That Lasts",
    body: "Sponsor logos and recognition live on the site's Sponsor Wall and in campaign updates — not just a one-time mention.",
  },
  {
    id: "race-day-storytelling",
    title: "Race-Day Storytelling",
    body: "As race day approaches, sponsors are woven into the story — training milestones, countdown updates, and race-day coverage.",
  },
] as const;

/** In-kind categories offered on the Sponsors page's custom partnership tier. */
export const CUSTOM_PARTNERSHIP_CATEGORIES = [
  "Bicycle / Equipment",
  "Apparel",
  "Nutrition",
  "Travel",
  "Lodging",
  "Race Services",
  "Media",
  "Photography",
  "Community Events",
] as const;

/** TODO: replace with the athlete's real training/race timeline. */
export const RACE_INFO = {
  raceDate: null as string | null, // e.g. "2026-11-08T07:00:00-05:00" — TODO
  raceLocation: null as string | null, // TODO
  courseInfoUrl: null as string | null, // TODO
  athleteGoalTime: null as string | null, // TODO, e.g. "6:30:00"
  trainingStartDate: null as string | null, // e.g. "2026-03-01T00:00:00-05:00" — TODO, used to compute weeks completed/remaining
};

/**
 * Aggregate training volume for the Race page's "The Work" section. All
 * null by default — hidden (EmptyState) rather than shown as zeros/TODO
 * until real training data is logged. Weeks completed/remaining are
 * computed from RACE_INFO.trainingStartDate/raceDate instead of stored here.
 */
export const TRAINING_VOLUME = {
  swimMiles: null as number | null,
  bikeMiles: null as number | null,
  runMiles: null as number | null,
  totalHours: null as number | null,
};

export const CONTACT_EMAIL: string | null = "seventyforseventy@gmail.com";

/**
 * Social profile links for the footer's "Follow" list. Empty by default —
 * intentionally not a placeholder set of fake icons; add entries only with
 * real, confirmed profile URLs. See SocialLinks, which renders nothing
 * while this is empty (same "hide, don't fake" rule as the rest of the
 * site — see README's Eliminating Placeholder Content).
 */
export const SOCIAL_LINKS: { platform: string; label: string; url: string }[] = [];
