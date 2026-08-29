import Link from "next/link";
import { DONATE_LINK } from "@/lib/constants";
import type { JournalPrimaryCategory } from "@/types/database";

/** Context-aware end-of-post CTA, keyed by primary_category — not the same link on every entry. */
const CTA_BY_CATEGORY: Record<JournalPrimaryCategory, { label: string; href: string }> = {
  Training: { label: "Follow the Road to Chattanooga", href: "/journal" },
  "Race Prep": { label: "Follow the Road to Chattanooga", href: "/journal" },
  Fundraising: { label: DONATE_LINK.label, href: DONATE_LINK.href },
  Milestones: { label: DONATE_LINK.label, href: DONATE_LINK.href },
  Sponsors: { label: "Meet Our Partners", href: "/beneficiaries" },
  "Mighty Oaks": { label: "Meet Our Partners", href: "/beneficiaries" },
};

export function JournalCta({ category }: { category: JournalPrimaryCategory }) {
  const cta = CTA_BY_CATEGORY[category] ?? { label: "Back to Follow My Progress", href: "/journal" };

  return (
    <Link
      href={cta.href}
      className="mt-8 inline-flex rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
    >
      {cta.label}
    </Link>
  );
}
