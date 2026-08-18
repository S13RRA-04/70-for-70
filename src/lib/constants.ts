import type { NavLink } from "@/types/content";

export const SITE_NAME = "70 for 70";
export const SITE_TAGLINE = "70 miles. $70,000. One mission for veterans.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "The Mission", href: "/the-mission" },
  { label: "The Race", href: "/the-race" },
  { label: "Fund a Mile", href: "/fund-a-mile" },
  { label: "Partners", href: "/partners" },
  { label: "Updates", href: "/updates" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "About", href: "/about" },
];

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

/** TODO: replace with the athlete's real training/race timeline. */
export const RACE_INFO = {
  raceDate: null as string | null, // e.g. "2026-11-08T07:00:00-05:00" — TODO
  raceLocation: null as string | null, // TODO
  courseInfoUrl: null as string | null, // TODO
  athleteGoalTime: null as string | null, // TODO, e.g. "6:30:00"
};

/**
 * No confirmed public contact address yet. Kept `null` rather than a fake
 * placeholder — consumers must hide the email link/mention entirely when
 * this is unset (the contact form remains available either way).
 */
export const CONTACT_EMAIL: string | null = null;
