"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import {
  CAMPAIGN_NAME,
  CAMPAIGN_NAV_LINKS,
  DONATE_LINK,
  GET_INVOLVED_LINK,
  MERCH_LINK,
  ORG_NAV_LINKS,
  SITE_NAME,
  SPONSOR_LINK,
} from "@/lib/constants";
import type { SiteMode } from "@/lib/site-mode";
import { cn } from "@/lib/utils";
import { CTAButton } from "@/components/shared/cta-button";
import { MobileMenu } from "@/components/layout/mobile-menu";

export function Header({ mode }: { mode: SiteMode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isCampaign = mode === "campaign";
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu on navigation. Adjusted during render (rather than
  // in an effect) per https://react.dev/learn/you-might-not-need-an-effect.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  const navLinks = isCampaign ? CAMPAIGN_NAV_LINKS : ORG_NAV_LINKS;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-off-white/95 backdrop-blur supports-[backdrop-filter]:bg-off-white/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src={isCampaign ? "/campaign-logo.png" : "/logo.png"}
            alt=""
            aria-hidden="true"
            width={36}
            height={36}
            priority
          />
          <span className="flex flex-col leading-none">
            {isCampaign && (
              <span className="text-[10px] font-semibold uppercase tracking-widest text-charcoal-light">
                {SITE_NAME}
              </span>
            )}
            <span className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              {isCampaign ? CAMPAIGN_NAME : SITE_NAME}
              {!isCampaign && <sup className="text-[0.5em] font-medium tracking-normal">™</sup>}
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium uppercase tracking-wide text-charcoal transition-colors hover:text-bronze",
                pathname === link.href && "text-bronze",
              )}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}

          {isCampaign ? (
            <>
              <Link
                href={SPONSOR_LINK.href}
                className="rounded-sm border border-ink/20 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-ink/5"
              >
                {SPONSOR_LINK.label}
              </Link>
              <Link
                href={DONATE_LINK.href}
                className="rounded-sm bg-bronze px-5 py-2 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
              >
                {DONATE_LINK.label}
              </Link>
            </>
          ) : (
            <>
              <CTAButton href={MERCH_LINK.href} variant="secondary" size="md">
                {MERCH_LINK.label}
              </CTAButton>
              <CTAButton href={GET_INVOLVED_LINK.href} variant="primary" accent="black" size="md">
                {GET_INVOLVED_LINK.label}
              </CTAButton>
            </>
          )}
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          {isCampaign ? (
            <Link
              href={DONATE_LINK.href}
              className="rounded-sm bg-bronze px-3 py-2 text-sm font-semibold uppercase tracking-wide text-off-white"
            >
              {DONATE_LINK.label}
            </Link>
          ) : (
            <Link
              href="/resources"
              className="rounded-sm px-3 py-2 text-sm font-semibold uppercase tracking-wide text-ink"
            >
              Resources
            </Link>
          )}
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex items-center justify-center rounded-sm p-2 text-ink"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={26} aria-hidden /> : <Menu size={26} aria-hidden />}
          </button>
        </div>
      </div>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        navLinks={navLinks}
        pathname={pathname}
        isCampaign={isCampaign}
        triggerRef={menuButtonRef}
      />
    </header>
  );
}
