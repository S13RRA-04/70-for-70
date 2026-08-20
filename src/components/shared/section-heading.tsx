import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  /** Render as the page's real <h1> for the topmost heading on a page — every other instance should stay the default <h2>. */
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-bronze">
          {eyebrow}
        </p>
      )}
      <Heading className="text-balance text-3xl font-semibold uppercase tracking-tight text-ink sm:text-4xl">
        {title}
      </Heading>
      {description && (
        <p
          className={cn(
            "mt-3 max-w-2xl text-base text-charcoal-light/90",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
