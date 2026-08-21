import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** "dark" for a section on an ink/black background — swaps text colors so eyebrow/title/description stay readable. */
  tone?: "light" | "dark";
  className?: string;
  /** Render as the page's real <h1> for the topmost heading on a page — every other instance should stay the default <h2>. */
  as?: "h1" | "h2";
}) {
  const isDark = tone === "dark";
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-2 text-sm font-semibold uppercase tracking-[0.2em]",
            isDark ? "text-bronze-light" : "text-bronze",
          )}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        className={cn(
          "text-balance text-3xl font-semibold uppercase tracking-tight sm:text-4xl",
          isDark ? "text-off-white" : "text-ink",
        )}
      >
        {title}
      </Heading>
      {description && (
        <p
          className={cn(
            "mt-3 max-w-2xl text-base",
            isDark ? "text-off-white/75" : "text-charcoal-light/90",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
