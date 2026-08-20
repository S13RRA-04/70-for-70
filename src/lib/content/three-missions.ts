/**
 * The canonical CONNECT / ADVOCATE / COMPETE copy — the org's three-pillar
 * mission framing. Shared by the homepage's "Our Three Missions" section and
 * the standalone /mission page so the explanation only exists in one place
 * (see the rebrand brief's instruction not to duplicate the same
 * explanation across pages).
 */
export const THREE_MISSIONS = {
  connect: {
    number: "01" as const,
    title: "Connect",
    description:
      "Connecting veterans and first responders with athletic opportunities, recovery programs, grants, support services, and communities that promote mental, physical, and spiritual wellbeing.",
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
    title: "Compete",
    description: "An athletic team that competes to support the nonprofits serving them.",
    ctaLabel: "Meet the Team →",
    ctaHref: "/athletes",
  },
};
