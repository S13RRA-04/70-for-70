"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  CAMPAIGN_HOME_LINK,
  CAMPAIGNS,
  DONATE_LINK,
  FUND_A_MILE_LINK,
  ORG_HOME_LINK,
} from "@/lib/constants";
import type { CampaignSlug } from "@/lib/site-mode";
import type { NavLink } from "@/types/content";
import { cn } from "@/lib/utils";

/** Tri's mobile menu groups — see AGENTS.md's "Mobile navigation" section. Explore omits Shop (grouped under Support instead). */
const TRI_EXPLORE_LINKS: NavLink[] = [
  { label: "Campaign", href: "/the-mission" },
  { label: "Race", href: "/the-race" },
  { label: "Journal", href: "/journal" },
  { label: "Partners", href: "/partners" },
];
const TRI_SUPPORT_LINKS: NavLink[] = [FUND_A_MILE_LINK, DONATE_LINK, { label: "Shop", href: "/shop" }];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  pathname: string;
  /** Which campaign's menu to show — omit/null for the org menu. */
  campaignSlug?: CampaignSlug | null;
  /** The hamburger button that opens this menu — focus returns there on close. */
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

/**
 * A real overlay drawer (not the old push-down inline panel) so the menu
 * reads as a distinct layer above the page, with proper dialog semantics —
 * focus trap, Escape-to-close, and focus return to the trigger button.
 */
export function MobileMenu({ open, onClose, navLinks, pathname, campaignSlug, triggerRef }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const campaign = campaignSlug ? CAMPAIGNS[campaignSlug] : null;

  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    focusable?.[0]?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  // Portaled to document.body — the trigger button lives inside <header>,
  // which has backdrop-blur. backdrop-filter establishes a new containing
  // block for fixed-position descendants (same category as
  // transform/filter/will-change), so without the portal this drawer's
  // "fixed inset-0" was sized against the header's own small bounding box
  // instead of the viewport, rendering as an unusable sliver.
  return createPortal(
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 bg-anchor/60"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-off-white shadow-xl"
      >
        <nav aria-label="Mobile" className="flex flex-1 flex-col px-4 py-4 sm:px-6">
          {campaignSlug === "tri" ? (
            <>
              <MobileNavGroup label="Explore" links={TRI_EXPLORE_LINKS} pathname={pathname} />
              <MobileNavGroup label="Support" links={TRI_SUPPORT_LINKS} pathname={pathname} className="mt-5 border-t border-ink/10 pt-5" />
              <ParentInitiativeGroup />
            </>
          ) : campaignSlug === "ruck" && campaign ? (
            <>
              <MobileNavGroup label="Explore" links={campaign.navLinks} pathname={pathname} />
              <div className="mt-5 border-t border-ink/10 pt-5">
                <a
                  href={campaign.primaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-sm bg-bronze px-3 py-3 text-center text-base font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
                >
                  {campaign.primaryCta.label} <span aria-hidden="true">&#8599;</span>
                </a>
              </div>
              <ParentInitiativeGroup />
            </>
          ) : (
            <>
              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block rounded-sm px-3 py-3 text-base font-medium uppercase tracking-wide text-charcoal hover:bg-sand-light",
                        pathname === link.href && "text-bronze",
                      )}
                      aria-current={pathname === link.href ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-auto border-t border-ink/10 pt-3">
                <Link
                  href="/crisis"
                  className="block rounded-sm bg-anchor px-3 py-3 text-center text-base font-semibold uppercase tracking-wide text-off-white hover:bg-anchor-light"
                >
                  Need Help Now
                </Link>
                <a
                  href={CAMPAIGN_HOME_LINK.href}
                  className="mt-2 block rounded-sm px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
                >
                  {CAMPAIGN_HOME_LINK.label} <span aria-hidden="true">&#8599;</span>
                </a>
              </div>
            </>
          )}
        </nav>
      </div>
    </div>,
    document.body,
  );
}

function ParentInitiativeGroup() {
  return (
    <div className="mt-5 border-t border-ink/10 pt-5">
      <p className="px-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
        Parent Initiative
      </p>
      <a
        href={ORG_HOME_LINK.href}
        className="mt-2 block rounded-sm px-3 py-3 text-base font-medium uppercase tracking-wide text-charcoal hover:bg-sand-light"
      >
        {ORG_HOME_LINK.label} <span aria-hidden="true">&#8599;</span>
      </a>
    </div>
  );
}

function MobileNavGroup({
  label,
  links,
  pathname,
  className,
}: {
  label: string;
  links: NavLink[];
  pathname: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="px-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light">{label}</p>
      <ul className="mt-2 flex flex-col gap-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                "block rounded-sm px-3 py-3 text-base font-medium uppercase tracking-wide text-charcoal hover:bg-sand-light",
                pathname === link.href && "text-bronze",
              )}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
