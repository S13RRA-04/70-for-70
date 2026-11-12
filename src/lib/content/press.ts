import { CAMPAIGN_URL, LIVE_CAMPAIGN_URL, SITE_URL } from "@/lib/constants";
import { HAS_LISTED_AUCTION_ITEMS } from "@/lib/content/live-auction";

/** Reusable, approved organizational press copy. */
export const FOUNDER_BIO_SHORT =
  "Cody Hitson is a Navy veteran, husband, and father who served seven years on active duty as a Mass Communication Specialist, including a 2011 deployment to Afghanistan as a combat journalist. He founded For The 22 to help veterans and first responders find trusted resources—and to mobilize communities behind the organizations serving them.";

export const FOUNDER_BIO_LONG = [
  "Cody Hitson is a Navy veteran, husband, father, and endurance athlete who spent seven years on active duty as a Mass Communication Specialist, deploying to Afghanistan in 2011 in support of Operation Enduring Freedom as a combat journalist. After returning home, he spent years learning to function without dealing with what was underneath—a season that included major back surgery in 2016 and no clear sense of what came next. A 2023 retreat with the Mighty Oaks Warrior Program became a turning point, redirecting his recovery around faith, responsibility, and purpose.",
  "Cody founded For The 22 to make that search easier for the next person: a directory of established programs, services, and communities serving veterans, first responders, and their families—paired with campaigns that mobilize communities and raise direct support for confirmed beneficiary organizations. He was featured as the VA's #VeteranOfTheDay.",
] as const;

/** One-sentence intro a host or emcee can read on air. */
export const FOUNDER_INTRO =
  "Cody Hitson is a Navy veteran and former combat journalist who founded For The 22 to connect veterans, first responders, and their families with trusted resources—and to rally communities behind the organizations serving them.";

/** Subjects Cody can speak to — every one grounded in the approved bios above. */
export const INTERVIEW_TOPICS = [
  "Seven years as a Navy Mass Communication Specialist, including a 2011 deployment to Afghanistan as a combat journalist",
  "Coming home, a 2016 back surgery, and the Mighty Oaks retreat that turned his recovery around",
  "Why finding the right help at the right time is so hard—and how the For The 22 resource directory makes it easier",
  "Endurance as mission: training for IRONMAN 70.3 Chattanooga and rucking for the 22",
  "How listeners can get involved, and the vetted organizations every campaign supports",
] as const;

export interface PressPhoto {
  src: string;
  alt: string;
  caption: string;
  credit: string;
}

/** Shown beside the photos and repeated in the downloadable kit's README. */
export const PHOTO_USAGE_TERMS =
  "Free to use in editorial coverage of For The 22 and Cody Hitson. Please include the credit listed with each photo. Not for advertising or endorsement use.";

/**
 * Metadata-stripped JPEG exports in public/press/photos/ (EXIF/GPS removed,
 * bystanders cropped out). Only photos For The 22 holds the rights to — a
 * race photographer's shot needs their permission before it goes here.
 */
export const PRESS_PHOTOS: readonly PressPhoto[] = [
  {
    src: "/press/photos/cody-hitson-founder-portrait.jpg",
    alt: "Cody Hitson smiling outdoors wearing a ruck and a camouflage cap",
    caption: "Cody Hitson, founder of For The 22, during RuckUp22 Huntsville, October 24, 2026.",
    credit: "Courtesy of For The 22",
  },
  {
    src: "/press/photos/cody-hitson-ruckup22-finish.jpg",
    alt: "Cody Hitson in a For The 22 shirt holding a 22-mile challenge coin under the RuckUp22 tent",
    caption: "Cody Hitson with his 22-mile coin after completing the 11th Annual RuckUp22 in Huntsville, Alabama.",
    credit: "Courtesy of For The 22",
  },
  {
    src: "/press/photos/cody-hitson-afghanistan-2011.jpg",
    alt: "Navy Petty Officer 2nd Class Cody Hitson reporting on camera in Afghanistan",
    caption: "PO2 Cody Hitson reporting as a combat journalist in Afghanistan, 2011.",
    credit: "AFN Afghanistan / U.S. Department of Defense",
  },
  {
    src: "/press/photos/cody-hitson-navy-service.jpg",
    alt: "Cody Hitson in Navy working uniform aboard ship",
    caption: "Cody Hitson on active duty as a U.S. Navy Mass Communication Specialist.",
    credit: "Courtesy of Cody Hitson",
  },
];

/** Logos, photos, bios, and fact sheet in one file — rebuild it whenever any of those change. */
export const MEDIA_KIT_ZIP_PATH = "/press/for-the-22-media-kit.zip";

export interface StoryAngle {
  label: string;
  headline: string;
  pitch: string;
  /** Where a reporter can verify the facts in the pitch. */
  sources: readonly { label: string; href: string }[];
}

/**
 * Ready-made pitches for regional reporters. Each claim must stay checkable
 * against the linked pages — and the music angle must describe exactly what
 * each band gave, never imply an endorsement or ongoing partnership.
 */
