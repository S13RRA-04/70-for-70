"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  CAMPAIGN_NAME,
  CURRENT_MISSION_NAV_LINK,
  DONATE_LINK,
  GET_INVOLVED_LINK,
  MERCH_LINK,
  ORG_HOME_LINK,
  SPONSOR_LINK,
} from "@/lib/constants";
import type { NavLink } from "@/types/content";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  pathname: string;
  isCampaign: boolean;
  /** The hamburger button that opens this menu — focus returns there on close. */
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

/**
 * A real overlay drawer (not the old push-down inline panel) so the menu
 * reads as a distinct layer above the page, with proper dialog semantics —
 * focus trap, Escape-to-close, and focus return to the trigger button.
 */
export function MobileMenu({ open, onClose, navLinks, pathname, isCampaign, triggerRef }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

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

  return (
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

          {isCampaign ? (
            <ul className="mt-3 flex flex-col gap-2 border-t border-ink/10 pt-3">
              <li>
                <Link
                  href={SPONSOR_LINK.href}
                  className="block rounded-sm border border-ink/20 px-3 py-3 text-center text-base font-semibold uppercase tracking-wide text-ink hover:bg-sand-light"
                >
                  {SPONSOR_LINK.label}
                </Link>
              </li>
              <li>
                <Link
                  href={DONATE_LINK.href}
                  className="block rounded-sm bg-bronze px-3 py-3 text-center text-base font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
                >
                  {DONATE_LINK.label}
                </Link>
              </li>
              <li>
                <a
                  href={ORG_HOME_LINK.href}
                  className="block rounded-sm px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
                >
                  &larr; {ORG_HOME_LINK.label}
                </a>
              </li>
            </ul>
          ) : (
            <>
              <ul className="mt-3 flex flex-col gap-2 border-t border-ink/10 pt-3">
                <li>
                  <Link
                    href={MERCH_LINK.href}
                    className="block rounded-sm border border-ink/20 px-3 py-3 text-center text-base font-semibold uppercase tracking-wide text-ink hover:bg-sand-light"
                  >
                    {MERCH_LINK.label}
                  </Link>
                </li>
                <li>
                  <a
                    href={CURRENT_MISSION_NAV_LINK.href}
                    className="block rounded-sm border border-anchor/20 px-3 py-3 text-center text-base font-semibold uppercase tracking-wide text-anchor hover:bg-anchor/5"
                  >
                    {CURRENT_MISSION_NAV_LINK.label} &mdash; {CAMPAIGN_NAME}
                  </a>
                </li>
                <li>
                  <Link
                    href={GET_INVOLVED_LINK.href}
                    className="block rounded-sm bg-anchor px-3 py-3 text-center text-base font-semibold uppercase tracking-wide text-off-white hover:bg-anchor-light"
                  >
                    {GET_INVOLVED_LINK.label}
                  </Link>
                </li>
              </ul>
              <div className="mt-auto border-t border-ink/10 pt-3">
                <Link
                  href="/crisis"
                  className="block rounded-sm px-3 py-3 text-center text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
                >
                  Need Help Now
                </Link>
              </div>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
