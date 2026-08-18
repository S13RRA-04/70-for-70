import Image from "next/image";
import Link from "next/link";
import { formatDateLong } from "@/lib/utils";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import type { PostRow } from "@/types/database";

export function UpdateCard({ post }: { post: PostRow }) {
  return (
    <Link
      href={`/updates/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-ink/10 bg-off-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/9] w-full bg-sand-light">
        {post.image_url ? (
          <Image
            src={post.image_url}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        ) : (
          <MediaPlaceholder />
        )}
        {post.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-bronze px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-off-white">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bronze">
          <span>{post.category}</span>
          {post.published_at && (
            <>
              <span aria-hidden>&middot;</span>
              <time dateTime={post.published_at}>{formatDateLong(post.published_at)}</time>
            </>
          )}
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold uppercase tracking-wide text-ink group-hover:text-bronze">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-charcoal-light">{post.summary}</p>
      </div>
    </Link>
  );
}
