import { SOCIAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Minimal brand glyphs (single-color, currentColor) — same path data as the Simple Icons set, hand-inlined so this doesn't need a whole icon-library dependency for three logos. lucide-react itself dropped platform-specific brand icons, which is why these live here instead. */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.391.524A2.994 2.994 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.994 2.994 0 0 0 2.107 2.117c1.886.524 9.391.524 9.391.524s7.505 0 9.391-.524a2.994 2.994 0 0 0 2.107-2.117C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.75 15.568V8.432L15.818 12 9.75 15.568z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.602-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933Zm-1.292 19.491h2.039L6.486 3.24H4.298L17.61 20.644Z" />
    </svg>
  );
}

const PLATFORM_ICONS: Record<string, (props: { className?: string }) => React.JSX.Element> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  x: XIcon,
};

/**
 * Renders nothing while SOCIAL_LINKS is empty — see constants.ts. Brand
 * glyphs rather than text labels; each link's visible label moves to
 * sr-only text so the accessible name survives the switch to icon-only.
 * Platforms without a mapped icon (none currently) fall back to the text
 * label rather than rendering nothing.
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
    <ul className={cn("flex flex-wrap items-center gap-4", className)}>
      {SOCIAL_LINKS.map((social) => {
        const Icon = PLATFORM_ICONS[social.platform];
        return (
          <li key={social.url}>
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-event="share_click"
              aria-label={social.label}
              title={social.label}
              className={cn(
                "block transition-colors",
                tone === "dark" ? "text-off-white/70 hover:text-off-white" : "text-charcoal-light hover:text-ink",
              )}
            >
              {Icon ? <Icon className="h-5 w-5" /> : <span className="text-sm font-medium">{social.label}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
