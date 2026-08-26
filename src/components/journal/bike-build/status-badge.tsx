import { CheckCircle2, CircleDot, Circle, HelpCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BikeBuildStatus } from "@/types/bike-build";

/**
 * Icon + color per canonical status, shared by the status-summary panel and
 * the component board. The visible text label is always passed in
 * separately (see BikeBuildStatusSummaryItem.statusLabel /
 * BikeBuildComponentRow.statusLabel) — color and icon reinforce it, they
 * never carry the meaning alone.
 */
const STATUS_STYLES: Record<BikeBuildStatus, { icon: typeof CheckCircle2; className: string }> = {
  confirmed: { icon: CheckCircle2, className: "text-olive" },
  complete: { icon: CheckCircle2, className: "text-olive" },
  available: { icon: CircleDot, className: "text-olive" },
  offered: { icon: CircleDot, className: "text-bronze" },
  under_review: { icon: HelpCircle, className: "text-bronze" },
  needed: { icon: AlertCircle, className: "text-bronze" },
  pending: { icon: Circle, className: "text-charcoal-light/60" },
};

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: BikeBuildStatus;
  label: string;
  className?: string;
}) {
  const { icon: Icon, className: colorClassName } = STATUS_STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-ink/15 bg-off-white px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        colorClassName,
        className,
      )}
    >
      <Icon size={13} aria-hidden="true" />
      {label}
    </span>
  );
}
