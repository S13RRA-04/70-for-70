import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Alternating image/text block for the About page's editorial chapters —
 * `reverse` flips which side the image sits on so consecutive chapters can
 * break the "photo left, text right" monotony the redesign specifically
 * calls out.
 */
export function ImageTextRow({
  image,
  reverse = false,
  eyebrow,
  heading,
  children,
}: {
  image: { src: string; alt: string; focus?: string };
  reverse?: boolean;
  eyebrow?: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
      <div className={cn("relative aspect-[4/5] overflow-hidden rounded-sm lg:col-span-5", reverse && "lg:order-2")}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className={cn("object-cover", image.focus)}
        />
      </div>
      <div className={cn("lg:col-span-7", reverse && "lg:order-1")}>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze">{eyebrow}</p>
        )}
        <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-tight text-ink sm:text-3xl">
          {heading}
        </h2>
        <div className="mt-5 space-y-4">{children}</div>
      </div>
    </div>
  );
}
