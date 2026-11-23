import Image from "next/image";
import Link from "next/link";
import { Download, FileText, Mail, Send } from "lucide-react";
import { Container } from "@/components/shared/container";
import {
  PortalSectionHeading,
  RuleList,
  TalentContactBand,
  TalentPortalNav,
} from "@/components/voices/talent-portal";
import { VoiceVideo } from "@/components/voices/voice-video";
import {
  ABOUT_FOUNDER,
  ABOUT_INITIATIVE,
  HERO,
  INVITATION,
  KIT_FILES,
  KIT_UPDATED,
  KIT_VERSION,
  PARTICIPATION_SUMMARY,
  PORTAL_PATHS,
  PRIVACY_POINTS,
  TAGLINE,
  TALENT_INQUIRY_MAILTO,
} from "@/lib/content/voices-talent";
import { SITE_URL } from "@/lib/constants";
import { getVoiceGallery } from "@/lib/data/voices";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Voices For The 22 — Talent Participation",
  description:
    "Record a 20–30 second message of encouragement for veterans, first responders and their families. A smartphone is enough, and there's no cost or travel.",
  canonical: PORTAL_PATHS.talent,
});

const JSON_LD = [
  breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Voices For The 22", url: `${SITE_URL}/voices` },
    { name: "Talent participation", url: `${SITE_URL}${PORTAL_PATHS.talent}` },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Voices For The 22 — Talent Participation",
    url: `${SITE_URL}${PORTAL_PATHS.talent}`,
    about: "Mental health awareness and suicide prevention for veterans, first responders and their families",
    publisher: { "@type": "Organization", name: "For The 22", url: SITE_URL },
  },
];

const STEPS = [
  { title: "Review the kit", body: "Read the brief and recording guide. Ask us anything first — no commitment." },
  { title: "Record", body: "20–30 seconds on a phone, in your own words. Vertical preferred." },
  { title: "Submit securely", body: "Upload privately or share a secure link. You'll get a reference number." },
  { title: "Permission first", body: "Nothing is published until written permission, restrictions and any approvals are recorded." },
] as const;

