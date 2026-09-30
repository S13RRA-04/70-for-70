import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, opts?: { cents?: boolean }) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: opts?.cents ? 2 : 0,
  }).format(amount);
}

export function formatNumber(value: number, fractionDigits = 0) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function percentFunded(totalRaised: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.min((totalRaised / goal) * 100, 100);
}

export function formatDateLong(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/** Whole weeks between two ISO timestamps, floored, never negative. */
export function weeksBetween(fromIso: string, toIso: string): number {
  const ms = new Date(toIso).getTime() - new Date(fromIso).getTime();
  return Math.max(Math.floor(ms / (1000 * 60 * 60 * 24 * 7)), 0);
}
