import Image from "next/image";
import { cn } from "@/lib/utils";
import type { LogoBackground } from "@/types/database";

interface PartnerLogoProps {
  name: string;
  logoUrl: string | null;
  logoLightUrl?: string | null;
  logoDarkUrl?: string | null;
  /** Which container to render — 'dark' pairs with a light-colored logo. Defaults to 'light'. */
  background?: LogoBackground | null;
  className?: string;
}

/**
 * Renders a partner/sponsor logo inside a container guaranteed to contrast
 * with it, instead of dropping the raw image onto whatever background the
 * surrounding section happens to have (the bug: a near-white or fully-white
 * logo going invisible on the off-white page background). Picks
 * logoDarkUrl on a light container / logoLightUrl on a dark one, falling
 * back to the single logoUrl when a variant isn't set.
 */
export function PartnerLogo({
  name,
  logoUrl,
  logoLightUrl,
  logoDarkUrl,
  background = "light",
  className,
}: PartnerLogoProps) {
  const isDark = background === "dark";
  const src = (isDark ? logoLightUrl : logoDarkUrl) ?? logoUrl;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-sm border p-5",
        isDark
          ? "border-off-white/15 bg-ink shadow-sm"
          : "border-ink/10 bg-white shadow-sm",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={`${name} logo`}
          width={240}
          height={100}
          className="h-full w-auto max-w-full object-contain"
        />
      ) : (
        <span
          className={cn(
            "text-center text-sm font-semibold uppercase tracking-wide",
            isDark ? "text-off-white" : "text-ink",
          )}
        >
          {name}
        </span>
      )}
    </div>
  );
}
