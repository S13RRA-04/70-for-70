import { STRAVA_PROFILE_URL } from "@/lib/constants";

/**
 * Strava's own official "Follow" badge widget (generated from Strava's
 * badge generator) — the sprite image loads directly from Strava's CDN
 * (badges.strava.com), not a self-hosted asset. Plain <style> tag (not
 * styled-jsx, which requires "use client") since this is exactly Strava's
 * own generated snippet and has no interactivity of its own. Class names
 * are prefixed strava-badge-* specifically so they can't collide with
 * anything else on the page — don't "fix" the trailing hyphen on
 * strava-badge-, it's intentional, part of Strava's generated markup.
 */
export function StravaFollowBadge() {
  return (
    <>
      <style>{`
        .strava-badge- { display: inline-block; height: 48px; }
        .strava-badge- img { visibility: hidden; height: 48px; }
        .strava-badge-:hover { background-position: 0 -63px; }
        .strava-badge-follow { height: 48px; width: 48px; background: url(//badges.strava.com/echelon-sprite-48.png) no-repeat 0 0; }
      `}</style>
      <a
        href={STRAVA_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="strava-badge- strava-badge-follow"
        aria-label="Follow on Strava"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Strava's own hosted sprite asset, not a build-time-known local/remote image next/image can optimize. */}
        <img src="//badges.strava.com/echelon-sprite-48.png" alt="Strava" />
      </a>
    </>
  );
}
