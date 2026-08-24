/**
 * Campaign-domain (tri.forthe22.org) companion to src/lib/content/about.ts.
 * Everything here is Cody's athletic/training narrative — the detailed
 * endurance chronology, "Athlete" as a principal identity, and the
 * campaign-origin story. This content used to live on the parent /about
 * page; it moved here so the parent site stays a resource-connection
 * initiative and the campaign carries its own athletic story. See
 * src/lib/content/about.ts's doc comment for the parent-side split.
 */

export const STORY_TAGLINE = "Athlete. Veteran. Husband. Father. Still Moving Forward.";

export const HOW_THIS_BEGAN = {
  heading: "How This Became Tri For The 22",
  body: [
    "My next major goal is completing a 70.3-mile triathlon — 1.2 miles swimming, 56 miles cycling, and 13.1 miles running. Tri For The 22 began as a personal endurance challenge: train for the race, tell the story honestly, connect people with established resources, and encourage direct support for organizations already doing the work.",
    "I have benefited from people and organizations willing to invest in veterans when it mattered most. Now I want to return that investment. I cannot solve everything a veteran or first responder is carrying, but I can swim 1.2 miles, ride 56, run 13.1, and tell my story.",
  ],
};

export const WHY_ENDURANCE = {
  heading: "Why Endurance",
  body: [
    "You do not have to feel strong to keep moving. You just have to take the next step.",
    "That is what endurance has become for me. Not an escape. Not punishment. A way forward.",
  ],
};

/**
 * The endurance story shown as a visual timeline — only accurate, approved
 * dates. Thumbnails are optional supporting photos, not a stand-in for a
 * full gallery.
 */
export const MOVEMENT_TIMELINE = [
  { year: "2015", label: "Spartan Trifecta completed", image: { src: "/about/trail.jpg", alt: "Cody on a trail run" } },
  {
    year: "2016",
    label: "Back surgery — adapts, trains in Brazilian Jiu-Jitsu",
    image: { src: "/about/jiu-jitsu.jpg", alt: "Cody after a Brazilian Jiu-Jitsu competition" },
  },
  { year: "2023", label: "First marathon, Nashville", image: { src: "/about/nashville.jpg", alt: "Cody at the Nashville marathon" } },
  {
    year: "2024",
    label: "First 100-kilometer ultramarathon",
    image: { src: "/about/ultra-2.jpg", alt: "Cody racing solo on a wooded trail during an ultramarathon" },
  },
  { year: "2027", label: "IRONMAN 70.3 Chattanooga (goal)" },
] as const;

export const BENEFICIARY_EXPLANATION =
  "Tri For The 22 raises funds for confirmed nonprofit beneficiaries — organizations already doing this work, not a fund Cody administers himself. See the Beneficiaries page for who's currently confirmed and how donations reach them directly.";

export const REMEMBRANCE_STATEMENT =
  "We remember those we have lost—and keep showing up for those who are still here.";

/** Approved training/race photography — empty until real photos are cleared for publication (see press.ts for the same no-placeholder convention). */
export const STORY_PHOTOS: { src: string; alt: string }[] = [];
