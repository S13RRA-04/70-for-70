import Link from "next/link";
import { DONATE_LINK, EVENT22_CAMPAIGN_URL } from "@/lib/constants";
import type { JournalPrimaryCategory } from "@/types/database";

/** Context-aware end-of-post CTA, keyed by primary_category — not the same link on every entry. */
const CTA_BY_CATEGORY: Record<JournalPrimaryCategory, { label: string; href: string }> = {
  Training: { label: "Follow the Road to Chattanooga", href: "/journal" },
  "Race Prep": { label: "Follow the Road to Chattanooga", href: "/journal" },
  Campaign: { label: DONATE_LINK.label, href: DONATE_LINK.href },
  Milestones: { label: DONATE_LINK.label, href: DONATE_LINK.href },
  Support: { label: "Meet Our Partners", href: "/beneficiaries" },
  "Mighty Oaks": { label: "Meet Our Partners", href: "/beneficiaries" },
  "22 For the 22": { label: "Join 22 For the 22", href: EVENT22_CAMPAIGN_URL },
};

export function JournalCta({ category }: { category: JournalPrimaryCategory }) {
  const cta = CTA_BY_CATEGORY[category] ?? { label: "Back to the Journal", href: "/journal" };

  return (
    <Link
      href={cta.href}
      className="mt-8 inline-flex rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
    >
      {cta.label}
    </Link>
  );
}
