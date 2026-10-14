import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmailSignupForm } from "@/components/forms/email-signup-form";
import {
  CAMPAIGN_NAME,
  CONTACT_EMAIL,
  CURRENT_CAMPAIGN,
  FUNDRAISING_GOAL,
  ORG_HOME_LINK,
  ORG_TAGLINE,
  RACE_INFO,
  RACE_TOTAL_DISTANCE,
  SITE_NAME,
} from "@/lib/constants";
import { LIVE_CAMPAIGN_TAGLINE, LIVE_PILLARS } from "@/lib/content/live-campaign";
import { getActiveCampaignSlug } from "@/lib/site-mode";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Coming Soon",
  robots: { index: false, follow: false },
};

/**
 * Served (via middleware's rewrite, not direct navigation) for a domain
 * that isn't live yet — see src/lib/launch-gate.ts. Org and campaign are
 * gated independently, so middleware tags which one triggered the gate
 * via `?scope=campaign` (org gating has no scope param — it's the
 * default/unmarked case, so a stray direct visit to /coming-soon without
 * the param still reads as "org," which is harmless). Not linked from nav
 * or the sitemap; it's an internal gate target, not a real page.
 *
 * The campaign branch is the one that actually matters right now —
 * CAMPAIGN_LIVE is false in production, so this is what a tri.forthe22.org
 * visitor sees today. It intentionally does not expose the full campaign
 * nav (Race/Beneficiaries/Journal all point at pages with nothing
 * live behind them yet) — just the concept, the concrete facts that are
 * already confirmed, and a way to follow along.
 */
export default async function ComingSoonPage(props: PageProps<"/coming-soon">) {
  const searchParams = await props.searchParams;
  const scope = Array.isArray(searchParams.scope) ? searchParams.scope[0] : searchParams.scope;
  const isCampaignScope = scope === "campaign";

  // CAMPAIGN_LIVE gates every campaign host at once, but the splash below
  // is Tri's. Live has its own identity, so it gets its own splash rather
  // than showing a concert-series visitor "70.3 Miles".
  if (isCampaignScope && (await getActiveCampaignSlug()) === "live") {
    return (
      <section className="flex min-h-[85vh] flex-col items-center justify-center gap-5 px-6 py-20 text-center">
        <h1 className="w-full">
          <Image
            src="/brand/live/wordmark.webp"
            alt="For The 22: Live"
            width={1092}
            height={297}
            priority
            sizes="(min-width: 840px) 760px, 100vw"
            className="mx-auto h-auto w-full max-w-[760px]"
          />
        </h1>
        <p className="text-[15px] font-bold uppercase tracking-[0.42em]">{LIVE_CAMPAIGN_TAGLINE}</p>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">{LIVE_PILLARS.join("  |  ")}</p>
        <p className="label-caps mt-4 rounded-full bg-live-red px-4 py-2 text-xs text-white">Lineup announcing soon</p>
        {CONTACT_EMAIL && (
          <div className="mt-6 flex flex-col items-center">
            <p className="label-caps mb-3 text-xs text-muted">Get on the list</p>
            <EmailSignupForm idleLabel="Count me in" />
          </div>
        )}
        <a href={ORG_HOME_LINK.href} className="mt-6 text-sm font-bold uppercase tracking-wide text-jet hover:text-live-red">
          &larr; {ORG_HOME_LINK.label}
        </a>
      </section>
    );
  }

  if (isCampaignScope) {
    return (
      <section className="flex min-h-[85vh] flex-col items-center justify-center bg-ink px-6 py-20 text-center text-off-white">
        <Image src="/campaign-logo-white.png" alt="" aria-hidden="true" width={64} height={64} priority />
        {/* Oversized splash-screen hero, same reason the homepage hero bypasses
            SectionHeading too — its fixed text-3xl/4xl scale would shrink this. */}
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-bronze-light">
          {SITE_NAME} &middot; Current Campaign
        </p>
        <h1 className="mt-3 text-balance font-display text-4xl uppercase leading-[0.95] sm:text-6xl">
          {CAMPAIGN_NAME}
        </h1>
        <p className="mt-4 font-display text-xl uppercase text-off-white/90 sm:text-2xl">
          {RACE_TOTAL_DISTANCE} Miles. {formatCurrency(FUNDRAISING_GOAL)}. One Mission.
        </p>
        <p className="mt-5 max-w-md text-sm font-bold uppercase tracking-[0.2em] text-bronze-light">
          Campaign Launch Coming Soon
        </p>

        <dl className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-off-white/70">
          {RACE_INFO.raceLocation && (
            <div>
              <dt className="sr-only">Location</dt>
              <dd>{RACE_INFO.raceLocation}</dd>
            </div>
          )}
          <div>
            <dt className="sr-only">Beneficiaries</dt>
            <dd>{CURRENT_CAMPAIGN.beneficiaries.join(" · ")}</dd>
          </div>
        </dl>

        {CONTACT_EMAIL && (
          <div className="mt-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-off-white/60">
              Follow the Road to {RACE_TOTAL_DISTANCE}
            </p>
            <EmailSignupForm tone="dark" />
          </div>
        )}

        <a
          href={ORG_HOME_LINK.href}
          className="mt-10 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze-light hover:text-bronze"
        >
          &larr; {ORG_HOME_LINK.label}
        </a>
      </section>
    );
  }

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center">
      <Image src="/logo.png" alt="" aria-hidden="true" width={88} height={88} priority />
      <div className="mt-6">
        <SectionHeading as="h1" align="center" eyebrow={SITE_NAME} title="We're Getting Ready" description={ORG_TAGLINE} />
      </div>
      <p className="mt-2 max-w-md text-sm text-charcoal-light">
        The site is being finalized and isn&apos;t open to the public yet. Check back soon.
      </p>
      {CONTACT_EMAIL && (
        <a href={`mailto:${CONTACT_EMAIL}`} className="mt-6 text-sm text-bronze hover:underline">
          {CONTACT_EMAIL}
        </a>
      )}
    </section>
  );
}
