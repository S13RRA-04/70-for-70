"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type TabId = "completed" | "next";

const TABS: { id: TabId; label: string }[] = [
  { id: "completed", label: "Completed Missions" },
  { id: "next", label: "Next Missions" },
];

/**
 * Completed / Next Missions tabs on the Ruck home page. Both panels are
 * server-rendered into the HTML (inactive one `hidden`), so crawlers and
 * AI answer engines read every mission, not just the default tab. The URL
 * hash (#completed / #next) selects a tab, so header links and shared URLs
 * can deep-link straight to either.
 */
export function MissionTabs({
  completed,
  next,
  counts,
}: {
  completed: ReactNode;
  next: ReactNode;
  counts: Record<TabId, number>;
}) {
  const [active, setActive] = useState<TabId>("completed");

  useEffect(() => {
    function syncFromHash() {
      const hash = window.location.hash.slice(1);
      if (hash === "completed" || hash === "next") setActive(hash);
    }
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  function select(id: TabId) {
    setActive(id);
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <div>
      <div role="tablist" aria-label="Missions" className="flex gap-1 border-b-2 border-ink/10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => select(tab.id)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              const nextTab = TABS[(TABS.findIndex((t) => t.id === tab.id) + 1) % TABS.length];
              select(nextTab.id);
              document.getElementById(`tab-${nextTab.id}`)?.focus();
            }}
            className={cn(
              "-mb-0.5 border-b-2 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] transition-colors",
              active === tab.id
                ? "border-bronze-text text-ink"
                : "border-transparent text-charcoal-light hover:text-ink",
            )}
          >
            {tab.label}
            <span className="ml-2 rounded-full bg-ink/10 px-2 py-0.5 text-xs tabular-nums">{counts[tab.id]}</span>
          </button>
        ))}
      </div>
      {TABS.map((tab) => (
        <div
          key={tab.id}
          id={`panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={active !== tab.id}
          className="pt-8"
        >
          {tab.id === "completed" ? completed : next}
        </div>
      ))}
    </div>
  );
}
