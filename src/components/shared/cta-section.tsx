import { cn } from "@/lib/utils";
import { CTAButton } from "@/components/shared/cta-button";

interface CTASectionButton {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
}

/**
 * Closing call-to-action band. "dark" is the navy band (the homepage's
 * Mobilization treatment); "light" is a white band with the left brush edge
 * (the homepage's "Here to give help?" bookend).
 */
export function CTASection({
  eyebrow,
  title,
  description,
  buttons,
  tone = "dark",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  buttons: CTASectionButton[];
  tone?: "dark" | "light";
}) {
  const dark = tone === "dark";
  return (
    <section
      className={cn(
        "relative overflow-hidden py-20 sm:py-24",
        dark ? "bg-navy text-white" : "border-y border-line bg-white text-jet",
      )}
    >
      {!dark && (
        // eslint-disable-next-line @next/next/no-img-element -- decorative edge art sized to the section's height
        <img
          src="/brand/edge-left.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-full w-auto max-w-[18vw] object-cover object-right opacity-35 md:opacity-80"
        />
      )}
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 text-center">
        {eyebrow && <p className={cn("label-caps", dark ? "text-mist" : "text-steel")}>{eyebrow}</p>}
        <h2
          className={cn(
            "text-worn text-balance font-display text-[clamp(40px,5vw,64px)] uppercase leading-none",
            !dark && "text-navy",
          )}
        >
          {title}
        </h2>
        {description && (
          <p className={cn("max-w-xl text-lg leading-relaxed", dark ? "text-mist" : "text-copy")}>{description}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {buttons.map((button, i) => (
            <CTAButton
              key={button.href}
              href={button.href}
              variant={button.variant ?? "primary"}
              tone={tone}
              size="lg"
              // Only the first (highest-intent) button gets the magnetic
              // hover — see CTAButton's doc comment on why it's never
              // more than one or two per page.
              magnetic={i === 0}
            >
              {button.label}
            </CTAButton>
          ))}
        </div>
      </div>
    </section>
  );
}