export const STORY_ANGLES: readonly StoryAngle[] = [
  {
    label: "Veteran profile",
    headline: "From Combat to Community: A Veteran's Mission to Reconnect Those Who Served",
    pitch:
      "A former Navy combat journalist who struggled to find the right help after coming home built a nationwide directory of vetted resources for veterans, first responders, and their families—and a set of community campaigns that raise money for the nonprofits serving them.",
    sources: [
      { label: "Founder story", href: `${SITE_URL}/about` },
      { label: "Resource directory", href: `${SITE_URL}/resources` },
      { label: "VA #VeteranOfTheDay profile", href: "https://news.va.gov/91792/veteranoftheday-navy-veteran-cody-hitson/" },
    ],
  },
  {
    label: "Chattanooga · IRONMAN 70.3",
    headline: "70.3 Miles, $70,000, One Mission",
    pitch:
      "A Navy combat veteran is training for IRONMAN 70.3 Chattanooga on May 16, 2027, using the race to rally donations toward a $70,000 goal for two veteran-serving nonprofits: Mighty Oaks Foundation and Veterans and Athletes United.",
    sources: [
      { label: "Tri For The 22", href: CAMPAIGN_URL },
      { label: "The $70K Mission", href: `${SITE_URL}/70k` },
      { label: "Official race page", href: "https://www.ironman.com/races/im703-chattanooga" },
    ],
  },
  {
    label: "Music & community",
    headline: "When Music Becomes a Mission: Country Artists Rally Behind Veterans",
    pitch:
      "Whiskey Myers donated and signed a guitar plus two 2027 concert tickets, and Muscadine Bloodline's Gary Stanton and Charlie Muncaster signed a Gibson guitar donated through Gibson Gives—both for For The 22's online silent auction, as part of a benefit concert series in development.",
    sources: [
      HAS_LISTED_AUCTION_ITEMS
        ? { label: "Silent auction items", href: `${LIVE_CAMPAIGN_URL}/auction` }
        : { label: "For The 22: Live", href: LIVE_CAMPAIGN_URL },
    ],
  },
];

export interface PressQuote {
  /** Verbatim as approved by the speaker — never edit beyond capitalization or obvious typos. */
  quote: string;
  name: string;
  title: string;
  organization: string;
  organizationUrl: string;
  /** When the speaker provided it for press use. */
  providedOn: string;
}

/**
 * Quotes their speakers have approved for press use, for reporters to run
 * as written. Beneficiary voices only describe their own work — they're
 * not endorsements of For The 22.
 */
export const PRESS_QUOTES: readonly PressQuote[] = [
  {
    quote:
      "Adaptive sports has been life-changing for so many of us. Honestly, many of us might not be here today without the opportunities, support, and community these programs provide. Our ability to help provide VAU Sports grants towards travel to events and equipment needed to participate can be the decisive point for many veterans to continue to move forward with their disabilities.",
    name: "James Howard",
    title: "President",
    organization: "Veterans and Athletes United",
    organizationUrl: "https://www.vetsau.org/",
    // Midday UTC, so the date reads as Nov. 9 in every U.S. time zone.
    providedOn: "2026-11-09T12:00:00Z",
  },
];

export interface MediaLink {
  label: string;
  url: string;
  kind: "article" | "audio" | "video" | "social";
}

/** One interview or feature, with every place it can be read, heard, or watched. */
export interface MediaAppearance {
  outlet: string;
  title: string;
  date: string;
  /** What kind of coverage it is — e.g. "Radio interview", or "Founder background" for anything predating For The 22. */
  format: string;
  summary: string;
  links: readonly MediaLink[];
}

/**
 * Real earned coverage only, newest first. Shared by the org and campaign
 * press pages; an empty array hides the section on both.
 */
export const MEDIA_APPEARANCES: readonly MediaAppearance[] = [
  {
    outlet: "Military Broadcast Radio",
    title: "The H-Train Show: Cody Hitson, For the 22 Joins Us",
    date: "2026-11-06",
    format: "Radio interview",
    summary: "Cody discusses founding For The 22 and how communities can rally behind veterans, first responders, and the organizations serving them.",
    links: [
      // Starts at the For the 22 segment of the full show.
      { label: "Watch on YouTube", url: "https://www.youtube.com/watch?v=kLAcmPzcVQc&t=2997s", kind: "video" },
      { label: "Listen on Spotify", url: "https://open.spotify.com/episode/3Yi3sSxf7byVNE8DHxY9VD", kind: "audio" },
      { label: "Facebook", url: "https://www.facebook.com/DVRadioNetwork/videos/4602773216611957/", kind: "social" },
    ],
  },
  {
    outlet: "DV Radio Network",
    title: "Rucking Through Veteran PTSD",
    date: "2026-10-10",
    format: "Podcast and video interview",
    summary: "A conversation about veteran mental health, PTSD, rucking, and rebuilding purpose after service.",
    links: [
      { label: "Watch on Rumble", url: "https://rumble.com/embed/v7ei15s/?pub=3buze8", kind: "video" },
      { label: "Listen on Podbean", url: "https://dvradionetwork.podbean.com/e/rucking-through-veteran-ptsd/", kind: "audio" },
      { label: "Facebook", url: "https://www.facebook.com/photo/?fbid=1753352850124579", kind: "social" },
      { label: "Instagram", url: "https://www.instagram.com/p/DeaZ_saGxl2/", kind: "social" },
    ],
  },
  {
    outlet: "U.S. Department of Veterans Affairs",
    title: "#VeteranOfTheDay: Navy Veteran Cody Hitson",
    date: "2021-08-06",
    format: "Founder background",
    summary: "An independently published VA profile of Cody's Navy service and military journalism career. It predates For The 22 and does not cover the organization.",
    links: [
      { label: "Read on VA News", url: "https://news.va.gov/91792/veteranoftheday-navy-veteran-cody-hitson/", kind: "article" },
    ],
  },
];
