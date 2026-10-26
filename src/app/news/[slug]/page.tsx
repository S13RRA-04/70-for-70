import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { ShareButtons } from "@/components/shared/share-buttons";
import { CTASection } from "@/components/shared/cta-section";
import { JournalMarkdown } from "@/components/journal/journal-markdown";
import { ANNOUNCEMENTS, findAnnouncement, type Announcement } from "@/lib/content/announcements";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, FOUNDER_PERSON_JSON_LD, jsonLdScriptProps } from "@/lib/json-ld";
import { estimateReadingMinutes, formatDateLong } from "@/lib/utils";

export async function generateStaticParams() {
  return ANNOUNCEMENTS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const announcement = findAnnouncement(slug);
  if (!announcement) return {};

  return pageMetadata({
    title: announcement.title,
    description: announcement.summary,
    canonical: `${SITE_URL}/news/${slug}`,
    image: announcement.ogImage ?? announcement.image?.src,
    type: "article",
  });
}

/** Absolute URLs throughout — JSON-LD isn't resolved through metadataBase. */
function announcementJsonLd(a: Announcement) {
  const url = `${SITE_URL}/news/${a.slug}`;
  const image = a.ogImage ?? a.image?.src;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.summary,
    url,
    mainEntityOfPage: url,
    datePublished: a.publishedAt,
    ...(image && { image: `${SITE_URL}${image}` }),
    author: FOUNDER_PERSON_JSON_LD,
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

export default async function AnnouncementPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const announcement = findAnnouncement(slug);
  if (!announcement) notFound();

  const url = `${SITE_URL}/news/${slug}`;
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "News", url: `${SITE_URL}/news` },
    { name: announcement.title, url },
  ]);

  return (
    <article className="py-16 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(announcementJsonLd(announcement))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(breadcrumb)} />
      <Container className="max-w-3xl">
        <p className="label-caps text-xs text-muted">
          <Link href="/news" className="hover:text-navy hover:underline">
            News
          </Link>
        </p>

        <div className="label-caps mt-4 flex items-center gap-2 text-olive">
          <time dateTime={announcement.publishedAt}>{formatDateLong(`${announcement.publishedAt}T12:00:00Z`)}</time>
          <span aria-hidden>&middot;</span>
          <span>{estimateReadingMinutes(announcement.body)} min read</span>
        </div>

        <h1 className="text-worn mt-3 text-balance font-display text-[clamp(40px,6vw,72px)] uppercase leading-[0.95] text-navy">
          {announcement.title}
        </h1>
        <p className="mt-5 text-lg font-semibold leading-relaxed text-copy sm:text-xl">{announcement.subtitle}</p>

        {announcement.image && (
          <div className="mx-auto mt-10 max-w-md">
            <Image
              src={announcement.image.src}
              alt={announcement.image.alt}
              width={announcement.image.width}
              height={announcement.image.height}
              priority
              className="h-auto w-full"
            />
          </div>
        )}

        <JournalMarkdown body={announcement.body} className="mt-10 sm:text-lg" />

        <div className="mt-12 border-t border-line pt-8">
          <ShareButtons url={url} title={announcement.title} />
        </div>
      </Container>

      <CTASection
        eyebrow="22 ≠ 0"
        title="Be Part of the Movement"
        buttons={[
          { label: "Our Mission", href: "/mission" },
          { label: "See the Campaigns", href: "/campaigns" },
        ]}
      />
    </article>
  );
}
