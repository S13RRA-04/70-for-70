import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/section-heading";
import { CONTACT_EMAIL, ORG_TAGLINE, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Coming Soon",
  robots: { index: false, follow: false },
};

/**
 * Served (via middleware's rewrite, not direct navigation) while the site
 * isn't live yet — see src/lib/launch-gate.ts. Not linked from nav or the
 * sitemap; it's an internal gate target, not a real page.
 */
export default function ComingSoonPage() {
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
