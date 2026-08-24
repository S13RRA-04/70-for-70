import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const components: Components = {
  h2: ({ ...props }) => (
    <h2 className="mt-8 font-display text-xl font-semibold uppercase tracking-wide text-ink" {...props} />
  ),
  h3: ({ ...props }) => (
    <h3 className="mt-6 font-display text-base font-semibold uppercase tracking-wide text-ink" {...props} />
  ),
  p: ({ ...props }) => <p className="mt-4 leading-relaxed text-charcoal-light" {...props} />,
  a: ({ ...props }) => (
    <a className="font-semibold text-bronze underline underline-offset-2 hover:text-bronze-light" {...props} />
  ),
  ul: ({ ...props }) => <ul className="mt-4 list-disc space-y-1.5 pl-5 text-charcoal-light" {...props} />,
  ol: ({ ...props }) => <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-charcoal-light" {...props} />,
  li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
  blockquote: ({ ...props }) => (
    <blockquote className="mt-4 border-l-2 border-bronze pl-4 italic text-charcoal-light" {...props} />
  ),
  code: ({ ...props }) => <code className="rounded bg-ink/5 px-1.5 py-0.5 text-sm text-ink" {...props} />,
  strong: ({ ...props }) => <strong className="font-semibold text-ink" {...props} />,
  hr: ({ ...props }) => <hr className="my-8 border-ink/10" {...props} />,
};

/** Renders a journal entry's Markdown body with the site's editorial typography. Shared by the public post page and the admin editor's preview pane. */
export function JournalMarkdown({ body, className }: { body: string; className?: string }) {
  return (
    <div className={cn("text-base", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {body}
      </ReactMarkdown>
    </div>
  );
}
