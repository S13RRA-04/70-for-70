"use client";

import { Printer } from "lucide-react";

/** Opens the browser's print dialog — where "Save as PDF" turns the fact sheet into a file. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="action-control inline-flex min-h-[44px] items-center gap-2 bg-navy px-5 py-2.5 text-[15px] font-bold text-white transition-colors hover:bg-navy-hover"
    >
      <Printer size={16} aria-hidden />
      Print or save as PDF
    </button>
  );
}
