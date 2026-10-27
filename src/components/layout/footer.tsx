import Link from "next/link";
import Image from "next/image";
import {
  CAMPAIGN_HOME_LINK,
  CAMPAIGN_URL,
  CAMPAIGNS,
  CONTACT_EMAIL,
  DONATE_LINK,
  MISSION_NAME,
  ORG_HOME_LINK,
  ORG_TAGLINE,
  PERSONAL_PROJECT_DISCLOSURE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import { Container } from "@/components/shared/container";
import { SocialLinks } from "@/components/shared/social-links";
import { BrandStripe } from "@/components/shared/brand-stripe";
import { isNavGroup, type NavLink } from "@/types/content";
import type { CampaignSlug, SiteMode } from "@/lib/site-mode";
import { isRaceDayModeEnabled } from "@/lib/race-day-mode";

export function Footer({
  mode,
  campaignSlug,
  awarenessMonth = false,
}: {
  mode: SiteMode;
  campaignSlug?: CampaignSlug | null;
  awarenessMonth?: boolean;
}) {
  const isCampaign = mode === "campaign";
  const campaign = campaignSlug ? CAMPAIGNS[campaignSlug] : null;
  // Legal pages live on the org domain only — link there directly instead
  // of relying on the campaign-host redirect for every click.
  const legalBase = isCampaign ? SITE_URL : "";

  const raceDayLive = isRaceDayModeEnabled();

  // Small teal/purple identification dot for National Suicide Prevention
  // Month (September) — see isSuicidePreventionMonth. Same convention as
  // ring-colors.ts: a chromatic accent used only as an identification
  // signal, never a background fill.
  const awarenessDot = awarenessMonth ? (
    <span
      aria-hidden="true"
      className="ml-1.5 inline-block h-2 w-2 rounded-full align-middle"
      style={{
        background: "linear-gradient(135deg, var(--color-awareness-teal), var(--color-awareness-purple))",
      }}
    />
  ) : null;

  return (
    <footer className="property-footer-shell relative overflow-hidden text-white">
      <BrandStripe onNavy variant={campaignSlug === "live" ? "live" : "org"} />
      <Container
        className={`relative grid gap-10 pb-14 pt-16 sm:grid-cols-2 ${
          campaignSlug === "tri"
            ? "lg:grid-cols-3 xl:grid-cols-6"
            : campaignSlug === "ruck" || campaignSlug === "22" || campaignSlug === "live"
              ? "lg:grid-cols-4"
              : "lg:grid-cols-3 xl:grid-cols-6"
        }`}
      >
        <div className={isCampaign ? "sm:col-span-2 lg:col-span-2" : "sm:col-span-2 lg:col-span-1"}>
          {campaign?.logoCarriesName ? (
            <div className="flex items-center gap-4">
              <Image src={campaign.logoDark} alt="" aria-hidden="true" width={84} height={84} />
              <div>
                <p className="sr-only">{campaign.name}</p>
                <p className="text-sm font-bold uppercase tracking-[0.42em]">{campaign.tagline}</p>
                <p className="mt-1 max-w-xs text-sm text-off-white/70">
                  A {SITE_NAME} campaign. For those who serve. For what comes next.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Image
                src={campaign ? campaign.logoDark : "/logo-white.png"}
                alt=""
                aria-hidden="true"
                width={32}
                height={32}
              />
              <p className="whitespace-nowrap font-display text-[26px] uppercase leading-none">
                {campaign ? campaign.name : SITE_NAME}
                {!isCampaign && <sup className="text-[0.5em] font-medium tracking-normal">™</sup>}
              </p>
            </div>
          )}
          {campaignSlug === "tri" || campaign?.logoCarriesName ? null : campaign ? (
            <p className="mt-3 max-w-sm text-sm text-off-white/70">A {SITE_NAME} campaign.</p>
          ) : (
            <>
              <p className="mt-3 max-w-sm text-base text-mist">{ORG_TAGLINE}</p>
              <p className="label-caps mt-3 text-xs text-mist">Connection · Mobilization · Impact</p>
            </>
          )}
          {null}
        </div>

        {campaignSlug === "tri" ? (
          <>
            <div className="sm:col-span-2 lg:col-span-6">
              <p className="font-display text-xl uppercase text-off-white">
                The campaign is temporary. The mission isn&apos;t.
              </p>
              <p className="mt-2 max-w-2xl text-sm text-off-white/70">
                For The 22 exists to help veterans, first responders, and their families connect with trusted
                resources, community, purpose, and support.
              </p>
              <a
                href={SITE_URL}
                className="mt-3 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze-light hover:text-off-white"
              >
                Visit ForThe22.org <span aria-hidden="true">&#8599;</span>
              </a>
            </div>

            <div>
              <p className="label-caps text-xs text-mist">
                About
              </p>
              <ul className="mt-4 space-y-2 text-[15px] text-mist">
                <li>
                  <Link href="/the-mission" className="transition-colors hover:text-white hover:underline">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/the-race" className="transition-colors hover:text-white hover:underline">
                    Race
                  </Link>
                </li>
                <li>
                  <Link href="/journal" className="transition-colors hover:text-white hover:underline">
                    Journal
                  </Link>
                </li>
                <li>
                  <Link href="/messages" className="transition-colors hover:text-white hover:underline">
                    Messages
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="label-caps text-xs text-mist">
                Support
              </p>
              <ul className="mt-4 space-y-2 text-[15px] text-mist">
                <li>
                  <Link href={DONATE_LINK.href} className="transition-colors hover:text-white hover:underline">
                    {DONATE_LINK.label}
                  </Link>
                </li>
                <li>
                  <Link href="/get-involved" className="transition-colors hover:text-white hover:underline">
                    Get Involved
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="transition-colors hover:text-white hover:underline">
                    Shop
                  </Link>
                </li>
                <li>
                  <a href={`${SITE_URL}/70k`} className="transition-colors hover:text-white hover:underline">
                    {MISSION_NAME} <span aria-hidden="true">&#8599;</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="label-caps text-xs text-mist">
                Organization
              </p>
              <ul className="mt-4 space-y-2 text-[15px] text-mist">
                {campaign?.crisisLink && (
                  <li>
                    <a
                      href={campaign.crisisLink.href}
                      className="font-semibold text-off-white transition-colors hover:text-bronze-light"
                    >
                      {campaign.crisisLink.label}
                    </a>
                  </li>
                )}
                <li>
                  <Link href="/beneficiaries" className="transition-colors hover:text-white hover:underline">
                    Beneficiaries
                  </Link>
                </li>
                <li>
                  <Link href="/sponsors" className="transition-colors hover:text-white hover:underline">
                    Sponsors
                  </Link>
                </li>
                <li>
                  <Link href="/financial-transparency" className="transition-colors hover:text-white hover:underline">
                    Financial Transparency
                  </Link>
                </li>
                <li>
                  <a href={`${SITE_URL}/transparency`} className="transition-colors hover:text-white hover:underline">
                    Transparency <span aria-hidden="true">&#8599;</span>
                  </a>
                </li>
                <li>
                  <a href={`${legalBase}/privacy`} className="transition-colors hover:text-white hover:underline">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href={`${legalBase}/terms`} className="transition-colors hover:text-white hover:underline">
                    Terms
                  </a>
                </li>
                {raceDayLive && (
                  <li>
                    <Link href="/live" className="transition-colors hover:text-white hover:underline">
                      Race Day Live
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <p className="label-caps text-xs text-mist">
                Media
              </p>
              <ul className="mt-4 space-y-2 text-[15px] text-mist">
                <li>
                  <Link href="/press" className="transition-colors hover:text-white hover:underline">
                    Press &amp; Media
                  </Link>
                </li>
              </ul>
            </div>
          </>
        ) : campaignSlug === "ruck" && campaign ? (
          <>
            <div>
              <p className="label-caps text-xs text-mist">
                Event
              </p>
              <ul className="mt-4 space-y-2 text-[15px] text-mist">
                {campaign.navLinks.filter((entry): entry is NavLink => !isNavGroup(entry)).map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="transition-colors hover:text-white hover:underline">
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={campaign.primaryCta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-white hover:underline"
                  >
                    {campaign.primaryCta.label} <span aria-hidden="true">&#8599;</span>
                  </a>
                </li>
                <li>
                  <Link href="/#beneficiaries" className="transition-colors hover:text-white hover:underline">
                    Donate
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="label-caps text-xs text-mist">
                Organization
              </p>
              <ul className="mt-4 space-y-2 text-[15px] text-mist">
                {campaign.crisisLink && (
                  <li>
                    <a
                      href={campaign.crisisLink.href}
                      className="font-semibold text-off-white transition-colors hover:text-bronze-light"
                    >
                      {campaign.crisisLink.label}
                    </a>
                  </li>
                )}
                <li>
                  <a href={`${SITE_URL}/70k`} className="transition-colors hover:text-white hover:underline">
                    Learn about the full {MISSION_NAME} <span aria-hidden="true">&#8599;</span>
                  </a>
                </li>
                <li>
                  <a href={`${SITE_URL}/transparency`} className="transition-colors hover:text-white hover:underline">
                    Transparency <span aria-hidden="true">&#8599;</span>
                  </a>
                </li>
                <li>
                  <a href={`${legalBase}/privacy`} className="transition-colors hover:text-white hover:underline">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href={`${legalBase}/terms`} className="transition-colors hover:text-white hover:underline">
                    Terms
                  </a>
                </li>
                <li>
                  <a href={ORG_HOME_LINK.href} className="transition-colors hover:text-white hover:underline">
                    {ORG_HOME_LINK.label} <span aria-hidden="true">&#8599;</span>
                  </a>
                </li>
              </ul>
            </div>
          </>
        ) : campaignSlug === "22" && campaign ? (
          <>
            <div>
              <p className="label-caps text-xs text-mist">
                Event
              </p>
              <ul className="mt-4 space-y-2 text-[15px] text-mist">
                {campaign.navLinks.filter((entry): entry is NavLink => !isNavGroup(entry)).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-white hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="label-caps text-xs text-mist">
                Support
              </p>
              <ul className="mt-4 space-y-2 text-[15px] text-mist">
                <li>
                  <a href={`${SITE_URL}/70k`} className="transition-colors hover:text-white hover:underline">
                    Learn about the full {MISSION_NAME} <span aria-hidden="true">&#8599;</span>
                  </a>
                </li>
                <li>
                  <a href={CAMPAIGN_URL} className="transition-colors hover:text-white hover:underline">
                    Visit Tri For The 22 <span aria-hidden="true">&#8599;</span>
                  </a>
                </li>
                <li>
                  <a href={`${CAMPAIGN_URL}${DONATE_LINK.href}`} className="transition-colors hover:text-white hover:underline">
                    {DONATE_LINK.label} <span aria-hidden="true">&#8599;</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="label-caps text-xs text-mist">
                Organization
              </p>
              <ul className="mt-4 space-y-2 text-[15px] text-mist">
                {campaign.crisisLink && (
                  <li>
                    <a
                      href={campaign.crisisLink.href}
                      className="font-semibold text-off-white transition-colors hover:text-bronze-light"
                    >
                      {campaign.crisisLink.label}
                    </a>
                  </li>
                )}
                <li>
                  <a href={`${SITE_URL}/transparency`} className="transition-colors hover:text-white hover:underline">
                    Transparency <span aria-hidden="true">&#8599;</span>
                  </a>
                </li>
                <li>
                  <a href={`${legalBase}/privacy`} className="transition-colors hover:text-white hover:underline">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href={`${legalBase}/terms`} className="transition-colors hover:text-white hover:underline">
                    Terms
                  </a>
                </li>
                <li>
                  <a href={ORG_HOME_LINK.href} className="transition-colors hover:text-white hover:underline">
                    {ORG_HOME_LINK.label} <span aria-hidden="true">&#8599;</span>
                  </a>
                </li>
              </ul>
            </div>
          </>
        ) : campaignSlug === "live" && campaign ? (
          <>
            <div>
              <p className="label-caps text-xs text-mist">
                The Series
              </p>
              <ul className="mt-4 space-y-2 text-[15px] text-mist">
                {campaign.navLinks.filter((entry): entry is NavLink => !isNavGroup(entry)).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-white hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={campaign.primaryCta.href} className="transition-colors hover:text-white hover:underline">
                    {campaign.primaryCta.label}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="label-caps text-xs text-mist">
                Organization
              </p>
              <ul className="mt-4 space-y-2 text-[15px] text-mist">
                {campaign.crisisLink && (
                  <li>
                    <a
                      href={campaign.crisisLink.href}
                      className="font-semibold text-off-white transition-colors hover:text-bronze-light"
                    >
                      {campaign.crisisLink.label}
                    </a>
                  </li>
                )}
                <li>
                  <a href={`${SITE_URL}/70k`} className="transition-colors hover:text-white hover:underline">
                    {MISSION_NAME} <span aria-hidden="true">&#8599;</span>
                  </a>
                </li>
                <li>
                  <a href={`${SITE_URL}/store`} className="transition-colors hover:text-white hover:underline">
                    Shop <span aria-hidden="true">&#8599;</span>
                  </a>
                </li>
                {CONTACT_EMAIL && (
                  <li>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-white hover:underline">
                      Contact
                    </a>
                  </li>
                )}
                <li>
                  <a href={`${SITE_URL}/transparency`} className="transition-colors hover:text-white hover:underline">
                    Transparency <span aria-hidden="true">&#8599;</span>
                  </a>
                </li>
                <li>
                  <a href={ORG_HOME_LINK.href} className="transition-colors hover:text-white hover:underline">
                    {ORG_HOME_LINK.label} <span aria-hidden="true">&#8599;</span>
                  </a>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Resources — the directory and its crisis pathways. Plain <a>,
                not <Link>, for /crisis — on a campaign host it 308s
                cross-origin to forthe22.org, and Next's client-side
                fetch-based navigation gets CORS-blocked following that
                redirect. A full page load handles it fine. */}
            <div>
              <p className="label-caps text-xs text-mist">
                Resources
              </p>
              <ul className="mt-4 space-y-2 text-[15px] text-mist">
                <li>
                  <Link href="/resources" className="transition-colors hover:text-white hover:underline">
                    Find Resources
                  </Link>
                </li>
                <li>
                  <a
                    href="/crisis"
                    className="font-semibold text-off-white transition-colors hover:text-bronze-light"
                  >
                    Need Help Now
                    {awarenessDot}
                  </a>
                </li>
                <li>
                  <a href="/crisis#veterans" className="transition-colors hover:text-white hover:underline">
                    Veteran Crisis Resources
                  </a>
                </li>
                <li>
                  <a href="/crisis#first-responders" className="transition-colors hover:text-white hover:underline">
                    First Responder Resources
                  </a>
                </li>
                <li>
                  <Link href="/standards" className="transition-colors hover:text-white hover:underline">
                    Resource Standards
                  </Link>
                </li>
              </ul>
            </div>

            {/* Mission — the org's own mission content and the campaigns it
                runs toward The $70K Mission (reachable via Campaigns, not a
                permanent top-level/footer link of its own). */}
            <div>
              <p className="label-caps text-xs text-mist">
                Mission
              </p>
              <ul className="mt-4 space-y-2 text-[15px] text-mist">
                <li>
                  <Link href="/mission" className="transition-colors hover:text-white hover:underline">
                    Mission
                  </Link>
                </li>
                <li>
                  <Link href="/campaigns" className="transition-colors hover:text-white hover:underline">
                    Campaigns
                  </Link>
                </li>
                <li>
                  <Link href="/network" className="transition-colors hover:text-white hover:underline">
                    Network
                  </Link>
                </li>
                <li>
                  <Link href="/impact" className="transition-colors hover:text-white hover:underline">
                    Impact
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="transition-colors hover:text-white hover:underline">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect — press, contact, and shop touchpoints. */}
            <div>
              <p className="label-caps text-xs text-mist">
                Connect
              </p>
              <ul className="mt-4 space-y-2 text-[15px] text-mist">
                <li>
                  <Link href="/press" className="transition-colors hover:text-white hover:underline">
                    Press &amp; Media
                  </Link>
                </li>
                <li>
                  {CONTACT_EMAIL ? (
                    <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-white hover:underline">
                      Contact
                    </a>
                  ) : (
                    <Link href="/contact" className="transition-colors hover:text-white hover:underline">
                      Contact
                    </Link>
                  )}
                </li>
                <li>
                  <Link href="/store" className="transition-colors hover:text-white hover:underline">
                    Shop
                  </Link>
                </li>
                <li>
                  <a href={CAMPAIGN_HOME_LINK.href} className="transition-colors hover:text-white hover:underline">
                    {CAMPAIGN_HOME_LINK.label} <span aria-hidden="true">&#8599;</span>
                  </a>
                </li>
              </ul>
              <SocialLinks className="mt-4" />
            </div>

            {/* Legal */}
            <div>
              <p className="label-caps text-xs text-mist">
                Legal
              </p>
              <ul className="mt-4 space-y-2 text-[15px] text-mist">
                <li>
                  <Link href="/transparency" className="transition-colors hover:text-white hover:underline">
                    Transparency
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="transition-colors hover:text-white hover:underline">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="transition-colors hover:text-white hover:underline">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </>
        )}
      </Container>

      <div className="relative border-t border-off-white/10 py-5">
        <Container>
          {campaignSlug === "tri" ? (
            <>
              <p className="max-w-3xl text-xs text-off-white/60">
                Tri For The 22 is an independent fundraising campaign supporting Mighty Oaks Warrior Programs and
                Veterans and Athletes United.
              </p>
              <p className="mt-2 max-w-3xl text-xs text-off-white/60">
                Independent initiative. No employer or government affiliation.{" "}
                <a
                  href="/campaign-terms#trademarks-and-endorsement"
                  className="underline-offset-2 hover:text-off-white/80 hover:underline"
                >
                  Full legal disclosure
                </a>
                .
              </p>
            </>
          ) : (
            <p className="max-w-3xl text-xs text-off-white/60">{PERSONAL_PROJECT_DISCLOSURE}</p>
          )}
        </Container>
      </div>

      <div className="relative border-t border-navy-rule py-6">
        <Container className="flex flex-col gap-3 text-xs text-off-white/50 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p>
              &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
            </p>
            <a
              href={`${legalBase}/privacy`}
              className="underline-offset-2 hover:text-off-white/80 hover:underline"
            >
              Privacy Policy
            </a>
            <a
              href={`${legalBase}/terms`}
              className="underline-offset-2 hover:text-off-white/80 hover:underline"
            >
              Site Terms
            </a>
          </div>
          {isCampaign && (
            <p>
              Donations are directed through each beneficiary organization&apos;s
              authorized donation platform. {campaign?.name ?? SITE_NAME} does not independently
              process charitable contributions unless explicitly stated.
            </p>
          )}
        </Container>
      </div>
    </footer>
  );
}
