import { Backpack, Bike, Footprints, Music } from "lucide-react";
import { CTAButton } from "@/components/shared/cta-button";
import { CAMPAIGN_STATUS_LABELS, MISSION_NAME } from "@/lib/constants";
import type { MovementCampaign } from "@/types/organization";

/**
 * One icon per campaign type, keyed by slug — the cards otherwise share
 * identical structure (status line, name, description, CTA), so this is the
 * one place visual differentiation is worth adding: each campaign reads as
 * its own activity at a glance instead of several copies of the same
 * template. Extracted from src/app/campaigns/page.tsx so the homepage's
 * campaign teaser and the full /campaigns index render identically rather
 * than drifting into two hand-maintained card markups.
 */
const CAMPAIGN_ICONS: Record<string, typeof Bike> = {
  tri: Bike,
  ruck: Backpack,
  live: Music,
  "22": Footprints,
};

function formatCampaignDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

export function CampaignCard({ campaign }: { campaign: MovementCampaign }) {
  const isSameSite = "url" in campaign && campaign.url?.startsWith("/");
  const dateLine = campaign.startDate
    ? campaign.endDate
      ? `${formatCampaignDate(campaign.startDate)}–${formatCampaignDate(campaign.endDate)}`
      : formatCampaignDate(campaign.startDate)
    : null;
  const statusLine = [CAMPAIGN_STATUS_LABELS[campaign.status], campaign.type, campaign.location, dateLine]
    .filter(Boolean)
    .join(" · ");
  const Icon = CAMPAIGN_ICONS[campaign.slug];

  return (
    <div className="grid gap-6 border border-ink/10 bg-off-white p-7 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-7 sm:p-8">
      {Icon && (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-sm bg-bronze/10 text-bronze sm:h-24 sm:w-24">
          <Icon className="h-9 w-9 sm:h-10 sm:w-10" aria-hidden="true" />
        </div>
      )}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-bronze">{statusLine}</p>
        <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
          {campaign.name}
        </h3>
        {campaign.description && (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-charcoal-light">{campaign.description}</p>
        )}
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
          Contributes to {MISSION_NAME}
        </p>
        {campaign.url && (
          <CTAButton href={campaign.url} external={!isSameSite} className="mt-6">
            Explore {campaign.name}
          </CTAButton>
        )}
      </div>
    </div>
  );
}
