import Link from "next/link";
import type { PartnerRow } from "@/types/database";

/**
 * "Supported by [Partner]" and "This campaign supports: [Beneficiary]" —
 * opt-in per entry (see journal_entry_partner_mentions/journal_entry_beneficiary_mentions),
 * never implying the org authored or endorsed the post. Each block renders
 * only when its list is non-empty.
 */
export function PartnerMentionsFooter({
  partnerMentions,
  beneficiaryMentions,
}: {
  partnerMentions: PartnerRow[];
  beneficiaryMentions: PartnerRow[];
}) {
  if (partnerMentions.length === 0 && beneficiaryMentions.length === 0) return null;

  return (
    <div className="mt-10 space-y-3 border-t border-ink/10 pt-6 text-sm text-charcoal-light">
      {partnerMentions.length > 0 && (
        <p>
          <span className="font-semibold text-ink">Supported by:</span>{" "}
          {partnerMentions.map((partner, i) => (
            <span key={partner.id}>
              {i > 0 && ", "}
              {partner.website_url ? (
                <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="text-bronze hover:underline">
                  {partner.name}
                </a>
              ) : (
                partner.name
              )}
            </span>
          ))}
        </p>
      )}

      {beneficiaryMentions.length > 0 && (
        <p>
          <span className="font-semibold text-ink">This campaign supports:</span>{" "}
          {beneficiaryMentions.map((partner, i) => (
            <span key={partner.id}>
              {i > 0 && ", "}
              {partner.name}
            </span>
          ))}{" "}
          — <Link href="/partners#beneficiaries" className="text-bronze hover:underline">Learn more &rarr;</Link>
        </p>
      )}
    </div>
  );
}
