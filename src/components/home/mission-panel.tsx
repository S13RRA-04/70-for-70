import { CTAButton } from "@/components/shared/cta-button";

interface MissionPanelProps {
  number: "01" | "02" | "03";
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export function MissionPanel({ number, title, description, ctaLabel, ctaHref }: MissionPanelProps) {
  return (
    <div className="flex flex-col border border-ink/10 bg-off-white p-6 sm:p-8">
      <span aria-hidden="true" className="font-display text-sm font-semibold text-bronze">
        {number}
      </span>
      <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
        {title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-light">{description}</p>
      <CTAButton href={ctaHref} variant="ghost" className="mt-5 self-start px-0 py-0">
        {ctaLabel}
      </CTAButton>
    </div>
  );
}
