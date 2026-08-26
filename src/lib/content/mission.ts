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
      "Tri For The 22 pairs a 70.3-mile triathlon — a 1.2-mile swim, 56-mile bike, and 13.1-mile run — with a $70,000 fundraising goal: one mile completed on race day, one mile of fundraising, at $1,000 per mile.",
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
    id: "why-mighty-oaks",
    heading: "Why Mighty Oaks",
    body: [
      "The Mighty Oaks Warrior Program works with veterans through a lens centered on faith, responsibility, purpose, and relationships — helping veterans and their families move forward rather than simply trying to return to who they were before.",
      "That kind of impact on a veteran and a family is why Mighty Oaks is part of Tri For The 22.",
    ],
    link: { label: "Learn more about Mighty Oaks", href: "/partners" },
  },
  {
    id: "why-veterans-and-athletes-united",
    heading: "Why Veterans and Athletes United",
    body: [
      "Veterans and Athletes United uses adaptive sports, outdoor recreation, and community to help wounded, injured, and ill veterans rebuild strength and purpose.",
      "That kind of impact — reaching veterans who need exactly the mission, movement, and community this campaign is built around — is why Veterans and Athletes United is part of Tri For The 22.",
    ],
    link: { label: "Learn more about Veterans and Athletes United", href: "/partners" },
  },
  {
    id: "the-goal",
    heading: "The Goal",
    body: [
      "The fundraising model is simple: every $1,000 raised funds one mile of the race. There are 70 fundraising miles in total, matching the approximately 70-mile distance of a 70.3-mile triathlon.",
      "Donors can fund a mile outright or contribute alongside other supporters. Corporate sponsorships are handled separately through the sponsorship review process.",
    ],
  },
];
