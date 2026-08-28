import type { BikeBuildTimelineEntry } from "@/types/bike-build";

/**
 * Content for /journal/gear-journey — the living record of what it actually
 * costs (in money, favors, and awkward asks) to get a brand-new triathlete
 * to the starting line. Same pattern as building-the-bike.ts: plain
 * structured data, no Supabase journal_entries row, no admin CRUD, because
 * this is one continuing story rather than a stream of independent posts.
 *
 * The opening post (GEAR_JOURNEY_OPENING_POST) is long-form and only ever
 * written once. Everything that follows — a wetsuit arriving, a sponsor
 * saying yes, a component that turned out not to fit — is a short update
 * appended to GEAR_JOURNEY_TIMELINE, exactly like BIKE_BUILD_TIMELINE. See
 * the project README's "Gear Journey Content" section for a worked example
 * of adding one. Short version: append one object to GEAR_JOURNEY_TIMELINE
 * (oldest-first; the newest entry goes last). Nothing else needs to change.
 *
 * The bike itself has its own dedicated deep-dive at
 * /journal/building-the-bike (frame, groupset, fit — the full component-by-
 * component story). This page's "Building the Bike" section links out to it
 * rather than duplicating it.
 */

export const GEAR_JOURNEY_INTRO =
  "One of the things I underestimated when I decided to enter triathlon was just how high the barrier to entry can be. Not physically. I expected that part.";

export interface GearJourneySection {
  /** Omit for the lead-in block before the first subheading. */
  heading?: string;
  /** One paragraph per array entry. */
  paragraphs: string[];
}

export interface GearJourneyOpeningPost {
  title: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Human-facing date text. */
  displayDate: string;
  sections: GearJourneySection[];
}

