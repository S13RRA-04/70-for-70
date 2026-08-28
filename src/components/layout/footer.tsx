import Link from "next/link";
import Image from "next/image";
import {
  CAMPAIGN_HOME_LINK,
  CAMPAIGN_NAME,
  CONTACT_EMAIL,
  ORG_HOME_LINK,
  ORG_TAGLINE,
  PERSONAL_PROJECT_DISCLOSURE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import { Container } from "@/components/shared/container";
import { SocialLinks } from "@/components/shared/social-links";
import type { SiteMode } from "@/lib/site-mode";
import { isRaceDayModeEnabled } from "@/lib/race-day-mode";

export function Footer({ mode, awarenessMonth = false }: { mode: SiteMode; awarenessMonth?: boolean }) {
  const isCampaign = mode === "campaign";
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
      className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
      style={{
        background: "linear-gradient(135deg, var(--color-awareness-teal), var(--color-awareness-purple))",
      }}
    />
  ) : null;

  return (
    <footer className="relative overflow-hidden border-t border-off-white/10 bg-ink text-off-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
        style={{ backgroundImage: "url(/topo-map.png)" }}
        aria-hidden="true"
      />
      <Container
        className={`relative grid gap-10 py-14 sm:grid-cols-2 ${isCampaign ? "lg:grid-cols-6" : "lg:grid-cols-3 xl:grid-cols-6"}`}
      >
        <div className={isCampaign ? "sm:col-span-2 lg:col-span-2" : "sm:col-span-2 lg:col-span-1"}>
          <div className="flex items-center gap-2.5">
            <Image
              src={isCampaign ? "/campaign-logo-white.png" : "/logo-white.png"}
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
            />
            <p className="font-display text-xl font-semibold uppercase tracking-wide">
              {isCampaign ? CAMPAIGN_NAME : SITE_NAME}
              {!isCampaign && <sup className="text-[0.5em] font-medium tracking-normal">™</sup>}
            </p>
          </div>
          {isCampaign ? (
            <p className="mt-3 max-w-sm text-sm text-off-white/70">
              The current campaign under {SITE_NAME}.
            </p>
          ) : (
            <p className="mt-3 max-w-sm text-sm text-off-white/70">{ORG_TAGLINE}</p>
          )}
          {isCampaign && <SocialLinks className="mt-4" />}
        </div>

        {isCampaign ? (
          <>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-bronze-light">
                Campaign
              </p>
              <ul className="mt-4 space-y-2 text-sm text-off-white/70">
                <li>
                  <Link href="/the-mission" className="transition-colors hover:text-off-white">
                    Campaign
                  </Link>
                </li>
                <li>
                  <Link href="/the-race" className="transition-colors hover:text-off-white">
                    Race
                  </Link>
                </li>
                <li>
                  <Link href="/journal" className="transition-colors hover:text-off-white">
                    Journal
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-bronze-light">
                Support
              </p>
              <ul className="mt-4 space-y-2 text-sm text-off-white/70">
                <li>
                  <Link href="/fund-a-mile" className="transition-colors hover:text-off-white">
                    Fund a Mile
                  </Link>
                </li>
                <li>
                  <Link href="/donate" className="transition-colors hover:text-off-white">
                    Donate Directly
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="transition-colors hover:text-off-white">
                    Shop
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-bronze-light">
                Organization
              </p>
              <ul className="mt-4 space-y-2 text-sm text-off-white/70">
                <li>
                  <Link href="/partners" className="transition-colors hover:text-off-white">
                    Partners
                  </Link>
                </li>
                <li>
                  <Link href="/financial-transparency" className="transition-colors hover:text-off-white">
                    Financial Transparency
                  </Link>
                </li>
                <li>
                  <a href={`${legalBase}/privacy`} className="transition-colors hover:text-off-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href={`${legalBase}/terms`} className="transition-colors hover:text-off-white">
                    Terms
                  </a>
                </li>
                {raceDayLive && (
                  <li>
                    <Link href="/live" className="transition-colors hover:text-off-white">
                      Race Day Live
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-bronze-light">
                Parent Initiative
              </p>
              <ul className="mt-4 space-y-2 text-sm text-off-white/70">
                <li>
                  <a href={ORG_HOME_LINK.href} className="transition-colors hover:text-off-white">
                    {ORG_HOME_LINK.label} <span aria-hidden="true">&#8599;</span>
                  </a>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-bronze-light">
                Mission
              </p>
              <ul className="mt-4 space-y-2 text-sm text-off-white/70">
                <li>
                  <Link href="/resources" className="transition-colors hover:text-off-white">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="/mission" className="transition-colors hover:text-off-white">
                    Mission
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="transition-colors hover:text-off-white">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-bronze-light">
                Campaigns
              </p>
              <ul className="mt-4 space-y-2 text-sm text-off-white/70">
                <li>
                  <a href={CAMPAIGN_HOME_LINK.href} className="transition-colors hover:text-off-white">
                    {CAMPAIGN_HOME_LINK.label} <span aria-hidden="true">&#8599;</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-bronze-light">
                Support
              </p>
              <ul className="mt-4 space-y-2 text-sm text-off-white/70">
                <li>
                  <Link href="/crisis" className="transition-colors hover:text-off-white">
                    Need Help Now
                    {awarenessDot}
                  </Link>
                </li>
                <li>
                  <Link href="/crisis#veterans" className="transition-colors hover:text-off-white">
                    Veteran Crisis Resources
                  </Link>
                </li>
                <li>
                  <Link
                    href="/crisis#first-responders"
                    className="transition-colors hover:text-off-white"
                  >
                    First Responder Resources
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-bronze-light">
                Media
              </p>
              <ul className="mt-4 space-y-2 text-sm text-off-white/70">
                <li>
                  <Link href="/press" className="transition-colors hover:text-off-white">
                    Press &amp; Media
                  </Link>
                </li>
                <li>
                  {CONTACT_EMAIL ? (
                    <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-off-white">
                      Contact
                    </a>
                  ) : (
                    <Link href="/contact" className="transition-colors hover:text-off-white">
                      Contact
                    </Link>
                  )}
                </li>
              </ul>
              <SocialLinks className="mt-4" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-bronze-light">
                Legal
              </p>
              <ul className="mt-4 space-y-2 text-sm text-off-white/70">
                <li>
                  <Link href="/terms" className="transition-colors hover:text-off-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="transition-colors hover:text-off-white">
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
          {isCampaign ? (
            <p className="max-w-3xl text-xs text-off-white/60">
              Personal, off-duty project. No employer or government affiliation.{" "}
              <a
                href="/campaign-terms#trademarks-and-endorsement"
                className="underline-offset-2 hover:text-off-white/80 hover:underline"
              >
                Full legal disclosure
              </a>
              .
            </p>
          ) : (
            <p className="max-w-3xl text-xs text-off-white/60">{PERSONAL_PROJECT_DISCLOSURE}</p>
          )}
        </Container>
      </div>

      <div className="relative border-t border-off-white/10 py-6">
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
              authorized donation platform. {SITE_NAME} does not independently
              process charitable contributions unless explicitly stated.
            </p>
          )}
        </Container>
      </div>
    </footer>
  );
}
