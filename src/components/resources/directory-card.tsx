import Link from "next/link";
import { audienceText, NEED_BY_ID, type DirectoryResource } from "@/lib/resources/directory";

/**
 * Directory result card: the same facts in a fixed order (for, cost, where,
 * how to start) and exactly two actions. Facts that are unknown are left
 * off rather than shown as "unknown". No hooks, so it renders from both the
 * client directory and server pages.
 */
export function DirectoryCard({ resource, as: Tag = "li" }: { resource: DirectoryResource; as?: "li" | "div" }) {
  const who = audienceText(resource.audiences);
  const facts: [string, string | undefined][] = [
    ["For", who || undefined],
    ["Cost", resource.costLabel],
    ["Where", resource.coverageLabel],
    ["Start", resource.startLabel],
  ];

  return (
    <Tag className="flex flex-col gap-3 rounded-lg border border-line bg-white p-5 transition-colors hover:border-navy">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.1em] text-impact">{NEED_BY_ID[resource.needs[0]].label}</span>
        {resource.orgType && (
          <span className="rounded-[3px] bg-[#eef0f4] px-2 py-0.5 text-xs font-semibold text-steel">{resource.orgType}</span>
        )}
      </div>
      <h3 className="text-[19px] font-bold leading-tight text-navy">{resource.name}</h3>
      <p className="text-[15px] text-copy">{resource.summary}</p>
      <dl className="grid grid-cols-[64px_1fr] gap-x-2 gap-y-1.5 text-sm">
        {facts.map(([label, value]) =>
          value ? (
            <div key={label} className="contents">
              <dt className="font-bold text-navy">{label}</dt>
              <dd className="text-copy">{value}</dd>
            </div>
          ) : null,
        )}
      </dl>
      <div className="mt-auto flex gap-2.5 border-t border-line pt-3">
        <Link
          href={`/resources/${resource.id}`}
          aria-label={`Learn more about ${resource.name}`}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[4px] border-[1.5px] border-navy bg-navy px-4 text-sm font-bold text-white hover:bg-navy-hover"
        >
          Learn more
        </Link>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-event="resource_outbound_click"
          aria-label={`Visit ${resource.name} website (opens in a new tab)`}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[4px] border-[1.5px] border-navy bg-white px-4 text-sm font-bold text-navy hover:bg-paper"
        >
          Visit site <span aria-hidden="true">&nbsp;↗</span>
        </a>
      </div>
    </Tag>
  );
}
