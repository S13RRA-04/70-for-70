"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CAMPAIGN_HOME_LINK, CAMPAIGNS } from "@/lib/constants";
import type { CampaignSlug } from "@/lib/site-mode";
import { isNavGroup, type NavEntry, type NavLink } from "@/types/content";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  navLinks: NavEntry[];
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

  // Mount-then-animate / delay-unmount so the drawer can slide in and out
  // instead of popping. `rendered` controls whether the portal exists at
  // all; `visible` controls the transitioned classes. Mirroring `open` into
  // these synchronously during render (not inside an effect) is the pattern
  // this codebase already uses for this exact kind of derived state — see
  // Header's pathname-change handling just below. Only the genuinely
  // deferred parts (the next-frame flip to `visible`, and the delayed
  // unmount) belong in an effect.
  const [rendered, setRendered] = useState(open);
  const [visible, setVisible] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setRendered(true);
    } else {
      setVisible(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  useEffect(() => {
    if (open) return;
    const timeout = setTimeout(() => setRendered(false), 300);
    return () => clearTimeout(timeout);
  }, [open]);

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

  if (!rendered) return null;

  // Portaled to document.body — the trigger button lives inside <header>,
  // which has backdrop-blur. backdrop-filter establishes a new containing
  // block for fixed-position descendants (same category as
  // transform/filter/will-change), so without the portal this drawer's
  // "fixed inset-0" was sized against the header's own small bounding box
  // instead of the viewport, rendering as an unusable sliver.
  return createPortal(
    <div className="fixed inset-0 z-50 xl:hidden">
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        className={cn(
          "absolute inset-0 bg-anchor/60 transition-opacity duration-300 ease-out",
          visible ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        id="mobile-nav-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-off-white shadow-xl transition-transform duration-300 ease-out",
          visible ? "translate-x-0" : "translate-x-full",
        )}
      >
        <nav aria-label="Mobile" className="flex flex-1 flex-col px-4 py-4 sm:px-6">
          {campaignSlug === "tri" && campaign ? (
            <>
              {campaign.navLinks.filter(isNavGroup).map((group, i) => (
                <MobileNavGroup
                  key={group.label}
                  label={group.label}
                  links={group.children}
                  pathname={pathname}
                  className={i > 0 ? "mt-5 border-t border-ink/10 pt-5" : undefined}
                />
              ))}
              <div className="mt-5 flex flex-col gap-1 border-t border-ink/10 pt-5">
                {campaign.navLinks
                  .filter((entry): entry is NavLink => !isNavGroup(entry))
                  .map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "block rounded-sm px-3 py-3 text-base font-medium uppercase tracking-wide text-charcoal hover:bg-sand-light",
                        pathname === link.href && "text-bronze",
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                <a
                  href={campaign.primaryCta.href}
                  {...(campaign.primaryCta.external && { target: "_blank", rel: "noopener noreferrer" })}
                  className="mt-2 block rounded-sm bg-bronze-text px-3 py-3 text-center text-base font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-dark"
                >
                  {campaign.primaryCta.label}
                </a>
              </div>
              {campaign.parentLink && <ParentInitiativeGroup link={campaign.parentLink} />}
            </>
          ) : (campaignSlug === "ruck" || campaignSlug === "22") && campaign ? (
            <>
              <MobileNavGroup
                label="Explore"
                links={campaign.navLinks.filter((entry): entry is NavLink => !isNavGroup(entry))}
                pathname={pathname}
              />
              <div className="mt-5 border-t border-ink/10 pt-5">
                <a
                  href={campaign.primaryCta.href}
                  {...(campaign.primaryCta.external && { target: "_blank", rel: "noopener noreferrer" })}
                  className="block rounded-sm bg-bronze-text px-3 py-3 text-center text-base font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-dark"
                >
                  {campaign.primaryCta.label}
                  {campaign.primaryCta.external && <span aria-hidden="true"> &#8599;</span>}
                </a>
              </div>
              {campaign.parentLink && <ParentInitiativeGroup link={campaign.parentLink} />}
            </>
          ) : (
            <>
              <ul className="flex flex-col gap-1">
                {navLinks
                  .filter((entry): entry is NavLink => !isNavGroup(entry))
                  // "/resources" and "/crisis" get dedicated CTA treatment
                  // below instead of a plain row, matching the desktop header
                  // — otherwise both would render twice.
                  .filter((link) => link.href !== "/resources" && link.href !== "/crisis")
                  .map((link) => (
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
              {navLinks.filter(isNavGroup).map((group) => (
                <MobileNavGroup
                  key={group.label}
                  label={group.label}
                  links={group.children}
                  pathname={pathname}
                  className="mt-5 border-t border-ink/10 pt-5"
                />
              ))}
              <div className="mt-auto flex flex-col gap-2 border-t border-ink/10 pt-3">
                <Link
                  href="/resources"
                  className="block rounded-sm bg-bronze-text px-3 py-3 text-center text-base font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-dark"
                >
                  Find Resources
                </Link>
                <Link
                  href="/crisis"
                  className="block rounded-sm bg-signal px-3 py-3 text-center text-base font-semibold uppercase tracking-wide text-off-white hover:bg-signal-dark"
                >
                  Need Help Now
                </Link>
                <a
                  href={CAMPAIGN_HOME_LINK.href}
                  className="mt-1 block rounded-sm px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
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

function ParentInitiativeGroup({ link }: { link: NavLink }) {
  return (
    <div className="mt-5 border-t border-ink/10 pt-5">
      <p className="px-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
        Parent Initiative
      </p>
      <a
        href={link.href}
        className="mt-2 block rounded-sm px-3 py-3 text-base font-medium uppercase tracking-wide text-charcoal hover:bg-sand-light"
      >
        {link.label} <span aria-hidden="true">&#8599;</span>
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
