/**
 * A partner's campaign ROLE (e.g. "Official Bicycle Support Partner") or
 * support CATEGORY (e.g. "Gear", "Printing") — deliberately distinct from
 * sponsorship tier. A partner's tier says how much they've contributed;
 * this says what kind of contribution it is. Never derive one from the
 * other. See src/lib/tier-theme.ts for the tier badge this pairs with.
 */
export function PartnerRoleBadge({
  label,
  variant = "role",
}: {
  label: string;
  variant?: "role" | "category";
}) {
  if (variant === "category") {
    return (
      <span className="inline-flex w-fit items-center rounded-full bg-sand px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-charcoal-light">
        {label}
      </span>
    );
  }

  return <p className="text-xs font-semibold uppercase tracking-widest text-ink">{label}</p>;
}
