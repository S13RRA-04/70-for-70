import type { NavLink } from "@/types/content";
import type { CampaignSlug } from "@/lib/site-mode";

/** The project's name — used in the header, footer, legal copy, and site-wide metadata. Not an organization name; see PROJECT_POSITIONING. */
export const SITE_NAME = "For The 22";
/**
 * The org's primary positioning statement.
 */
export const ORG_TAGLINE = "For Those Who Serve. For What Comes Next.";
/**
 * The org's one-sentence core mission statement — the non-negotiable
 * definition of what For The 22 is, used verbatim in the homepage hero,
 * /mission, and press copy. Deliberately contains no campaign-specific
 * language (Tri For The 22, fundraising, race goals, beneficiaries) —
 * that content lives on the campaign subdomain, never here.
 */
export const ORG_SUPPORTING_STATEMENT =
  "For The 22 connects veterans and first responders with trusted programs, services, and communities that support their mental, physical, emotional, and spiritual health.";
/**
 * Shown prominently on the homepage, donation pages, and in the footer —
 * required disclosure while ethics approval is pending. Do not remove or
 * soften without written approval covering the change.
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
export const SITE_TAGLINE = "70.3 miles. $70,000. One mission for veterans.";

/**
 * Fixed note donors add to a gift on a beneficiary platform that has no
 * way to attribute the gift to this campaign on its own (e.g. a generic
 * PayPal button) — see DonationTrackingNote and PartnerRow.requires_donation_note.
 * Cross-referenced against the beneficiary's own records on a schedule.
 */
export const DONATION_TRACKING_CODE = "TRIFORTHE22";
/** Same idea as DONATION_TRACKING_CODE, scoped to Ruck For The 22 — a shared beneficiary (e.g. VAU) needs a different note per campaign so gifts reconcile to the right one. */
export const RUCK_DONATION_TRACKING_CODE = "RUCKFORTHE22";

/**
 * The org root — forthe22.org in production. Movement/mission pages
 * (home, My Story, Resources, Join, Merch, Press, legal) live here.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * The campaign root — tri.forthe22.org in production. Fundraising pages
 * (The Race, Donate, Beneficiaries, Sponsors, Live, Updates, Admin) live
 * here. See src/middleware.ts for the host-based routing that enforces this
 * split, and README's "Movement/Campaign Domain Split" section for the full
 * picture. Defaults to the same local dev origin as SITE_URL — there's no
 * real second host in local dev.
 */
export const CAMPAIGN_URL = process.env.NEXT_PUBLIC_CAMPAIGN_URL ?? "http://localhost:3000";

/**
 * The second campaign, Ruck For The 22 — ruck.forthe22.org in production.
 * Unlike Tri (a full personal-athlete site: mission, race, donate, journal,
 * admin), this is deliberately a single-page event microsite (see
 * src/app/ruck-home/page.tsx) — no training tracker, no dedicated fundraising
 * mechanism beyond direct donation, no dedicated Supabase schema. Defaults to
 * the same local dev origin as SITE_URL/CAMPAIGN_URL — there's no real third
 * host in local dev.
 */
export const RUCK_CAMPAIGN_URL = process.env.NEXT_PUBLIC_RUCK_URL ?? "http://localhost:3000";
export const RUCK_CAMPAIGN_NAME = "Ruck For The 22";

/**
 * On-brand fallback photo for a journal entry with no image_url — used
 * anywhere a post's image would otherwise be shown (card, detail hero,
 * social share/JSON-LD image), so text-only entries still get a real,
 * on-brand image instead of MediaPlaceholder's abstract mark. Root-relative;
 * build an absolute URL (prefix with CAMPAIGN_URL) for contexts like
 * JSON-LD that aren't resolved through Next's metadataBase.
 */
export const JOURNAL_PLACEHOLDER_IMAGE = "/journal/placeholder.png";

/**
 * Naming ideas Cody may take on personally if Tri For The 22 goes well —
 * powers the "[Mission] For The 22" explainer on /the-mission and the org
 * site's /campaigns landing page. Only Tri is real/active; the rest are
 * just a naming convention for possible future personal challenges, not
 * commitments with dates or a managed program — labeled "Future" rather
 * than implying a timeline or an institution. `description`/`url` are only
 * set for active campaigns — /campaigns deliberately renders future
 * entries without invented copy or a link (see README's "Eliminating
 * Placeholder Content").
 */
