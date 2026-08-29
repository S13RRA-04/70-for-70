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
      "That experience showed me how difficult it can be to find the right help at the right time—and why connecting people with established resources matters.",
    ],
  },
  "the-idea": {
    id: "the-idea",
    heading: "How This Became For The 22",
    body: [
      "I have benefited from people and organizations willing to invest in veterans when it mattered most. Now I want to return that investment. There is another veteran somewhere trying to figure out what comes next — another who needs a mission.",
      "I can't solve that for everyone. But I can build a place that makes it easier to find the right support: a directory of established programs, services, and communities, put together by someone who knows firsthand how hard that search can be.",
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
  "why-22": {
    id: "why-22",
    heading: "Why 22?",
    body: [
      "22 has become a widely recognized symbol of veteran suicide awareness. It's historically significant, but it isn't the current national number — the VA's most recent data (2023) puts the daily average at 17.5 Veterans lost to suicide.",
      "For The 22 also serves law enforcement, fire, EMS, dispatch, and corrections. Reporting there is far less complete, but the best available estimates suggest a law-enforcement officer is lost to suicide roughly every 2 to 3 days.",
      "Behind every one of those numbers is a family, a team, a unit, and a community left behind — and that's what keeps this work in front of us.",
    ],
  },
  "why-black": {
    id: "why-black",
    heading: "Why We Wear Black",
    body: [
      "Black is mourning. We wear it for the veterans and first responders we've lost to suicide, trauma, and the invisible battles carried long after the uniform comes off.",
      "We remember those we have lost—and keep showing up for those who are still here.",
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
  tagline: "Veteran. Husband. Father. Still Moving Forward.",
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
 * The 5 chapters shown in the About page's sticky rail (desktop) / compact
 * indicator (mobile). Nav metadata only — each chapter's actual content is
 * hand-composed in the page since every chapter has a distinct layout
 * (alternating image/text, full-bleed memorial, annotated mark). The
 * endurance/training chronology ("Movement") lives on the campaign
 * subdomain's Story page, not here — see src/lib/content/the-story.ts.
 */
export const ABOUT_CHAPTERS: AboutChapter[] = [
  { id: "service", number: "01", label: "Service" },
  { id: "after", number: "02", label: "After" },
  { id: "turning-point", number: "03", label: "Turning Point" },
  { id: "for-the-22", number: "04", label: "For The 22" },
  { id: "the-mark", number: "05", label: "The Mark" },
];

/**
 * Re-exported from src/lib/ring-colors.ts, which is the canonical source now
 * that other parts of the site (beyond this About page content module) need
 * the same ring-color data.
 */
export { OUTER_RING_COLORS, INNER_RING_COLORS } from "@/lib/ring-colors";
