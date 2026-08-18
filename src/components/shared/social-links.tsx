import { SOCIAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Renders nothing while SOCIAL_LINKS is empty — see constants.ts. Uses
 * text labels rather than brand icons: lucide-react dropped
 * platform-specific brand icons, and pulling in a separate icon set for
 * a handful of labels isn't worth the dependency (same call made for
 * ShareButtons' Facebook/LinkedIn/X buttons).
 */
export function SocialLinks({
  className,
  tone = "dark",
}: {
  className?: string;
  /** "dark" for use on a dark background (footer); "light" for a light one (header). */
  tone?: "dark" | "light";
}) {
  if (SOCIAL_LINKS.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-3", className)}>
      {SOCIAL_LINKS.map((social) => (
        <li key={social.url}>
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics-event="share_click"
            className={cn(
              "text-sm font-medium transition-colors",
              tone === "dark"
                ? "text-off-white/70 hover:text-off-white"
                : "text-charcoal-light hover:text-ink",
            )}
          >
            {social.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
