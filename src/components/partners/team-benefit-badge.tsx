"use client";

import { useState } from "react";

const TEAM_BENEFIT_TOOLTIP =
  "Special swim and wetsuit pricing is available to approved Tri For the 22 team members, with qualifying purchases generating equipment credit for the campaign.";

/**
 * Small "Team Benefit" pill for the standard supporter grid — see
 * MissionPartnerCard. Deliberately reveals only the public-safe summary on
 * hover (title attribute) or tap (click toggle); the actual access details
 * and discount code are never included here or anywhere client-side.
 */
export function TeamBenefitBadge() {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        title={TEAM_BENEFIT_TOOLTIP}
        aria-expanded={open}
        className="inline-flex items-center rounded-full border border-bronze/40 bg-bronze/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-bronze"
      >
        Team Benefit
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-0 top-full z-10 mt-2 w-56 rounded-sm border border-ink/10 bg-ink p-3 text-xs font-normal normal-case leading-relaxed text-off-white shadow-lg"
        >
          {TEAM_BENEFIT_TOOLTIP}
        </span>
      )}
    </span>
  );
}
