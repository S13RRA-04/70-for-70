import Link from "next/link";
import { Container } from "@/components/shared/container";
import { getAnnouncementsNewestFirst } from "@/lib/content/announcements";
import { SITE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";
import { formatDateLong } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "News",
  description: "Announcements and updates from For the 22 — the movement for veterans, first responders, and their families.",
  canonical: `${SITE_URL}/news`,
});

const NEWS_BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: "News", url: `${SITE_URL}/news` },
]);

export default function NewsPage() {
  const announcements = getAnnouncementsNewestFirst();

  return (
    <section className="py-16 sm:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(NEWS_BREADCRUMB_JSON_LD)} />
      <Container className="max-w-3xl">
        <p className="label-caps text-olive">For the 22</p>
        <h1 className="text-worn mt-3 font-display text-[clamp(44px,6vw,80px)] uppercase leading-[0.95] text-navy">
          News
        </h1>

        <ul className="mt-10 divide-y divide-line border-y border-line">
          {announcements.map((a) => (
            <li key={a.slug}>
              <Link href={`/news/${a.slug}`} className="group block py-8">
                <time dateTime={a.publishedAt} className="label-caps text-xs text-muted">
                  {formatDateLong(`${a.publishedAt}T12:00:00Z`)}
                </time>
                <h2 className="mt-2 font-display text-2xl uppercase text-navy group-hover:underline sm:text-3xl">
                  {a.title}
                </h2>
                <p className="mt-3 leading-relaxed text-copy">{a.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
