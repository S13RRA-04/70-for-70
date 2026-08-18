"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { DONATE_LINK, NAV_LINKS, SITE_NAME, SPONSOR_LINK } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu on navigation. Adjusted during render (rather than
  // in an effect) per https://react.dev/learn/you-might-not-need-an-effect.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-off-white/95 backdrop-blur supports-[backdrop-filter]:bg-off-white/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="" aria-hidden="true" width={36} height={36} priority />
          <span className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
            {SITE_NAME}
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 lg:flex"
        >
          {NAV_LINKS.map((link) => (
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
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-sm p-2 text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} aria-hidden /> : <Menu size={26} aria-hidden />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-ink/10 bg-off-white lg:hidden"
        >
          <ul className="flex flex-col gap-1 px-4 py-4 sm:px-6">
            {NAV_LINKS.map((link) => (
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
            <li className="pt-2">
              <Link
                href={SPONSOR_LINK.href}
                className="block rounded-sm border border-ink/20 px-3 py-3 text-center text-base font-semibold uppercase tracking-wide text-ink hover:bg-sand-light"
              >
                {SPONSOR_LINK.label}
              </Link>
            </li>
            <li className="pt-2">
              <Link
                href={DONATE_LINK.href}
                className="block rounded-sm bg-bronze px-3 py-3 text-center text-base font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
              >
                {DONATE_LINK.label}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
