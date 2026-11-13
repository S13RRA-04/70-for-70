import Link from "next/link";
import Image from "next/image";
import { CONTACT_EMAIL, ORG_TAGLINE, PERSONAL_PROJECT_DISCLOSURE, SITE_NAME } from "@/lib/constants";
import { Container } from "@/components/shared/container";
import { SocialLinks } from "@/components/shared/social-links";
import { BrandStripe } from "@/components/shared/brand-stripe";
import { ORG_ABOUT_LINKS, ORG_PILLARS } from "@/lib/pillars";

export function Footer({ awarenessMonth = false }: { awarenessMonth?: boolean }) {
  const awarenessDot = awarenessMonth ? (
    <span aria-hidden="true" className="ml-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ background: "linear-gradient(135deg, var(--color-awareness-teal), var(--color-awareness-purple))" }} />
  ) : null;

  return (
    <footer className="property-footer-shell relative overflow-hidden text-white">
      <BrandStripe onNavy variant="org" />
      <Container className="relative grid gap-10 pb-14 pt-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <Image src="/logo-white.png" alt="" aria-hidden="true" width={32} height={32} />
            <p className="whitespace-nowrap font-display text-[26px] uppercase leading-none">{SITE_NAME}<sup className="text-[0.5em] font-medium tracking-normal">™</sup></p>
          </div>
          <p className="mt-3 max-w-sm text-base text-mist">{ORG_TAGLINE}</p>
          <p className="label-caps mt-3 text-xs text-mist">Connection · Mobilization · Impact</p>
        </div>

        {ORG_PILLARS.map((pillar) => (
          <div key={pillar.id}>
            <p className="label-caps text-xs text-mist">{pillar.number} · {pillar.navLabel}</p>
            <ul className="mt-4 space-y-2 text-[15px] text-mist">
              {pillar.id === "connection" && (
                <li><Link href="/crisis" className="font-semibold text-off-white transition-colors hover:text-bronze-light">Need Help Now{awarenessDot}</Link></li>
              )}
              {pillar.links.filter((link) => link.href !== "/crisis").map((link) => (
                <li key={link.href}><Link href={link.href} className="transition-colors hover:text-white hover:underline">{link.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="label-caps text-xs text-mist">About</p>
          <ul className="mt-4 space-y-2 text-[15px] text-mist">
            {ORG_ABOUT_LINKS.map((link) => (
              <li key={link.href}>
                {link.href === "/contact" && CONTACT_EMAIL ? (
                  <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-white hover:underline">{link.label}</a>
                ) : (
                  <Link href={link.href} className="transition-colors hover:text-white hover:underline">{link.label}</Link>
                )}
              </li>
            ))}
          </ul>
          <SocialLinks className="mt-4" />
        </div>

        <div>
          <p className="label-caps text-xs text-mist">Legal</p>
          <ul className="mt-4 space-y-2 text-[15px] text-mist">
            <li><Link href="/transparency" className="transition-colors hover:text-white hover:underline">Transparency</Link></li>
            <li><Link href="/terms" className="transition-colors hover:text-white hover:underline">Terms</Link></li>
            <li><Link href="/privacy" className="transition-colors hover:text-white hover:underline">Privacy</Link></li>
          </ul>
        </div>
      </Container>

      <div className="relative border-t border-off-white/10 py-5"><Container><p className="max-w-3xl text-xs text-off-white/60">{PERSONAL_PROJECT_DISCLOSURE}</p></Container></div>
      <div className="relative border-t border-navy-rule py-6">
        <Container className="flex flex-col gap-3 text-xs text-off-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="underline-offset-2 hover:text-off-white/80 hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="underline-offset-2 hover:text-off-white/80 hover:underline">Site Terms</Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
