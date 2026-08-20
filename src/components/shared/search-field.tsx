"use client";

import { useId } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  className?: string;
  /** Optional id on the wrapping div — for anchor/scroll targets (e.g. a mobile action bar's "Search" button). */
  id?: string;
}

export function SearchField({ value, onChange, label, placeholder, className, id: wrapperId }: SearchFieldProps) {
  const id = useId();

  return (
    <div id={wrapperId} className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        size={18}
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-sm border border-ink/15 bg-off-white py-3 pl-11 pr-4 text-base text-ink placeholder:text-charcoal-light/80 focus:border-bronze focus:outline-none"
      />
    </div>
  );
}
