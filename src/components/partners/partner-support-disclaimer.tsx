import { cn } from "@/lib/utils";

/**
 * Stated once per full partner listing (not every teaser logo row that
 * links onward to one of these) — see /sponsors, /network's Campaign
 * Partners section, and /ruck-home's Campaign Partners section (its only
 * partner listing; unlike campaign-home's teaser wall, which links to
 * /sponsors instead of repeating this).
 */
export function PartnerSupportDisclaimer({ className }: { className?: string }) {
  return (
    <p className={cn("max-w-2xl border-l-2 border-bronze/40 pl-4 text-sm leading-relaxed text-charcoal-light", className)}>
      No affiliate links, no referral fees, no sponsored placement &mdash; I&apos;m not an
      influencer, and nothing here is paid promotion. Every organization listed chose to back
      this mission because the work speaks for itself. I&apos;m just the guy putting in the work;
      they&apos;re helping me get it done.
    </p>
  );
}
