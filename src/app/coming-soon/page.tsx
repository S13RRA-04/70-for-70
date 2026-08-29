import type { Metadata } from "next";
import Image from "next/image";
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

  if (isCampaignScope) {
    return (
      <section className="flex min-h-[85vh] flex-col items-center justify-center bg-ink px-6 py-20 text-center text-off-white">
        <Image src="/campaign-logo-white.png" alt="" aria-hidden="true" width={64} height={64} priority />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-bronze-light">
          {SITE_NAME} &middot; Current Campaign
        </p>
        <h1 className="mt-3 text-balance font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
          {CAMPAIGN_NAME}
        </h1>
        <p className="mt-4 font-display text-lg font-semibold uppercase tracking-tight text-off-white/90 sm:text-xl">
          {RACE_TOTAL_DISTANCE} Miles. {formatCurrency(FUNDRAISING_GOAL)}. One Mission.
        </p>
        <p className="mt-5 max-w-md text-sm font-semibold uppercase tracking-widest text-bronze-light">
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
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-off-white/60">
              Follow the Road to {RACE_TOTAL_DISTANCE}
            </p>
            <EmailSignupForm />
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
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-bronze">{SITE_NAME}</p>
      <h1 className="mt-3 text-balance font-display text-3xl font-bold uppercase tracking-tight text-ink sm:text-4xl">
        We&apos;re Getting Ready
      </h1>
      <p className="mt-4 max-w-md text-base text-charcoal-light">{ORG_TAGLINE}</p>
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
