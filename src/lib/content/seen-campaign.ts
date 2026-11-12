/**
 * Evergreen "For The 22: SEEN" copy — the concept, how it works, and the
 * ways to take part. No artists, pieces, or exhibitions are listed here
 * yet; the hero wall's numbered frames stay empty ("awaiting its story")
 * until real pieces exist. Add them as real data once they're confirmed
 * rather than writing placeholder names into the page.
 */

export const SEEN_CAMPAIGN_TAGLINE = "Every life has a story worth seeing.";

export const SEEN_CAMPAIGN_DESCRIPTION =
  "For The 22: SEEN is an art initiative making the people behind the uniforms visible — pairing the stories of veterans, first responders, and their families with visual artists, and turning the finished work into support for The $70K Mission.";

export const SEEN_HERO_INTRO =
  "Real stories from veterans, first responders, and their families — interpreted by artists, shown to the world, and turned into support for the people doing the work.";

/** The media line under the hero headline. */
export const SEEN_MEDIA = ["Charcoal", "Paint", "Photography", "Sculpture"] as const;

/** Wall label beside the hero's empty frames. */
export const SEEN_FIRST_WALL_NOTE = "The first pieces are being made now.";

/** "The idea" section. The page appends the link to For The 22: Live after `companion`. */
export const SEEN_CONCEPT = {
  lead: "Not just military-themed artwork.",
  leadEmphasis: "Something more personal.",
  body: "SEEN makes the people behind the uniforms visible — veterans, first responders, their families, and their experiences. Each piece begins with a real story, interpreted by a visual artist in the medium that fits it best.",
  companion: "The artwork becomes a permanent representation of the story. It's the companion to",
  closer: "— the same stories, told in a different medium. Art isn't simply another thing to auction. It's another way to carry the mission.",
} as const;

export interface SeenStep {
  title: string;
  description: string;
}

/** "How it works" — story → artwork → impact. Each step's illustration lives in the page. */
export const SEEN_STEPS: SeenStep[] = [
  {
    title: "A story is shared",
    description:
      "A veteran, first responder, or family member shares whatever part of their story they choose — and only what they're comfortable sharing.",
  },
  {
    title: "An artist interprets it",
    description:
      "A visual artist creates a finished piece in the medium that fits best — charcoal, paint, photography, or sculpture.",
  },
  {
    title: "The piece gives back",
    description: "Exhibitions, auctions, and art sales raise money for the mission's beneficiaries.",
  },
];

export interface SeenPillar {
  name: "Connection" | "Mobilization" | "Impact";
  description: string;
}

/** For The 22's three mission pillars, as they apply to SEEN. Impact's copy names the beneficiaries in the page. */
export const SEEN_PILLARS: SeenPillar[] = [
  {
    name: "Connection",
    description: "Artists and veterans connect through personal stories and creative expression.",
  },
  {
    name: "Mobilization",
    description: "The community takes part through exhibitions, auctions, workshops, and art purchases.",
  },
  {
    name: "Impact",
    description: "Proceeds support the veteran-focused organizations behind The $70K Mission.",
  },
];

/** "Where it goes" flow — same mechanism as LIVE_FUNDS_DISCLOSURE (live-campaign.ts). */
export const SEEN_PROCEEDS = ["Artwork sales", "Auctions", "Exhibition giving"] as const;

export interface SeenJoinPath {
  title: string;
  /** Wall-placard metadata rows, rendered as a <dl>. */
  meta: { for: string; medium: string; begins: string };
  cta: string;
}

/** "Take part" placards. Hrefs are wired in the page (mailto/cross-domain). */
export const SEEN_JOIN_PATHS = {
  storytellers: {
    title: "Share your story",
    meta: {
      for: "Veterans, first responders, and families",
      medium: "Your words — only what you're comfortable sharing",
      begins: "With a conversation, not a form",
    },
    cta: "Start a conversation",
  },
  artists: {
    title: "Create with us",
    meta: {
      for: "Painters, illustrators, photographers, and sculptors",
      medium: "Yours — whatever fits the story",
      begins: "By being paired with a story",
    },
    cta: "Create with us",
  },
  partners: {
    title: "Partner with SEEN",
    meta: {
      for: "Galleries, venues, and sponsors",
      medium: "Host an exhibition or underwrite a piece",
      begins: "With a wall, a room, or a sponsorship",
    },
    cta: "Partner with SEEN",
  },
} satisfies Record<string, SeenJoinPath>;

export interface SeenConsentPromise {
  title: string;
  detail: string;
  /**
   * Only confirmed promises render. These are commitments to the people
   * sharing their stories — flip one to true only once the process
   * actually guarantees it.
   */
  confirmed: boolean;
}

/** "Your story, your terms" — the care-and-consent commitments to storytellers. */
export const SEEN_CONSENT_PROMISES: SeenConsentPromise[] = [
  { title: "You choose what's shared.", detail: "Only the parts you're comfortable with.", confirmed: true },
  { title: "You see it first.", detail: "Review the piece before it's shown.", confirmed: false },
  { title: "Your name, your call.", detail: "Full name, first name only, or anonymous.", confirmed: false },
  { title: "You can step back.", detail: "Withdraw your story before a piece is shown.", confirmed: false },
];
