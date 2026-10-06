/** Reusable, approved organizational press copy. */
export const FOUNDER_BIO_SHORT =
  "Cody Hitson is a Navy veteran, husband, and father who served seven years on active duty as a Mass Communication Specialist, including a 2011 deployment to Afghanistan as a combat journalist. He founded For The 22 to help veterans and first responders find trusted resources—and to mobilize communities behind the organizations serving them.";

export const FOUNDER_BIO_LONG = [
  "Cody Hitson is a Navy veteran, husband, father, and endurance athlete who spent seven years on active duty as a Mass Communication Specialist, deploying to Afghanistan in 2011 in support of Operation Enduring Freedom as a combat journalist. After returning home, he spent years learning to function without dealing with what was underneath—a season that included major back surgery in 2016 and no clear sense of what came next. A 2023 retreat with the Mighty Oaks Warrior Program became a turning point, redirecting his recovery around faith, responsibility, and purpose.",
  "Cody founded For The 22 to make that search easier for the next person: a directory of established programs, services, and communities serving veterans, first responders, and their families—paired with campaigns that mobilize communities and raise direct support for confirmed beneficiary organizations. He was featured as the VA's #VeteranOfTheDay.",
] as const;

export interface MediaCoverageItem {
  outlet: string;
  headline: string;
  date: string;
  url: string;
  type: "article" | "audio" | "video";
  image: string | null;
}

/** Real earned coverage only. An empty array hides the section. */
export const MEDIA_COVERAGE: readonly MediaCoverageItem[] = [
  {
    outlet: "U.S. Department of Veterans Affairs",
    headline: "#VeteranOfTheDay — Navy Veteran Cody Hitson",
    date: "2021-08-04",
    url: "https://news.va.gov/91792/veteranoftheday-navy-veteran-cody-hitson/",
    type: "article",
    image: null,
  },
];
