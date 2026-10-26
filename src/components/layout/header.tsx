"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { CAMPAIGN_URL, CAMPAIGNS, ORG_NAV_LINKS, SITE_NAME } from "@/lib/constants";
import type { CampaignSlug, SiteMode } from "@/lib/site-mode";
import { isNavGroup, type NavGroup } from "@/types/content";
import { cn } from "@/lib/utils";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Container } from "@/components/shared/container";
import { CTAButton } from "@/components/shared/cta-button";
import { BrandStripe } from "@/components/shared/brand-stripe";

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
        "property-nav-shell sticky top-0 z-40 backdrop-blur transition-[background-color,box-shadow] duration-motion-ui ease-system",
        scrolled && "shadow-sm",
      )}
    >
      <Container className="flex h-[74px] items-center justify-between gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src={campaign ? campaign.logoLight : "/logo.png"}
            alt=""
            aria-hidden="true"
            width={campaign?.logoCarriesName ? 60 : 50}
            height={campaign?.logoCarriesName ? 60 : 50}
            className={
              campaign?.logoCarriesName
                ? "h-[52px] w-[52px] object-contain sm:h-[60px] sm:w-[60px]"
                : "h-11 w-11 object-contain sm:h-[50px] sm:w-[50px]"
            }
            priority
          />
          <span
            className={
              campaign?.logoCarriesName
                ? "sr-only"
                : "hidden whitespace-nowrap font-display text-[26px] uppercase leading-none text-jet xs:inline-block"
            }
          >
            {campaign ? campaign.name : SITE_NAME}
            {!isCampaign && <sup className="text-[0.5em] font-medium tracking-normal">™</sup>}
          </span>
        </Link>

        <div className="hidden items-center gap-5 xl:flex 2xl:gap-6">
          {campaign?.parentLink && (
            <a
              href={campaign.parentLink.href}
              className="hidden whitespace-nowrap text-xs font-bold uppercase tracking-[0.14em] text-muted transition-colors hover:text-help min-[1600px]:inline"
            >
              {campaign.parentLink.label} <span aria-hidden="true">&#8599;</span>
            </a>
          )}
          <nav aria-label="Primary" className="flex items-center gap-5 2xl:gap-6">
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

              // The crisis entry gets the reserved help-blue CTA, preceded by
              // the outlined Donate button — see ORG_NAV_LINKS' doc comment
              // in src/lib/constants.ts. Donate is cross-domain (Tri hosts
              // the donation flow), so it's a plain absolute link.
              if (entry.href === "/crisis") {
                return (
                  <div key={entry.href} className="flex items-center gap-2.5">
                  <a
                    href={`${CAMPAIGN_URL}/donate`}
                    className="action-control inline-flex items-center border-2 border-navy bg-white/60 px-5 text-[15px] font-bold text-navy hover:bg-white"
                  >
                    Donate
                  </a>
                  <CTAButton
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
                  </div>
                );
              }

              return (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className={cn(
                    "whitespace-nowrap border-b-2 border-transparent py-3 text-[13px] font-bold uppercase tracking-[0.14em] text-jet transition-colors hover:text-help",
                    pathname === entry.href && "border-navy text-navy",
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
              className="action-control inline-flex items-center whitespace-nowrap bg-help px-5 text-[15px] font-bold text-white hover:bg-help-dark"
            >
              {campaign.crisisLink.label}
            </a>
          )}

          {campaign && (
            <CTAButton href={campaign.primaryCta.href} external={campaign.primaryCta.external} className="whitespace-nowrap">
              {campaign.primaryCta.label}
            </CTAButton>
          )}
        </div>

        <div className="flex items-center gap-1 xl:hidden">
          {!isCampaign && (
            <Link
              href="/resources"
              aria-current={pathname === "/resources" ? "page" : undefined}
              className="rounded-sm px-3 py-2 text-[13px] font-bold uppercase tracking-[0.14em] text-jet"
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
              className="rounded-sm bg-help px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-help-dark"
            >
              Help Now
            </Link>
          ) : (
            campaign?.crisisLink && (
              <a
                href={campaign.crisisLink.href}
                className="rounded-sm bg-help px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-help-dark"
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
      <BrandStripe />

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
          "flex items-center gap-1 whitespace-nowrap border-b-2 border-transparent py-3 text-[13px] font-bold uppercase tracking-[0.14em] text-jet transition-colors hover:text-help",
          (isActive || open) && "border-navy text-navy",
        )}
      >
        {group.label}
        <ChevronDown size={14} aria-hidden className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          id={panelId}
          aria-label={group.label}
          className="absolute left-0 top-full z-50 mt-1 w-60 rounded-xl border border-line bg-white py-2 shadow-[0_12px_32px_rgba(18,30,61,0.10)]"
        >
          {group.children.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={cn(
                "block px-4 py-2.5 text-[15px] font-semibold text-jet transition-colors hover:bg-paper hover:text-help",
                pathname === link.href && "text-navy underline underline-offset-4",
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
