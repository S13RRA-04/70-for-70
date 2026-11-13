import type { NavLink } from "@/types/content";

/**
 * The three mission pillars — the single source of truth for how the org
 * site is organized. The header/mobile nav, footer, homepage pillar cards,
 * and the cross-pillar links at the bottom of each hub page all read from
 * ORG_PILLARS, so renaming a pillar or moving a page between pillars is a
 * one-line change here.
 *
 * Page membership mirrors the `pillar` each page already passes to
 * PageHero (src/components/shared/page-hero.tsx) — keep the two in step.
 */
export type MissionPillar = "connection" | "mobilization" | "impact";

/** A page's pillar, or "neutral" for pages outside the three (About, Mission, legal). */
export type Pillar = MissionPillar | "neutral";

export const PILLAR_TEXT: Record<Pillar, string> = {
  connection: "text-help",
  mobilization: "text-olive",
  impact: "text-impact",
  neutral: "text-steel",
};

export const PILLAR_BORDER: Record<Pillar, string> = {
  connection: "border-help",
  mobilization: "border-olive",
  impact: "border-impact",
  neutral: "border-steel",
};

export interface OrgPillar {
  id: MissionPillar;
  number: "01" | "02" | "03";
  /** The pillar's own name — used in eyebrows ("01 · Connection"). */
  title: string;
  /** What a visitor wants from this pillar — used as the nav label. */
  navLabel: string;
  /** One line describing what the visitor finds here. */
  summary: string;
  /** The pillar's hub page; always the first entry in `links`. */
  hub: NavLink;
  links: NavLink[];
}

function pillar(config: Omit<OrgPillar, "links"> & { more: NavLink[] }): OrgPillar {
  const { more, ...rest } = config;
  return { ...rest, links: [rest.hub, ...more] };
}

export const ORG_PILLARS: readonly OrgPillar[] = [
  pillar({
    id: "connection",
    number: "01",
    title: "Connection",
    navLabel: "Find Support",
    summary: "Trusted resources for veterans, first responders, and their families — matched to who you are.",
    hub: { label: "Resource directory", href: "/resources" },
    more: [
      { label: "Crisis support", href: "/crisis" },
      { label: "First responder support", href: "/crisis#first-responders" },
      { label: "Resource standards", href: "/standards" },
    ],
  }),
  pillar({
    id: "mobilization",
    number: "02",
    title: "Mobilization",
    navLabel: "Get Involved",
    summary: "Campaigns, partners, and everyday ways to turn awareness into action.",
    hub: { label: "Campaigns", href: "/campaigns" },
    more: [
      { label: "Network", href: "/network" },
      { label: "Awareness calendar", href: "/awareness" },
      { label: "For The 22 Store", href: "/store" },
      { label: "Shop With Purpose", href: "/veteran-brands" },
    ],
  }),
  pillar({
    id: "impact",
    number: "03",
    title: "Impact",
    navLabel: "See the Impact",
    summary: "Every dollar and participant, tracked against one goal and published with who it reaches.",
    hub: { label: "Impact report", href: "/impact" },
    more: [
      { label: "The $70K Mission", href: "/70k" },
      { label: "Transparency", href: "/transparency" },
    ],
  }),
];

export function getOrgPillar(id: MissionPillar): OrgPillar {
  const found = ORG_PILLARS.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown pillar: ${id}`);
  return found;
}

/** "01 · Connection" — the eyebrow every pillar surface uses. */
export function pillarEyebrow(p: OrgPillar): string {
  return `${p.number} · ${p.title}`;
}

/**
 * Whether `pathname` is at or under `href` — ignores any #fragment on the
 * href, so "/crisis#first-responders" marks /crisis as current.
 */
export function isPathWithin(pathname: string, href: string): boolean {
  const base = href.split("#")[0] || "/";
  if (base === "/") return pathname === "/";
  return pathname === base || pathname.startsWith(`${base}/`);
}

/** The org nav/footer group that sits outside the three pillars. */
export const ORG_ABOUT_LINKS: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Mission", href: "/mission" },
  { label: "Press & Media", href: "/press" },
  { label: "Contact", href: "/contact" },
];
