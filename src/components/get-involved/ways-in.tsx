import Link from "next/link";
import { CAMPAIGN_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * "Here to give help? Four ways in." — the Mobilization entry points
 * (participate, partner, donate, share). Lives on the /campaigns hub; it
 * moved off the homepage when the homepage was cut down to one door per
 * pillar.
 */
export function WaysIn() {
  return (
    <section aria-labelledby="ways-in-heading" className="relative overflow-hidden border-b border-line">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative edge art sized to the section's height */}
      <img
        src="/brand/edge-left.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-full w-auto max-w-[24vw] object-cover object-right opacity-35 md:opacity-90"
      />
      <div className="relative mx-auto flex max-w-[1040px] flex-col gap-9 px-6 py-16 sm:py-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="label-caps text-olive">Get involved</span>
          <h2 id="ways-in-heading" className="text-worn font-display text-[clamp(44px,5.4vw,72px)] uppercase leading-none">
            <span className="text-outline">Here to give help?</span>
            <br />
            <span className="text-navy">Four ways in.</span>
          </h2>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          <WayInCard href="#current-campaigns" title="Participate" cta="See campaigns">
            Join a ruck, a race, or a movement challenge.
          </WayInCard>
          <WayInCard href={`${CAMPAIGN_URL}/become-a-partner`} external title="Partner" cta="Become a partner">
            Brands, artists, and organizations: contribute gear, services, funding, expertise, or reach.
          </WayInCard>
          <WayInCard href={`${CAMPAIGN_URL}/donate`} external title="Donate" cta="Donate" dark>
            Give directly through a beneficiary campaign.
          </WayInCard>
          <WayInCard href="/resources" title="Share" cta="Find resources">
            Help trusted resources reach the people who need them.
          </WayInCard>
        </div>
      </div>
    </section>
  );
}

function WayInCard({
  href,
  title,
  cta,
  dark = false,
  external = false,
  children,
}: {
  href: string;
  title: string;
  cta: string;
  dark?: boolean;
  /** Cross-domain (tri.forthe22.org) — a plain <a>, see AGENTS.md on cross-domain links. */
  external?: boolean;
  children: React.ReactNode;
}) {
  const className = cn(
    "lift view-rise flex min-h-[180px] flex-col gap-2 rounded-xl p-[26px]",
    dark ? "bg-navy text-white" : "border border-line bg-white text-jet hover:border-navy/40",
  );
  const content = (
    <>
      <span className="font-display text-[30px] uppercase leading-none">{title}</span>
      <span className={cn("flex-grow text-base leading-relaxed", dark ? "text-mist" : "text-copy")}>{children}</span>
      <span className={cn("font-bold", dark ? "text-gold" : "text-navy")}>{cta} →</span>
    </>
  );
  return external || href.startsWith("#") ? (
    <a href={href} className={className}>
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
