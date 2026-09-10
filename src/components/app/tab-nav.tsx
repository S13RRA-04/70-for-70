"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, BarChart3, Share2, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/app/home", label: "Home", icon: Home },
  { href: "/app/challenges", label: "Challenges", icon: Trophy },
  { href: "/app/progress", label: "Progress", icon: BarChart3 },
  { href: "/app/share", label: "Share", icon: Share2 },
  { href: "/app/profile", label: "Profile", icon: User },
] as const;

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Bottom nav on mobile, a simple top nav row on desktop — same five destinations either way. */
export function TabNav() {
  const pathname = usePathname();

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-off-white/95 backdrop-blur supports-[backdrop-filter]:bg-off-white/80 sm:hidden"
      >
        <div className="grid grid-cols-5">
          {TABS.map((tab) => {
            const active = isActive(pathname, tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[56px] flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide",
                  active ? "text-bronze" : "text-charcoal-light",
                )}
              >
                <Icon size={20} aria-hidden />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <nav aria-label="Primary" className="sticky top-0 z-40 hidden border-b border-ink/10 bg-off-white sm:block">
        <div className="mx-auto flex max-w-3xl items-center gap-1 px-4">
          {TABS.map((tab) => {
            const active = isActive(pathname, tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-4 py-3.5 text-sm font-semibold uppercase tracking-wide transition-colors",
                  active ? "border-bronze text-ink" : "border-transparent text-charcoal-light hover:text-ink",
                )}
              >
                <Icon size={16} aria-hidden />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
