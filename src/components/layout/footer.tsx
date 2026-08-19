import Link from "next/link";
import Image from "next/image";
import {
  CAMPAIGN_HOME_LINK,
  CAMPAIGN_NAME,
  CAMPAIGN_NAV_LINKS,
  CONTACT_EMAIL,
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
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
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
            {isCampaign ? (
              <>
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
              </>
            ) : (
              <>
                <li>
                  <Link href="/press" className="transition-colors hover:text-off-white">
                    Press &amp; Media
                  </Link>
                </li>
                <li>
                  <Link href="/merch" className="transition-colors hover:text-off-white">
                    Shop
                  </Link>
                </li>
                <li>
                  {CONTACT_EMAIL ? (
                    <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-off-white">
                      {CONTACT_EMAIL}
                    </a>
                  ) : (
                    <Link href="/contact" className="transition-colors hover:text-off-white">
                      Contact Us
                    </Link>
                  )}
                </li>
              </>
            )}
          </ul>
          <SocialLinks className="mt-4" />
        </div>
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
