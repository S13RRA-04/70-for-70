"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { AboutChapter } from "@/lib/content/about";

/**
 * Chapter wayfinding for the About page's editorial arc. One component,
 * two renders, single IntersectionObserver — same split as
 * ScrollProgressRail (homepage): a left-docked sticky rail on desktop
 * (ScrollProgressRail docks right, so the two never collide), and a compact
 * "0X / 06 — Label" bar on mobile sticky just below the header, replacing
 * SectionSubnav's horizontal-pill treatment for this page specifically.
 *
 * The desktop rail hides itself over any element marked `data-rail-quiet`
 * (the Why 22 / Why Black memorial beats) — those are deliberately spare,
 * full-bleed moments, and the fixed rail's text was ghosting over the black
 * background there.
 */
export function ChapterRail({ chapters }: { chapters: AboutChapter[] }) {
  const [activeId, setActiveId] = useState(chapters[0]?.id);
  const [quiet, setQuiet] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    const elements = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);
    elements.forEach((el) => observer.observe(el));

    const quietElements = new Set<Element>();
    const quietObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) quietElements.add(entry.target);
          else quietElements.delete(entry.target);
        }
        setQuiet(quietElements.size > 0);
      },
      { rootMargin: "-20% 0px -20% 0px" },
    );
    document.querySelectorAll("[data-rail-quiet]").forEach((el) => quietObserver.observe(el));

    return () => {
      observer.disconnect();
      quietObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeIndex = Math.max(0, chapters.findIndex((c) => c.id === activeId));
  const active = chapters[activeIndex];

  return (
    <>
      <nav
        aria-label="Chapters"
        className={cn(
          "fixed left-6 top-1/2 z-20 hidden -translate-y-1/2 transition-opacity duration-300 xl:block",
          quiet ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <ul className="space-y-4 border-l border-ink/15 pl-4">
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                aria-current={activeId === chapter.id ? "true" : undefined}
                className={cn(
                  "flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest transition-colors",
                  activeId === chapter.id ? "text-bronze" : "text-charcoal-light/50 hover:text-charcoal-light",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    activeId === chapter.id ? "bg-bronze" : "bg-charcoal-light/30",
                  )}
                />
                {chapter.number} {chapter.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {active && (
        <div
          aria-hidden="true"
          className="sticky top-16 z-30 border-y border-ink/10 bg-off-white/95 py-2.5 text-center backdrop-blur xl:hidden"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-light">
            {String(activeIndex + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
            <span className="text-bronze"> — {active.label}</span>
          </span>
        </div>
      )}
    </>
  );
}
