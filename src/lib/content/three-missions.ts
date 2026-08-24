import { CAMPAIGN_URL } from "@/lib/constants";

/**
 * The canonical CONNECT / ADVOCATE / ENDURE copy — the three-pillar mission
 * framing. Shared by the homepage's "Our Three Missions" section and the
 * standalone /mission page so the explanation only exists in one place.
 *
 * The "compete" key name is kept as-is (internal identifier only, never
 * rendered) even though the pillar now reads "Endure" — this avoids
 * renaming it across every call site for a change that's purely cosmetic
 * at the type level.
 */
export const THREE_MISSIONS = {
  connect: {
    number: "01" as const,
    title: "Connect",
    description:
      "Helping veterans and first responders find established programs, services, and communities that promote mental, physical, and spiritual wellbeing.",
    ctaLabel: "Find Resources →",
    ctaHref: "/resources",
  },
  advocate: {
    number: "02" as const,
    title: "Advocate",
    description: "Raising awareness of the challenges carried by those who serve.",
    ctaLabel: "Why It Matters →",
    ctaHref: "/advocacy",
  },
  compete: {
    number: "03" as const,
    title: "Endure",
    description:
      "Using a personal endurance challenge to encourage direct support for independent nonprofit organizations.",
    ctaLabel: "Follow the Campaign →",
    ctaHref: CAMPAIGN_URL,
    ctaExternal: true,
  },
};
