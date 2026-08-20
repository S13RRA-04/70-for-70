/**
 * Athlete profile copy for the About page. This is Cody's own account —
 * kept as data rather than hard-coded JSX so it can be revised without
 * touching components. `portraitUrl` is unset pending photography — see
 * MediaPlaceholder for how that's handled without a visible TODO label.
 */

export interface AboutSection {
  id: string;
  heading: string;
  body: string[];
  pullQuote?: { text: string; attribution: string };
  image?: { src: string; alt: string };
}

export interface AboutContent {
  name: string;
  tagline: string;
  portraitUrl: string | null;
  /** Condensed 2–3 paragraph version for the homepage "Why I'm Doing This" section. */
  homepageTeaser: string[];
  sections: AboutSection[];
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
  sections: [
    {
      id: "my-story",
      heading: "My Story",
      body: [
        "My name is Cody Hitson. I am a husband, father, Navy veteran, law enforcement professional, and endurance athlete. Over the years, I have worn a lot of different uniforms and carried a lot of different responsibilities, but the part of my story that matters most to Tri For The 22 is not what I have done.",
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
        "That is what endurance has become for me.",
        "Not an escape.",
        "Not punishment.",
        "A way forward.",
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
    {
      id: "the-next-challenge",
      heading: "The Next Challenge",
      body: [
        "My next major goal is completing a 70.3-mile triathlon. That means 1.2 miles swimming, 56 miles cycling, and 13.1 miles running — 70.3 miles total.",
        "But I do not want this race to be only about crossing another finish line. I want those miles to mean something. That is where Tri For The 22 began.",
      ],
    },
    {
      id: "tri-for-the-22",
      heading: "Tri For The 22",
      body: [
        "Tri For The 22 is the first campaign under a larger idea: For The 22. The goal is to create a movement where athletes use endurance challenges to raise money, awareness, and support for veterans and first responders.",
        "The mission is simple: 70 miles. $70,000. One mission for veterans.",
        "My goal is to use the road to 70.3 as a platform to raise $70,000 in support of organizations helping veterans rebuild their lives, rediscover purpose, and find community after service. Every mile represents $1,000 toward that mission.",
        "The swim. The bike. The run. The early mornings. The setbacks. The bad workouts. The breakthroughs. The race itself. All of it becomes part of something larger than me.",
      ],
    },
    {
      id: "why-22",
      heading: "Why 22?",
      body: [
        "22 has become a widely recognized symbol of veteran suicide awareness. For The 22 uses that number as a reminder of the veterans still fighting — and the responsibility to keep showing up for them.",
        "That number is symbolic, not presented as a current precise daily statistic. What it represents does not change: there are still veterans out there who need someone to reach them.",
      ],
    },
    {
      id: "why-im-doing-this",
      heading: "Why I Am Doing This",
      body: [
        "I have benefited from people and organizations willing to invest in veterans. Now I want to return that investment.",
        "There is another veteran somewhere who is trying to figure out what comes next. There is another family trying to understand why the person who came home feels different from the person who left. There is another veteran who needs a mission. Another who needs a team. Another who needs someone to tell them that their best days do not have to be behind them.",
        "I cannot solve all of that. But I can swim 1.2 miles. I can ride 56. I can run 13.1. I can tell my story. I can ask people to join me.",
        "And together, we can turn 70 miles into something that reaches far beyond a finish line.",
      ],
    },
    {
      id: "the-mission",
      heading: "The Mission",
      body: [
        "Tri For The 22 is not about proving how tough I am. I have nothing left to prove in that department.",
        "This is about using the ability I still have, the opportunities I have been given, and the lessons I have learned to help someone else take their next step.",
        "If my story helps one veteran ask for help, it matters. If this campaign helps one family get their husband, wife, father, mother, son, or daughter back, it matters. If these 70 miles help create a new mission for someone who thought theirs was over, every mile will have been worth it.",
        "70 miles. $70,000. One mission for veterans. And one step at a time until we get there.",
      ],
    },
  ],
};
