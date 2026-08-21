import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

/**
 * Dark, contour-textured header band for campaign-domain page heroes
 * (the-mission, the-race, fund-a-mile, donate, sponsors, partners,
 * updates) — the parent org site's page heroes stay on the light
 * bg-sand-light band; this is what differentiates Tri visually per the
 * "Tri should feel more athletic/data-driven" brand direction. Pair
 * with <SectionHeading tone="dark"> inside — the plain "light" tone
 * hardcodes text-ink/text-charcoal-light, which is unreadable here.
 */
export function CampaignPageHero({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-off-white/10 bg-ink py-16 text-off-white sm:py-20",
        className,
      )}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url(/topo-map.png)" }}
        aria-hidden="true"
      />
      <Container className={cn("relative", containerClassName)}>{children}</Container>
    </section>
  );
}
