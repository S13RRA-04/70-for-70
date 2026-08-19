import type { Metadata } from "next";
import Image from "next/image";
import { CAMPAIGN_NAME, CONTACT_EMAIL, ORG_HOME_LINK, ORG_TAGLINE, SITE_NAME } from "@/lib/constants";

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
 */
export default async function ComingSoonPage(props: PageProps<"/coming-soon">) {
  const searchParams = await props.searchParams;
  const scope = Array.isArray(searchParams.scope) ? searchParams.scope[0] : searchParams.scope;
  const isCampaignScope = scope === "campaign";

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center">
      <Image src="/logo.png" alt="" aria-hidden="true" width={88} height={88} priority />
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-bronze">
        {isCampaignScope ? CAMPAIGN_NAME : SITE_NAME}
      </p>
      <h1 className="mt-3 text-balance font-display text-3xl font-bold uppercase tracking-tight text-ink sm:text-4xl">
        {isCampaignScope ? "The Campaign Isn't Open Yet" : "We're Getting Ready"}
      </h1>
      <p className="mt-4 max-w-md text-base text-charcoal-light">
        {isCampaignScope
          ? `${CAMPAIGN_NAME} is being finalized and isn't open to the public yet. Check back soon.`
          : ORG_TAGLINE}
      </p>
      {!isCampaignScope && (
        <p className="mt-2 max-w-md text-sm text-charcoal-light">
          The site is being finalized and isn&apos;t open to the public yet. Check back soon.
        </p>
      )}
      {isCampaignScope && (
        <a
          href={ORG_HOME_LINK.href}
          className="mt-6 inline-flex rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
        >
          Visit {ORG_HOME_LINK.label}
        </a>
      )}
      {CONTACT_EMAIL && (
        <a href={`mailto:${CONTACT_EMAIL}`} className="mt-6 text-sm text-bronze hover:underline">
          {CONTACT_EMAIL}
        </a>
      )}
    </section>
  );
}
