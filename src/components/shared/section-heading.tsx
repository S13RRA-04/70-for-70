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
            "label-caps mb-3",
            isDark ? "property-eyebrow-dark" : "property-eyebrow",
          )}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        className={cn(
          "text-balance font-display uppercase",
          // A page's H1 gets the hero scale + worn print; section titles stay on the section step.
          Heading === "h1" ? "text-worn text-[clamp(44px,6vw,84px)] leading-[0.95]" : "text-section leading-none",
          isDark ? "text-white" : "text-navy",
        )}
      >
        {title}
      </Heading>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-relaxed sm:text-lg",
            isDark ? "text-mist" : "text-[#3e4247]",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
