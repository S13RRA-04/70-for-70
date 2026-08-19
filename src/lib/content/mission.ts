/**
 * Editable narrative copy for the Mission page. Kept as data rather than
 * hard-coded JSX so copy can be revised without touching components.
 * Condensed from Cody's full account on the About page — see
 * src/lib/content/about.ts for the complete story.
 */

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
      "Tri pairs a 70.3-mile triathlon — a 1.2-mile swim, 56-mile bike, and 13.1-mile run — with a $70,000 fundraising goal: one mile completed on race day, one mile of fundraising, at $1,000 per mile.",
      "The race itself is the vehicle, not the point. The training, the setbacks, the early mornings, and the finish line all become part of something larger than one race.",
    ],
  },
  {
    id: "why-veterans",
    heading: "Why Veterans",
    body: [
      "I spent seven years on active duty in the United States Navy as a Mass Communication Specialist, including a 2011 deployment to Afghanistan as a combat journalist. Like a lot of veterans, I came home physically present but carrying things I did not fully understand how to process.",
      "There is another veteran somewhere trying to figure out what comes next, and another family trying to understand why the person who came home feels different from the person who left. I have benefited from people and organizations willing to invest in veterans. Now I want to return that investment.",
    ],
    link: { label: "Read the full story", href: "/about" },
  },
  {
    id: "why-mighty-oaks",
    heading: "Why Mighty Oaks",
    body: [
      "In 2023, I attended a Mighty Oaks Warrior Program retreat. It became an important turning point in my life — helping me look at difficult experiences through a lens centered on faith, responsibility, purpose, and relationships, and affecting how I viewed my marriage, my family, and my future.",
      "I know firsthand what their work can mean to a veteran and a family. That's why Mighty Oaks is part of Tri.",
    ],
    link: { label: "Learn more about Mighty Oaks", href: "/partners" },
  },
  {
    id: "why-project-echelon",
    heading: "Why Project Echelon",
    body: [
      "Project Echelon uses endurance sport, mentorship, structure, and community to help veterans continue moving forward after military service. As I began pursuing triathlon, that mission immediately made sense to me.",
      "There is something powerful about putting veterans back into an environment where there is a mission, a team, accountability, and a reason to keep showing up — you prepare, you suffer together, you hold each other accountable, and you finish what you started.",
    ],
    link: { label: "Learn more about Project Echelon", href: "/partners" },
  },
  {
    id: "the-goal",
    heading: "The Goal",
    body: [
      "The fundraising model is simple: every $1,000 raised funds one mile of the race. There are 70 fundraising miles in total, matching the approximately 70-mile distance of a 70.3-mile triathlon.",
      "Donors and sponsors can fund a mile outright or contribute toward one alongside other supporters — no single mile requires one donor to cover the full $1,000.",
    ],
  },
];
