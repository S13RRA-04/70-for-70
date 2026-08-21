import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { CTAButton } from "@/components/shared/cta-button";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

/**
 * Root app/not-found.tsx — composes inside the existing root layout (this
 * app has a single root layout with no dynamic top-level segments), so
 * header/footer render normally around this. Without a custom file here,
 * Next.js falls back to its generic unstyled default.
 */
export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-off-white py-20">
      <Container className="max-w-2xl text-center">
        <p className="font-display text-7xl font-bold text-bronze sm:text-8xl">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold uppercase tracking-tight text-ink sm:text-3xl">
          Page Not Found
        </h1>
        <p className="mt-3 text-base leading-relaxed text-charcoal-light">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <CTAButton href="/">Back to Home</CTAButton>
          <CTAButton href="/resources" variant="secondary">
            Find Resources
          </CTAButton>
        </div>
        <a
          href="/crisis"
          className="mt-8 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
        >
          Need help now? Crisis support &rarr;
        </a>
      </Container>
    </section>
  );
}
