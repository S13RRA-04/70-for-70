import Link from "next/link";
import Image from "next/image";
import {
  CAMPAIGN_HOME_LINK,
  CAMPAIGN_NAME,
  CAMPAIGN_NAV_LINKS,
  CAMPAIGN_URL,
  CONTACT_EMAIL,
  CURRENT_MISSION_NAV_LINK,
  ORG_HOME_LINK,
  ORG_NAV_LINKS,
  ORG_TAGLINE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import { Container } from "@/components/shared/container";
import { SocialLinks } from "@/components/shared/social-links";
import type { SiteMode } from "@/lib/site-mode";

export function Footer({ mode }: { mode: SiteMode }) {
  const isCampaign = mode === "campaign";
  const navLinks = isCampaign ? CAMPAIGN_NAV_LINKS : ORG_NAV_LINKS;
  // Legal pages live on the org domain only — link there directly instead
  // of relying on the campaign-host redirect for every click.
  const legalBase = isCampaign ? SITE_URL : "";

  return (
    <footer className="border-t border-off-white/10 bg-ink text-off-white">
      <Container
        className={`grid gap-10 py-14 sm:grid-cols-2 ${isCampaign ? "lg:grid-cols-4" : "lg:grid-cols-3 xl:grid-cols-6"}`}
      >
        <div className={isCampaign ? "sm:col-span-2 lg:col-span-2" : "sm:col-span-2 lg:col-span-1"}>
          <div className="flex items-center gap-2.5">
            <Image
              src={isCampaign ? "/campaign-logo.png" : "/logo-white.png"}
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
            <>
              <p className="mt-3 max-w-sm text-sm text-off-white/70">
                The current campaign under {SITE_NAME}.
              </p>
              <a
                href={ORG_HOME_LINK.href}
                className="mt-1 inline-block max-w-sm text-xs font-semibold uppercase tracking-wide text-bronze-light hover:underline"
              >
                &larr; {ORG_HOME_LINK.label}
              </a>
            </>
          ) : (
            <>
              <p className="mt-3 max-w-sm text-sm text-off-white/70">{ORG_TAGLINE}</p>
              <a
                href={CAMPAIGN_HOME_LINK.href}
                className="mt-1 inline-block max-w-sm text-xs font-semibold uppercase tracking-wide text-bronze-light hover:underline"
              >
                Current Mission: {CAMPAIGN_HOME_LINK.label} &rarr;
              </a>
            </>
          )}
        </div>

        {isCampaign ? (
          <>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-bronze-light">
                Navigate
              </p>
              <ul className="mt-4 space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-off-white/70 transition-colors hover:text-off-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-bronze-light">
                Connect
              </p>
              <ul className="mt-4 space-y-2 text-sm text-off-white/70">
                <li>
                  <Link href="/donate" className="transition-colors hover:text-off-white">
                    Donate
                  </Link>
                </li>
                <li>
                  <Link href="/sponsors" className="transition-colors hover:text-off-white">
                    Become a Sponsor
                  </Link>
                </li>
                <li>
                  <Link href="/live" className="transition-colors hover:text-off-white">
                    Race Day Live
                  </Link>
                </li>
              </ul>
              <SocialLinks className="mt-4" />
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
                  <Link href="/athletes" className="transition-colors hover:text-off-white">
                    Athletes
                  </Link>
                </li>
                <li>
                  <a
                    href={CURRENT_MISSION_NAV_LINK.href}
                    className="transition-colors hover:text-off-white"
                  >
                    {CURRENT_MISSION_NAV_LINK.label}
                  </a>
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
                Get Involved
              </p>
              <ul className="mt-4 space-y-2 text-sm text-off-white/70">
                <li>
                  <Link href="/join" className="transition-colors hover:text-off-white">
                    Join
                  </Link>
                </li>
                <li>
                  <a href={`${CAMPAIGN_URL}/sponsors`} className="transition-colors hover:text-off-white">
                    Sponsor
                  </a>
                </li>
                <li>
                  <Link href="/merch" className="transition-colors hover:text-off-white">
                    Shop
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-bronze-light">
                Help
              </p>
              <ul className="mt-4 space-y-2 text-sm text-off-white/70">
                <li>
                  <Link href="/crisis" className="transition-colors hover:text-off-white">
                    Need Help Now
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
                Information
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
                <li>
                  <Link href="/merch#transparency" className="transition-colors hover:text-off-white">
                    Financial Transparency
                  </Link>
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
                <li>
                  <Link href="/athlete-agreement" className="transition-colors hover:text-off-white">
                    Athlete Agreement
                  </Link>
                </li>
              </ul>
            </div>
          </>
        )}
      </Container>

      <div className="border-t border-off-white/10 py-6">
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
          <p>
            Donations are directed through each beneficiary organization&apos;s
            authorized donation platform. {SITE_NAME} does not independently
            process charitable contributions unless explicitly stated.
          </p>
        </Container>
      </div>
    </footer>
  );
}
