import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export interface ResourceCategory {
  title: string;
  description: string;
  slug: string;
  href: string;
  icon: LucideIcon;
}

export function ResourceCategoryCard({ category }: { category: ResourceCategory }) {
  const Icon = category.icon;
  return (
    <Link
      href={category.href}
      className="group flex flex-col border border-ink/15 bg-off-white p-6 transition-colors hover:border-bronze hover:bg-bronze/5 sm:p-7"
    >
      <Icon size={24} strokeWidth={1.5} className="text-bronze" aria-hidden="true" />
      <h3 className="mt-4 font-display text-base font-bold uppercase leading-tight tracking-tight text-ink">
        {category.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-light">{category.description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-bronze transition-colors group-hover:text-bronze-light">
        Explore <span aria-hidden="true">&rarr;</span>
      </span>
    </Link>
  );
}
