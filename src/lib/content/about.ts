/**
 * Athlete profile copy for the About page. This is Cody's own account —
 * kept as data rather than hard-coded JSX so it can be revised without
 * touching components. `portraitUrl` is unset pending photography — see
 * MediaPlaceholder for how that's handled without a visible TODO label.
 *
 * Content is organized into GROUPS (Origin / My Story / Why Endurance /
 * Why 22 / Why Black / Brand Meaning) matching the About page's subnav —
 * each group can hold one or more SUBSECTIONS so related material (e.g.
 * "My Story" + "My Testimony") reads together without collapsing into a
 * single undifferentiated block. Use findAboutSubsection() for the flat,
 * by-id lookups other pages (home, /advocacy) need.
 */

export interface AboutSubsection {
  id: string;
  heading: string;
  body: string[];
  pullQuote?: { text: string; attribution: string };
  image?: { src: string; alt: string };
}

export interface AboutGroup {
  id: string;
  /** Shown in the About page's subnav. */
  navLabel: string;
  subsections: AboutSubsection[];
}

export interface AboutContent {
  name: string;
  tagline: string;
  portraitUrl: string | null;
  /** Condensed 2–3 paragraph version, used on the campaign homepage's "Why I'm Doing This" section. */
  homepageTeaser: string[];
  /** Tighter single-paragraph version for the org homepage's brief founder-story section. */
  homepageStoryExcerpt: string;
  groups: AboutGroup[];
}