export const MOVEMENT_CAMPAIGNS = [
  {
    name: "Tri For The 22",
    discipline: "Triathlon",
    status: "current" as const,
    description:
      "A 70.3-mile triathlon paired with a $70,000 fundraising goal, in support of confirmed veteran-focused nonprofit beneficiaries.",
    url: CAMPAIGN_URL,
  },
  {
    name: RUCK_CAMPAIGN_NAME,
    discipline: "Rucking",
    status: "current" as const,
    description:
      "A community rucking event in Huntsville, Alabama — ruck the full 22 miles or walk any distance with family and friends to raise awareness, in support of confirmed veteran-focused nonprofit beneficiaries.",
    url: RUCK_CAMPAIGN_URL,
  },
  { name: "Run For The 22", discipline: "Running", status: "future" as const },
  { name: "Ride For The 22", discipline: "Cycling", status: "future" as const },
] as const;

/**
 * Two separate nav sets, one per domain — see README's "Movement/Campaign
 * Domain Split". forthe22.org (org) and tri.forthe22.org (fundraising
 * campaign) each get their own header/footer nav; a visitor never sees
 * campaign nav on the org site or vice versa. The org nav's other-domain
 * touchpoints are "Campaigns" — an org-owned editorial page (/campaigns)
 * listing what For The 22 is currently engaged in and linking out to
 * tri.forthe22.org — and "Shop", which links to /store, an org-only
 * interstitial page (mirroring the campaign's own /shop) that discloses how
 * proceeds are allocated before sending visitors out to the org's own
 * non-fundraising Fourthwall store (see ORG_SHOP_URL). Unlike the
 * campaign's /shop (fundraising merch tied to Tri For The 22, lives on
 * tri.forthe22.org only), this store isn't part of a fundraising mechanism
 * and isn't gated by the domain split's merchandise firewall.
 */
export const ORG_NAV_LINKS: NavLink[] = [
  { label: "Resources", href: "/resources" },
  { label: "Mission", href: "/mission" },
  { label: "Why It Matters", href: "/advocacy" },
  { label: "About", href: "/about" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "Shop", href: "/store" },
  { label: "Contact", href: "/contact" },
  { label: "Need Help Now", href: "/crisis" },
];

/**
 * The org's own merchandise store — a separate, non-fundraising Fourthwall
 * shop (distinct from MERCH_STORE_URL, the campaign's Bonfire store, which
 * pays 100% of net profit to a single named beneficiary). Linked from
 * /store, not directly from the header, so the allocation split below is
 * always disclosed first.
 */
export const ORG_SHOP_URL = "https://for-the-22-ohp-shop.fourthwall.com/";

/**
 * How proceeds from ORG_SHOP_URL are allocated, displayed on /store.
 * Percentages must sum to 100 — enforced by a dev-time assertion below
 * rather than trusted silently, since this is a public financial claim.
 */
export const ORG_SHOP_ALLOCATION = [
  {
    percent: 22,
    label: "Charitable Organizations",
    description: "Returned directly to charitable organizations.",
  },
  {
    percent: 58,
    label: "For The 22 Campaign Efforts",
    description: "Equipment, training, and other costs of running For The 22's campaigns.",
  },
  {
    percent: 20,
    label: "Reserve",
    description: "Held in reserve for tax obligations and other holdings.",
  },
] as const;

if (process.env.NODE_ENV !== "production") {
  const total = ORG_SHOP_ALLOCATION.reduce((sum, row) => sum + row.percent, 0);
  if (total !== 100) {
    throw new Error(`ORG_SHOP_ALLOCATION percentages must sum to 100, got ${total}`);
  }
}

/**
 * 7 links + the header's separate Donate CTA button (see DONATE_LINK).
 * Sponsors (gear/resource campaign sponsors, see src/app/sponsors/page.tsx)
 * is also cross-linked from Beneficiaries and the footer. Get Involved lives
 * here (rather than the footer) so it's reachable from the header nav.
 */
