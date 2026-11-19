import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { ShareButtons } from "@/components/shared/share-buttons";
import { VoiceVideo } from "@/components/voices/voice-video";
import { VoicesSupportSection } from "@/components/voices/voices-support";
import { SITE_URL } from "@/lib/constants";
import { getVoiceBySlug } from "@/lib/data/voices";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/metadata";

/**
 * Shareable page for one published contributor. getVoiceBySlug only returns
 * published, permission-cleared messages, so an unpublished or withdrawn
 * contributor's URL 404s — and their name never reaches metadata.
 */

function absolute(url: string) {
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

export async function generateMetadata(props: PageProps<"/voices/[slug]">) {
  const { slug } = await props.params;
  const item = await getVoiceBySlug(slug);
  if (!item) return { robots: { index: false } };
  return pageMetadata({
    title: `${item.name} — Voices For The 22`,
    description: item.summary ?? `A message of hope from ${item.name} to veterans, first responders and their families.`,
    canonical: `/voices/${item.slug}`,
    image: item.video.poster,
  });
}

export default async function VoiceContributorPage(props: PageProps<"/voices/[slug]">) {
  const { slug } = await props.params;
  const item = await getVoiceBySlug(slug);
  if (!item) notFound();

  const url = `${SITE_URL}/voices/${item.slug}`;
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", url: SITE_URL },
      { name: "Voices For The 22", url: `${SITE_URL}/voices` },
      { name: item.name, url },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: `${item.name} — Voices For The 22`,
      description: item.summary ?? `A message of hope from ${item.name}.`,
      uploadDate: item.publishedOn,
      contentUrl: absolute(item.video.src),
      ...(item.video.poster && { thumbnailUrl: absolute(item.video.poster) }),
      ...(item.transcript && { transcript: item.transcript.join("\n\n") }),
      publisher: { "@type": "Organization", name: "For The 22", url: SITE_URL },
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(jsonLd)} />
      <section className="border-b border-line py-14 sm:py-20">
        <Container className="grid max-w-6xl gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <VoiceVideo message={item} />
          </div>
          <div className="lg:col-span-7">
            <Link href="/voices" className="label-caps text-xs text-help hover:underline">
              ← Voices For The 22
            </Link>
            <h1 className="mt-4 font-display text-[clamp(44px,6vw,80px)] uppercase leading-[0.95] text-navy">{item.name}</h1>
            {item.descriptor && <p className="mt-3 text-base text-copy">{item.descriptor}</p>}
            {item.summary && <p className="mt-5 max-w-xl text-lg leading-relaxed text-copy">{item.summary}</p>}
            {item.transcript && (
              <details className="mt-6 max-w-xl rounded-lg border border-line bg-white p-5">
                <summary className="cursor-pointer font-bold text-navy">Read the transcript</summary>
                <div className="mt-4 flex flex-col gap-3 text-base leading-relaxed text-copy">
                  {item.transcript.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </details>
            )}
            {item.externalUrl && (
              <a href={item.externalUrl} rel="noopener noreferrer" target="_blank" className="mt-5 inline-flex text-sm font-bold text-navy underline underline-offset-4">
                Learn more about {item.name} ↗
              </a>
            )}
            <div className="mt-8">
              <ShareButtons url={url} title={`${item.name} — Voices For The 22`} />
            </div>
          </div>
        </Container>
      </section>
      <VoicesSupportSection />
    </>
  );
}
