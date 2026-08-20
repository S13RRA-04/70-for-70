"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

interface SubnavItem {
  id: string;
  label: string;
}

/**
 * Sticky horizontal pill sub-nav for long single-page layouts (About) —
 * highlights the section currently in view via IntersectionObserver, same
 * scroll-spy approach as ScrollProgressRail (that one's a side rail for the
 * homepage; this is a distinct horizontal-pill treatment on purpose, per
 * the "no two adjacent-feeling surfaces should look like the same
 * component" rule).
 */
export function SectionSubnav({ items }: { items: SubnavItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav
      aria-label="Page sections"
      className="sticky top-16 z-30 border-y border-ink/10 bg-off-white/95 backdrop-blur"
    >
      <Container>
        <div className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={activeId === item.id ? "true" : undefined}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                activeId === item.id
                  ? "border-bronze bg-bronze text-off-white"
                  : "border-ink/15 text-charcoal-light hover:border-bronze/40 hover:text-ink",
              )}
            >
              {item.label}
            </a>
          ))}
        </div>
      </Container>
    </nav>
  );
}
