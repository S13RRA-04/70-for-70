"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { CAMPAIGNS, ORG_NAV_LINKS, SITE_NAME } from "@/lib/constants";
import type { CampaignSlug, SiteMode } from "@/lib/site-mode";
import { isNavGroup, type NavGroup } from "@/types/content";
import { cn } from "@/lib/utils";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Container } from "@/components/shared/container";
import { CTAButton } from "@/components/shared/cta-button";

export function Header({
  mode,
  campaignSlug,
  awarenessMonth = false,
}: {
  mode: SiteMode;
  /** Which campaign's branding to show — required whenever mode is "campaign", see src/lib/constants.ts's CAMPAIGNS. */
  campaignSlug?: CampaignSlug | null;
  awarenessMonth?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isCampaign = mode === "campaign";
  const campaign = campaignSlug ? CAMPAIGNS[campaignSlug] : null;
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  // Which desktop nav dropdown is open, if any — lifted up here (rather than
  // each NavDropdown owning its own open state) so opening one closes any
  // other that was already open, instead of letting two stay open at once.
  const [openGroupLabel, setOpenGroupLabel] = useState<string | null>(null);

  // Close the mobile menu on navigation. Adjusted during render (rather than
  // in an effect) per https://react.dev/learn/you-might-not-need-an-effect.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Picks up a shadow and a more opaque background once the page has
  // scrolled past the hero — the sticky header was otherwise visually
  // identical at scroll position 0 and 10,000px. A real scroll listener
  // (not an IntersectionObserver) since there's no single sentinel element
  // this needs to track — just "has the user scrolled at all."
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = campaign ? campaign.navLinks : ORG_NAV_LINKS;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-ink/10 backdrop-blur transition-[background-color,box-shadow] duration-300",
        scrolled ? "bg-off-white/95 shadow-sm supports-[backdrop-filter]:bg-off-white/80" : "bg-off-white/70",
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src={campaign ? campaign.logoLight : "/logo.png"}
            alt=""
            aria-hidden="true"
            width={36}
            height={36}
            priority
          />
          <span className="whitespace-nowrap font-display text-xl font-semibold uppercase tracking-wide text-ink">
            {campaign ? campaign.name : SITE_NAME}
            {!isCampaign && <sup className="text-[0.5em] font-medium tracking-normal">™</sup>}
          </span>
        </Link>

        <div className="hidden items-center gap-6 xl:flex">
          {campaign?.parentLink && (
            <a
              href={campaign.parentLink.href}
              className="whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-charcoal-light transition-colors hover:text-ink"
            >
              {campaign.parentLink.label} <span aria-hidden="true">&#8599;</span>
            </a>
          )}
          <nav aria-label="Primary" className="flex items-center gap-6">
            {navLinks.map((entry) => {
              if (isNavGroup(entry)) {
                return (
                  <NavDropdown
                    key={entry.label}
                    group={entry}
                    pathname={pathname}
                    open={openGroupLabel === entry.label}
                    onOpenChange={(next) => setOpenGroupLabel(next ? entry.label : null)}
                  />
                );
              }

              // The two highest-intent org-nav actions get CTA treatment
              // instead of a plain link, so they stand apart from the
              // informational items between them — see ORG_NAV_LINKS' doc
              // comment in src/lib/constants.ts.
              if (entry.href === "/resources") {
                return (
                  <CTAButton
                    key={entry.href}
                    href={entry.href}
                    size="md"
                    aria-current={pathname === entry.href ? "page" : undefined}
                  >
                    {entry.label}
                  </CTAButton>
                );
              }
              if (entry.href === "/crisis") {
                return (
                  <CTAButton
                    key={entry.href}
                    href={entry.href}
                    accent="emergency"
                    size="md"
                    aria-current={pathname === entry.href ? "page" : undefined}
                  >
                    {entry.label}
                    {awarenessMonth && (
                      <span
                        aria-hidden="true"
                        className="ml-1.5 inline-block h-2 w-2 rounded-full align-middle"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--color-awareness-teal), var(--color-awareness-purple))",
                        }}
                      />
                    )}
                  </CTAButton>
                );
              }

              return (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className={cn(
                    "whitespace-nowrap border-b-2 border-transparent pb-0.5 text-sm font-medium uppercase tracking-wide text-charcoal transition-colors hover:text-bronze",
                    pathname === entry.href && "border-bronze text-bronze",
                  )}
                  aria-current={pathname === entry.href ? "page" : undefined}
                >
                  {entry.label}
                </Link>
              );
            })}
          </nav>

          {campaign?.crisisLink && (
            <a
              href={campaign.crisisLink.href}
              className="rounded-sm bg-signal px-5 py-2 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-signal-dark"
            >
              {campaign.crisisLink.label}
            </a>
          )}

          {campaign && (
            <a
              href={campaign.primaryCta.href}
              {...(campaign.primaryCta.external && { target: "_blank", rel: "noopener noreferrer" })}
              className="rounded-sm bg-bronze-text px-5 py-2 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-dark"
            >
              {campaign.primaryCta.label}
            </a>
          )}
        </div>

        <div className="flex items-center gap-1 xl:hidden">
          {!isCampaign && (
            <Link
              href="/resources"
              aria-current={pathname === "/resources" ? "page" : undefined}
              className="rounded-sm px-3 py-2 text-sm font-semibold uppercase tracking-wide text-ink"
            >
              Resources
            </Link>
          )}
          {/* Mobile-collapsed header previously gave "Find Resources" a
              1-tap shortcut here but made "Need Help Now" wait behind the
              hamburger — backwards for the more time-critical of the two.
              Compact label + signal fill keeps it unmistakable even at this
              size. On campaign hosts, crisisLink's absolute SITE_URL href
              carries it across to the org domain. */}
          {!isCampaign ? (
            <Link
              href="/crisis"
              aria-current={pathname === "/crisis" ? "page" : undefined}
              className="rounded-sm bg-signal px-3 py-2 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-signal-dark"
            >
              Help Now
            </Link>
          ) : (
            campaign?.crisisLink && (
              <a
                href={campaign.crisisLink.href}
                className="rounded-sm bg-signal px-3 py-2 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-signal-dark"
              >
                Help Now
              </a>
            )
          )}
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex items-center justify-center rounded-sm p-2 text-ink"
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={26} aria-hidden /> : <Menu size={26} aria-hidden />}
          </button>
        </div>
      </Container>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        navLinks={navLinks}
        pathname={pathname}
        campaignSlug={campaignSlug}
        triggerRef={menuButtonRef}
      />
    </header>
  );
}

