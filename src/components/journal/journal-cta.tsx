import Link from "next/link";
import type { JournalPrimaryCategory } from "@/types/database";

/**
 * Context-aware end-of-post CTA, keyed by primary_category — not the same
 * link on every entry. /partners and /sponsors both just redirect to
 * /beneficiaries (see src/app/partners/page.tsx), so partner/sponsor
 * mentions link there directly rather than through the redirect.
 */
const CTA_BY_CATEGORY: Record<JournalPrimaryCategory, { label: string; href: string }> = {
  Training: { label: "Follow the Road to Chattanooga", href: "/journal" },
  "Race Prep": { label: "Follow the Road to Chattanooga", href: "/journal" },
  Fundraising: { label: "Support the Mission", href: "/donate" },
  Milestones: { label: "Support the Mission", href: "/donate" },
  Sponsors: { label: "Meet Our Partners", href: "/beneficiaries" },
  "Mighty Oaks": { label: "Meet Our Partners", href: "/beneficiaries" },
  "Project Echelon": { label: "Meet Our Partners", href: "/beneficiaries" },
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
