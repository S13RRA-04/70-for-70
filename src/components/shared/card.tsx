import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CardVariant = "default" | "muted" | "accent" | "dark";

const VARIANTS: Record<CardVariant, string> = {
  default: "ui-card",
  muted: "ui-card ui-card-muted",
  accent: "ui-card ui-card-accent",
  dark: "border border-off-white/15 bg-property-dark text-off-white",
};

/** Shared structural card. Domain flavor comes from root property tokens. */
export function Card<T extends ElementType = "div">({
  as,
  variant = "default",
  interactive = false,
  className,
  children,
  ...props
}: {
  as?: T;
  variant?: CardVariant;
  interactive?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">) {
  const Component = as ?? "div";
  return (
    <Component
      className={cn(
        VARIANTS[variant],
        interactive && "hover-lift transition-colors hover:border-property-accent/50",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
