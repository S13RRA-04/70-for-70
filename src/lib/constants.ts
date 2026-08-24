import type { NavLink } from "@/types/content";

/** The project's name — used in the header, footer, legal copy, and site-wide metadata. Not an organization name; see PROJECT_POSITIONING. */
export const SITE_NAME = "For The 22";
/**
 * The org's primary positioning statement.
 */
export const ORG_TAGLINE = "For Those Who Serve. For What Comes Next.";
/**
 * One-sentence expansion of ORG_TAGLINE — matches the homepage hero copy
 * verbatim; import from here instead of re-typing it. Deliberately frames
 * For The 22 as Cody Hitson's personal, off-duty project — not an
 * organization, athletic team, or entity that receives/allocates money —
 * pending written federal ethics approval for any broader framing. See
 * PERSONAL_PROJECT_DISCLOSURE for the fuller disclosure shown near
 * donation flows and in the footer.
 */
export const ORG_SUPPORTING_STATEMENT =
  "For The 22 is a personal endurance campaign connecting veterans and first responders with resources and encouraging direct support for the independent nonprofit organizations serving them.";
/**
 * Shown prominently on the homepage, donation pages, and in the footer —
 * required disclosure while broader ethics approval is pending. Do not
 * remove or soften without written approval covering the change.
 */
export const PERSONAL_PROJECT_DISCLOSURE =
  "This is a personal, off-duty project. It is not sponsored, endorsed, or operated by any employer or government entity. No government title, authority, time, equipment, contacts, or nonpublic information is used.";
/**
 * The specific fundraising campaign/race effort — distinct from SITE_NAME.
 * Individual campaigns follow a "[Mission] For The 22" naming convention
 * (see MOVEMENT_CAMPAIGNS below); this is the current one. Used in the
 * hero, mission copy, and anywhere the campaign itself (not the
 * organization) is being named.
 */
export const CAMPAIGN_NAME = "Tri For The 22";
export const SITE_TAGLINE = "70 miles. $70,000. One mission for veterans.";

/**
 * The org root — forthe22.org in production. Movement/mission pages
 * (home, My Story, Resources, Join, Merch, Press, legal) live here.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * The campaign root — tri.forthe22.org in production. Fundraising pages
 * (The Race, Fund a Mile, Donate, Sponsors, Partners, Live, Updates,
 * Miles, Admin) live here. See src/middleware.ts for the host-based
 * routing that enforces this split, and README's "Movement/Campaign
 * Domain Split" section for the full picture. Defaults to the same local
 * dev origin as SITE_URL — there's no real second host in local dev.
 */
export const CAMPAIGN_URL = process.env.NEXT_PUBLIC_CAMPAIGN_URL ?? "http://localhost:3000";

/**
 * Naming ideas Cody may take on personally if Tri For The 22 goes well —
 * powers the "[Mission] For The 22" explainer on /the-mission. Only Tri is
 * real/active; the rest are just a naming convention for possible future
 * personal challenges, not commitments with dates or a managed program —
 * labeled "Future" rather than implying a timeline or an institution.
 */
export const MOVEMENT_CAMPAIGNS = [
  { name: "Tri For The 22", discipline: "Triathlon", status: "current" as const },
  { name: "Run For The 22", discipline: "Running", status: "future" as const },
  { name: "Ride For The 22", discipline: "Cycling", status: "future" as const },
  { name: "Ruck For The 22", discipline: "Rucking", status: "future" as const },
] as const;

/**
 * Two separate nav sets, one per domain — see README's "Movement/Campaign
 * Domain Split". forthe22.org (org) and tri.forthe22.org (fundraising
 * campaign) each get their own header/footer nav; a visitor never sees
 * campaign nav on the org site or vice versa. "Current Mission" is a
 * separate utility strip above the header (see CampaignUtilityBar), not a
 * nav item competing with the org's own pages.
 *
 * Beneficiaries is a real page but a *campaign*-domain route (see
 * CAMPAIGN_PATH_PREFIXES in middleware.ts, part of the deliberate
 * Movement/Campaign Domain Split) — its href here is deliberately an
 * absolute CAMPAIGN_URL link rather than a relative path that would get
 * silently redirected off the org site.
 */
export const ORG_NAV_LINKS: NavLink[] = [
  { label: "Resources", href: "/resources" },
  { label: "Mission", href: "/mission" },
  { label: "About", href: "/about" },
  { label: "Beneficiaries", href: `${CAMPAIGN_URL}/beneficiaries` },
];

