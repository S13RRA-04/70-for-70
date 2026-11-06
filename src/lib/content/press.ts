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
  credit?: string;
}

/** Approved for editorial use. All already published on /about or the Ruck mission journal. */
export const PRESS_PHOTOS: readonly PressPhoto[] = [
  {
    src: "/ruck/ruckup22-2026/img-6228.webp",
    alt: "Cody Hitson smiling outdoors wearing a ruck and a camouflage cap",
    caption: "Cody Hitson, founder of For The 22, on a 2026 Ruck For The 22 mission.",
  },
  {
    src: "/about/afghan-1.jpg",
    alt: "Navy Petty Officer 2nd Class Cody Hitson reporting on camera in Afghanistan",
    caption: "PO2 Cody Hitson reporting as a combat journalist in Afghanistan, 2011.",
    credit: "AFN Afghanistan",
  },
  {
    src: "/about/navy.jpg",
    alt: "Cody Hitson in Navy working uniform aboard ship",
    caption: "Cody Hitson on active duty with the U.S. Navy.",
  },
  {
    src: "/about/ultra-1.jpg",
    alt: "Cody Hitson running a trail ultramarathon wearing bib 31",
    caption: "Cody Hitson racing a trail ultramarathon.",
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
    date: "2021-08-04",
    links: [
      { label: "Read on VA News", url: "https://news.va.gov/91792/veteranoftheday-navy-veteran-cody-hitson/", kind: "article" },
    ],
  },
];
