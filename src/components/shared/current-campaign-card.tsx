import Image from "next/image";
import { CTAButton } from "@/components/shared/cta-button";
import { ATHLETIC_TEAM_NAME, CAMPAIGN_HOME_LINK, CAMPAIGN_NAME } from "@/lib/constants";

const STATS = [
  { value: "70.3 MI", label: "Race" },
  { value: "$70K", label: "Goal" },
  { value: "2027", label: "Chattanooga" },
] as const;

/**
 * "For The 22 Athletic Team → Current Campaign → Tri For The 22" module —
 * shared between the homepage and /athletes so the campaign hierarchy reads
 * identically everywhere it appears, per the Current Campaign Architecture.
 * Dashboard-style on purpose: photo + stat row + CTA, not just a paragraph.
 */
export function CurrentCampaignCard() {
  return (
    <div className="relative overflow-hidden rounded-sm border border-bronze/30 bg-ink text-off-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-bronze"
      />
      <div className="grid gap-0 lg:grid-cols-[minmax(0,320px)_1fr]">
        <div className="relative aspect-[16/10] w-full lg:aspect-auto">
          <Image src="/about/trail.jpg" alt="Training on the road to 70.3" fill sizes="(min-width: 1024px) 320px, 100vw" className="object-cover" />
        </div>

        <div className="p-8">
          <div className="flex items-center gap-4">
            <Image
              src="/campaign-logo.png"
              alt=""
              aria-hidden="true"
              width={40}
              height={40}
              className="shrink-0"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-bronze-light">
                {ATHLETIC_TEAM_NAME}
              </p>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-off-white/70">
                Current Campaign
              </p>
            </div>
          </div>
          <p className="mt-3 font-display text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
            {CAMPAIGN_NAME}
          </p>
          <p className="mt-2 max-w-lg text-sm text-off-white/75">
            A 70.3-mile triathlon paired with a $70,000 fundraising goal, in support of Mighty
            Oaks Foundation, Project Echelon, and Veterans and Athletes United.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-off-white/15 pt-6 sm:max-w-sm">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-xl font-bold tabular-nums text-bronze-light sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-off-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <CTAButton href={CAMPAIGN_HOME_LINK.href} external className="mt-7">
            Follow the Campaign
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