/**
 * A desktop nav dropdown — button + panel disclosure (not a full ARIA menu;
 * each item is a plain link, so this only needs disclosure semantics).
 * Closes on Escape, outside click, and navigation (the parent Header's
 * pathname-change effect unmounts/remounts nothing here, so this tracks
 * pathname itself to close on route change). `open`/`onOpenChange` are
 * controlled by Header so opening one dropdown closes any sibling that was
 * already open, rather than each managing independent state.
 */
function NavDropdown({
  group,
  pathname,
  open,
  onOpenChange,
}: {
  group: NavGroup;
  pathname: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const isActive = group.children.some((link) => pathname === link.href);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Close on route change.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (open) onOpenChange(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
        className={cn(
          "flex items-center gap-1 whitespace-nowrap border-b-2 border-transparent pb-0.5 text-sm font-medium uppercase tracking-wide text-charcoal transition-colors hover:text-bronze",
          (isActive || open) && "border-bronze text-bronze",
        )}
      >
        {group.label}
        <ChevronDown size={14} aria-hidden className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          id={panelId}
          aria-label={group.label}
          className="absolute left-0 top-full z-50 mt-3 w-56 rounded-sm border border-ink/10 bg-off-white py-2 shadow-lg"
        >
          {group.children.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={cn(
                "block px-4 py-2 text-sm font-medium uppercase tracking-wide text-charcoal transition-colors hover:bg-sand-light hover:text-bronze",
                pathname === link.href && "text-bronze",
              )}
              onClick={() => onOpenChange(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
