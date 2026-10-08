import { CampaignProgress } from "@/components/campaign/campaign-progress";
import { MISSION_NAME, MISSION_SUPPORTING_LINE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { AllocationBreakdown } from "@/lib/data/allocation";

/**
 * The shared "$70K Mission" progress display — a thin framing wrapper
 * around CampaignProgress (same bar/stats it has always rendered, reading
 * the same canonical public.campaign totals via getCampaign()/
 * getFundraisingImpactStats()), not a parallel component. Every page that
 * shows the mission total should render this instead of CampaignProgress
 * directly, so the "$70K Mission" name/line stay consistent everywhere —
 * see AGENTS.md's fundraising-architecture plan.
 */
export function MissionProgress({
  totalRaised,
  goal,
  tone,
  breakdown,
  className,
}: {
  totalRaised: number;
  goal: number;
  tone?: "dark";
  breakdown?: AllocationBreakdown | null;
  className?: string;
}) {
  const isDark = tone === "dark";
  return (
    <div className={className}>
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.2em]",
          isDark ? "text-bronze-light" : "text-bronze-text",
        )}
      >
        {MISSION_NAME}
      </p>
      <p className={cn("mt-1 text-sm", isDark ? "text-off-white/75" : "text-charcoal-light")}>
        {MISSION_SUPPORTING_LINE}
      </p>
      <div className="mt-4">
        <CampaignProgress totalRaised={totalRaised} goal={goal} tone={tone} breakdown={breakdown} />
      </div>
    </div>
  );
}
