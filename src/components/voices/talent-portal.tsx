import Link from "next/link";
import { Mail } from "lucide-react";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";
import { PORTAL_PATHS, TAGLINE, TALENT_CONTACT, TALENT_INQUIRY_MAILTO } from "@/lib/content/voices-talent";

/**
 * Shared chrome for the /voices/talent portal: a dark, understated editorial
 * look (navy + paper, gold used only as a small highlight on navy, per
 * DESIGN_SYSTEM.md). Deliberately free of fundraising CTAs — the header's
 * Donate button and the mobile conversion bar are hidden on these routes too.
 */

const NAV = [
  { href: PORTAL_PATHS.talent, label: "Overview" },
  { href: PORTAL_PATHS.recordingGuide, label: "Recording guide" },
  { href: PORTAL_PATHS.submit, label: "Submit" },
  { href: PORTAL_PATHS.permissions, label: "Permissions" },
] as const;

export type PortalPage = (typeof NAV)[number]["href"];

export function TalentPortalNav({ current }: { current: PortalPage }) {
  return (
    <nav aria-label="Talent portal" className="border-b border-white/10 bg-jet text-white">
      <Container className="flex items-center gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
        <span className="mr-3 hidden shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/50 sm:inline">
          Talent portal
        </span>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.href === current ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-sm px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
              item.href === current ? "bg-white/10 text-white" : "text-white/70 hover:text-white",
            )}
          >
            {item.label}
          </Link>
        ))}
        <a
          href={TALENT_INQUIRY_MAILTO}
          className="ml-auto hidden shrink-0 items-center gap-2 rounded-sm px-3 py-2 text-sm font-semibold text-gold hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:inline-flex"
        >
          <Mail size={16} aria-hidden="true" />
          {TALENT_CONTACT.email}
        </a>
      </Container>
    </nav>
  );
}

/** Dark page opener for the portal's subpages. The overview page has its own, larger hero. */
export function TalentPageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-navy text-white">
      <Container className="max-w-5xl py-16 sm:py-24">
        <p className="label-caps text-gold">{eyebrow}</p>
        <h1 className="mt-4 text-balance font-display text-[clamp(44px,6vw,84px)] uppercase leading-[0.95]">{title}</h1>
        {children && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">{children}</div>}
      </Container>
    </section>
  );
}

/** Closing band on every portal page: the founder's contact, always visible. */
export function TalentContactBand() {
  return (
    <section className="bg-jet text-white" aria-labelledby="talent-contact-heading">
      <Container className="grid max-w-5xl gap-10 py-16 sm:py-20 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <p className="label-caps text-gold">Talent &amp; media inquiries</p>
          <h2 id="talent-contact-heading" className="mt-3 font-display text-4xl uppercase leading-none sm:text-5xl">
            Questions? Talk to our founder directly.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
            Representatives, publicists and managers are welcome to reach out before committing to anything.
          </p>
        </div>
        <address className="not-italic">
          <p className="text-lg font-bold">{TALENT_CONTACT.name}</p>
          <p className="text-white/70">{TALENT_CONTACT.title}</p>
          <a
            href={TALENT_INQUIRY_MAILTO}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-sm bg-white px-5 font-bold text-navy hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <Mail size={18} aria-hidden="true" />
            {TALENT_CONTACT.email}
          </a>
          <p className="mt-3">
            <a href={TALENT_CONTACT.website} className="text-sm text-white/70 underline underline-offset-4 hover:text-white">
              forthe22.org
            </a>
          </p>
        </address>
      </Container>
      <Container className="max-w-5xl border-t border-white/10 py-6">
        <p className="font-display text-2xl uppercase tracking-wide text-white/90">{TAGLINE}</p>
      </Container>
    </section>
  );
}

/** Small dark/light "eyebrow + heading" pair used down the portal pages. */
export function PortalSectionHeading({
  eyebrow,
  title,
  id,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  id?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div>
      <p className={cn("label-caps", tone === "dark" ? "text-gold" : "text-steel")}>{eyebrow}</p>
      <h2
        id={id}
        className={cn(
          "mt-3 text-balance font-display text-4xl uppercase leading-none sm:text-5xl",
          tone === "dark" ? "text-white" : "text-navy",
        )}
      >
        {title}
      </h2>
    </div>
  );
}

/** Bulleted list with a thin rule marker — the portal's list style. */
export function RuleList({ items, tone = "light" }: { items: readonly string[]; tone?: "light" | "dark" }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className={cn("flex gap-4 text-base leading-relaxed sm:text-lg", tone === "dark" ? "text-white/85" : "text-copy")}>
          <span aria-hidden="true" className={cn("mt-[0.8em] h-px w-5 shrink-0", tone === "dark" ? "bg-gold" : "bg-navy")} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
