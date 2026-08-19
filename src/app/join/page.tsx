import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { JoinInterestForm } from "@/components/forms/join-interest-form";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Join the Movement",
  description: "Race. Ride. Ruck. Swim. Lift. Move. Use your challenge for something bigger.",
  alternates: { canonical: "/join" },
};

export default function JoinPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-2xl">
        <SectionHeading
          eyebrow={`Join ${SITE_NAME}`}
          title="Race. Ride. Ruck. Swim. Lift. Move."
          description="Use your challenge for something bigger. Onboarding isn't open yet — this is just the start of the list."
        />

        <p className="mt-6 text-sm text-charcoal-light">
          {SITE_NAME} is a movement, not a single event. Tri For The 22 is the current campaign —
          future campaigns (Run, Ride, Ruck For The 22) will open to more athletes over time. Tell
          us who you are, and we&apos;ll reach out as that grows.
        </p>

        <div className="mt-10">
          <JoinInterestForm />
        </div>

        <p className="mt-8 text-xs text-charcoal-light">
          Athletes who go on to formally affiliate with {SITE_NAME} accept a separate{" "}
          <Link href="/athlete-agreement" className="text-bronze hover:underline">
            Athlete Participation &amp; Affiliation Agreement
          </Link>{" "}
          before representing themselves as an affiliated athlete, using {SITE_NAME} branding, or
          receiving program support.
        </p>
      </Container>
    </section>
  );
}
