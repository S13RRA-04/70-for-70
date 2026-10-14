import Link from "next/link";
import { ExternalLink } from "lucide-react";

export interface TicketStubProps {
  /** e.g. "Show 01". */
  number: string;
  /** Date line, already formatted — "Date TBA" when unscheduled. */
  dateLabel: string;
  headliner: string;
  /** Secondary line under the headliner: venue, support act, or format. */
  detail?: string;
  /** Ticket/registration link — rendered as the stub's action, else an "Announcing soon" chip. */
  action?: { label: string; href: string; external?: boolean };
  /** Same-site detail page for the whole show, when one exists. */
  detailHref?: string;
}

/**
 * One show as an admit-one ticket: paper body with the punched notches
 * (.live-ticket-stub), and a jet tear-off end. The tear-off is decoration
 * and drops away on small screens, where it would wrap under the body.
 */
export function TicketStub({ number, dateLabel, headliner, detail, action, detailHref }: TicketStubProps) {
  return (
    <article className="live-ticket-stub flex rounded-[4px] bg-paper text-jet">
      <div className="flex flex-1 flex-wrap items-center gap-x-10 gap-y-3 px-7 py-6 sm:px-10">
        <div className="flex min-w-[120px] flex-col gap-0.5">
          <span className="label-caps text-xs text-muted">{number}</span>
          <span className="font-display text-[32px] uppercase leading-none">{dateLabel}</span>
        </div>
        <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-1">
          <h3 className="font-display text-[clamp(1.875rem,4vw,2.5rem)] uppercase leading-none">
            {detailHref ? (
              <Link href={detailHref} className="hover:text-live-red">
                {headliner}
              </Link>
            ) : (
              headliner
            )}
          </h3>
          {detail && <p className="text-base text-muted">{detail}</p>}
        </div>
        {action ? (
          <a
            href={action.href}
            {...(action.external && { target: "_blank", rel: "noopener noreferrer" })}
            className="action-control inline-flex items-center gap-2 bg-live-red px-5 text-[15px] font-bold text-white hover:bg-live-red-dark"
          >
            {action.label}
            {action.external && <ExternalLink className="h-4 w-4" aria-hidden="true" />}
            {action.external && <span className="sr-only">(opens in a new tab)</span>}
          </a>
        ) : (
          <span className="label-caps rounded-full bg-live-red px-3 py-1.5 text-xs text-white">Announcing soon</span>
        )}
      </div>
      <div
        aria-hidden="true"
        className="hidden w-[132px] shrink-0 flex-col items-center justify-center gap-1.5 border-l-2 border-dashed border-paper bg-jet p-4 sm:flex"
      >
        <span className="font-display text-[30px] uppercase leading-none text-white [-webkit-text-stroke:1px_var(--color-live-red)]">
          Live
        </span>
        <span className="label-caps text-[11px] text-[#8c8c8c]">Admit one</span>
      </div>
    </article>
  );
}
