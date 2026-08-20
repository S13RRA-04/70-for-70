import { cn } from "@/lib/utils";
import { CTAButton } from "@/components/shared/cta-button";

interface CTASectionButton {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
}

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
  return (
    <section
      className={cn(
        "py-16",
        tone === "dark" ? "bg-ink text-off-white" : "bg-sand-light text-ink",
      )}
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-bronze-light">
            {eyebrow}
          </p>
        )}
        <h2 className="text-balance font-display text-3xl font-semibold uppercase tracking-tight sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mx-auto mt-4 max-w-xl text-base",
              tone === "dark" ? "text-off-white/75" : "text-charcoal-light",
            )}
          >
            {description}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {buttons.map((button) => (
            <CTAButton
              key={button.href}
              href={button.href}
              variant={button.variant ?? "primary"}
              tone={tone}
            >
              {button.label}
            </CTAButton>
          ))}
        </div>
      </div>
    </section>
  );
}