export const ABOUT_CONTENT: AboutContent = {
  name: "Cody Hitson",
  tagline: "Athlete. Veteran. Husband. Father. Still Moving Forward.",
  portraitUrl: "/about/hiking.jpg",
  homepageTeaser: [
    "I'm Cody — a Navy veteran, husband, father, and endurance athlete. I spent seven years on active duty as a Mass Communication Specialist, including a 2011 deployment to Afghanistan as a combat journalist. I came home physically present but carrying things I didn't fully understand how to process, and it took years before I found real ways to work through that.",
    "In 2023, a Mighty Oaks Warrior Program retreat became a turning point — it taught me that recovery isn't about becoming who you were before something happened, but someone stronger because of it. Around that same time, endurance sports became one of the ways I learned to keep moving forward: a marathon in 2023, a 100-kilometer ultramarathon in 2024, and now the road to a 70.3-mile triathlon.",
    "I've benefited from people and organizations willing to invest in veterans when it mattered most. Now I want to return that investment — one mile, and one story, at a time — so another veteran finds the same kind of turning point I did.",
  ],
  /** Tight 3-sentence version for the org homepage specifically — the org homepage keeps the founder story brief (a link out to the full About page) since the site is no longer organized around it; the campaign homepage still uses the fuller homepageTeaser above. */
  homepageStoryExcerpt:
    "I'm Cody — a Navy veteran, husband, father, and endurance athlete. After a 2011 combat deployment left me carrying things I didn't know how to process, a 2023 Mighty Oaks retreat became the turning point that taught me recovery means becoming someone stronger, not going back to who I was. I started For The 22 so other veterans and first responders could find that same turning point — one mile, and one resource, at a time.",
  groups: [
    {
      id: "origin",
      navLabel: "Origin",
      subsections: [
        {
          id: "mighty-oaks",
          heading: "Mighty Oaks",
          body: [
            "In 2023, I attended a Mighty Oaks Warrior Program retreat. That experience became an important turning point in my life.",
            "Mighty Oaks gave me more than a place to talk about difficult experiences. It helped me look at those experiences through a different lens — one centered on faith, responsibility, purpose, relationships, and what it means to move forward intentionally.",
            "The lessons I took home affected the way I viewed myself, my marriage, my family, my service, and my future.",
            "I left understanding something I had spent years missing: recovery is not simply about becoming the person you were before something happened. Sometimes it is about becoming someone stronger, wiser, more grounded, and more useful because of what happened.",
            "That is one of the reasons Mighty Oaks is part of Tri For The 22. I know firsthand what their work can mean to a veteran and a family.",
          ],
        },
        {
          id: "the-idea",
          heading: "How This Became For The 22",
          body: [
            "My next major goal is completing a 70.3-mile triathlon — 1.2 miles swimming, 56 miles cycling, and 13.1 miles running. But I did not want that race to be only about crossing another finish line. I wanted the miles to mean something. That is where Tri For The 22 began: the first campaign under a larger idea, For The 22 — a movement where athletes use endurance challenges to raise money, awareness, and support for veterans and first responders.",
            "I have benefited from people and organizations willing to invest in veterans when it mattered most. Now I want to return that investment. There is another veteran somewhere trying to figure out what comes next. Another who needs a mission. Another who needs a team. I cannot solve all of that, but I can swim 1.2 miles, ride 56, run 13.1, tell my story, and ask people to join me.",
            "Full details on the current campaign — the race, the fundraising goal, and how it's tracking — live on the Tri For The 22 site.",
          ],
        },
      ],
    },
    {
      id: "my-story",
      navLabel: "My Story",
      subsections: [
        {
          id: "my-story",
          heading: "My Story",
          body: [
            "My name is Cody Hitson. I am a husband, father, Navy veteran, and endurance athlete. Over the years, I have worn a lot of different uniforms and carried a lot of different responsibilities, but the part of my story that matters most to Tri For The 22 is not what I have done.",
            "It is what I have survived, what I have learned, and what I believe I am supposed to do with the life I have been given.",
            "I spent seven years on active duty in the United States Navy as a Mass Communication Specialist. In 2011, I deployed to Afghanistan in support of Operation Enduring Freedom as a combat journalist. My job placed me alongside service members operating in an environment where violence, loss, fear, and uncertainty were part of everyday life.",
            "Like a lot of veterans, I came home physically present but carrying things I did not fully understand how to process.",
            "For years, I found ways to keep moving. Sometimes that meant burying myself in work. Sometimes it meant pushing harder physically. Sometimes it meant simply refusing to stop long enough to deal with what was underneath the surface.",
            "I learned how to function. That is not the same thing as learning how to live well.",
          ],
          image: {
            src: "/about/afghan-1.jpg",
            alt: "Cody reporting for AFN Afghanistan during his 2011 deployment",
          },
        },
        {
          id: "my-testimony",
          heading: "My Testimony",
          body: [
            "My faith has become the foundation of how I understand recovery, purpose, and the responsibility that comes with surviving difficult things.",
            "For me, that verse is not about pretending the ashes never existed. It is about what God can build from them.",
            "My story includes trauma, mistakes, setbacks, physical injuries, difficult seasons, and times when I did not know what the next chapter was supposed to look like.",
            "But it also includes grace. It includes family. It includes people who showed up when they did not have to. It includes a renewed sense of purpose.",
            "And it includes the realization that surviving something creates an opportunity to help someone else through it.",
          ],
          pullQuote: {
            text: "...to give unto them beauty for ashes, the oil of joy for mourning, the garment of praise for the spirit of heaviness...",
            attribution: "Isaiah 61:3",
          },
        },
      ],
    },
    {
      id: "why-endurance",
      navLabel: "Why Endurance",
      subsections: [
        {
          id: "why-endurance-sports",
          heading: "Why Endurance Sports",
          body: [
            "My relationship with endurance sports began in 2014, shortly after I left active duty.",
            "At first, it was simple: trail runs near my home. I was looking for challenge, structure, and an outlet. Before long, those runs evolved into obstacle course racing, and in 2015 I completed the Spartan Trifecta.",
            "I also began weightlifting, but injuries and physical trauma connected to my military service increasingly limited my mobility. Eventually, those issues led to major back surgery in 2016.",
            "That could have been the end of competitive physical pursuits for me. Instead, I adapted.",
            "From 2016 into 2017, I trained in Brazilian Jiu-Jitsu and eventually competed at the Atlanta Open. In the years that followed, I continued finding different ways to test myself physically, but I also had to become much more deliberate about the challenges I chose. My body had become increasingly prone to injury, and simply pushing harder was no longer a sustainable strategy.",
            "I had to learn how to keep moving without destroying myself in the process.",
            "In 2023, endurance sports became a major part of my life again when I completed my first marathon in Nashville. The following year, I pushed farther and completed my first 100-kilometer ultramarathon.",
            "Those experiences reinforced something I had been learning for years: you do not have to feel strong to keep moving. You just have to take the next step.",
            "There are moments in endurance events when your body is exhausted, your mind is searching for an exit, and the finish line feels impossibly far away. Life can feel exactly the same way.",
            "The answer is rarely to solve the entire problem at once.",
            "Find the next aid station. Reach the next mile marker. Take the next step.",
            "Then do it again.",
            "Family challenges pulled me away from consistent training again in 2025, but in 2026 I made the decision to return with a renewed sense of purpose.",
            "This time, I am not simply training to see how far I can push myself.",
            "I am training toward a 70.3-mile triathlon in May 2027, with the goal of continuing on to the full-distance IRONMAN level and pursuing opportunities to compete at the highest level I can earn my way into.",
            "More importantly, I want the training, the races, and every difficult mile along the way to serve something larger than my own finish time.",
            "That is what endurance has become for me. Not an escape. Not punishment. A way forward.",
          ],
          image: { src: "/about/jiu-jitsu.jpg", alt: "Cody after a Brazilian Jiu-Jitsu competition" },
        },
        {
          id: "project-echelon",
          heading: "Project Echelon",
          body: [
            "As I began pursuing triathlon, Project Echelon became another piece of this journey.",
            "Project Echelon uses endurance sport, mentorship, structure, and community to help veterans continue moving forward after military service. That mission immediately made sense to me.",
            "There is something powerful about putting veterans back into an environment where there is a mission, a team, accountability, hardship, and a reason to keep showing up.",
            "Training may look very different from military service, but some of the lessons are remarkably similar. You prepare. You suffer together. You hold each other accountable. And you finish what you started.",
          ],
        },
      ],
    },
    {
      id: "why-22",
      navLabel: "Why 22",
      subsections: [
        {
          id: "why-22",
          heading: "Why 22?",
          body: [
            "22 has become a widely recognized symbol of veteran suicide awareness. For The 22 uses that number as a reminder of the veterans still fighting — and the responsibility to keep showing up for them.",
            "That number is symbolic, not presented as a current precise daily statistic. What it represents does not change: there are still veterans out there who need someone to reach them.",
          ],
        },
      ],
    },
    {
      id: "why-black",
      navLabel: "Why Black",
      subsections: [
        {
          id: "why-black",
          heading: "Why We Wear Black",
          body: [
            "Black is the foundation of the For The 22 brand because it represents mourning.",
            "We wear black for the veterans and first responders we have lost to suicide, trauma, injury, and the invisible battles carried long after the uniform comes off.",
            "The black racing uniform is not meant to look tactical. It is meant to be a memorial.",
            "Every race, every mile, and every challenge begins against that black background as a reminder that this mission was born from loss.",
            "The colors surrounding the For The 22 mark represent the communities still standing together. The black beneath them represents those who are no longer here.",
            "For The 22 athletes wear black because we carry their memory with us.",
            "We do not race only for ourselves. We race in mourning. We race in remembrance. And we move forward for those who no longer can.",
          ],
        },
      ],
    },
  ],
};

/** Flat, by-id lookup across every group — used by the homepage and /advocacy. */
export function findAboutSubsection(id: string): AboutSubsection | undefined {
  for (const group of ABOUT_CONTENT.groups) {
    const found = group.subsections.find((s) => s.id === id);
    if (found) return found;
  }
  return undefined;
}

/**
 * The story arc shown as a compact visual timeline near the top of the
 * About page — only accurate, approved dates (see AboutSection above for
 * the full narrative each of these compresses).
 */
export const STORY_TIMELINE = [
  { year: "2011", label: "Afghanistan deployment" },
  { year: "2023", label: "Mighty Oaks retreat & first marathon" },
  { year: "2024", label: "First 100-kilometer ultramarathon" },
  { year: "2026", label: "For The 22 founded" },
  { year: "2027", label: "Tri For The 22 — 70.3-mile triathlon" },
] as const;

/**
 * Re-exported from src/lib/ring-colors.ts, which is the canonical source now
 * that other parts of the site (beyond this About page content module) need
 * the same ring-color data.
 */
export { OUTER_RING_COLORS, INNER_RING_COLORS } from "@/lib/ring-colors";