export const CAMPAIGN_NAV_LINKS: NavLink[] = [
  { label: "About", href: "/the-mission" },
  { label: "Race", href: "/the-race" },
  { label: "Follow My Progress", href: "/journal" },
  { label: "Beneficiaries", href: "/beneficiaries" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Shop", href: "/shop" },
  { label: "Get Involved", href: "/get-involved" },
];

/**
 * The org's single outbound link to the campaign — lives only in the
 * footer's small "Campaigns" area and the mobile menu, never in primary
 * nav and never as a persistent banner (see README's Movement/Campaign
 * Domain Split — the campaign must not dominate parent-site navigation).
 */
export const CAMPAIGN_HOME_LINK: NavLink = { label: CAMPAIGN_NAME, href: CAMPAIGN_URL };
/** Campaign header → org subdomain, styled as a CTA. */
export const ORG_HOME_LINK: NavLink = { label: SITE_NAME, href: SITE_URL };

export const DONATE_LINK: NavLink = { label: "Donate Now", href: "/donate" };
/** Distinct parent-site text link in the campaign header (the logo/title still link to the campaign home). */
export const PARENT_INITIATIVE_LINK: NavLink = { label: "A For The 22 campaign", href: SITE_URL };

export const FUNDRAISING_GOAL = 70_000;

/** Official IRONMAN 70.3 leg distances, in miles. */
export const RACE_LEGS = {
  swim: 1.2,
  bike: 56,
  run: 13.1,
} as const;

export const RACE_TOTAL_DISTANCE = 70.3;

export const SPONSORSHIP_LEVELS = [
  {
    id: "mile",
    name: "Mile Sponsor",
    minimumContribution: 1_000,
    perks: [
      "Name/company recognition as a founding-tier campaign sponsor",
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
    body: "Every dollar you contribute moves the campaign visibly closer to its $70,000 goal — a concrete, trackable way to give.",
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
  // IRONMAN 70.3 Chattanooga, confirmed for May 16, 2027. 07:00 ET is the
  // typical 70.3 Chattanooga rolling-start time — adjust once IRONMAN
  // publishes the official athlete guide with a confirmed start time.
  raceDate: "2027-05-16T07:00:00-04:00" as string | null,
  raceYear: "2027" as string | null,
  raceLocation: "Chattanooga, Tennessee" as string | null,
  courseInfoUrl: "https://www.ironman.com/races/im703-chattanooga" as string | null,
  registrationUrl: "https://www.ironman.com/races/im703-chattanooga/register" as string | null,
  athleteGoalTime: null as string | null, // TODO, e.g. "6:30:00"
  trainingStartDate: null as string | null, // e.g. "2026-03-01T00:00:00-05:00" — TODO, used to compute weeks completed/remaining
};

export const CONTACT_EMAIL: string | null = "admin@forthe22.org";

/** The /get-involved header/footer/mobile-menu link. */
export const GET_INVOLVED_LINK: NavLink = { label: "Get Involved", href: "/get-involved" };

/**
 * Volunteer roles shown on /get-involved, keyed to
 * GET_INVOLVED_INTEREST_TYPES (src/lib/validation/inquiry.ts) so the sign-up
 * form's dropdown matches the roles described on the page one-to-one.
 */
export const GET_INVOLVED_ROLES = [
  {
    id: "Race Crew",
    title: "Race Crew",
    description:
      "Help on the ground race weekend — aid station support, gear transport, and other hands-on tasks that keep race day running.",
  },
  {
    id: "Campaign Tent",
    title: "Campaign Tent",
    description:
      "Staff the campaign tent near the course — greet supporters, share the mission, and help collect donations in person.",
  },
  {
    id: "Cheer Squad",
    title: "Cheer Squad",
    description:
      "Show up along the course to cheer — no experience required, just energy for the swim, bike, and run legs.",
  },
  {
    id: "Social Media Team",
    title: "Social Media Team",
    description:
      "Help get the word out — sharing updates, creating content, and growing the campaign's reach online before and during race weekend.",
  },
] as const;

/**
 * A room block is being arranged at The Chattanoogan for race weekend for
 * anyone traveling in to help or cheer — null until the booking link is
 * live, at which point /get-involved switches from a "coming soon" note to
 * a real "Book Your Room" button (same pattern as RACE_INFO's
 * registrationUrl above).
 */
export const CHATTANOOGAN_HOTEL_BLOCK_URL: string | null = null;

/**
 * Bonfire fundraising store — live, linked from the campaign's /shop.
 * 100% of net profit is paid by Bonfire directly to a recipient in
 * MERCH_BENEFICIARIES; For The 22 never takes possession of merchandise
 * proceeds. Bonfire annotates which of the two beneficiaries each individual
 * item supports directly on the product listing — this site doesn't track
 * that split per item, only the two organizations it can go to.
 */
export const MERCH_STORE_URL = "https://www.bonfire.com/store/for-the-22/";

/** Recipients of net Bonfire store profit, split per item on Bonfire — see MERCH_STORE_URL. */
export const MERCH_BENEFICIARIES = ["Mighty Oaks Foundation", "Veterans and Athletes United"];

/**
 * Generic category teasers for the campaign homepage's shop hotlink. No
 * per-item product data exists locally (Bonfire is a fully external store —
 * see MERCH_STORE_URL), so these are category-level labels rather than named
 * products, avoiding any drift from what's actually for sale.
 */
export const SHOP_CATEGORIES = [
  { label: "Apparel", description: "Tees, tanks, and hoodies" },
  { label: "Headwear", description: "Hats and beanies" },
  { label: "Accessories", description: "Stickers, bags, and more" },
] as const;

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

/**
 * Everything specific to the RuckUp22 Huntsville event — the one real page
 * at /ruck-home reads entirely from this object. Deliberately a single
 * flexible community event, not a race: participants can ruck the full 22
 * miles, walk any distance, or do it at another location/date entirely —
 * see the description fields below, which are the actual event terms, not
 * a simplification of them.
 *
 * Important organizational distinction: RuckUp22 Huntsville itself is
 * organized by RuckUp 22, Inc. (see RUCK_EVENT_ORGANIZER below), a
 * separate 501(c)(3) — not by For The 22. Cody is registering to
 * participate in person, and "Ruck For The 22" is his own participation
 * and parallel fundraising effort alongside it, the same relationship
 * Tri For The 22 has to IRONMAN 70.3 Chattanooga (an event For The 22
 * doesn't organize either). Event registration/ticket proceeds go to
 * RUCK_EVENT_BENEFICIARIES, chosen by RuckUp 22, Inc. — separate from
 * `beneficiaries` below, Cody's own usual campaign causes.
 */
export const RUCK_EVENT_INFO = {
  name: "RuckUp22 Huntsville",
  year: "2026",
  // 08:00 local (Central) on October 24, 2026.
  eventDate: "2026-10-24T08:00:00-05:00" as string | null,
  eventDateDisplay: "October 24, 2026 · 0800",
  location: "Aldridge Creek Greenway, Huntsville, Alabama",
  locationDetail:
    "Huntsville-area participants are encouraged to use the Aldridge Creek Greenway, starting anywhere from Ditto Landing to Bailey Cove Road. The path is open to the public and accessible at multiple points.",
  formatNote:
    "Attempt to ruck the full 22 miles, or walk any distance with family and friends to raise awareness for the RuckUp22 cause. Other hiking/walking locations in your local area, and dates of your choosing, are also welcome.",
  personalNote:
    "Cody is registering to ruck the full 22 miles in person in Huntsville — join him there, or ruck/walk your own distance wherever you are.",
  ticketUrl:
    "https://www.eventbee.com/v/2026-ruckup22-huntsville/event?eid=218120732#/tickets",
  /** Cody's own usual campaign beneficiaries (same two as Tri For The 22's CURRENT_CAMPAIGN.beneficiaries) — see partners.ts for the shared record. Distinct from RUCK_EVENT_BENEFICIARIES below. */
  beneficiaries: ["Mighty Oaks Foundation", "Veterans and Athletes United"],
} as const;

/** RuckUp22 Huntsville's own organizing entity — see RUCK_EVENT_INFO's doc comment for why this is distinct from For The 22. */
export const RUCK_EVENT_ORGANIZER = {
  name: "RuckUp 22, Inc.",
  ein: "88-3844658",
} as const;

/**
 * Who RuckUp22 Huntsville's own registration/ticket proceeds support —
 * chosen by RuckUp 22, Inc., not by Cody or For The 22 (see
 * RUCK_EVENT_INFO's doc comment). Plain data, not a `partners` row: these
 * aren't Tri For The 22 beneficiaries, and that shared table's
 * `description` field hard-codes "part of Tri For The 22" copy that
 * wouldn't apply here. EIN/501(c)(3)/donate-page details confirmed
 * directly from each organization's own website.
 */
export const RUCK_EVENT_BENEFICIARIES = [
  {
    name: "The Battle Buddy Foundation",
    description:
      "Provides highly trained psychiatric and mobility service dogs, at no cost, to veterans of all eras living with PTSD, traumatic brain injury, and physical limitations.",
    websiteUrl: "https://www.tbbf.org",
    donationUrl: "https://www.tbbf.org/donate-now/",
    ein: "46-2069571",
  },
  {
    name: "Tunnel to Towers Foundation",
    description:
      "Provides mortgage-free homes to Gold Star and fallen first responder families with young children, and builds specially adapted smart homes for catastrophically injured veterans and first responders.",
    websiteUrl: "https://www.t2t.org",
    donationUrl: "https://dogood.t2t.org/give/320847/#!/donation/checkout",
    ein: "02-0554654",
  },
] as const;

/**
 * Ruck's in-page section nav — anchors on the single /ruck-home page, not
 * separate routes (see RUCK_CAMPAIGN_URL's doc comment).
 */
export const RUCK_NAV_LINKS: NavLink[] = [
  { label: "The Event", href: "/#event" },
  { label: "Beneficiaries", href: "/#beneficiaries" },
];

export const RUCK_REGISTER_LINK: NavLink = { label: "Register", href: RUCK_EVENT_INFO.ticketUrl };

/**
 * Per-campaign header/footer branding, keyed by the CampaignSlug that
 * src/lib/site-mode.ts derives from the request host. Header/Footer/
 * MobileMenu read from here instead of hard-coding Tri's constants, so a
 * visitor on ruck.forthe22.org sees Ruck's own name/logo/nav, not Tri's.
 * Ruck only has a dark-background mark so far (white text, transparent —
 * see brand/ruck-logo-white-source.png) — logoLight falls back to the real
 * org mark (logo.png) until a light-background/black-text version exists,
 * rather than showing white-on-white in the header.
 */
export const CAMPAIGNS: Record<
  CampaignSlug,
  {
    name: string;
    url: string;
    /** Short, used in the app shell's <title> template and OG/Twitter cards. */
    tagline: string;
    /** One sentence, used as the app shell's default meta description. */
    description: string;
    navLinks: NavLink[];
    logoLight: string;
    logoDark: string;
    primaryCta: NavLink & { external?: boolean };
  }
> = {
  tri: {
    name: CAMPAIGN_NAME,
    url: CAMPAIGN_URL,
    tagline: SITE_TAGLINE,
    description: `${CAMPAIGN_NAME} — ${SITE_TAGLINE}`,
    navLinks: CAMPAIGN_NAV_LINKS,
    logoLight: "/campaign-logo.png",
    logoDark: "/campaign-logo-white.png",
    primaryCta: DONATE_LINK,
  },
  ruck: {
    name: RUCK_CAMPAIGN_NAME,
    url: RUCK_CAMPAIGN_URL,
    tagline: `${RUCK_EVENT_INFO.eventDateDisplay} · Huntsville, Alabama`,
    description: `${RUCK_CAMPAIGN_NAME} — a community rucking event in Huntsville, Alabama, raising awareness and funds for veteran-focused nonprofit organizations.`,
    navLinks: RUCK_NAV_LINKS,
    logoLight: "/logo.png",
    logoDark: "/ruck-logo-white.png",
    primaryCta: { ...RUCK_REGISTER_LINK, external: true },
  },
};
