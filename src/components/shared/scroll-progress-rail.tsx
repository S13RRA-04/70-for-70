"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RailSection {
  id: string;
  label: string;
}

/**
 * Scroll wayfinding for long single-page layouts (the homepage). Desktop
 * gets a side rail listing major sections, highlighting the one in view.
 * Mobile gets a slim fixed top progress bar instead — full section labels
 * don't fit, and a reading-progress bar is the lighter-weight equivalent.
 * Not global chrome — mount this only on pages long/section-heavy enough
 * to need it.
 */
export function ScrollProgressRail({ sections }: { sections: RailSection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    elements.forEach((el) => observer.observe(el));

    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-30 h-0.5 bg-transparent xl:hidden"
      >
        <div
          className="h-full bg-bronze transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <nav
        aria-label="Page sections"
        className="fixed right-6 top-1/2 z-20 hidden -translate-y-1/2 xl:block"
      >
        <ul className="space-y-4 border-l border-ink/15 pl-4">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={cn(
                  "flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest transition-colors",
                  activeId === s.id ? "text-bronze" : "text-charcoal-light/50 hover:text-charcoal-light",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    activeId === s.id ? "bg-bronze" : "bg-charcoal-light/30",
                  )}
                />
                {String(i + 1).padStart(2, "0")} {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