export const GEAR_JOURNEY_OPENING_POST: GearJourneyOpeningPost = {
  title: "The Gear Journey: The Cost of Getting to the Starting Line",
  date: "2026-08-28",
  displayDate: "August 28, 2026",
  sections: [
    {
      paragraphs: [
        "I knew I would have to learn how to swim efficiently. I knew I would have to build cycling fitness, improve my running, learn how to fuel for hours of continuous movement, and somehow teach my body to do all three disciplines back-to-back.",
        "What I did not fully appreciate was the financial barrier just to participate.",
        "Triathlon is an equipment-heavy sport.",
        "You need a bike. A helmet. Cycling shoes. Running shoes. A wetsuit for open-water training and racing. Goggles. A tri suit. Nutrition. Hydration equipment. Bike tools. Spare tubes and repair equipment. Eventually, things like a bike computer, indoor trainer, power meter, race belt, transition gear, and all the other small items that individually seem manageable but collectively become a serious investment.",
        "And then there are race registrations, travel, lodging, pool access, maintenance, replacement parts, and the inevitable discovery that the thing you bought first was not actually the thing you needed.",
        "Ask me how I know.",
        "For an established triathlete, much of that equipment has been accumulated over years.",
        "For a brand-new athlete, it hits almost all at once.",
      ],
    },
    {
      heading: "Starting From Zero",
      paragraphs: [
        "I didn't enter this project with a garage full of carbon bikes and bins of race gear.",
        "I entered it as a new triathlete trying to build toward an Ironman 70.3 while using that journey to raise awareness and money through Tri For The 22.",
        "That creates an unusual situation.",
        "I'm not a professional athlete.",
        "I'm not an influencer with hundreds of thousands of followers.",
        "I'm not standing on podiums with sponsors competing to put their logo on my kit.",
        "I'm a no-name amateur trying to do something difficult for a cause I believe matters.",
        "That means the traditional sponsorship world gets complicated very quickly.",
        "Companies understandably want a return on their investment. They want exposure, audience size, race results, content reach, or some other measurable benefit.",
        "When you're just beginning, you don't have much of that yet.",
        "You have an idea.",
        "You have a mission.",
        "And you have a willingness to work.",
        "Sometimes that's enough to get someone to listen.",
        "Often it isn't.",
      ],
    },
    {
      heading: "Asking for Help Is Its Own Discipline",
      paragraphs: [
        "One of the strangest parts of this journey has been learning how to ask companies for support.",
        "That does not come naturally to me.",
        "There is a big difference between asking someone to donate to a cause and asking a company to help equip you so that you can pursue the cause.",
        "Even when the purpose is legitimate, there is an uncomfortable voice in the back of your head asking: does this sound like I'm just asking for free stuff?",
        "So I've tried to approach every conversation the same way.",
        "Be transparent.",
        "Explain the mission.",
        "Explain exactly what I'm doing.",
        "Explain what the equipment will be used for.",
        "And give companies an easy opportunity to say no.",
        "Some never respond.",
        "Some politely decline.",
        "Some conversations disappear into the digital abyss.",
        "And then occasionally someone says yes.",
        "Those moments mean a lot more than the equipment itself.",
      ],
    },
    {
      heading: "Building the Bike One Piece at a Time",
      paragraphs: [
        "The bike has probably been the best example.",
        "Rather than walking into a bike shop and dropping several thousand dollars on a complete triathlon setup, I've slowly pieced together a build through a combination of purchases, donated equipment, advice, and opportunities that appeared along the way.",
        "That has meant learning far more about bicycles than I ever expected.",
        "Frames. Groupsets. Cranksets. Bottom brackets. Brifters. Chains. Cassettes. Compatibility standards that apparently exist solely to punish people who thought bicycles were simple machines.",
        "At several points I've stared at a component listing and thought, surely this fits. That sentence is usually followed by twenty minutes of research and disappointment.",
        "But the bike is gradually coming together. And because of the way it has happened, every component has a story attached to it.",
        "Some were purchased. Some came through relationships. Some came from companies willing to support what Tri For The 22 is trying to accomplish.",
        "That makes the final bike more meaningful to me than simply ordering one out of a catalog.",
      ],
    },
    {
      heading: "The Wetsuit Problem",
      paragraphs: [
        "Then there are things like the wetsuit.",
        "You can train for a long time in a pool without one.",
        "Eventually, though, if you're preparing for a 1.2-mile open-water swim, you have to get into open water. And if the race permits wetsuits, you need to know how it feels to swim in one before race morning.",
        "That means another piece of specialized equipment. Another sizing chart. Another few hundred dollars. Another decision between buying something inexpensive now or purchasing something better that can realistically survive the entire training cycle.",
        "This pattern repeats throughout triathlon.",
        "Nothing seems outrageous in isolation.",
        "It's the accumulation that gets you.",
      ],
    },
    {
      heading: "The People Who Say Yes",
      paragraphs: [
        "There have also been some incredible bright spots.",
        "A few organizations and companies have been willing to hear the story behind Tri For The 22 instead of simply looking at follower counts or race credentials.",
        "Those are the partnerships I want to remember.",
        "Not because they gave me something.",
        "Because they took a chance on the mission before there was much proof that this whole thing would work.",
        "That support matters when you're standing at the beginning of a long training cycle looking at an expensive equipment list and an even longer road to race day.",
        "Every piece of support moves the project forward.",
        "Sometimes literally.",
      ],
    },
    {
      heading: "I Still Believe There Is Value in the Hard Way",
      paragraphs: [
        "There would obviously be an easier way to do this.",
        "Buy everything. Hire a coach. Get the best equipment. Show up with a polished setup.",
        "But that wouldn't really represent how this project started.",
        "Tri For The 22 is being built the same way I'm building myself into a triathlete: one piece at a time.",
        "One workout. One lesson. One mistake. One component. One conversation. One person willing to help.",
        "There is something fitting about that.",
        "The goal was never to prove that I could buy my way onto an Ironman course.",
        "The goal is to show what can happen when someone decides to take on something that initially feels far outside his lane, builds the capability piece by piece, and uses the process to draw attention to something bigger than himself.",
        "Eventually, all of this equipment will be sitting in transition on race morning.",
        "The bike will be built. The wetsuit will be zipped. The shoes will be waiting.",
        "But none of that gear will tell the whole story.",
        "The real story will be everything — and everyone — that helped get it there.",
        "And we're still building.",
      ],
    },
  ],
};

/**
 * Shorter updates, appended one at a time as they happen: a component
 * arrives, a sponsor says yes, something expensive turns out not to fit.
 * Empty until the first one lands — BuildTimeline renders an empty list
 * fine, ending in its own "To Be Continued" marker.
 */
export const GEAR_JOURNEY_TIMELINE: BikeBuildTimelineEntry[] = [];

function getLatestGearJourneyEntry(): BikeBuildTimelineEntry | null {
  return GEAR_JOURNEY_TIMELINE.length > 0 ? GEAR_JOURNEY_TIMELINE[GEAR_JOURNEY_TIMELINE.length - 1] : null;
}

/** ISO date driving the hero's "Last updated" badge, the sitemap's lastModified, and dateModified metadata. */
export function getGearJourneyLastUpdated(): string {
  return getLatestGearJourneyEntry()?.date ?? GEAR_JOURNEY_OPENING_POST.date;
}

export interface GearJourneyTeaser {
  title: string;
  displayDate: string;
  summary: string;
  href: string;
}

/** Used by the Journal index's pinned card. Always reflects the newest update, or the opening post if none exist yet. */
export function getGearJourneyTeaser(): GearJourneyTeaser {
  const latest = getLatestGearJourneyEntry();
  if (latest) {
    return {
      title: latest.title,
      displayDate: latest.displayDate,
      summary: latest.summary,
      href: `/journal/gear-journey#${latest.id}`,
    };
  }

  return {
    title: GEAR_JOURNEY_OPENING_POST.title,
    displayDate: GEAR_JOURNEY_OPENING_POST.displayDate,
    summary: GEAR_JOURNEY_INTRO,
    href: "/journal/gear-journey",
  };
}
