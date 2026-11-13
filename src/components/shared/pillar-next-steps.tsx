import Link from "next/link";
import { ORG_PILLARS, PILLAR_BORDER, PILLAR_TEXT, pillarEyebrow, type MissionPillar } from "@/lib/pillars";
import { cn } from "@/lib/utils";

/**
 * Closing strip on each pillar hub (/resources, /campaigns, /impact): links
 * to the other two pillars, so a visitor who arrives in one part of the
 * mission can reach the rest without going back to the homepage.
 */
export function PillarNextSteps({ current }: { current: MissionPillar }) {
  const others = ORG_PILLARS.filter((p) => p.id !== current);

  return (
    <nav aria-label="Other parts of the mission" className="border-t border-line">
      <div className="mx-auto grid max-w-[1240px] gap-5 px-6 py-14 sm:py-16 md:grid-cols-2">
        {others.map((pillar) => (
          <Link
            key={pillar.id}
            href={pillar.hub.href}
            className={cn(
              "lift flex flex-col gap-2 rounded-xl border border-line border-t-4 bg-white p-7 text-jet hover:border-navy/40",
              PILLAR_BORDER[pillar.id],
            )}
          >
            <span className={cn("label-caps text-xs", PILLAR_TEXT[pillar.id])}>{pillarEyebrow(pillar)}</span>
            <span className="font-display text-[32px] uppercase leading-none text-navy">{pillar.navLabel}</span>
            <span className="text-base leading-relaxed text-copy">{pillar.summary}</span>
            <span className="mt-1 font-bold text-navy">{pillar.hub.label} →</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