const DATE = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export default async function TalentPortalPage() {
  // Only permission-cleared, published contributors ever reach the gallery.
  const [featured] = await getVoiceGallery();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(JSON_LD)} />
      <TalentPortalNav current={PORTAL_PATHS.talent} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <Container className="grid max-w-6xl gap-12 py-16 sm:py-24 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <p className="label-caps text-gold">{HERO.eyebrow}</p>
            <h1 className="mt-4 font-display text-[clamp(52px,8vw,112px)] uppercase leading-[0.9]">{HERO.title}</h1>
            <p className="mt-6 max-w-2xl text-balance font-display text-2xl uppercase leading-tight text-white sm:text-3xl">
              {HERO.headline}
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{HERO.body}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={KIT_FILES.zip.href}
                download
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-sm bg-white px-6 font-bold text-navy hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <Download size={18} aria-hidden="true" />
                Download Talent Participation Kit
              </a>
              <Link
                href={PORTAL_PATHS.submit}
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-sm border-2 border-white px-6 font-bold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <Send size={18} aria-hidden="true" />
                Submit Your Message
              </Link>
              <a
                href={TALENT_INQUIRY_MAILTO}
                className="inline-flex min-h-[50px] items-center justify-center gap-2 px-2 font-bold text-white/85 underline-offset-4 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <Mail size={18} aria-hidden="true" />
                Contact Our Founder
              </a>
            </div>
            <p className="mt-10 font-display text-3xl uppercase tracking-wide text-gold">{TAGLINE}</p>
          </div>
          <div className="mx-auto w-full max-w-[320px] lg:max-w-[380px]">
            <Image src="/logo-white.png" alt="For The 22" width={760} height={760} priority className="h-auto w-full drop-shadow-2xl" />
          </div>
        </Container>
      </section>

      {/* Participation summary */}
      <section aria-label="What we're asking" className="border-b border-line bg-white">
        <Container className="grid max-w-6xl divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {PARTICIPATION_SUMMARY.map((item) => (
            <div key={item.label} className="flex flex-col items-center px-6 py-10 text-center">
              <p className="font-display text-6xl leading-none text-navy sm:text-7xl">
                {item.value}
                {item.unit && <span className="ml-2 align-middle text-2xl uppercase text-steel">{item.unit}</span>}
              </p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-copy">{item.label}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* About the initiative */}
      <section className="bg-paper py-16 sm:py-24" aria-labelledby="initiative-heading">
        <Container className="grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.4fr]">
          <PortalSectionHeading id="initiative-heading" eyebrow="About the initiative" title="Behind every uniform is a human being." />
          <div className="flex flex-col gap-5 text-lg leading-relaxed text-copy">
            {ABOUT_INITIATIVE.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Container>
      </section>

      {/* The invitation */}
      <section className="bg-navy py-16 text-white sm:py-24" aria-labelledby="invitation-heading">
        <Container className="grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <PortalSectionHeading id="invitation-heading" eyebrow="The invitation" title="A brief message, in your own words." tone="dark" />
            <p className="mt-6 text-lg leading-relaxed text-white/80">{INVITATION.intro}</p>
            <p className="mt-3 text-lg font-semibold text-white">{INVITATION.voluntary}</p>
            <p className="mt-10 border-l-2 border-gold pl-5 font-display text-3xl uppercase leading-tight">{INVITATION.closing}</p>
          </div>
          <div className="lg:pt-14">
            <RuleList items={INVITATION.points} tone="dark" />
            <Link
              href={PORTAL_PATHS.recordingGuide}
              className="mt-8 inline-flex min-h-11 items-center gap-2 font-bold text-gold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Read the full recording guide →
            </Link>
          </div>
        </Container>
      </section>

      {/* Featured contributor — only ever a published, permission-cleared message. */}
      {featured && (
        <section className="bg-white py-16 sm:py-24" aria-labelledby="featured-heading">
          <Container className="grid max-w-6xl gap-14 lg:grid-cols-[1fr_1.3fr] lg:items-center">
            <VoiceVideo message={featured} />
            <div>
              <PortalSectionHeading id="featured-heading" eyebrow="Hear from the series" title={featured.name} />
              {featured.descriptor && <p className="mt-3 text-base text-copy">{featured.descriptor}</p>}
              {featured.summary && <p className="mt-5 max-w-xl text-lg leading-relaxed text-copy">{featured.summary}</p>}
              <Link
                href={`/voices/${featured.slug}`}
                className="mt-7 inline-flex min-h-11 items-center font-bold text-navy underline underline-offset-4 hover:text-steel"
              >
                See every message in the series →
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* How it works */}
      <section className="border-y border-line bg-paper py-16 sm:py-24" aria-labelledby="process-heading">
        <Container className="max-w-6xl">
          <PortalSectionHeading id="process-heading" eyebrow="How it works" title="Simple for you. Careful on our end." />
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="border-t-2 border-navy pt-5">
                <p className="font-display text-4xl text-steel">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-lg font-bold text-navy">{step.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-copy">{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12">
            <RuleList items={PRIVACY_POINTS} />
          </div>
        </Container>
      </section>

      {/* About the founder */}
      <section className="bg-white py-16 sm:py-24" aria-labelledby="founder-heading">
        <Container className="grid max-w-6xl gap-12 md:grid-cols-[minmax(0,320px)_1fr] md:items-center">
          <Image
            src="/press/photos/cody-hitson-headshot.jpg"
            alt="Cody Hitson, founder of For The 22"
            width={640}
            height={640}
            className="aspect-square w-full max-w-[320px] rounded-xl object-cover grayscale-[20%]"
          />
          <div>
            <PortalSectionHeading id="founder-heading" eyebrow="About the founder" title="Veteran-led. Rooted in lived experience." />
            <div className="mt-6 flex max-w-2xl flex-col gap-4 text-lg leading-relaxed text-copy">
              {ABOUT_FOUNDER.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Downloads */}
      <section id="kit" className="scroll-mt-24 bg-navy py-16 text-white sm:py-24" aria-labelledby="kit-heading">
        <Container className="max-w-6xl">
          <PortalSectionHeading id="kit-heading" eyebrow="Talent participation kit" title="Everything your team needs." tone="dark" />
          <p className="mt-4 text-sm text-white/60">
            Version {KIT_VERSION} · Updated {DATE.format(new Date(`${KIT_UPDATED}T00:00:00Z`))}
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {Object.values(KIT_FILES).map((file) => (
              <li key={file.href}>
                <a
                  href={file.href}
                  download
                  className="group flex h-full items-start gap-4 rounded-xl border border-white/15 bg-white/5 p-6 transition-colors hover:border-white/40 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  {file.href.endsWith(".zip") ? (
                    <Download className="mt-1 shrink-0 text-gold" size={22} aria-hidden="true" />
                  ) : (
                    <FileText className="mt-1 shrink-0 text-gold" size={22} aria-hidden="true" />
                  )}
                  <span>
                    <span className="block text-lg font-bold">{file.label}</span>
                    <span className="mt-1 block text-sm text-white/65">{file.detail}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-2xl text-sm text-white/60">
            The participation release is a proposed draft pending founder and legal review. Read the{" "}
            <Link href={PORTAL_PATHS.permissions} className="underline underline-offset-4 hover:text-white">
              participation &amp; usage permissions
            </Link>{" "}
            for a plain-language summary.
          </p>
        </Container>
      </section>

      <TalentContactBand />
    </>
  );
}
