import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getPostBySlug, getPosts } from "@/lib/data/posts";
import { Container } from "@/components/shared/container";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { ShareButtons } from "@/components/shared/share-buttons";
import { formatDateLong } from "@/lib/utils";
import { SITE_URL } from "@/lib/constants";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/updates/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary },
    alternates: { canonical: `/updates/${post.slug}` },
  };
}

export default async function UpdatePostPage(props: PageProps<"/updates/[slug]">) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <article className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bronze">
          <span>{post.category}</span>
          {post.published_at && (
            <>
              <span aria-hidden>&middot;</span>
              <time dateTime={post.published_at}>{formatDateLong(post.published_at)}</time>
            </>
          )}
        </div>

        <h1 className="mt-3 text-balance font-display text-3xl font-semibold uppercase tracking-tight text-ink sm:text-4xl">
          {post.title}
        </h1>

        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-sm bg-sand-light">
          {post.image_url ? (
            <Image src={post.image_url} alt="" fill className="object-cover" />
          ) : (
            <MediaPlaceholder />
          )}
        </div>

        {post.training_metrics && (
          <dl className="mt-8 grid grid-cols-2 gap-4 rounded-sm border border-ink/10 bg-off-white p-5 sm:grid-cols-3">
            {Object.entries(post.training_metrics).map(([key, value]) => (
              <div key={key}>
                <dt className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                  {key}
                </dt>
                <dd className="mt-1 font-display text-lg font-semibold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-8 max-w-none text-base leading-relaxed whitespace-pre-line text-charcoal-light">
          {post.body}
        </div>

        <div className="mt-10 border-t border-ink/10 pt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            Share This Update
          </p>
          <ShareButtons url={`${SITE_URL}/updates/${post.slug}`} title={`${post.title} | 70 for 22`} />
        </div>
      </Container>
    </article>
  );
}
