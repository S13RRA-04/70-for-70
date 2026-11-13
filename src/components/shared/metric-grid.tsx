import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * One responsive shell for KPI groups. Metric content stays in StatCard or a
 * domain-specific adapter, while density and breakpoint behavior stay shared.
 */
export function MetricGrid({
  children,
  columns = 4,
  className,
}: {
  children: ReactNode;
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}) {
  const layouts = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    5: "sm:grid-cols-3 lg:grid-cols-5",
  } as const;

  return <div className={cn("grid grid-cols-2 gap-3 sm:gap-4", layouts[columns], className)}>{children}</div>;
}
