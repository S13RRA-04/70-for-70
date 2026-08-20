interface MobileAction {
  label: string;
  href: string;
}

/**
 * Sticky bottom action bar, mobile only — used selectively on a handful of
 * pages (Resources, Athletes), not sitewide. Pages that render this should
 * add a small bottom spacer so the fixed bar doesn't overlap page content.
 */
export function MobileActionBar({
  primary,
  secondary,
}: {
  primary: MobileAction;
  secondary: MobileAction;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex border-t border-ink/10 bg-off-white/95 backdrop-blur sm:hidden">
      <a
        href={secondary.href}
        className="flex-1 border-r border-ink/10 px-4 py-3.5 text-center text-sm font-semibold uppercase tracking-wide text-ink"
      >
        {secondary.label}
      </a>
      <a
        href={primary.href}
        className="flex-1 bg-bronze px-4 py-3.5 text-center text-sm font-semibold uppercase tracking-wide text-off-white"
      >
        {primary.label}
      </a>
    </div>
  );
}
