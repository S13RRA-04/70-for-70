/**
 * Editable narrative copy for the Mission page. Kept as data rather than
 * hard-coded JSX so copy can be revised without touching components.
 *
 * Deliberately organizational, not personal — anything about Cody himself
 * lives only on /about#founders-story (see src/lib/content/about.ts); this
 * page links there rather than re-narrating any of it. This page lives on
 * the campaign domain but /about is org-only, so that link uses the full
 * SITE_URL rather than a relative path — see README's "Movement/Campaign
 * Domain Split".
 */

import { SITE_URL } from "@/lib/constants";

export interface MissionSection {
  id: string;
  heading: string;
  body: string[];
  link?: { label: string; href: string };
}

export const MISSION_SECTIONS: MissionSection[] = [
  {
    id: "the-challenge",
    heading: "The Challenge",
    body: [
      "Tri For The 22 pairs a 70.3-mile triathlon — a 1.2-mile swim, 56-mile bike, and 13.1-mile run — with a $70,000 fundraising goal.",
      "The race itself is the vehicle, not the point. The training, the setbacks, the early mornings, and the finish line all become part of something larger than one race.",
    ],
  },
  {
    id: "why-veterans",
    heading: "Why Veterans",
    body: [
      "There's a veteran or first responder out there right now trying to figure out what comes next — and a family trying to understand why the person who came home feels different from the person who left.",
      "Every mile of this campaign is aimed at closing that gap: connecting people to the resources, community, and support that make that transition survivable, not just endurable.",
    ],
    link: { label: "Read the Founder's Story", href: `${SITE_URL}/about#founders-story` },
  },
  {
    id: "why-first-responders",
    heading: "Why First Responders",
    body: [
      "Law enforcement, fire, EMS, dispatch, and corrections carry a version of the same weight — repeated exposure to trauma, and a culture that often rewards toughness over asking for help. Reporting is far less complete than it is for veterans, but the best available estimates suggest a law-enforcement officer is lost to suicide roughly every 2 to 3 days.",
      "That's why For The 22 has always stood for veterans and first responders together — the number \"22\" started as a veteran statistic, but the mission behind it was never about one uniform. Closing that same gap is why first responders are part of this campaign's mission, not an afterthought to it.",
    ],
    link: { label: "Read Why 22", href: `${SITE_URL}/about#for-the-22` },
  },
  {
    id: "why-mighty-oaks",
    heading: "Why Mighty Oaks",
    body: [
      "The Mighty Oaks Warrior Program works with veterans through a lens centered on faith, responsibility, purpose, and relationships — helping veterans and their families move forward rather than simply trying to return to who they were before.",
      "That kind of impact on a veteran and a family is why Mighty Oaks is part of Tri For The 22.",
    ],
    link: { label: "Learn more about Mighty Oaks", href: "/beneficiaries" },
  },
  {
    id: "why-veterans-and-athletes-united",
    heading: "Why Veterans and Athletes United",
    body: [
      "Veterans and Athletes United uses adaptive sports, outdoor recreation, and community to help wounded, injured, and ill veterans rebuild strength and purpose.",
      "That kind of impact — reaching veterans who need exactly the mission, movement, and community this campaign is built around — is why Veterans and Athletes United is part of Tri For The 22.",
    ],
    link: { label: "Learn more about Veterans and Athletes United", href: "/beneficiaries" },
  },
  {
    id: "the-goal",
    heading: "The Goal",
    body: [
      "The goal is simple: $70,000 raised in support of the beneficiary organizations, alongside the 70.3-mile race itself.",
      "Every donation counts toward that single goal, whatever the amount. Corporate sponsorships are handled separately through the sponsorship review process.",
    ],
  },
];
