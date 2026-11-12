/**
 * Evergreen "For The 22: SEEN" copy — the concept, how it works, and the
 * ways to take part. No artists, pieces, or exhibitions are listed here
 * yet; add them as real data once they're confirmed rather than writing
 * placeholder names into the page.
 */

export const SEEN_CAMPAIGN_TAGLINE = "Every life has a story worth seeing.";

export const SEEN_CAMPAIGN_DESCRIPTION =
  "For The 22: SEEN is an art initiative making the people behind the uniforms visible — pairing the stories of veterans, first responders, and their families with visual artists, and turning the finished work into support for The $70K Mission.";

/** The media line under the hero headline. */
export const SEEN_MEDIA = ["Charcoal", "Paint", "Photography", "Sculpture"] as const;

/** "The idea" section — the concept statement, in order. */
export const SEEN_CONCEPT = {
  lead: "Not just military-themed artwork. Something more personal.",
  paragraphs: [
    "SEEN makes the people behind the uniforms visible — veterans, first responders, their families, and the experiences they carry.",
    "Each piece starts with a real story. A visual artist interprets it through charcoal, paint, photography, sculpture, or another medium of their choosing.",
  ],
  closer: "The artwork becomes a permanent representation of the story. The story gives the artwork meaning.",
} as const;

export interface SeenStep {
  title: string;
  description: string;
}

/** "How it works" — story → artwork → impact. */
export const SEEN_STEPS: SeenStep[] = [
  {
    title: "A story is shared",
    description:
      "A veteran, first responder, or family member shares the part of their story they choose to — nothing more.",
  },
  {
    title: "An artist interprets it",
    description: "A visual artist turns that story into a finished piece, in whatever medium fits it best.",
  },
  {
    title: "The piece gives back",
    description:
      "Through exhibitions, auctions, and art sales, the finished work raises money for the mission's beneficiaries.",
  },
];

export interface SeenPillar {
  name: string;
  description: string;
}

/** For The 22's three mission pillars, as they apply to SEEN. */
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

/**
 * Same mechanism as LIVE_FUNDS_DISCLOSURE (live-campaign.ts) — every
 * For The 22 campaign's proceeds follow one path.
 */
export const SEEN_FUNDS_DISCLOSURE =
  "For The 22 is the initial recipient of proceeds from For The 22: SEEN — artwork sales, auctions, and exhibition giving alike. Those proceeds are then distributed evenly across the mission's beneficiary organizations.";

export interface SeenJoinPath {
  title: string;
  description: string;
  cta: string;
}

/** "Take part" cards. Hrefs are wired in the page (mailto/cross-domain). */
export const SEEN_JOIN_PATHS = {
  storytellers: {
    title: "Share your story",
    description:
      "Veterans, first responders, and families: share only what you're comfortable sharing, and let an artist help it be seen.",
    cta: "Start a conversation",
  },
  artists: {
    title: "Artists",
    description: "Painters, illustrators, photographers, sculptors — lend your craft to a story that deserves to last.",
    cta: "Create with us",
  },
  hosts: {
    title: "Galleries & sponsors",
    description: "Host an exhibition, underwrite a piece, or put your name behind the work and the people in it.",
    cta: "Partner with SEEN",
  },
} satisfies Record<string, SeenJoinPath>;
