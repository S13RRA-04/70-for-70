/**
 * Athlete profile copy for the About page. This is Cody's own account —
 * kept as data rather than hard-coded JSX so it can be revised without
 * touching components. `portraitUrl` is unset pending photography — see
 * MediaPlaceholder for how that's handled without a visible TODO label.
 *
 * The About page itself is a hand-composed editorial arc (Service → After →
 * Turning Point → Movement → For The 22 → The Mark), not a generic loop over
 * this data — `ABOUT_CHAPTERS` below is only the rail/indicator nav metadata.
 * Content lives in the flat `SUBSECTIONS` map so `findAboutSubsection()` keeps
 * working as a stable by-id lookup for other pages (home, /advocacy) that
 * link to or excerpt specific pieces without reproducing them.
 *
 * Personal/biographical content — anything about Cody himself — lives only
 * on this page (/about). Other pages that used to reproduce excerpts of it
 * link here instead of re-narrating any of it.
 */

export interface AboutSubsection {
  id: string;
  heading: string;
  body: string[];
  pullQuote?: { text: string; attribution: string };
  /**
   * `focus` is a Tailwind object-position class, only needed when the
   * photo's aspect ratio doesn't match the display container's — default
   * center cropping can otherwise cut through a subject's face on a
   * portrait-oriented source photo. Omit for images where center framing is
   * fine.
   */
  image?: { src: string; alt: string; focus?: string };
}

const SUBSECTIONS = {
  "mighty-oaks": {
    id: "mighty-oaks",
    heading: "Mighty Oaks",
    body: [
      "In 2023, I attended a Mighty Oaks Warrior Program retreat. It became a turning point — a place that helped me look at faith, responsibility, purpose, and relationships through a different lens, and understand that recovery isn't about becoming who I was before. Sometimes it's about becoming someone stronger because of what happened.",
      "That's one of the reasons Mighty Oaks is part of Tri For The 22 — I know firsthand what their work can mean to a veteran and a family.",
    ],
  },
  "the-idea": {
    id: "the-idea",
    heading: "How This Became For The 22",
    body: [
      "My next major goal is completing a 70.3-mile triathlon — 1.2 miles swimming, 56 miles cycling, and 13.1 miles running. Tri For The 22 began as a personal endurance challenge: train for the race, tell the story honestly, connect people with established resources, and encourage direct support for organizations already doing the work.",
      "I have benefited from people and organizations willing to invest in veterans when it mattered most. Now I want to return that investment. There is another veteran somewhere trying to figure out what comes next — another who needs a mission. I cannot solve all of that, but I can swim 1.2 miles, ride 56, run 13.1, and tell my story.",
    ],
  },
  "my-story": {
    id: "my-story",
    heading: "Seven Years in the Navy",
    body: [
      "I'm a husband, father, Navy veteran, and endurance athlete. I spent seven years on active duty in the United States Navy as a Mass Communication Specialist.",
      "In 2011, I deployed to Afghanistan in support of Operation Enduring Freedom as a combat journalist — alongside service members operating in an environment where violence, loss, fear, and uncertainty were part of everyday life.",
      "Like a lot of veterans, I came home physically present but carrying things I didn't fully understand how to process.",
    ],
    image: {
      src: "/about/afghan-2.jpg",
      alt: "Cody during his 2011 deployment to Afghanistan",
      // Source photo is a tall 3:4 portrait cropped into a wide box —
      // default center cropping pushes the visible window below the top of
      // his head. object-top lands the crop almost exactly on his face
      // instead of his chest/uniform.
      focus: "object-top",
    },
  },
  "after": {
    id: "after",
    heading: "What Came After",
    body: [
      "I learned how to function. That is not the same thing as learning how to live well.",
      "For years, I found ways to keep moving without dealing with what was underneath. Sometimes that meant burying myself in work. Sometimes it meant pushing harder physically. Sometimes it meant refusing to stop long enough to feel it.",
      "Injuries and physical trauma connected to my service caught up with me. In 2016, it led to major back surgery — and to a season with no clear sense of what came next.",
      "My story includes trauma, mistakes, setbacks, and times I didn't know what the next chapter was supposed to look like.",
    ],
  },
  "my-testimony": {
    id: "my-testimony",
    heading: "My Testimony",
    body: [
      "My faith became the foundation of how I understand recovery, purpose, and the responsibility that comes with surviving hard things — not pretending the ashes never existed, but paying attention to what can be built from them.",
      "But it also includes grace. It includes family. It includes people who showed up when they did not have to. And it includes the realization that surviving something creates an opportunity to help someone else through it.",
    ],
    pullQuote: {
      text: "...to give unto them beauty for ashes, the oil of joy for mourning, the garment of praise for the spirit of heaviness...",
      attribution: "Isaiah 61:3",
    },
  },
  "why-endurance-sports": {
    id: "why-endurance-sports",
    heading: "Why Endurance",
    body: [
      "You do not have to feel strong to keep moving. You just have to take the next step.",
      "That is what endurance has become for me. Not an escape. Not punishment. A way forward.",
    ],
  },
  "why-22": {
    id: "why-22",
    heading: "Why 22?",
    body: [
      "22 has become a widely recognized symbol of veteran suicide awareness. For The 22 uses that number as a reminder of the veterans still fighting — and the responsibility to keep showing up for them.",
      "That number is symbolic, not presented as a current precise daily statistic. What it represents does not change: there are still veterans out there who need someone to reach them.",
    ],
  },
  "why-black": {
    id: "why-black",
    heading: "Why We Wear Black",
    body: [
      "Black is mourning. We wear it for the veterans and first responders we've lost to suicide, trauma, and the invisible battles carried long after the uniform comes off.",
      "We race in remembrance — and we move forward for those who no longer can.",
    ],
  },
} as const satisfies Record<string, AboutSubsection>;

export interface AboutContent {
  name: string;
  tagline: string;
  portraitUrl: string | null;
}

export const ABOUT_CONTENT: AboutContent = {
  name: "Cody Hitson",
  tagline: "Athlete. Veteran. Husband. Father. Still Moving Forward.",
  portraitUrl: "/about/hiking.jpg",
};

/** Flat, by-id lookup — used by the homepage and /advocacy for non-personal excerpts (e.g. "why-22", "the-idea"). */
export function findAboutSubsection(id: string): AboutSubsection | undefined {
  return (SUBSECTIONS as Record<string, AboutSubsection>)[id];
}

export interface AboutChapter {
  id: string;
  number: string;
  label: string;
}

/**
 * The 6 chapters shown in the About page's sticky rail (desktop) / compact
 * indicator (mobile). Nav metadata only — each chapter's actual content is
 * hand-composed in the page since every chapter has a distinct layout
 * (alternating image/text, timeline, full-bleed memorial, annotated mark).
 */
export const ABOUT_CHAPTERS: AboutChapter[] = [
  { id: "service", number: "01", label: "Service" },
  { id: "after", number: "02", label: "After" },
  { id: "turning-point", number: "03", label: "Turning Point" },
  { id: "movement", number: "04", label: "Movement" },
  { id: "for-the-22", number: "05", label: "For The 22" },
  { id: "the-mark", number: "06", label: "The Mark" },
];

/**
 * The endurance story shown as a visual timeline in the Movement chapter —
 * only accurate, approved dates. Thumbnails are optional supporting photos,
 * not a stand-in for a full gallery.
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

/**
 * Re-exported from src/lib/ring-colors.ts, which is the canonical source now
 * that other parts of the site (beyond this About page content module) need
 * the same ring-color data.
 */
export { OUTER_RING_COLORS, INNER_RING_COLORS } from "@/lib/ring-colors";
