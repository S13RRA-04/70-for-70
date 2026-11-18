import Link from "next/link";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { VoiceVideo } from "@/components/voices/voice-video";
import { VOICE_MESSAGES, VOICES_SERIES_DESCRIPTION, VOICES_SERIES_NAME } from "@/lib/content/voices";
import { SITE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: VOICES_SERIES_NAME,
  description: VOICES_SERIES_DESCRIPTION,
  canonical: "/voices",
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: VOICES_SERIES_NAME, url: `${SITE_URL}/voices` },
]);

const PUBLISHED_DATE = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

/** Newest first — the content file is append-only, so reverse it for display. */
const MESSAGES_NEWEST_FIRST = [...VOICE_MESSAGES].reverse();

export default function VoicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <PageHero pillar="connection" eyebrow="Video series" title={VOICES_SERIES_NAME} description={VOICES_SERIES_DESCRIPTION} />

      <section className="border-b border-line py-14 sm:py-16">
        <Container className="flex flex-col gap-20">
          {MESSAGES_NEWEST_FIRST.map((message, index) => (
            <div key={message.id} id={message.id} className="scroll-mt-28">
            <RevealOnScroll as="article" className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5">
                <VoiceVideo message={message} />
              </div>
              <div className="lg:col-span-7">
                <p className="label-caps text-xs text-help">
                  {index === 0 ? "Latest message" : "Message"} · {PUBLISHED_DATE.format(new Date(`${message.publishedOn}T00:00:00Z`))}
                </p>
                <h2 className="mt-3 font-display text-5xl uppercase leading-none text-navy sm:text-6xl">{message.name}</h2>
                <p className="mt-3 text-base text-copy">{message.descriptor}</p>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-copy">{message.summary}</p>
                {message.transcript && (
                  <details className="mt-6 max-w-xl rounded-lg border border-line bg-white p-5">
                    <summary className="cursor-pointer font-bold text-navy">Read the transcript</summary>
                    <div className="mt-4 flex flex-col gap-3 text-base leading-relaxed text-copy">
                      {message.transcript.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </RevealOnScroll>
            </div>
          ))}
        </Container>
      </section>

      <section className="bg-paper py-14 sm:py-16">
        <Container className="max-w-3xl text-center">
          <h2 className="font-display text-4xl uppercase leading-none text-navy">You don&apos;t have to carry it alone.</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-copy">
            If you&apos;re struggling, call or text 988 — veterans, press 1. Or find trusted programs, peer support, and
            community built for veterans, first responders, and their families.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/crisis"
              className="action-control inline-flex min-h-[50px] items-center bg-help px-6 font-bold text-white hover:bg-help-dark"
            >
              Get Help Now
            </Link>
            <Link
              href="/resources"
              className="action-control inline-flex min-h-[50px] items-center border-2 border-help px-6 font-bold text-help hover:bg-help hover:text-white"
            >
              Find resources
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