export const CAMPAIGN_NAV_LINKS: NavLink[] = [
  { label: "Campaign", href: "/the-mission" },
  { label: "Race", href: "/the-race" },
  { label: "Fundraising", href: "/fund-a-mile" },
  { label: "Beneficiaries", href: "/beneficiaries" },
  { label: "Journal", href: "/journal" },
  // /merch is an org-domain-only route (see ORG_PATH_PREFIXES in
  // middleware.ts) — absolute SITE_URL link, same reason ORG_NAV_LINKS'
  // Beneficiaries entry above uses an absolute CAMPAIGN_URL link: avoids
  // the silent cross-domain redirect a relative href would trigger.
  { label: "Shop", href: `${SITE_URL}/merch` },
];

/** Org header → campaign subdomain, styled as a CTA (not a plain nav link). */
export const CAMPAIGN_HOME_LINK: NavLink = { label: CAMPAIGN_NAME, href: CAMPAIGN_URL };
/**
 * Org header's "Current Mission" nav slot — same destination as
 * CAMPAIGN_HOME_LINK, but labeled generically so it reads as a nav item
 * ("Current Mission") rather than restating the campaign name a second
 * time next to the footer/homepage module, which already say "Tri For
 * The 22" via CAMPAIGN_HOME_LINK.
 */
export const CURRENT_MISSION_NAV_LINK: NavLink = { label: "Current Mission", href: CAMPAIGN_URL };
/** Campaign header → org subdomain, styled as a CTA. */
export const ORG_HOME_LINK: NavLink = { label: SITE_NAME, href: SITE_URL };

export const DONATE_LINK: NavLink = { label: "Donate Directly", href: "/donate" };

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
  { key: "swim", label: "The Swim", start: 1, end: 1, accent: "charcoal" },
  { key: "bike", label: "The Bike", start: 2, end: 57, accent: "olive" },
  { key: "run", label: "The Run", start: 58, end: 70, accent: "bronze" },
] as const;

/**
 * Mile 22 carries the movement's name and gets distinct treatment — a
 * collective mile meant to be funded together, not by one sponsor.
 */
export const FEATURED_MILE = {
  number: 22,
  title: "For Those Still Fighting",
  description:
    "Mile 22 carries the movement's name. It's meant to be funded together — by veterans, families, and first responders showing up for each other — not by a single sponsor.",
} as const;

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
      "First right of refusal for future For The 22 campaigns",
    ],
  },
] as const;

/** Why sponsor Tri For The 22 — shown before pricing tiers on the Sponsors page. */
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

export const RACE_INFO = {
  // Confirmed: IRONMAN 70.3 Chattanooga, Sunday, May 17, 2026.
  raceDate: "2026-05-17T07:00:00-04:00" as string | null,
  raceLocation: "Chattanooga, Tennessee" as string | null,
  courseInfoUrl: "https://www.ironman.com/races/im703-chattanooga" as string | null,
  athleteGoalTime: null as string | null, // TODO, e.g. "6:30:00"
  trainingStartDate: null as string | null, // e.g. "2026-03-01T00:00:00-05:00" — TODO, used to compute weeks completed/remaining
};

export const CONTACT_EMAIL: string | null = "admin@forthe22.org";

/**
 * Bonfire fundraising store — a third-party print-on-demand platform, not
 * operated by For The 22. Bonfire pays 100% of net profit from purchases
 * directly to Mighty Oaks Foundation; For The 22 never processes, collects,
 * or takes possession of merchandise proceeds. See the Merchandise section
 * of the Terms of Use and /how-funds-work.
 */
export const MERCH_STORE_URL = "https://www.bonfire.com/tri-for-the-22-mighty-oaks/";

/** Sole recipient of 100% of net Bonfire store profit — see MERCH_STORE_URL. */
export const MERCH_BENEFICIARY = "Mighty Oaks Foundation";

/**
 * Social profile links for the footer's "Follow" list. Empty by default —
 * intentionally not a placeholder set of fake icons; add entries only with
 * real, confirmed profile URLs. See SocialLinks, which renders nothing
 * while this is empty (same "hide, don't fake" rule as the rest of the
 * site — see README's Eliminating Placeholder Content).
 */
export const SOCIAL_LINKS: { platform: string; label: string; url: string }[] = [
  { platform: "facebook", label: "Facebook", url: "https://www.facebook.com/profile.php?id=61593405604317" },
];

/**
 * The current campaign as a data object rather than hard-coded page
 * markup — the code-level seam a future multi-campaign Supabase schema
 * would plug into. The `campaign` table itself is still single-row for
 * now; that's a real migration worth doing deliberately once a second
 * campaign (Run/Ride/Ruck For The 22) is actually being built, not
 * speculatively right before launch.
 */
export const CURRENT_CAMPAIGN = {
  movement: SITE_NAME,
  name: CAMPAIGN_NAME,
  goal: FUNDRAISING_GOAL,
  type: "triathlon",
  event: "IRONMAN 70.3 Chattanooga",
  eventUrl: RACE_INFO.courseInfoUrl,
  beneficiaries: ["Mighty Oaks Foundation", "Veterans and Athletes United"],
} as const;
