"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { CAMPAIGNS, ORG_NAV_LINKS, SITE_NAME } from "@/lib/constants";
import type { CampaignSlug, SiteMode } from "@/lib/site-mode";
import { cn } from "@/lib/utils";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Container } from "@/components/shared/container";

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

  // Close the mobile menu on navigation. Adjusted during render (rather than
  // in an effect) per https://react.dev/learn/you-might-not-need-an-effect.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  const navLinks = campaign ? campaign.navLinks : ORG_NAV_LINKS;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-off-white/95 backdrop-blur supports-[backdrop-filter]:bg-off-white/80">
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap border-b-2 border-transparent pb-0.5 text-sm font-medium uppercase tracking-wide text-charcoal transition-colors hover:text-bronze",
                  pathname === link.href && "border-bronze text-bronze",
                )}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
                {awarenessMonth && link.href === "/crisis" && (
                  <span
                    aria-hidden="true"
                    className="ml-1.5 inline-block h-2 w-2 rounded-full align-middle"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-awareness-teal), var(--color-awareness-purple))",
                    }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {campaign && (
            <a
              href={campaign.primaryCta.href}
              {...(campaign.primaryCta.external && { target: "_blank", rel: "noopener noreferrer" })}
              className="rounded-sm bg-bronze px-5 py-2 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
            >
              {campaign.primaryCta.label}
            </a>
          )}
        </div>

        <div className="flex items-center gap-1 xl:hidden">
          {!isCampaign && (
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
