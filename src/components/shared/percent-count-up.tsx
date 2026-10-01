"use client";

import { CountUpNumber } from "@/components/shared/count-up-number";

/**
 * CountUpNumber with a `${n}%` formatter baked in, rather than passed as a
 * prop — a Server Component caller can't hand CountUpNumber an inline
 * formatter function (functions aren't serializable across that boundary),
 * so this wrapper keeps the function on the client side and only ever
 * accepts a plain number from the server.
 */
export function PercentCountUp({ value, className }: { value: number; className?: string }) {
  return <CountUpNumber value={value} formatter={(n) => `${Math.round(n)}%`} className={className} />;
}
